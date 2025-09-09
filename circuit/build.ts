import { buildConfigs, workerConfig } from './targets'

// Build main library
await Promise.all(buildConfigs.map(async (config) =>
  Bun.build({
    entrypoints: ['src/index.ts'],
    minify: true,
    outdir: 'dist',
    sourcemap: 'inline',
    ...config,
  })
))

// Build worker separately
await Bun.build({
  entrypoints: ['src/worker.ts'],
  outdir: 'dist',
  sourcemap: 'inline',
  ...workerConfig,
})
