import {computed, defineComponent, h, ref} from 'vue-demi'
import {isComponentInstance} from '../'

const Foo = defineComponent(() => {
  return () => h('div', 'foo')
})

export const Default = () => ({
  setup() {
    const componentRef = ref()
    const elementRef = ref()

    const thisKind = computed(() => {
      return isComponentInstance(componentRef.value) ? 'componentInstance' : 'unknown'
    })

    const barKind = computed(() => {
      return isComponentInstance(elementRef.value) ? 'componentInstance' : 'unknown'
    })

    return () => (
      h('div', [
        h('div', {ref: elementRef}, 'bar'),
        h(Foo, {ref: componentRef}),
        h('div', `this is ${thisKind.value} component`),
        h('div', `bar is ${barKind.value} component`),
      ])
    )
  },
})
