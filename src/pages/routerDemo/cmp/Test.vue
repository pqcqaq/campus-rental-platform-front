<template>
  <view class="test">
    <view class="title">当前路由信息</view>
    <text>{{ JSON.stringify(route) }}</text>
  </view>
</template>

<script lang="ts" setup>
import Text from 'XrFrame/components/Text'

const route = useRoute()
</script>

<style lang="scss" scoped>
.test {
  padding: 24rpx 0;
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  margin-bottom: 32rpx;
  .title {
    display: flex;
    justify-content: center;
    font-size: 48rpx;
    font-weight: 600;
    margin-bottom: 64rpx;
  }
  text {
    width: 100%;
    word-break: break-all;
  }
}
</style>
