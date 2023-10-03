<template>
  <hd-loading></hd-loading>
  <hd-toast></hd-toast>
  <view class="home">
    <view class="header">
      <hd-swiper
        :swiperList="swiperList"
        card
        :vertical="false"
        previousMargin="50rpx"
        nextMargin="50rpx"
        :showTextTip="true"
        :indicatorDots="false"
      ></hd-swiper>
    </view>
    <view class="main">
      <hd-button @click="doNav">
        <hd-icon name="ic_scan_line" size="48rpx" color="#292C39"></hd-icon>
      </hd-button>
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
const loading = useLoading()
const toast = useToast()
const router = useRouter()
const swiperList = ref<SwiperItem[]>([])

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
</style>
