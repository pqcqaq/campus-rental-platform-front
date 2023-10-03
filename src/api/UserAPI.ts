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

  static saveAlterAvatar(avatar: string): Promise<BaseResponse<string>> {
    return http
      .server()
      .post('user/saveAlterAvatar', avatar)
      .then((res) => res.data)
  }
}
