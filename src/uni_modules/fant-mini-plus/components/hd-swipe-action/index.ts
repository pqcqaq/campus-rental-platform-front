
import { ref } from 'vue'
import type { SwipeAction } from './types'

export function useSwipeAction(): SwipeAction {
  const moveIndex = ref<number>(-1)
  const updateIndex = (index: number) => {
    moveIndex.value = index
  }
  return { moveIndex, updateIndex }
}
