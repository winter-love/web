import {getStorageAvailable, StorageType} from '@winter-love/utils'
import {ref, watch} from 'vue'
import stringify from 'fast-json-stable-stringify'
import {useElementEvent} from '../element-event'

export interface StorageRefOptions<Data> {
  type?: StorageType
  init?: Data
}

const getItem = (storage: Storage, key: string) => {
  let result
  try {
    const raw = storage.getItem(key)
    if (raw) {
      result = JSON.parse(raw)
    }
  } catch {
    return
  }
  return result
}

const setItem = (storage: Storage, key: string, value: any) => {
  storage.setItem(key, stringify(value))
}

export const storageRef = <Data>(key: string, options: StorageRefOptions<Data> = {}) => {
  const {type = 'local', init} = options
  const valueRef = ref<Data | undefined>()
  const storage = getStorageAvailable(type)
  if (!storage) {
    return valueRef
  }

  const updateStorage = (value: any) => {
    setItem(storage, key, value)
    valueRef.value = value
  }

  const updateValue = (init?: any) => {
    const result = getItem(storage, key)

    if (typeof result !== 'undefined') {
      valueRef.value = getItem(storage, key)
      return
    }
    if (init) {
      updateStorage(init)
    }
  }

  updateValue(init)

  useElementEvent(window, 'storage', () => {
    updateValue()
  })

  watch(valueRef, (value) => {
    setItem(storage, key, value)
  })

  return valueRef
}