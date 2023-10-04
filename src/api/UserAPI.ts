import http from '@/http/HttpClient'
import BaseResponse from '@/model/BaseResponse'
import UserInfo from '@/model/UserInfo'
export default class UserAPI {
  /**
   * 登录
   */
  static login(username: string, password: string): Promise<BaseResponse<UserInfo>> {
    return http
      .server()
      .post('user/login', {
        username,
        password
      })
      .then((res) => res.data)
  }

  // 退出登录
  static logout(): Promise<BaseResponse<string>> {
    return http
      .server()
      .post('user/logout')
      .then((res) => res.data)
  }

  // 修改
  static alter(user: any): Promise<BaseResponse<UserInfo>> {
    return http
      .server()
      .post('user/alter', {
        ...useAuthStore().userInfo,
        ...user
      })
      .then((res) => res.data)
  }

  // 保存修改头像
  static saveAlterAvatar(avatar: string): Promise<BaseResponse<string>> {
    return http
      .server()
      .post('user/saveAlterAvatar', avatar)
      .then((res) => res.data)
  }

  // 刷新token，重新获取用户数据
  static refreshToken(): Promise<BaseResponse<UserInfo>> {
    return http
      .server()
      .post('user/refreshToken')
      .then((res) => res.data)
  }
}
