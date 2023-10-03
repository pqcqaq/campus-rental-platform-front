export class SwiperItem {
  // 图片
  img: Nullable<string> = null
  // 文字
  text: Nullable<string> = null
}

export interface Swiper {
  // 轮播图
  [index: number]: SwiperItem[]
}