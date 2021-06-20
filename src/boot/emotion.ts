import {createEmotion} from '@winter-love/emotion'
import {BootCallback, BootFileParams} from '@quasar/app'
import {theme} from 'src/theme'

export const emotion = createEmotion(theme)

const {
  styled, css, cache, flush, cx, injectGlobal, keyframes, merge, getRegisteredStyles, hydrate,
} = emotion

export {
  styled,
  css,
  cache,
  flush,
  cx,
  injectGlobal,
  keyframes,
  merge,
  getRegisteredStyles,
  hydrate,
}

const emotionBoot: BootCallback<any> = (context: BootFileParams<any>) => {
  const {app, ssrContext} = context

  if (ssrContext) {
    ssrContext.req.__emotionCache__ = cache
  }

  app.use(emotion as any)
}

export default emotionBoot
