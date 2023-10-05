import { type InjectionKey, type Ref, nextTick, provide, ref } from 'vue'
import { CommonUtil } from '../../index'
import type { Loading, LoadingOptions } from './types'

/**
 * useLoading 用到的key
 *
 * @internal
 */
export const loadingDefaultKey = Symbol('__LOADING__') as InjectionKey<Ref<boolean>>
export const loadingDefaultOptionKey = Symbol('__LOADING_OPTION__') as InjectionKey<Ref<LoadingOptions>>

/**
 * 默认参数
 */
export const defaultLoadingOptions: LoadingOptions = {
  background: true,
  title: '',
  delayTime: 0,
  type: 'flower'
}

export function useLoading(selector: string = ''): Loading {
  const loadingShow = ref<boolean>(false) // 是否展示loading
  const loadingOption = ref<LoadingOptions>(defaultLoadingOptions) // Loading选项
  const loadingKey = selector ? '__LOADING__' + selector : loadingDefaultKey
  const loadingOptionKey = selector ? '__LOADING_OPTION__' + selector : loadingDefaultOptionKey
  provide(loadingOptionKey, loadingOption)
  provide(loadingKey, loadingShow)

  const showLoading = (option: LoadingOptions) => {
    loadingOption.value = CommonUtil.deepMerge(defaultLoadingOptions, option) as LoadingOptions
    if (loadingShow.value) {
      loadingShow.value = false
      nextTick(() => {
        loadingShow.value = true
      })
    } else {
      loadingShow.value = true
    }
  }

  const hideLoading = () => {
    loadingOption.value = defaultLoadingOptions
    loadingShow.value = false
  }
  return {
    showLoading,
    hideLoading
  }
}
