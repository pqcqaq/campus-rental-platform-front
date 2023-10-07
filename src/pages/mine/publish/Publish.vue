<template>
  <div class="home">
    <hd-loading></hd-loading>
    <hd-modal></hd-modal>
    <hd-toast></hd-toast>
    <view class="header">
      <div class="title">我的发布</div>
      <div class="total">共{{ total }}条</div>
    </view>
    <view class="main">
      <div class="postList">
        <div v-for="item in postList" :key="item.id" class="postItem">
          <PostCard :showDel="true" :showAction="false" :postId="item.id || ''" :post="item" :handleDel="handleDelPost"></PostCard>
        </div>
        <text class="info">{{ loadMsg }}</text>
      </div>
    </view>
  </div>
</template>

<script lang="ts" setup>
import PostApi from '@/api/PostApi'
import Post from '@/model/Post'
import { useLoading, useToast, useModal } from '@/uni_modules/fant-mini-plus'
import PostCard from '@/components/PostCard.vue'
import { useAuthStore } from '../../../store/index'
const loading = useLoading()
const toast = useToast()
const modal = useModal()

const postList = ref<Post[]>([])
const loadMsg = ref<string>('暂无更多数据')
const pageNum = ref<number>(1)
const pageSize = ref<number>(10)
const total = ref<number>(0)

onMounted(() => {
  fetchData()
})

const fetchData = async () => {
  loadMsg.value = '加载中...'
  loading.showLoading({})
  PostApi.getPublishPosts(pageNum.value, pageSize.value, useAuthStore().getUserId())
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

//触底自动刷新
onReachBottom(() => {
  fetchData()
})

const handleDelPost = (postId: string) => {
  // 确认删除
  modal.showModal({
    title: '提示',
    content: '确认删除该帖子吗？',
    success: (res) => {
      if (res.confirm) {
        doDelPost(postId)
      }
    }
  })
}

const doDelPost = (postId: string) => {
  loading.showLoading({})
  PostApi.delPost(postId)
    .then((_resp) => {
      toast.showToast({
        title: '删除成功',
        icon: 'success'
      })
      // 从列表中删除
      postList.value = postList.value.filter((item) => item.id !== postId)
      // 更新总数
      total.value--
    })
    .catch((error) => {
      toast.showToast({
        title: error.message,
        icon: 'error'
      })
    })
    .finally(() => {
      loading.hideLoading()
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
  // 不显示左右滚动条
  overflow-x: hidden;
  .header {
    .title {
      // 显示在左上角，灰色圆角背景
      position: absolute;
      top: 24rpx;
      left: 24rpx;
      padding: 20rpx 20rpx;
      background: #e6e6e665;
      border-radius: 50rpx;
      font-size: 35rpx;
      color: #646566;
      // 背景虚化
      backdrop-filter: blur(10rpx);
    }
    .total {
      // 显示在右上角，灰色圆角背景
      position: absolute;
      top: 24rpx;
      right: 24rpx;
      padding: 20rpx 20rpx;
      background: #e6e6e665;
      border-radius: 50rpx;
      font-size: 35rpx;
      color: #646566;
      // 背景虚化
      backdrop-filter: blur(10rpx);
    }
  }

  .main {
    margin-top: 130rpx;
    &-img {
      width: 64rpx;
      height: 64rpx;
      margin-bottom: 24rpx;
    }
    &-txt {
      font-size: 20rpx;
      color: #646566;
    }
    .postList {
      .postItem {
        margin-bottom: 24rpx;
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
      }
    }
  }
}
</style>
