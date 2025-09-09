import type { BuildConfig as BunBuildConfig, Target } from 'bun'

interface BuildConfig {
  format: BunBuildConfig['format']
  naming: BunBuildConfig['naming']
  target: Target
}

export const buildConfigs: BuildConfig[] = [
  {
    format: 'esm',
    target: 'browser',
    naming: '[name].browser.m[ext]',
  },
  {
    format: 'iife',
    target: 'browser',
    naming: '[name].browser.iife.[ext]',
  },
]

export const workerConfig: BuildConfig = {
  format: 'esm',
  target: 'browser',
  naming: '[name].[ext]',
}
