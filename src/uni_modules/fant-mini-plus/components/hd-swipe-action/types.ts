import type { Ref } from 'vue'

export interface SwipeAction {
  moveIndex: Ref<number> // 滑动项的下标
  updateIndex(index: number): void // 更新滑动项的下标
}
