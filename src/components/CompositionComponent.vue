<template>
  <div>
    <p>{{ title }}</p>
    <ul>
      <li
        v-for="todo in todos"
        :key="todo.id"
        @click="increment"
      >
        {{ todo.id }} - {{ todo.content }}
      </li>
    </ul>
    <p>Count: {{ todoCount }} / {{ meta.totalCount }}</p>
    <p>Active: {{ active ? 'yes' : 'no' }}</p>
    <p>Clicks on todos: {{ clickCount }}</p>
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  PropType,
  Ref,
  ref,
  toRef,
} from 'vue'
import {Meta, Todo} from './models'

function useClickCount() {
  const clickCount = ref(0)
  function increment() {
    clickCount.value += 1
    return clickCount.value
  }

  return {clickCount, increment}
}

function useDisplayTodo(todos: Ref<Todo[]>) {
  const todoCount = computed(() => todos.value.length)
  return {todoCount}
}

export default defineComponent({
  name: 'CompositionComponent',
  props: {
    active: {
      type: Boolean,
    },
    meta: {
      required: true,
      type: Object as PropType<Meta>,
    },
    title: {
      required: true,
      type: String,
    },
    todos: {
      default: () => [],
      type: Array as PropType<Todo[]>,
    },
  },
  setup(props) {
    return {...useClickCount(), ...useDisplayTodo(toRef(props, 'todos'))}
  },
})
</script>
