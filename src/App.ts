import {defineComponent, h} from 'vue'
import {RouterView} from 'vue-router'

export default defineComponent({
  name: 'app',
  setup() {
    return () => {
      return (
        h('div', {id: 'app'}, [
          h('div', 'top'),
          h(RouterView),
        ])
      )
    }
  },
})
