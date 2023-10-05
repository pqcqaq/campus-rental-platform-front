
let timer: Nullable<number> | any = null // 定时器

let flag = false // 定时器是否结束

/**
 * 节流原理：在一定时间内，只能触发一次
 *
 * @param {Function} func 要执行的回调函数
 * @param {Number} wait 延时的时间
 * @param {Boolean} immediate 是否立即执行
 * @return null
 */
export function throttle(func: Function, wait: number = 500, immediate: boolean = true) {
  function throttlefunc(...args: any) {
    if (immediate) {
      if (!flag) {
        flag = true
        // 如果是立即执行，则在wait毫秒内开始时执行
        typeof func === 'function' && func(...args)
        timer = setTimeout(() => {
          flag = false
        }, wait)
      }
    } else if (!flag) {
      flag = true
      // 如果是非立即执行，则在wait毫秒内的结束处执行
      timer = setTimeout(() => {
        flag = false
        typeof func === 'function' && func(...args)
      }, wait)
    }
  }
  return throttlefunc
}
