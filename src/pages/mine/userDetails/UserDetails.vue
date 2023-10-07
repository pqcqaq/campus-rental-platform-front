<template>
  <hd-toast></hd-toast>
  <div class="main">
    <div :show="showHeader" name="fade-down" class="header">
      <UserInfoCard :user="userDetails" :enable-fillet="false" :custom-style="{ height: '300rpx' }" :handleFollow="handleFollow" />
    </div>
    <div class="body">
      <view class="nav">
        <view class="tab-scroll" scroll-x="true" scroll-with-animation :scroll-left="scrollLeft">
          <view class="tab-scroll_box">
            <view
              class="tab-scroll_item"
              v-for="(item, index) in category"
              :key="index"
              :class="{ active: isActive == index }"
              @click="chenked(index)"
            >
              {{ item.name }}
            </view>
          </view>
        </view>
      </view>
      <swiper @change="change" :current="isActive" class="swiper-content" :style="fullHeight">
        <swiper-item class="swiperitem-content">
          <scroll-view :scroll-y="true" class="nav_item" @scrolltolower="handleTouchButtom1">
            <div class="postList">
              <div v-for="item in postList" :key="item.id" class="postItem">
                <PostCard :showAction="true" :postId="item.id || ''" :post="item" :enable-side-action="false" />
              </div>
              <text class="info">{{ loadMsg }}</text>
            </div>
          </scroll-view>
        </swiper-item>
        <swiper-item class="swiperitem-content">
          <scroll-view :scroll-y="true" class="nav_item" @scrolltolower="handleTouchButtom2">
            <div class="userInfoHeader">粉丝列表</div>
            <div class="userInfoBody">
              <div v-if="fansList.length > 0">
                <div class="userInfo" v-for="item in fansList" :key="item.id!">
                  <UserInfoCard :user="item" :handleOpenDetails="handleOpenDetails" />
                </div>
              </div>
              <div v-else>暂无更多数据</div>
            </div>
            <div class="userInfoFooter"></div>
          </scroll-view>
        </swiper-item>
        <swiper-item class="swiperitem-content">
          <view scroll-y style="height: 100%">
            <view class="nav_item">33333</view>
          </view>
        </swiper-item>
        <swiper-item class="swiperitem-content">
          <view scroll-y style="height: 100%">
            <view class="nav_item">4444</view>
          </view>
        </swiper-item>
      </swiper>
    </div>
    <div class="footer"></div>
  </div>
</template>

<script lang="ts" setup>
import UserInfoCard from '@/components/UserInfoCard.vue'
import { useShowNowStore } from '@/store/postShowNow'
import UserApi from '@/api/UserAPI'
import UserInfo from '@/model/UserInfo'
import UserAPI from '@/api/UserAPI'
import Post from '@/model/Post'
import { useLoading, useToast, useModal } from '@/uni_modules/fant-mini-plus'
import PostCard from '@/components/PostCard.vue'
import PostApi from '@/api/PostApi'
import rpxToPx from '@/utils/PixelUtils'
import router from '@/router'
const loading = useLoading()
const toast = useToast()
const modal = useModal()
const postList = ref<Post[]>([])
const loadMsg = ref<string>('暂无更多数据')
const pageNum = ref<number>(1)
const pageSize = ref<number>(10)
const total = ref<number>(0)
const active = ref(0)
const showHeader = ref(true)
const userDetails = ref<UserInfo>({
  id: null,
  linkMan: null,
  username: null,
  mobile: null,
  nickName: null,
  avatar: null,
  background: null,
  school: null,
  token: null,
  role: null,
  followNum: null,
  fansNum: null,
  isFollow: null
})
const fansList = ref<UserInfo[]>([])
const pageNum2 = ref<number>(1)
const pageSize2 = ref<number>(10)

const fetchData2 = () => {
  UserAPI.getFansList(pageNum2.value, pageSize2.value, useShowNowStore().userId)
    .then((res) => {
      fansList.value.push(...res.data!.data)
      pageNum2.value++
    })
    .catch((err) => {
      toast.showToast({
        title: '加载失败！',
        icon: 'error'
      })
    })
}

const handleOpenDetails = (userId: string) => {
  useShowNowStore().setUserId(userId)
  router.push({ name: 'userDetails' })
}

//触底自动刷新
const handleTouchButtom2 = () => {
  fetchData2()
}

onMounted(() => {
  UserApi.getUserDetails(useShowNowStore().userId).then((res) => {
    userDetails.value = res.data!
  })
  fetchData2()
})

const handleFollow = () => {
  UserAPI.follow(userDetails.value.id!)
    .then((res) => {
      if (res.code === 200) {
        if (res.data) {
          toast.showToast({
            title: '关注成功',
            icon: 'success'
          })
          userDetails.value.fansNum = userDetails.value.fansNum! + 1
          userDetails.value.isFollow = true
        } else {
          // toast.showToast({
          //   title: '取消关注成功',
          //   icon: 'success'
          // })
          userDetails.value.fansNum = userDetails.value.fansNum! - 1
          userDetails.value.isFollow = false
        }
      }
    })
    .catch((error) => {
      toast.showToast({
        title: error.message,
        icon: 'error'
      })
    })
}
onMounted(() => {
  fetchData()
})

const fetchData = async () => {
  loadMsg.value = '加载中...'
  loading.showLoading({})
  PostApi.getPublishPosts(pageNum.value, pageSize.value, useShowNowStore().userId)
    .then((resp) => {
      const list = resp.data?.data || []
      if (list.length > 0) {
        postList.value = postList.value.concat(list)
        total.value = resp.data?.total || 0
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

// 触底自动刷新
const handleTouchButtom1 = () => {
  fetchData()
}

onMounted(async () => {
  //获取手机屏幕的高度，让其等于swiper的高度，从而使屏幕充满
  uni.getSystemInfo({
    success: function (res) {
      fullHeight.value = 'height:' + (res.windowHeight - rpxToPx(200)) + 'px'
    }
  })
})

const isActive = ref<number>(0)
const currentindex = ref<number>(0)

watch(currentindex, (newval, _oldValue) => {
  isActive.value = newval
  scrollLeft.value = 0
})

const category = ref([
  {
    id: 1,
    name: '最近',
    width: 0,
    left: 0
  },
  {
    id: 2,
    name: '粉丝',
    width: 0,
    left: 0
  },
  {
    id: 3,
    name: '关注',
    width: 0,
    left: 0
  },
  {
    id: 4,
    name: '更多',
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

<style lang="scss" scoped>
.userInfoHeader {
  padding: 20rpx;
  // 文字效果
  border-radius: 50rpx;
  //字体大小
  font-size: 40rpx;
  // 颜色
  color: #64656695;
  // 居中
  display: flex;
  justify-content: center;
}
.userInfoBody {
  padding: 20rpx;
}
.userInfoFooter {
  padding: 80rpx;
}
.userInfo {
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 16px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.header {
  height: 300rpx;
}
.postList {
  .postItem {
    margin-top: 24rpx;
    //放置在中间
    display: flex;
    justify-content: center;
  }
  .info {
    font-size: 35rpx;
    color: #64656695;
    // 居中
    display: flex;
    justify-content: center;
    padding: 60rpx;
  }
}
.body {
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
        overflow-y: auto;
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
</style>
