<template>
  <hd-loading></hd-loading>
  <hd-toast></hd-toast>
  <hd-modal></hd-modal>
  <div class="header">fanslist</div>
  <div class="body">
    <div v-if="fansList.length > 0">
      <div class="userInfo" v-for="item in fansList" :key="item.id!">
        <UserInfoCard :user="item" :handleOpenDetails="handleOpenDetails" />
      </div>
    </div>
  </div>
  <div class="footer"></div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import UserAPI from '../api/UserAPI'
import { useShowNowStore } from '../store/postShowNow/index'
import UserInfo from '@/model/UserInfo'
import { useLoading, useToast, useModal } from '@/uni_modules/fant-mini-plus'
import UserInfoCard from '@/components/UserInfoCard.vue'
import PageResult from '../model/PageResult'
import router from '@/router'

const loading = useLoading()
const toast = useToast()
const modal = useModal()

const pageNum = ref<number>(1)
const pageSize = ref<number>(10)
const fansList = ref<UserInfo[]>([])

onMounted(() => {
  UserAPI.getFansList(pageNum.value, pageSize.value, useShowNowStore().userId)
    .then((res) => {
      fansList.value = res.data!.data
    })
    .catch((err) => {
      toast.showToast({
        title: '加载失败！',
        icon: 'error'
      })
    })
})

const handleOpenDetails = (userId: string) => {
  console.log('打开用户详情', userId)

  useShowNowStore().setUserId(userId)
  router.push({ name: 'userDetails' })
}
</script>

<style lang="scss" scoped>
.userInfo {
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 16px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}
</style>
