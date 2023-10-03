/*
 * @Author: weisheng
 * @Date: 2023-03-21 19:57:00
 * @LastEditTime: 2023-09-14 21:40:13
 * @LastEditors: weisheng
 * @Description:
 * @FilePath: \fant-mini-plus\src\uni_modules\fant-mini-plus\components\hd-swipe-action\index.ts
 * 记得注释
 */

import { ref } from 'vue'
import type { SwipeAction } from './types'

export function useSwipeAction(): SwipeAction {
  const moveIndex = ref<number>(-1)
  const updateIndex = (index: number) => {
    moveIndex.value = index
  }
  return { moveIndex, updateIndex }
}
