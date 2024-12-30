import { type InjectionKey, type Ref, nextTick, provide, ref } from 'vue'
import type { Area } from './types'

/**
 * useArea 用到的key
 *
 * @internal
 */
export const areaDefaultKey = Symbol('__AREA__') as InjectionKey<Ref<boolean>>

export function useArea(selector: string = ''): Area {
  const areaShow = ref<boolean>(false) // 是否展示area
  const areaKey = selector ? '__AREA__' + selector : areaDefaultKey
  provide(areaKey, areaShow)
  const showArea = () => {
    if (areaShow.value) {
      areaShow.value = false
    }
    nextTick(() => {
      areaShow.value = true
    })
  }

  const closeArea = () => {
    areaShow.value = false
  }
  return {
    showArea,
    closeArea
  }
}
