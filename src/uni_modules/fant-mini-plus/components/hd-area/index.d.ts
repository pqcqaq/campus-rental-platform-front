import { type InjectionKey, type Ref } from 'vue'
import type { Area } from './types'
/**
 * useArea 用到的key
 *
 * @internal
 */
export declare const areaDefaultKey: InjectionKey<Ref<boolean>>
export declare function useArea(selector?: string): Area
