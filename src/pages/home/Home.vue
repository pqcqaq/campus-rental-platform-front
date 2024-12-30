<template>
  <hd-loading></hd-loading>
  <hd-toast></hd-toast>
  <view class="home">
    <view class="header">
      <swiper
        class="swiper-box"
        :indicator-dots="indicatorDots"
        :autoplay="autoplay"
        :interval="interval"
        :duration="duration"
        circular="true"
        previous-margin="20px"
        next-margin="20px"
      >
        <swiper-item class="swiper-box" :autoplay="true" :interval="1000" v-for="item in swiperList" :key="item">
          <view class="swiper-item" @click="openDetial(item)">
            <image class="image" mode="aspectFill" :src="item.img"></image>
            <text class="text">{{ item.text }}</text>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <view class="main">
      <hd-button @click="doNav">
        <hd-icon name="ic_scan_line" size="48rpx" color="#292C39"></hd-icon>
      </hd-button>
      <PostCard></PostCard>
    </view>
    <!-- 悬浮在左下角的发布按钮（圆形加号） -->
    <button class="addBtn" color="#E1EDF9" @click="doAdd">
      <hd-icon class="icon" name="ic_add_line" size="110rpx" color="#71ADE9"></hd-icon>
    </button>
  </view>
</template>

<script lang="ts" setup>
import CommonApi from '@/api/CommonApi'
import DemoApi from '@/api/DemoApi'
import Chanel from '@/model/Chanel'
import { SwiperItem } from '@/model/Swiper'
import { useLoading, useToast } from '@/uni_modules/fant-mini-plus'
import axios from 'axios'
import { ref, onMounted } from 'vue'
import PostCard from './cpns/PostCard.vue'
const loading = useLoading()
const toast = useToast()
const router = useRouter()
const swiperList = ref<SwiperItem[]>([])
const indicatorDots = ref<boolean>(true)
const autoplay = ref<boolean>(true)
const interval = ref<number>(5000)
const duration = ref<number>(1000)

const chanel = ref<Chanel[]>([])

onMounted(() => {
  doInit()
})

/**
 * 跳转至路由演示页面
 */
function doNav() {
  router.push({ name: 'routerDemo' })
}

function doAdd() {
  router.push({ name: 'add' })
}
/**
 * 初始化
 */
function doInit() {
  loading.showLoading({})
  DemoApi.init()
    .then((resp) => {
      loading.hideLoading()
      chanel.value = resp.data || []
    })
    .catch((error) => {
      loading.hideLoading()
      // 判断如果是取消的请求则不提示
      if (axios.isCancel(error)) {
        return
      }
      toast.showToast({
        title: error.message,
        icon: 'none'
      })
    })
  // 获取轮播图
  CommonApi.getSwiper().then((resp) => {
    swiperList.value = resp.data || []
    console.log(resp.data)
  })
}

const openDetial = (item) => {
  console.log(item.postId)
  router.push({ name: 'detail', params: { id: item.postId } })
}
</script>

<style lang="scss" scoped>
.home {
  min-height: calc(100vh - var(--window-top) - var(--window-bottom));
  width: 100vw;
  box-sizing: border-box;
  background: #f4f9ff;
  padding: 0 24rpx 24rpx;
  .header {
    margin-bottom: 24rpx;
  }
  .main {
    &-img {
      width: 64rpx;
      height: 64rpx;
      margin-bottom: 24rpx;
    }
    &-txt {
      font-size: 20rpx;
      color: #646566;
    }
  }
}
.addBtn {
  width: 100rpx;
  height: 100rpx;
  position: fixed;
  bottom: 120rpx;
  left: 24rpx;
  border-radius: 50%;
  // 阴影
  box-shadow: 3rpx 3rpx 20rpx 0rpx rgba(64, 109, 255, 0.665);

  .icon {
    // 居中
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
.swiper-box {
  height: 380upx;
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
      bottom: 60rpx;
      right: 50rpx;
      padding: 10rpx;
    }
  }
}
</style>
