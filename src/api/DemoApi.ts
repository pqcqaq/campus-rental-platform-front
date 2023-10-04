import http from '@/http/HttpClient'
import BaseResponse from '@/model/BaseResponse'
import Chanel from '@/model/Chanel'
import UserInfo from '@/model/UserInfo'

// 这里将API方法统一管理
export default class DemoApi {
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

  /**
   * 初始化
   */
  static init(): Promise<BaseResponse<Chanel[]>> {
    return http
      .server()
      .post('common/init', {}, {})
      .then((res) => res.data)
  }
}
