<template>
  <div>
    <UserInfoCard :user="userDetails" :enable-fillet="false" :custom-style="{ height: '300rpx' }" />
  </div>
</template>

<script lang="ts" setup>
import UserInfoCard from '@/components/UserInfoCard.vue'
import { useShowNowStore } from '@/store/postShowNow'
import UserApi from '@/api/UserAPI'
import UserInfo from '@/model/UserInfo'
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
</script>

<style lang="stylus" scoped></style>
