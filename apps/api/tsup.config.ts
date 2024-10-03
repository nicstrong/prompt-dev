import { defineConfig, type Options } from 'tsup'

export default defineConfig((options: Options) => ({
  entryPoints: ["src/index.ts"],
  clean: true,
  sourcemap: true,
  format: ['esm', 'cjs'],
  target: 'node20',
  ...options,
}))
