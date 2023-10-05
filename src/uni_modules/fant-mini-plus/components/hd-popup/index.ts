import { type InjectionKey, type Ref, nextTick, provide, ref } from 'vue'
import type { Popup } from './types'

/**
 * usePopup 用到的key
 *
 * @internal
 */
export const popupDefaultKey = Symbol('__POPUP_') as InjectionKey<Ref<boolean>>

export function usePopup(selector: string = ''): Popup {
  const popupShow = ref<boolean>(false) // 是否展示popup
  const popupKey = selector ? '__POPUP_' + selector : popupDefaultKey
  provide(popupKey, popupShow)

  const showPopup = () => {
    if (popupShow.value) {
      popupShow.value = false
      nextTick(() => {
        popupShow.value = true
      })
    } else {
      popupShow.value = true
    }
  }

  const closePopup = () => {
    popupShow.value = false
  }
  return {
    showPopup,
    closePopup
  }
}
