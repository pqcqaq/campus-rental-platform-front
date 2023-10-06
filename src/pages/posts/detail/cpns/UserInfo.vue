<template>
  <div
    class="userInfo"
    :style="{
      'background-image': 'url(' + props.user.background + ')',
      'background-repeat': 'no-repeat',
      width: '100%',
      height: '100%',
      'background-size': 'cover',
      'background-position': 'center'
    }"
  >
    <view class="userInfo-user">
      <div class="blur">
        <image v-if="props.user.avatar != ''" :src="props.user.avatar" class="userInfo-user-avatar" />
        <image v-else src="@/static/guest.png" class="userInfo-user-avatar" />
        <view class="userInfo-user-nickname">
          <view class="nickname">{{ props.user.nickName }}</view>
          <view class="info">{{ props.user.school }}</view>
          <view class="phone">{{ props.user.mobile }}</view>
        </view>
      </div>
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
.blur {
  // 阴影
  box-shadow: 0 2rpx 10rpx 0 rgba(0, 0, 0, 0.3);
  // 背景模糊
  backdrop-filter: blur(10rpx);
  // 白色边框
  border: 1rpx solid #8d8d8d;
  // 圆角
  border-radius: 30rpx;
  display: flex;
  padding: 10rpx;
  padding-right: 30rpx;
}
// 按下后颜色变暗的效果
.blur:hover {
  background-color: rgb(225, 234, 253);
  border-radius: 30rpx;
  opacity: 0.8;
  // 背景模糊
  backdrop-filter: blur(10rpx);
}
.userInfo {
  padding: 16rpx;

  width: 100%;
  background: #f6f9fe;
  border-radius: 20rpx;
  box-sizing: border-box;

  &-user {
    display: flex;
    margin-bottom: 20rpx;
    margin-top: 20rpx;
    &-avatar {
      flex: 0 0 auto;
      border-radius: 50%;
      width: 128rpx;
      height: 128rpx;
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
        color: #595959;
        font-size: 28rpx;
      }
      .phone {
        color: #595959;
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
