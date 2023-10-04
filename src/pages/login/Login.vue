<!--
 * @Author: weisheng
 * @Date: 2021-12-22 15:19:08
 * @LastEditTime: 2023-05-22 16:12:41
 * @LastEditors: weisheng
 * @Description: 
 * @FilePath: \uniapp-vue3-fant-ts\src\pages\login\Login.vue
 * 记得注释
-->
<template>
  <hd-loading></hd-loading>
  <hd-toast></hd-toast>
  <view class="login">
    <view class="login-main" style="text-align: center">
      <text class="login-main-title">欢迎登陆 校园租赁平台</text>
      <view class="login-main-subtitle">让闲置的物品 活起来！</view>
      <view class="login-main-body">
        <login-input key="username" v-model="username" clearable placeholder="用户名" :maxlength="20"></login-input>
        <view class="login-password">
          <login-input key="password" v-model="password" password clearable placeholder="密码" :maxlength="20"></login-input>
        </view>
        <hd-button size="large" type="primary" :disabled="disabled" @click="doLogin">登录</hd-button>
      </view>
    </view>
    <view class="login-footer">
      <hd-button class="jump" plain type="primary" size="small" @click="jump">我是游客</hd-button>
      <text>developed by qcqcqc</text>
    </view>
  </view>
</template>

<script lang="ts" setup>
import LoginInput from './cmp/LoginInput.vue'
import { useLoading, useToast } from '@/uni_modules/fant-mini-plus'
import UserAPI from '@/api/UserAPI'

const username = ref<string>('') // 用户名
const password = ref<string>('') // 密码
const loading = useLoading()
const toast = useToast()
const { userInfo, isVisitor } = storeToRefs(useAuthStore()) // 解构pinia的store
const router = useRouter() // 路由

// 登录按钮是否禁用
const disabled = computed(() => {
  return !username.value || !password.value
})

// 登录接口
function doLogin() {
  loading.showLoading({})
  UserAPI.login(username.value, password.value)
    .then((resp: any) => {
      loading.hideLoading()
      toast.showToast({
        title: '登录成功',
        icon: 'success'
      })
      userInfo.value = resp.data
      isVisitor.value = false
      router.replaceAll({ name: 'home' })
    })
    .catch((error) => {
      loading.hideLoading()
      toast.showToast({
        title: error.msg,
        icon: 'error'
      })
    })
}

const jump = () => {
  userInfo.value = {
    linkMan: '游客',
    username: '游客',
    mobile: '12345678910',
    nickName: '游客',
    avatar: '',
    school: '某知名大学',
    token: 'null'
  }
  isVisitor.value = true
  router.replaceAll({ name: 'home' })
}
</script>

<style lang="scss" scoped>
.login {
  font-family: PingFangSC-Regular, PingFang SC;
  background-color: $color-white;
  height: calc(100vh - var(--window-top));
  width: 100vw;
  box-sizing: border-box;
  &-main {
    padding: 112rpx 75rpx 0 75rpx;
    position: relative;
    &-title {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 64rpx;
      font-size: 48rpx;
      font-weight: 600;
      color: $color-text-secondary;
      line-height: 64rpx;
      letter-spacing: 8rpx;
    }
    &-subtitle {
      font-size: 28rpx;
      color: $color-text-thirdly;
      line-height: 40rpx;
      letter-spacing: 12rpx;
      text-align: center;
      margin: 8rpx 0 104rpx;
    }
    &-body {
      position: relative;
      box-sizing: border-box;
      width: 600rpx;
      height: 548rpx;
      .login-password {
        position: relative;
        padding: 40rpx 0 104rpx;
      }
    }
  }
  &-footer {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 300rpx;
    text-align: center;
    line-height: 28rpx;
    font-size: 20rpx;
    font-weight: 500;
  }
}
.jump {
  margin-top: 50rpx;
  margin-bottom: 50rpx;
  height: 40rpx;
}
</style>
