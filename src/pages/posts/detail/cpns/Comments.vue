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
        <div class="reply" @click="doReply">{{ replyMsg }}</div>
      </div>
      <div class="replyInput" v-if="!isSubComment && showReplyInput">
        <!-- 回复的输入框 -->
        <div>
          <input v-model="replyInput" placeholder="输入内容" />
        </div>
        <button @click="handleReply">发送</button>
      </div>
    </div>
    <div class="footer">
      <div class="subComments">
        <div v-for="item in subComments" :key="item.id">
          <Comments :comment="item" :isSubComment="true" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useLoading, useToast, useModal } from '@/uni_modules/fant-mini-plus'
import Comment from '@/model/Comment'
import Comments from '@/pages/posts/detail/cpns/Comments.vue'
import router from '@/router'
import { useShowNowStore } from '../../../../store/postShowNow/index'
import CommentApi from '../../../../api/CommentApi'

const loading = useLoading()
const toast = useToast()
const modal = useModal()
const subComments = ref<Comment[]>([])

const replyInput = ref<string>('')
const showReplyInput = ref<boolean>(false)
const replyMsg = computed(() => {
  return showReplyInput.value ? '取消' : '回复'
})

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

onMounted(() => {
  subComments.value = props.comment.comments
})

const openUserDetails = () => {
  useShowNowStore().setUserId(props.comment.author.id!)
  router.push({ name: 'userDetails' })
}

const doReply = () => {
  showReplyInput.value = !showReplyInput.value
}

const handleReply = () => {
  CommentApi.publishComment({
    postId: useShowNowStore().postId,
    commentDetail: replyInput.value,
    parentId: props.comment.id
  })
    .then((res) => {
      toast.showToast({
        title: '回复成功',
        icon: 'success'
      })
      replyInput.value = ''
      showReplyInput.value = false
      subComments.value.push(res.data!)
    })
    .catch((err) => {
      toast.showToast({
        title: err.data.data,
        icon: 'error'
      })
    })
}
</script>

<style lang="scss" scoped>
.replyInput {
  // 背景 圆角 阴影
  border-radius: 30rpx;
  box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
  background: #ecf2ff;
  margin: 10rpx;
  padding: 10rpx 20rpx 10rpx 30rpx;
  input {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    font-size: 28rpx;
    color: #000;
  }
  display: flex;
  // 发送按钮显示在右边
  align-items: center;
  button {
    margin-right: 10rpx;
    font-size: 24rpx;
    color: #000;
    padding: 10rpx;
    // 背景 圆角 阴影
    border-radius: 50rpx;
    box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
  }
}
.main {
  margin-bottom: 10rpx;
  // 背景 圆角 阴影
  border-radius: 30rpx;
  box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
  background: #f3f3f3;
  .body {
    display: inline; //默认值
  }
  .left {
    display: flex;
    margin-top: 10rpx;
    height: 100%;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    // 背景 圆角 阴影
    border-radius: 16rpx;
    box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
    .userInfo {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: flex-start;
      height: 100%;
      margin-left: 20rpx;
      padding: 10rpx;

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
