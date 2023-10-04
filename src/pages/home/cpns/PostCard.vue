<template>
  <div :style="postStyle" class="postCard" ref="postCard" @touchstart="touchS" @touchmove="touchM" @touchend="touchE">
    <div class="img" @click="handleClickPost">
      <image class="img" ref="img" :src="firstImageUrl" mode="aspectFill" />
    </div>
    <div class="info">
      <div class="title">
        {{ post.title }}
      </div>
      <!-- 数量信息 -->
      <div class="nums">
        <!-- 收藏数目 -->
        <div class="collect">
          <image src="@/static/star-fill.png"></image>
          <text class="numText">{{ collectNum }}</text>
        </div>
        <!-- 点赞数目 -->
        <div class="like">
          <image src="@/static/like.png"></image>
          <text class="numText">{{ likeNum }}</text>
        </div>
      </div>
    </div>
    <div class="postActions" ref="postActions">
      <button class="actionButton" @click="handleLike">
        <hd-icon class="likeBtn" name="ic_collection_fill" :color="btnIconColor" size="50rpx"></hd-icon>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import PostApi from '@/api/PostApi'
import ImgSelect from '@/model/ImgSelect'
import Post from '@/model/Post'
import router from '@/router'
import { transIdToUrl } from '@/utils/ImageUtils'
import { ref } from 'vue'

onMounted(async () => {
  const imgList = props.post.imgs || []
  if (imgList.length > 0) {
    const url = await transIdToUrl(imgList[0].id)
    firstImageUrl.value = url
  } else {
    const url = await transIdToUrl('1709549532318216194')
    firstImageUrl.value = url
  }
  // 设置按钮颜色
  btnIconColor.value = props.post.isLike ? '#F97F7F' : '#fff'
})

const props = defineProps({
  height: {
    type: String,
    default: '400rpx'
  },
  width: {
    type: String,
    default: '700rpx'
  },
  post: {
    type: Post,
    required: true
  }
})

const postStyle = ref({
  transform: 'scale(1)',
  height: props.height,
  width: props.width
})

const firstImageUrl = ref('')

const btnIconColor = ref('#fff')

let startX = 0
let moveX = 0

const touchS = (e: TouchEvent) => {
  startX = e.touches[0].clientX
}

const touchM = (e: TouchEvent) => {
  moveX = e.touches[0].clientX - startX
}

const touchE = (e: TouchEvent) => {
  const offset = Math.abs(moveX)
  if (moveX < 0 && offset > 100) {
    // 触发滑动事件,左移30%
    postStyle.value.transform = 'translate(-30%, 0)'
  }
  if (moveX > 0 && offset > 100) {
    // 恢复原状
    postStyle.value.transform = 'translate(0, 0)'
  }
}

const handleClickPost = (e: MouseEvent) => {
  // 处理点击事件
  router.push({ name: 'detail', params: { id: props.post.id || '' } })
}

// 收藏数量
const collectNum = ref<number>(props.post.collectNum || 0)
// 点赞数量
const likeNum = ref<number>(props.post.likeNum || 0)

const handleLike = (e: MouseEvent) => {
  // 处理点赞事件
  PostApi.likePost(props.post.id || '')
    .then((resp) => {
      if (resp.data) {
        // 点赞成功
        btnIconColor.value = '#F97F7F'
        // 更新点赞数目
        likeNum.value++
      } else {
        // 取消点赞
        btnIconColor.value = '#fff'
        // 更新点赞数目
        likeNum.value--
      }
    })
    .catch((error) => {
      console.log(error)
    })
}
</script>

<style lang="scss" scoped>
.postCard {
  background-color: #fff;
  border-radius: 20rpx;
  box-shadow: 3rpx 3rpx 20rpx 0rpx rgba(0, 0, 0, 0.186);
  position: relative;
  // 动画效果
  transition: transform 0.3s ease-in-out;

  .info {
    .title {
      // 文字显示在图片的右下角
      position: absolute;
      bottom: 0;
      right: 0;
      padding: 15rpx;
      // 文字背景
      background: rgba(218, 218, 218, 0.5);
      border-radius: 20rpx 20rpx 20rpx 20rpx;
      // 标题颜色
      color: #000000ae;
    }
    .nums {
      display: flex;
      image {
        width: 25rpx;
        height: 25rpx;
        margin-right: 10rpx;
      }
      //元素之间的距离
      margin-top: 10rpx;
      .collect {
        margin-right: 10rpx;
      }
      .like {
        margin-right: 10rpx;
      }

      .numText {
        margin-right: 10rpx;
        font-size: 25rpx;
        color: #000000ae;
        //上下居中
        line-height: 30rpx;
        align-items: center;
        justify-content: center;
      }
      // 文字显示在图片的左下角
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 15rpx;
      // 文字背景
      background: rgba(218, 218, 218, 0.5);
      border-radius: 20rpx 20rpx 20rpx 20rpx;
      // 标题颜色
      color: #000000ae;
    }
  }
  .img {
    width: 100%;
    height: 100%;
    border-radius: 20rpx;
    object-fit: cover;
    transition: transform 0.3s ease-in-out;
  }
  .postActions {
    position: absolute;
    top: 0;
    right: -100px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    transition: right 0.3s ease-in-out;
  }
  .actionButton {
    width: 120rpx;
    height: 120rpx;
    margin-top: 10rpx;
    background-color: #b5daff;
    color: #fff;
    border: none;
    border-radius: 50%;
    margin-bottom: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;
    // 阴影
    box-shadow: 3rpx 3rpx 20rpx 0rpx rgba(0, 0, 0, 0.186);
    .likeBtn {
      transition: transform 0.3s ease-in-out;
    }
  }
  .actionButton:hover {
    background-color: #4c8fcb;
  }
}
</style>
