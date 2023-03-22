import colors from 'picocolors'
import { outro } from '@clack/prompts'

export function exitProgram ({ code = 0, message = 'No se ha creado el commit' } = {}) {
  outro(colors.yellow(message))
  process.exit(code)
}
