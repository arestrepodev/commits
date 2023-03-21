# Crear CLI en NODE

- [x] Inicializar proyecto + linter
- [x] Pedirle al usuario nombre del commit
- [x] Mostrar una lista de posibles commits
- [x] Comprobar si está en un repositorio de git
- [ ] Pedirle al usuario si es breaking change
- [ ] Confirmar con el usuario el commit
- [ ] Crear el commit
- [ ] Crear binario
- [ ] Publicar el paquete en npm

## Inicializar proyecto + linter

```bash
  volta pin node
  volta install pnpm
```

```bash
  npm init --y
```

```bash
  pnpm install standard -D
```

## Pedirle al usuario nombre del commit

```bash
  pnpm install @clack/prompts -E
```
