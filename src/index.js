import { confirm, intro, isCancel, multiselect, outro, select, text } from '@clack/prompts'
import { getChangedFiles, getStagedFiles, gitAdd, gitCommit } from './git.js'

import { COMMIT_TYPES } from './commit-types.js'
import colors from 'picocolors'
import { exitProgram } from './utils.js'
import { trytm } from '@bdsqqq/try'

intro(
  colors.inverse(`Asistente para la creación de commits por ${colors.blue('@arestrepodev')}`)
)

const [changedFiles, errorChangedFiles] = await trytm(getChangedFiles())
const [stagedFiles, errorStagedFiles] = await trytm(getStagedFiles())

if (errorChangedFiles ?? errorStagedFiles) {
  outro(colors.red('Opps! Al parecer no estas en un repositorio de GIT!'))
  process.exit(1)
}

if (stagedFiles.length === 0 && changedFiles.length > 0) {
  const files = await multiselect({
    message: colors.cyan('Selecciona los archivos que deseas agregar:'),
    options: changedFiles.map(file => ({
      value: file,
      label: file
    }))
  })

  if (isCancel(files)) exitProgram()

  await gitAdd({ files })
}

const commitType = await select({
  message: colors.cyan('Selecciona el tipo de commit'),
  options: Object.entries(COMMIT_TYPES).map(([key, value]) => ({
    value: key,
    label: `${value.emoji} ${key.padEnd(10, ' ')} · ${value.description}`
  }))
})

if (isCancel(commitType)) exitProgram()

const commitMsg = await text({
  message: colors.cyan('Introduce el mensaje del commit'),
  validate: (value) => {
    if (value.length === 0) {
      return colors.red('El mensaje no puede estar vacío')
    }
    if (value.length > 50) {
      return colors.red('El mensaje no puede tener más de 100 caracteres')
    }
  }
})

if (isCancel(commitMsg)) exitProgram()

const { emoji, release } = COMMIT_TYPES[commitType]

let breakingChange = false

if (release) {
  breakingChange = await confirm({
    initialValue: false,
    message: `${colors.cyan('¿Este commit tiene cambios que rompen la compatibilidad anterior:')} 
    ${colors.yellow('Si es así deberías crear un commit con el tipo "BREAKING-CHANGE" y al hacer release se publicará una versión major')}`
  })
  if (isCancel(breakingChange)) exitProgram()
}

let commit = `${emoji} ${commitType}: ${commitMsg}`
commit = breakingChange ? `${commit} [Breaking change]` : commit

const shouldBeContinue = await confirm({
  initialValue: true,
  message: `${colors.cyan('¿Quieres crear el commit con el siguiente mensaje?')}
  ${colors.green(colors.bold(commit))}
  ${colors.cyan('¿Confirmas?')}`
})

if (isCancel(shouldBeContinue)) exitProgram()

if (!shouldBeContinue) {
  outro(colors.yellow('No se ha creado el commit'))
  process.exit(0)
}

await gitCommit({ commit })

outro(colors.green('✓ Commit creado con éxito!! Gracias por usar el asistente'))
