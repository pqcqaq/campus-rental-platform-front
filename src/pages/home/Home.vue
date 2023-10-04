<template>
  <hd-loading></hd-loading>
  <hd-toast></hd-toast>
  <view class="home">
    <view class="header">
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
        <swiper-item class="swiper-box" :autoplay="true" :interval="1000" v-for="item in swiperList" :key="item">
          <view class="swiper-item" @click="openDetial(item)">
            <image class="image" mode="aspectFill" :src="item.img"></image>
            <text class="text">{{ item.text }}</text>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <view class="main">
      <!-- <hd-button @click="doNav">
        <hd-icon name="ic_scan_line" size="48rpx" color="#292C39"></hd-icon>
      </hd-button> -->
      <div v-for="(item, index) in postList" :key="index" class="postItem">
        <PostCard :postId="item.id || ''" :post="item"></PostCard>
      </div>
      <div>
        <!-- 暂无更多的提示  -->
        <text class="info">{{ loadMsg }}</text>
      </div>
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
import Post from '@/model/Post'
import { userInfo } from 'os'
import PostApi from '@/api/PostApi'
import { transIdToUrl } from '@/utils/ImageUtils'
const loading = useLoading()
const toast = useToast()
const router = useRouter()
const swiperList = ref<SwiperItem[]>([])
const indicatorDots = ref<boolean>(true)
const autoplay = ref<boolean>(true)
const interval = ref<number>(5000)
const duration = ref<number>(1000)
const pageNum = ref<number>(1)
const pageSize = ref<number>(10)
const loadMsg = ref<string>('暂无更多数据')

onMounted(() => {
  fetchData()
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
function fetchData() {
  loading.showLoading({})
  DemoApi.init()
    .then((resp) => {
      loading.hideLoading()
    })
    .catch((error) => {
      loading.hideLoading()
      toast.showToast({
        title: error.message,
        icon: 'none'
      })
    })
  // 获取轮播图
  CommonApi.getSwiper().then(async (resp) => {
    const imgList: SwiperItem[] = resp.data || []
    for (const imgItem of imgList) {
      imgItem.img = await transIdToUrl(imgItem?.img || '')
    }
    swiperList.value = imgList
    console.log(resp.data)
  })
  // 获取帖子列表
  fetchList()
}

const openDetial = (item) => {
  router.push({ name: 'detail', params: { id: item.postId } })
}

const postList = ref<Post[]>([])

const fetchList = () => {
  loadMsg.value = '加载中...'
  loading.showLoading({})
  PostApi.getPostsList(pageNum.value, pageSize.value)
    .then((resp) => {
      const list = resp.data?.data || []
      if (list.length > 0) {
        postList.value = postList.value.concat(list)
        pageNum.value++
      } else {
        loadMsg.value = '暂无更多数据'
      }
    })
    .catch((error) => {
      toast.showToast({
        title: error.message,
        icon: 'error'
      })
    })
    .finally(() => {
      loadMsg.value = '暂无更多数据'
      loading.hideLoading()
    })
}

onReachBottom(() => {
  fetchList()
})
</script>

<style lang="scss" scoped>
.home {
  min-height: calc(100vh - var(--window-top) - var(--window-bottom));
  width: 100vw;
  box-sizing: border-box;
  background: #f4f9ff;
  padding: 0 24rpx 24rpx;
  // 不显示左右滚动条
  overflow-x: hidden;
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
    .postItem {
      margin-bottom: 24rpx;
    }
    .info {
      font-size: 35rpx;
      color: #64656695;
      // 居中
      display: flex;
      justify-content: center;
    }
  }
}
.addBtn {
  width: 100rpx;
  height: 100rpx;
  position: fixed;
  bottom: 80rpx;
  left: 30rpx;
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
      bottom: 60rpx;
      right: 50rpx;
      padding: 10rpx;
    }
  }
}
</style>
