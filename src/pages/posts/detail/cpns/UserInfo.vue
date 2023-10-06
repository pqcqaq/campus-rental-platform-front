<template>
  <div class="userInfo">
    <image :src="props.user.background" mode="aspectFill" class="background" />
    <view class="userInfo-user">
      <image v-if="props.user.avatar != ''" :src="props.user.avatar" class="userInfo-user-avatar"></image>
      <image v-else src="@/static/guest.png" class="userInfo-user-avatar" />
      <view class="userInfo-user-nickname">
        <view class="nickname">{{ props.user.nickName }}</view>
        <view class="info">{{ props.user.school }}</view>
        <view class="phone">{{ props.user.mobile }}</view>
      </view>
    </view>
  </div>
</template>

<script setup lang="ts">
import UserInfo from '@/model/UserInfo'

const props = defineProps({
  user: {
    type: UserInfo,
    required: false,
    default: () => new UserInfo()
  }
})
</script>
<style lang="scss" scoped>
// 按下后颜色变暗的效果
.userInfo-user:hover {
  background-color: rgb(220, 236, 255);
  border-radius: 16rpx;
}
.userInfo {
  padding: 10rpx;
  position: relative;
  width: 100%;
  height: 100%;

  .background {
    // 作为整个view的背景
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    opacity: 0.4;
    // 模糊
    filter: blur(10);
    // 穿透
    pointer-events: none;
    border-radius: 16rpx;
  }
  width: 100%;
  background: #f6f9fe;
  border-radius: 16rpx;
  margin-top: 20rpx;
  box-sizing: border-box;
  // 阴影
  box-shadow: 0 2rpx 10rpx 0 rgba(0, 0, 0, 0.3);

  &-user {
    display: flex;
    margin-bottom: 20rpx;
    margin-top: 20rpx;
    &-avatar {
      flex: 0 0 auto;
      border-radius: 50%;
      width: 128rpx;
      height: 128rpx;
      overflow: hidden;
    }
    &-nickname {
      flex: 1 1 auto;
      margin-left: 32rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .nickname {
        color: #292c39;
        font-weight: 550;
        font-size: 40rpx;
        margin-bottom: 2rpx;
      }
      .info {
        color: #c6c9cf;
        font-size: 28rpx;
      }
      .phone {
        color: #c6c9cf;
        font-size: 20rpx;
      }
    }
    &-more {
      flex: 0 0 auto;
      width: 48rpx;
    }
  }
}
</style>
