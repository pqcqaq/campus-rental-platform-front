<template>
  <view class="content">
    <hd-loading></hd-loading>
    <hd-toast></hd-toast>
    <hd-modal></hd-modal>
    <view class="nav">
      <view class="tab-scroll" scroll-x="true" scroll-with-animation :scroll-left="scrollLeft">
        <view class="tab-scroll_box">
          <!-- 选项卡类别列表 -->
          <view class="tab-scroll_item" v-for="(item, index) in category" :key="index" :class="{ active: isActive == index }" @click="chenked(index)">
            {{ item.name }}
          </view>
        </view>
      </view>
    </view>
    <swiper @change="change" :current="isActive" class="swiper-content" :style="fullHeight">
      <swiper-item class="swiperitem-content">
        <!-- <view scroll-y style="height: 100%"> -->
        <scroll-view :scroll-y="true" style="height: 100%">
          <view class="nav_item">
            <Info />
          </view>
          <!-- </view> -->
        </scroll-view>
      </swiper-item>
      <swiper-item class="swiperitem-content">
        <scroll-view
          :scroll-y="true"
          style="height: 100%"
          @scrolltolower="handleTouchButtom"
          @refresherrefresh="handleTouchTop"
          refresher-enabled
          :refresher-triggered="freshStatus"
        >
          <view class="comment">
            <div v-for="item in commentsList" :key="item.id">
              <Comments :comment="item" />
            </div>
            <div class="msg">{{ msg }}</div>
          </view>
        </scroll-view>
      </swiper-item>
    </swiper>
  </view>
</template>
<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import Info from '@/pages/posts/detail/cpns/Info.vue'
import Comments from '@/pages/posts/detail/cpns/Comments.vue'
import PostApi from '@/api/PostApi'
import { useLoading, useToast, useModal } from '@/uni_modules/fant-mini-plus'
import Post from '@/model/Post'
import Comment from '@/model/Comment'
import CommentApi from '../../../api/CommentApi'
import { useShowNowStore } from '../../../store/postShowNow/index'

const loading = useLoading()
const toast = useToast()
const modal = useModal()
const commentsList = ref<Comment[]>([])
const pageNum = ref<number>(1)
const pageSize = ref<number>(10)
const msg = ref<string>('暂无更多数据')
const freshStatus = ref<boolean>(false)

onMounted(async () => {
  //获取手机屏幕的高度，让其等于swiper的高度，从而使屏幕充满
  uni.getSystemInfo({
    success: function (res) {
      fullHeight.value = 'height:' + res.windowHeight + 'px'
    }
  })
  fetchData()
})

const fetchData = () => {
  msg.value = '加载中...'
  loading.showLoading({})
  freshStatus.value = false
  CommentApi.pageComments(pageNum.value, pageSize.value, useShowNowStore().postId)
    .then((res) => {
      if (res.data!.data.length > 0) {
        pageNum.value++
        commentsList.value.push(...res.data!.data)
      }
    })
    .catch((err) => {
      toast.showToast({
        title: err.message,
        icon: 'error'
      })
    })
    .finally(() => {
      loading.hideLoading()
      msg.value = '暂无更多数据'
      uni.stopPullDownRefresh()
      freshStatus.value = true
    })
}

// 触底
const handleTouchButtom = () => {
  fetchData()
}

const handleTouchTop = () => {
  pageNum.value = 1
  commentsList.value = []
  fetchData()
}

onPullDownRefresh(() => {
  pageNum.value = 1
  commentsList.value = []
  fetchData()
})

const isActive = ref<number>(0)
const currentindex = ref<number>(0)

watch(currentindex, (newval, _oldValue) => {
  isActive.value = newval
  scrollLeft.value = 0
  for (let i = 0; i < newval - 1; i++) {
    scrollLeft.value += category.value[i].width
  }
})

const category = ref([
  {
    id: 1,
    name: '详情',
    width: 0,
    left: 0
  },
  {
    id: 2,
    name: '评论',
    width: 0,
    left: 0
  }
])
const scrollLeft = ref<number>(0) // 横向滚动条位置
const fullHeight = ref<string>('')

// 当前点击子元素靠左留一个选项展示，子元素宽度不相同也可实现
const chenked = (index) => {
  isActive.value = index
  scrollLeft.value = 0
  for (let i = 0; i < index - 1; i++) {
    scrollLeft.value += category[i].width
  }
}
// swiper滑动时，获取其索引，也就是第几个
const change = (e) => {
  const { current } = e.detail
  currentindex.value = current
}
</script>
<style lang="scss">
.msg {
  text-align: center;
  color: #999;
  font-size: 20px;
  padding: 20px 0;
}
page {
  height: 100%;
  display: flex;
  background-color: #ffffff;
}
.content {
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  .nav {
    border-top: 1rpx solid #f2f2f2;
    background-color: #deebff;
    position: fixed;
    z-index: 99;
    width: 100%;
    align-items: center;
    height: 100rpx;
    .tab-scroll {
      flex: 1;
      overflow: hidden;
      box-sizing: border-box;
      padding-left: 30rpx;
      padding-right: 30rpx;
      .tab-scroll_box {
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        box-sizing: border-box;
        .tab-scroll_item {
          line-height: 60rpx;
          margin-right: 35rpx;
          flex-shrink: 0;
          padding-bottom: 10px;
          display: flex;
          justify-content: center;
          font-size: 16px;
          padding-top: 10px;
        }
      }
    }
  }
  .swiper-content {
    padding-top: 100rpx;
    height: 100%;
    // flex: 1;
    .swiperitem-content {
      background-color: #ffffff;
      .nav_item {
        background-color: #e3ecff;
        height: 100%;
        padding: 20rpx;
        //可以上下滚动
        // overflow-y: auto;
      }
    }
  }
}
.active {
  position: relative;
  color: #3b69ff;
  font-weight: 600;
}
.active::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 10rpx;
  background-color: #3b69ff;
  left: 0px;
  right: 0px;
  bottom: 5px;
  margin: auto;
  // 阴影
  box-shadow: 3rpx 3rpx 20rpx 0rpx rgba(0, 0, 0, 0.186);
  // 圆角
  border-radius: 20rpx;
}
.uni-scroll-view::-webkit-scrollbar {
  display: none;
}
.comment {
  background-color: #e3ecff;
  height: 100%;
  padding: 20rpx;
  padding-top: 50rpx;
}
</style>
