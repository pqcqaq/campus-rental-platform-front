import http from '@/http/HttpClient'
import BaseResponse from '@/model/BaseResponse'
import Chanel from '@/model/Chanel'
import { SwiperItem } from '@/model/Swiper'
import UserInfo from '@/model/UserInfo'

export default class CommonApi {
  static getSwiper(): Promise<BaseResponse<SwiperItem[]>> {
    return http
      .server()
      .get('common/swiper')
      .then((res) => res.data)
  }
}
