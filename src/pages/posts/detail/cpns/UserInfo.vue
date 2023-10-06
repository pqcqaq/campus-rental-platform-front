<template>
  <hd-loading></hd-loading>
  <hd-toast></hd-toast>
  <hd-modal></hd-modal>
  <div
    class="userInfo"
    :style="{
      'background-image': 'url(' + user?.background + ')',
      'background-repeat': 'no-repeat',
      width: '100%',
      height: '100%',
      'background-size': 'cover',
      'background-position': 'center'
    }"
  >
    <view class="userInfo-user">
      <div class="blur">
        <image v-if="user?.avatar != ''" :src="user?.avatar" class="userInfo-user-avatar" />
        <image v-else src="@/static/guest.png" class="userInfo-user-avatar" />
        <view class="userInfo-user-nickname">
          <view class="nickname">{{ user?.nickName }}</view>
          <view class="info">{{ user?.school }}</view>
          <view class="phone">{{ user?.mobile }}</view>
        </view>
      </div>
      <div class="subscribe" @click="handleFollow">
        <text class="subNum">{{ user?.fansNum }}</text>
        <uni-icons class="subBtn" :color="user?.isFollow ? '#E76363' : '#DDDDDD'" type="heart-filled" size="60rpx" />
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
  },
  handleFollow: {
    type: Function,
    required: false,
    default: (userId: string) => {}
  }
})

const handleFollow = () => {
  props.handleFollow(props.user.id)
}
</script>
<style lang="scss" scoped>
.subscribe {
  // 上下对齐
  display: flex;
  align-items: center;
  justify-content: center;
  // 居中
  margin: auto;
  margin-right: 10rpx;
  // 圆角半透明阴影
  border-radius: 30rpx;
  box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
  // 背景模糊
  backdrop-filter: blur(10rpx);
  padding: 5rpx 5rpx 5rpx 15rpx;
  .subNum {
    font-size: 40rpx;
    font-weight: 550;
    color: #152a89a0;
    margin-bottom: 20rpx;
    margin: auto auto;
    margin-right: 10rpx;
  }
}
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
