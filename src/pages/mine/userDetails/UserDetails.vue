<template>
  <hd-toast></hd-toast>
  <div class="main">
    <div class="header">
      <UserInfoCard :user="userDetails" :enable-fillet="false" :custom-style="{ height: '300rpx' }" :handleFollow="handleFollow" />
    </div>
    <div class="body">
      <hd-tabs v-model="active" activeColor="#1C64FD" class="tabs">
        <hd-tab title="最近">
          <div class="postList">
            <div v-for="item in postList" :key="item.id" class="postItem">
              <PostCard :showAction="true" :postId="item.id || ''" :post="item"></PostCard>
            </div>
            <text class="info">{{ loadMsg }}</text>
          </div>
        </hd-tab>
        <hd-tab title="粉丝">谁关注了他</hd-tab>
        <hd-tab title="关注">他的关注列表</hd-tab>
        <hd-tab title="更多">333333</hd-tab>
      </hd-tabs>
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
const loading = useLoading()
const toast = useToast()
const modal = useModal()
const postList = ref<Post[]>([])
const loadMsg = ref<string>('暂无更多数据')
const pageNum = ref<number>(1)
const pageSize = ref<number>(10)
const total = ref<number>(0)
const active = ref(0)
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

onMounted(() => {
  UserApi.getUserDetails(useShowNowStore().userId).then((res) => {
    userDetails.value = res.data!
  })
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
</script>

<style lang="scss" scoped>
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
.tabs {
  margin-top: 20rpx;
  // 允许滚动
  overflow: scroll;
}
</style>
