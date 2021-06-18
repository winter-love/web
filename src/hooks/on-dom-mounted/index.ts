import {useElementEvent} from 'src/hooks/element-event'
import {onMounted} from 'vue'

export type OnMountedAndDomLoadedHook = () => void

export const onDomMounted = (hook: OnMountedAndDomLoadedHook) => {
  const {active, inactive} = useElementEvent(window, 'load', () => {
    hook()
    inactive()
  }, {
    immediate: false,
  })

  onMounted(() => {
    const isReady = document.readyState === 'complete'
    if (isReady) {
      hook()
      return
    }

    active()
  })
}