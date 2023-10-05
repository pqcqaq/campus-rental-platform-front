export class SwiperItem {
  // 帖子id
  postId: Nullable<string> = null
  // 图片
  img: Nullable<string> = null
  // 文字
  text: Nullable<string> = null
  // 类型
  type: Nullable<string> = null
}

export interface Swiper {
  // 轮播图
  [index: number]: SwiperItem[]
}
