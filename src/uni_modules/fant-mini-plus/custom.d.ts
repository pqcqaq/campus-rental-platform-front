import Vue from 'vue'

import { DatePickerOptions } from './components/hd-date-picker/types'
import { LoadingOptions } from './components/hd-loading/types'
import { ModalOptions } from './components/hd-modal/types'
import { ToastOptions } from './components/hd-toast/types'

declare module 'vue/types/vue' {
  interface Vue {
    $showModal(options: ModalOptions): void
    $showLoading(options: LoadingOptions): void
    $hideLoading(): void
    $showDatePicker(options: DatePickerOptions): void
    $showToast(options: ToastOptions): void
    $hideToast(): void
  }
}
