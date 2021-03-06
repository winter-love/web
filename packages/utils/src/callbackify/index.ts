import {isPromise} from '../is-promise'

export type CallbackifyHandle<S> = (error: undefined | Error, value?: S | undefined) => any

export const callbackify = <S>(
  action: () => Promise<S> | S,
  handle: CallbackifyHandle<S>,
) => {
  let result
  try {
    result = action()
  } catch (error) {
    handle(error)
    return
  }

  if (isPromise(result)) {
    return result.then((data: S) => {
      handle(undefined, data)
    }).catch((error) => {
      handle(error)
    })
  }

  handle(undefined, result)
  return result
}
