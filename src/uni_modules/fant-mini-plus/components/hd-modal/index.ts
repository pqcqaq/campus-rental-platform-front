import { type InjectionKey, type Ref, nextTick, provide, ref } from 'vue'
import { CommonUtil } from '../../index'
import type { Modal, ModalOptions } from './types'

/**
 * 默认参数
 */
export const defaultModalOptions: ModalOptions = {
  title: '提示',
  content: '',
  showCancel: true,
  cancelText: '取消',
  cancelColor: '#282C34',
  confirmText: '确定',
  confirmColor: '#1C64FD'
}

/**
 * useModal 用到的key
 *
 * @internal
 */
export const modalDefaultKey = Symbol('__MODAL__') as InjectionKey<Ref<boolean>>
export const modalDefaultOptionKey = Symbol('__MODAL_OPTION__') as InjectionKey<Ref<ModalOptions>>

export function useModal(selector: string = ''): Modal {
  const modalShow = ref<boolean>(false) // 是否展示modal
  const modalOption = ref<ModalOptions>(defaultModalOptions) // Modal选项
  const modalKey = selector ? '__MODAL__' + selector : modalDefaultKey
  const modalOptionKey = selector ? '__MODAL_OPTION__' + selector : modalDefaultOptionKey
  provide(modalOptionKey, modalOption)
  provide(modalKey, modalShow)
  const showModal = (option: ModalOptions) => {
    modalOption.value = CommonUtil.deepMerge(defaultModalOptions, option) as ModalOptions
    if (modalShow.value) {
      modalShow.value = false
      nextTick(() => {
        modalShow.value = true
      })
    } else {
      modalShow.value = true
    }
  }
  return {
    showModal
  }
}
