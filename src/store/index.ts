import UserAPI from '@/api/UserAPI'
import UserInfo from '@/model/UserInfo'
import router from '@/router'
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
      try {
        UserAPI.logout().finally(() => {
          this.userInfo = null
        })
      } catch (error) {
        console.log(error)
      }
      router.replaceAll({ name: 'login' })
    },
    getToken(): string {
      return this.userInfo?.token || ''
    },
    setAvatar(avatarId: string): void {
      const avatarUrl = baseURL + '/common/img/' + avatarId
      this.userInfo!.avatar = avatarUrl
      // 保存头像
      UserAPI.saveAlterAvatar(avatarUrl)
    },
    isAdmin(): boolean {
      return this.userInfo?.role === 'ROLE_ADMIN'
    }
  }
})
