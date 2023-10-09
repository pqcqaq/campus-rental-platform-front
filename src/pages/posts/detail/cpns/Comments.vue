<template>
  <div class="main">
    <hd-loading></hd-loading>
    <hd-toast></hd-toast>
    <hd-modal></hd-modal>
    <div class="header"></div>
    <div class="body">
      <!-- 左边显示用户头像（圆形） -->
      <div class="left" @click="openUserDetails">
        <div class="avatar">
          <image lazy-load :lazy-load-margin="1" v-if="comment.author?.avatar != ''" :src="comment.author?.avatar" class="userInfo-user-avatar" />
          <image lazy-load :lazy-load-margin="1" v-else src="@/static/guest.png" class="userInfo-user-avatar" />
        </div>
        <div class="userInfo">
          <div class="nickname">{{ comment.author.nickName }}</div>
          <div class="school">{{ comment.author.school }}</div>
        </div>
      </div>
      <!-- 右边显示用户昵称、评论内容、评论时间 -->
      <div class="right">
        <div class="content">{{ comment.detail }}</div>
        <div class="time">{{ comment.createTime }}</div>
      </div>
      <div class="btn" v-if="!isSubComment">
        <!-- 回复 -->
        <div class="reply" @click="handleReply">回复</div>
      </div>
      <div class="subComments">
        <div v-for="item in comment.comments" :key="item.id">
          <Comments :comment="item" :isSubComment="true" />
        </div>
      </div>
    </div>
    <div class="footer"></div>
  </div>
</template>

<script lang="ts" setup>
import { useLoading, useToast, useModal } from '@/uni_modules/fant-mini-plus'
import Comment from '@/model/Comment'
import Comments from '@/pages/posts/detail/cpns/Comments.vue'
import router from '@/router'
import { useShowNowStore } from '../../../../store/postShowNow/index'

const loading = useLoading()
const toast = useToast()
const modal = useModal()

const props = defineProps({
  comment: {
    type: Object as PropType<Comment>,
    required: true
  },
  isSubComment: {
    type: Boolean,
    required: false,
    default: false
  }
})

onMounted(() => {})

const openUserDetails = () => {
  useShowNowStore().setUserId(props.comment.author.id!)
  router.push({ name: 'userDetails' })
}

const handleReply = () => {}
</script>

<style lang="scss" scoped>
.main {
  margin-bottom: 10rpx;
  .body {
    border: 2rpx solid #000;
  }
  .left {
    display: flex;
    margin-top: 10rpx;
    width: 100%;
    height: 100%;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    .userInfo {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: flex-start;
      height: 100%;
      margin-left: 20rpx;
      padding: 10rpx;
      // 背景 圆角 阴影
      border-radius: 16rpx;
      box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
      // 宽度不要占满全部
      .school {
        font-size: 24rpx;
        color: #000;
      }

      .nickname {
        font-size: 30rpx;
        color: #000;
      }
    }
  }
  .right {
    margin-bottom: 10rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: flex-start;
    width: 100%;
    height: 100%;
    .content {
      font-size: 28rpx;
      color: #000;
      padding: 20rpx;
    }

    .time {
      font-size: 24rpx;
      color: #00000075;
      margin-left: 30rpx;
    }
  }

  .avatar {
    margin-left: 20rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: flex-start;
    width: 110rpx;
    height: 110rpx;
    .userInfo-user-avatar {
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
    }
  }
}
.btn {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  height: 100%;
  .reply {
    margin-right: 20rpx;
    font-size: 24rpx;
    color: #000;
    padding: 10rpx;
    // 背景 圆角 阴影
    border-radius: 16rpx;
    box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
    margin-bottom: 20rpx;
  }
}
</style>
