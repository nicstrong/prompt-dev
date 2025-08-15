import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  skipNodeModulesBundle: true,
  external: ['react', 'react-dom', '@tanstack/react-query'],
})
