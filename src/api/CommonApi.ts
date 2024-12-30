import http from '@/http/HttpClient'
import BaseResponse from '@/model/BaseResponse'
import { SwiperItem } from '@/model/Swiper'

export default class CommonApi {
  static getSwiper(): Promise<BaseResponse<SwiperItem[]>> {
    return http
      .server()
      .get('common/swiper')
      .then((res) => res.data)
  }
}
