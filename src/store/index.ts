/*
 * @Author: weisheng
 * @Date: 2023-04-14 12:57:12
 * @LastEditTime: 2023-04-19 11:03:00
 * @LastEditors: weisheng
 * @Description: pinia商店
 * @FilePath: \uniapp-vue3-fant-ts\src\store\index.ts
 * 记得注释
 */
import UserAPI from '@/api/UserAPI'
import UserInfo from '@/model/UserInfo'
import { defineStore } from 'pinia'
const baseURL = import.meta.env.VITE_BASEURL

interface AuthStore {
  // 鉴权令牌
  userInfo: Nullable<UserInfo>
  isVisitor: boolean
}
// defineStore 调用后返回一个函数，调用该函数获得 Store 实体
export const useAuthStore = defineStore('authState', {
  // state: 返回对象的函数
  state: (): AuthStore => ({
    userInfo: null,
    isVisitor: false
  }),
  getters: {},
  actions: {
    logout() {
      this.userInfo = null
    },
    getToken(): string {
      return this.userInfo?.token || ''
    },
    setAvatar(avatarId: string): void {
      const avatarUrl = baseURL + '/common/avatar/' + avatarId
      console.log('avatarUrl', avatarUrl)

      this.userInfo!.avatar = avatarUrl
      // 保存头像
      UserAPI.saveAlterAvatar(avatarUrl)
    }
  }
})
