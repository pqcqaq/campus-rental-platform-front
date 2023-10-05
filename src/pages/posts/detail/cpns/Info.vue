<template>
  <div>
    <hd-loading></hd-loading>
    <hd-toast></hd-toast>
    <hd-modal></hd-modal>
    <div class="body">
      <div class="header">
        <view class="header-user">
          <image v-if="post.author?.avatar != ''" :src="post.author?.avatar" class="header-user-avatar"></image>
          <image v-else src="@/static/guest.png" class="header-user-avatar" />
          <view class="header-user-nickname">
            <view class="nickname">{{ post.author?.nickName }}</view>
            <view class="info">{{ post.author?.school }}</view>
            <view class="phone">{{ post.author?.mobile }}</view>
          </view>
        </view>
      </div>
      <div class="main">
        <div class="swiper">
          <swiper
            v-if="swiperList.length > 0"
            class="swiper-box"
            :indicator-dots="indicatorDots"
            :autoplay="autoplay"
            :interval="interval"
            :duration="duration"
            circular="true"
            previous-margin="20px"
            next-margin="20px"
          >
            <swiper-item class="swiper-box" :autoplay="true" :interval="1000" v-for="(item, index) in swiperList" :key="index">
              <view class="swiper-item" @click="previewImg(item)">
                <image class="image" mode="aspectFill" :src="item" lazy-load :lazy-load-margin="0"></image>
              </view>
            </swiper-item>
          </swiper>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Post from '@/model/Post'
import { SwiperItem } from '@/model/Swiper'
import { useLoading, useToast, useModal } from '@/uni_modules/fant-mini-plus'
import { transIdToUrl } from '@/utils/ImageUtils'
import { usePostShowNowStore } from '@/store/postShowNow'
import PostApi from '@/api/PostApi'

const loading = useLoading()
const toast = useToast()
const modal = useModal()
const swiperList = ref<string[]>([])
const indicatorDots = ref<boolean>(true)
const autoplay = ref<boolean>(true)
const interval = ref<number>(5000)
const duration = ref<number>(1000)
//解构
const { postShowNow, postId } = storeToRefs(usePostShowNowStore())

const post = ref<Post>({})

const previewImg = (item: string) => {
  uni.previewImage({
    current: item,
    urls: swiperList.value
  })
}

onMounted(async () => {
  loading.showLoading({
    title: '加载中'
  })
  try {
    const res = await PostApi.getPostDetail(postId.value)
    post.value = res.data || {}
    const imgList = res.data?.imgs || []
    const list: string[] = []
    for (const item of imgList) {
      list.push(await transIdToUrl(item.id))
    }
    swiperList.value = list
    // 隐藏加载中
  } catch (error) {
    toast.showToast({
      title: '加载失败！',
      duration: 2000,
      icon: 'error'
    })
  } finally {
    loading.hideLoading()
  }
})
</script>

<style lang="scss" scoped>
.body {
  padding: 30rpx;
  box-sizing: border-box;
  // 背景，圆角，阴影
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
}
.header:hover {
  cursor: pointer;
  // 阴影
  box-shadow: 0 5rpx 20rpx rgba(0, 0, 0, 0.25);
  // 变色
  background: #f6f9fe;
}
.header {
  width: 100%;
  background: #f6f9fe;
  border-radius: 16rpx;
  padding: 32rpx;
  box-sizing: border-box;
  box-shadow: 0 5rpx 20rpx rgba(0, 0, 0, 0.35);

  &-user {
    display: flex;
    margin-bottom: 10rpx;
    &-avatar {
      flex: 0 0 auto;
      border-radius: 50%;
      width: 128rpx;
      height: 128rpx;
      overflow: hidden;
    }
    &-nickname {
      flex: 1 1 auto;
      margin-left: 32rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .nickname {
        color: #292c39;
        font-weight: 550;
        font-size: 40rpx;
        margin-bottom: 2rpx;
      }
      .info {
        color: #c6c9cf;
        font-size: 28rpx;
      }
      .phone {
        color: #c6c9cf;
        font-size: 20rpx;
      }
    }
    &-more {
      flex: 0 0 auto;
      width: 48rpx;
    }
  }
}
.swiper-box {
  height: 380upx;
  padding-top: 5rpx;

  .swiper-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #999;
    color: #fff;
    margin: 10rpx 10rpx 10rpx 10px;
    border-radius: 50upx;
    /* app上运行不显示图片，就需要加下面这行，设置高度 */
    height: 320upx;
    .image {
      width: 100%;
      height: 320upx;
      // 图片的圆角
      border-radius: 50upx;
      // 阴影
      box-shadow: 3rpx 3rpx 20rpx 0rpx rgba(0, 0, 0, 0.186);
    }
    .text {
      // 没有高度体积，放置在右下角
      position: absolute;
      bottom: 70rpx;
      right: 30rpx;
      padding: 15rpx;
      // 阴影
      background-color: #64656666;
      border-radius: 20rpx;
      box-shadow: 3rpx 3rpx 20rpx 0rpx rgba(0, 0, 0, 0.186);
      // 阴影模糊效果
      backdrop-filter: blur(10rpx);
    }
    .logos {
      position: absolute;
      left: 30rpx;
      bottom: 60rpx;
      display: flex;
      padding: 5rpx;
      // 文字背景
      border-radius: 20rpx 20rpx 20rpx 20rpx;
      // 标题颜色
      color: #000000ae;
      image {
        width: 25rpx;
        height: 25rpx;
        margin-right: 10rpx;
      }
      .collect {
        margin-left: 10rpx;
        margin-right: 10rpx;
      }
      .like {
        margin-left: 10rpx;
        margin-right: 10rpx;
      }
    }
  }
}
.swiper {
  margin-top: 20rpx;
  // 背景，圆角，阴影
  background: #fffdef;
  border-radius: 16rpx;
  box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
}
</style>
