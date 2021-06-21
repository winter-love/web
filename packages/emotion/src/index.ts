/* eslint-disable prefer-destructuring */
import createEmotionOriginal, {
  Emotion as _Emotion,
  CSSObject,
  EmotionCache,
  Options as OriginalEmotionOptions,
} from '@emotion/css/create-instance'
import {Interpolation, serializeStyles} from '@emotion/serialize'
import {getRegisteredStyles, insertStyles} from '@emotion/utils'
import clsx, {ClassValue} from 'clsx'
import {Tags} from './tags'
import {margeProps} from '@winter-love/use'
import {isSSR} from '@winter-love/utils'
import {
  ComponentObjectPropsOptions,
  computed,
  DefineComponent,
  defineComponent,
  ExtractPropTypes,
  Fragment,
  FunctionalComponent,
  getCurrentInstance,
  h,
  inject,
  InjectionKey,
  Plugin,
  toRef,
} from 'vue-demi'

export interface Theme {
  size?: any
}

export type {CSSObject}

export const EMOTION_CACHE_CONTEXT: InjectionKey<EmotionCache> = Symbol('emotion-cash')
export const EMOTION_THEME_CONTEXT: InjectionKey<Theme> = Symbol('emotion-theme')

export type AnyComponent = Tags | FunctionalComponent<any> | ReturnType<typeof defineComponent>

export interface StyledProps {
  as?: AnyComponent
  theme?: Theme
}

export const useTheme = () => {
  const instance = getCurrentInstance()
  const props = instance?.props ?? {}

  if (props.theme) {
    return props.theme as Theme
  }

  return inject(EMOTION_THEME_CONTEXT, {})
}

export interface StyledOptions {
  label?: string
  name?: string
  target?: string
}

export interface StyledOptionWIthObject<
  PropsOptions extends Readonly<ComponentObjectPropsOptions>
  > extends StyledOptions {
  props?: PropsOptions
}

export interface StyledOptionWithArray<PropsOptions extends Readonly<any[]>> extends StyledOptions {
  props?: PropsOptions
}

export type StyledResult<Props> = ((...args: (TemplateStringsArray | Interpolation<Props>)[]) => DefineComponent<Props>)

const defaultProps = {}

export type EmptyObject = {
  // empty
}

export const toBeClassName = (value: any): ClassValue => {
  if (typeof value === 'function') {
    return
  }
  return value
}

export const createStyled = (emotion: _Emotion) => {
  function styled<PropsOptions extends ComponentObjectPropsOptions = EmptyObject>(
    element: Tags | any,
    options?: Readonly<StyledOptionWIthObject<PropsOptions>>,
  ): StyledResult<ExtractPropTypes<PropsOptions>>
  function styled<PropNames extends string,
    PropsOptions = { [key in PropNames]: any },
    >(
    element: Tags | any,
    options?: Readonly<StyledOptionWithArray<PropNames[]>>,
  ): StyledResult<ExtractPropTypes<PropsOptions>>
  function styled(element: AnyComponent, options?: any): any {
    const {
      props, label, target, name,
    } = options ?? {}

    return (...args: any[]) => {
      const _args = [...args, {label}]
      const _target = target ? ` ${target}` : ''

      // emotion component
      return defineComponent({
        name: name ?? label ?? 'emotion',
        props: margeProps(props, defaultProps),
        setup: (props: any, {attrs, slots}) => {
          const asRef = toRef(props, 'as')
          const {cache: masterCache} = emotion
          const theme = useTheme()

          const cache = inject(EMOTION_CACHE_CONTEXT, masterCache)
          const elementRef = computed(() => {
            return asRef.value ?? element
          })
          const isStringElementRef = computed(() => {
            return typeof elementRef.value === 'string'
          })
          return () => {
            const classInterpolations: string[] = []
            const allAttrs = {
              ...props,
              theme,
            }
            let className = getRegisteredStyles(
              cache.registered,
              classInterpolations,
              clsx(toBeClassName(attrs.class)),
            )

            const serialized = serializeStyles(
              _args,
              cache.registered,
              allAttrs,
            )
            const rules = insertStyles(
              cache,
              serialized,
              isStringElementRef.value,
            )

            className += `${cache.key}-${serialized.name}`

            className += _target

            const passingProps = isStringElementRef.value ? {} : props

            const vNode = h(elementRef.value, {...attrs, ...passingProps, class: className}, slots)

            if (isSSR() && typeof rules !== 'undefined') {
              let next = serialized.next
              let dataEmotion = serialized.name

              while (typeof next !== 'undefined') {
                dataEmotion += ` ${next.name}`
                next = next.next
              }

              return (
                h(Fragment, [
                  h('style', {'data-emotion': dataEmotion, nonce: cache.sheet.nonce}, rules),
                  vNode,
                ])
              )
            }

            return vNode
          }
        },
      })
    }
  }

  return styled
}

export interface EmotionExtend extends _Emotion {
  styled: ReturnType<typeof createStyled>
}

export interface EmotionOptions extends Omit<OriginalEmotionOptions, 'key'> {
  key?: string
  theme?: Theme
}

export type EmotionPlugin = Plugin & EmotionExtend

export const createEmotion = (options: EmotionOptions = {}): EmotionPlugin => {
  const {theme, key = 'css', ...restOptions} = options

  const emotion = createEmotionOriginal({...restOptions, key})

  const styled = createStyled(emotion)

  return {
    ...emotion,
    install: (app) => {
      app.provide(EMOTION_CACHE_CONTEXT, emotion.cache)

      if (process.env.NODE_ENV === 'development') {
        console.log('winter-love emotion version salmon')
      }
      // provide theme if the options have it
      if (theme) {
        app.provide(EMOTION_THEME_CONTEXT, theme)
      }
    },
    styled,
  }
}
