import {genRollupOptions, GenRollupOptions} from './gen-rollup-options'
import {creRollupBundle} from './cre-rollup-bundle'
import {watch} from 'gulp'

export type RollupOptions = GenRollupOptions

export const creBundle = (options?: RollupOptions) => creRollupBundle(
  genRollupOptions(options),
)

export const creWatchBundle = async (options: RollupOptions = {}) => {
  const {src = 'src', ...rest} = options

  const rollup = creRollupBundle(
    genRollupOptions({src, ...rest}),
  )

  await rollup()

  return watch([`./${src}/**/*.ts`], rollup)
}
