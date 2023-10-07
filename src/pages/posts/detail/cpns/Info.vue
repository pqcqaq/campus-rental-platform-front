<template>
  <div>
    <hd-loading></hd-loading>
    <hd-toast></hd-toast>
    <hd-modal></hd-modal>
    <div class="body">
      <div class="header">
        <div class="title">{{ post.title }}</div>
        <div class="time">发布于{{ post.createTime }}</div>
        <view class="divLine" />
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
      <div class="main">
        <UserInfo :user="post.author" :handleFollow="handleFollow" :handle-open-details="handleOpenDetails" />
        <view class="divLine" />
        <view class="context">
          {{ post.intro }}
        </view>
      </div>
      <div class="footer">
        <view>
          <div class="logos">
            <!-- 收藏数目 -->
            <div class="collect" @click="handleCollect">
              <uni-icons class="collectBtn" type="star-filled" :color="collectBtnIconColor" size="100rpx" />
              <div class="num">{{ post.collectNum }}</div>
            </div>
            <!-- 点赞数目 -->
            <div class="like" @click="handleLike">
              <uni-icons class="likeBtn" :color="likeBtnInconColor" type="heart-filled" size="100rpx" />
              <div class="num">{{ post.likeNum }}</div>
            </div>
          </div>
        </view>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Post from '@/model/Post'
import { SwiperItem } from '@/model/Swiper'
import { useLoading, useToast, useModal } from '@/uni_modules/fant-mini-plus'
import { transIdToUrl } from '@/utils/ImageUtils'
import { useShowNowStore } from '@/store/postShowNow'
import PostApi from '@/api/PostApi'
import UserInfo from '@/components/UserInfoCard.vue'
import UserAPI from '@/api/UserAPI'
import router from '@/router'

const loading = useLoading()
const toast = useToast()
const swiperList = ref<string[]>([])
const indicatorDots = ref<boolean>(true)
const autoplay = ref<boolean>(true)
const interval = ref<number>(5000)
const duration = ref<number>(1000)
const collectBtnIconColor = ref<string>('#DDDDDD')
const likeBtnInconColor = ref<string>('#DDDDDD')
//解构
const { postId } = storeToRefs(useShowNowStore())

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
    // 设置按钮颜色
    collectBtnIconColor.value = post.value.isCollect ? '#F7CA59' : '#DDDDDD'
    likeBtnInconColor.value = post.value.isLike ? '#E76363' : '#DDDDDD'
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

onPullDownRefresh(() => {
  uni.stopPullDownRefresh()
})

const handleCollect = async () => {
  // 发起请求
  PostApi.collectPost(post.value.id || '')
    .then((resp) => {
      // 设置按钮颜色
      collectBtnIconColor.value = resp.data ? '#F7CA59' : '#DDDDDD'
      // 设置收藏数目
      post.value.collectNum = resp.data ? (post.value.collectNum || 0) + 1 : (post.value.collectNum || 0) - 1
    })
    .catch((_error) => {
      toast.showToast({
        title: '收藏失败',
        icon: 'error'
      })
    })
}

const handleLike = async () => {
  // 发起请求
  PostApi.likePost(post.value.id || '')
    .then((resp) => {
      // 设置按钮颜色
      likeBtnInconColor.value = resp.data ? '#E76363' : '#DDDDDD'
      // 设置点赞数目
      post.value.likeNum = resp.data ? (post.value.likeNum || 0) + 1 : (post.value.likeNum || 0) - 1
    })
    .catch((_error) => {
      toast.showToast({
        title: '点赞失败',
        icon: 'error'
      })
    })
}

const handleFollow = () => {
  UserAPI.follow(post.value.author?.id || '')
    .then((res) => {
      if (res.code === 200) {
        if (res.data) {
          toast.showToast({
            title: '关注成功',
            icon: 'success'
          })
          post.value.author!.fansNum = (post.value.author?.fansNum || 0) + 1
          post.value.author!.isFollow = true
        } else {
          // toast.showToast({
          //   title: '取消关注成功',
          //   icon: 'success'
          // })
          post.value.author!.fansNum = (post.value.author?.fansNum || 0) - 1
          post.value.author!.isFollow = false
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

const handleOpenDetails = (userId: string) => {
  console.log('打开用户详情', userId)

  useShowNowStore().setUserId(userId)
  router.push({ name: 'userDetails' })
}
</script>

<style lang="scss" scoped>
.header {
  .title {
    font-size: 40rpx;
    font-weight: 550;
    color: #152a89a0;
    margin-bottom: 20rpx;
  }
}
.body {
  padding: 20rpx;
  box-sizing: border-box;
  // 背景，圆角，阴影
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
  margin-bottom: 150rpx;
}

.main {
  width: 100%;
  background: #ffffff;
  margin-top: 20rpx;
  padding: 15rpx;
  box-sizing: border-box;
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
  }
}
.footer {
  margin-top: 50rpx;
  padding: 10rpx;
  width: 60%;
  margin-bottom: 30rpx;
  // 背景，圆角，阴影
  background: #eff2ff;
  border-radius: 16rpx;
  box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
  // 居中显示
  margin-left: auto;
  margin-right: auto;

  .logos {
    display: flex;
    padding: 5rpx;
    // 文字背景
    border-radius: 20rpx 20rpx 20rpx 20rpx;
    // 居中显示
    justify-content: center;
    // 标题颜色
    color: #000000ae;

    image {
      width: 100rpx;
      height: 100rpx;
      padding: 5rpx;
      border-radius: 50%;
    }
    .collect {
      margin-right: 50rpx;
      // 竖着排列
      flex-direction: column;
    }
    .like {
      // 竖着排列
      flex-direction: column;
    }
    .num {
      //居中
      text-align: center;
      // 字体样式
      font-size: 40rpx;
      font-weight: 550;
      color: #292c39;
    }
  }
}
.divLine {
  background: #b3b4b9;
  width: 100%;
  height: 5rpx;
  margin-top: 30rpx;
  margin-bottom: 20rpx;
}
.swiper {
  // 背景，圆角，阴影
  background: #fffdef;
  border-radius: 16rpx;
  box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
}
.time {
  font-size: 25rpx;
  color: #292c3951;
}
.context {
  margin-top: 20rpx;
  white-space: pre-wrap;
  // 正文样式
  font-size: 32rpx;
  color: #292c39;
  line-height: 1.5;
}
</style>
