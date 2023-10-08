<template>
  <div>
    <hd-loading></hd-loading>
    <hd-toast></hd-toast>
    <hd-modal></hd-modal>
    <div class="header"></div>
    <div class="body">
      <!-- 左边显示用户头像（圆形） -->
      <div class="left">
        <div class="avatar">
          <image v-if="comment.author?.avatar != ''" :src="comment.author?.avatar" class="userInfo-user-avatar" />
          <image v-else src="@/static/guest.png" class="userInfo-user-avatar" />
        </div>
        <div>
          <div class="nickname">{{ comment.author.nickName }}</div>
          <div class="school">{{ comment.author.school }}</div>
        </div>
      </div>
      <!-- 右边显示用户昵称、评论内容、评论时间 -->
      <div class="right">
        <div class="content">{{ comment.detail }}</div>
        <div class="time">{{ comment.createTime }}</div>
      </div>
    </div>
    <div class="footer"></div>
  </div>
</template>

<script lang="ts" setup>
import { useLoading, useToast, useModal } from '@/uni_modules/fant-mini-plus'
import Comment from '@/model/Comment'

const loading = useLoading()
const toast = useToast()
const modal = useModal()

const props = defineProps({
  comment: {
    type: Object as PropType<Comment>,
    required: true
  }
})

onMounted(() => {
  console.log(props.comment)
})
</script>

<style lang="scss" scoped>
.body {
  border: 2rpx solid #000;
}
.left {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: row;
  justify-content: flex-start;
}

.nickname {
  font-size: 30rpx;
  color: #000;
}
.school {
  font-size: 24rpx;
  color: #000;
}

.content {
  font-size: 28rpx;
  color: #000;
}

.time {
  font-size: 24rpx;
  color: #00000075;
}

.right {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
  width: 100%;
  height: 100%;
}
.userInfo-user-avatar {
  flex: 0 0 auto;
  border-radius: 50%;
  width: 90rpx;
  height: 90rpx;
}
</style>
