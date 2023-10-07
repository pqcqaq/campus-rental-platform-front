import http from '@/http/HttpClient'
import BaseResponse from '@/model/BaseResponse'
import myRecord from '@/model/myRecord'
import PageResult from '@/model/PageResult'
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

  static getMyInfo(): Promise<BaseResponse<myRecord[]>> {
    return http
      .server()
      .get('user/getUserInfoRecords')
      .then((res) => res.data)
  }

  static saveAlterBackground(background: string): Promise<BaseResponse<string>> {
    return http
      .server()
      .post('user/saveAlterBackground', background)
      .then((res) => res.data)
  }

  static follow(userId: string): Promise<BaseResponse<boolean>> {
    return http
      .server()
      .put(`user/follow/${userId}`)
      .then((res) => res.data)
  }

  static getUserDetails(userId: string): Promise<BaseResponse<UserInfo>> {
    return http
      .server()
      .get(`user/${userId}`)
      .then((res) => res.data)
  }

  static getFansList(pageNum: number, pageSize: number, userId: string): Promise<BaseResponse<PageResult<UserInfo>>> {
    return http
      .server()
      .get(`user/fansList/${pageNum}/${pageSize}/${userId}`)
      .then((res) => res.data)
  }
}
