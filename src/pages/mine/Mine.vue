<!--
 * @Author: weisheng
 * @Date: 2021-12-22 15:19:08
 * @LastEditTime: 2023-05-09 20:54:39
 * @LastEditors: weisheng
 * @Description: 
 * @FilePath: \uniapp-vue3-fant-ts\src\pages\mine\Mine.vue
 * 记得注释
-->
<template>
  <hd-modal></hd-modal>
  <hd-toast></hd-toast>

  <view class="mine">
    <view class="tools">
      <hd-icon name="ic_scan_line" size="48rpx" color="#292C39" @click="doScan"></hd-icon>
      <hd-icon name="ic_setup_fill" size="48rpx" color="#292C39" @click="setup"></hd-icon>
    </view>
    <view class="header">
      <view class="header-user">
        <image v-if="userInfo?.avatar != ''" :src="userInfo?.avatar" class="header-user-avatar"></image>
        <image v-else src="@/static/guest.png" class="header-user-avatar" />
        <view class="header-user-nickname">
          <view class="nickname">{{ userInfo?.nickName }}</view>
          <view class="info">{{ userInfo?.school }}</view>
          <view class="phone">{{ userInfo?.mobile }}</view>
        </view>
        <view class="header-user-more">
          <hd-icon name="ic_sort_fill" size="48rpx" color="#BEC0C7"></hd-icon>
        </view>
      </view>
      <view class="header-target">
        <view class="header-target-item" v-for="item of infoRecords" :key="item.name" @click="handlePageShow(item)">
          <text class="label">{{ item.value }}</text>
          <text class="value">{{ item.name }}</text>
        </view>
      </view>
    </view>
    <view class="main">
      <hd-cell title="关于我们" value="" align="right" is-link hasLine icon="ic_toastwarn_fill" />
      <hd-cell title="了解更多" align="right" value="" is-link hasLine icon="ic_address_fill" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useModal, useToast } from '@/uni_modules/fant-mini-plus'
import UserApi from '@/api/UserAPI'
import { useInfoRecords } from '@/store/UserInfoRecords'
const modal = useModal()
const toast = useToast()

const { userInfo } = storeToRefs(useAuthStore()) // 解构pinia的store
const { infoRecords } = storeToRefs(useInfoRecords()) // 解构

const router = useRouter()

const handlePageShow = (item) => {
  router.push({ name: item.routerName })
}

/**
 * 扫码
 */
function doScan() {
  uni.scanCode({
    success: (res) => {
      // 扫码内容
      const code: string = res.result || ''

      toast.showToast(`扫码内容：${code}`)
    }
  })
}

const setup = () => {
  router.push({ name: 'settings' })
}

onMounted(() => {
  if (useAuthStore().isVisitor) {
    userInfo.value = null
    router.replaceAll({ name: 'login' })
  } else {
    UserApi.refreshToken()
      .then((resp: any) => {
        userInfo.value = resp.data
        // 获取我的信息
        UserApi.getMyInfo().then((resp) => {
          infoRecords.value = resp.data || []
        })
      })
      .catch((error) => {
        toast.showToast({
          title: error.msg,
          icon: 'error'
        })
      })
  }
})
</script>

<style lang="scss" scoped>
.mine {
  min-height: calc(100vh - var(--window-top) - var(--window-bottom));
  width: 100vw;
  box-sizing: border-box;
  background: #e7f0ff;
  padding: 0 24rpx 24rpx;
  .tools {
    display: flex;
    justify-content: space-between;
    margin-bottom: 32rpx;
    box-sizing: border-box;
    padding: 0 12rpx;
  }
  .header {
    width: 100%;
    background: #f6f9fe;
    border-radius: 16rpx;
    padding: 32rpx;
    box-sizing: border-box;
    margin-bottom: 24rpx;
    // 阴影效果
    box-shadow: 0 2rpx 10rpx 0 rgba(0, 0, 0, 0.3);
    &-user {
      display: flex;
      margin-bottom: 56rpx;
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

    &-target {
      display: flex;
      &-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 25%;
        .label {
          color: #292c39;
          font-size: 32rpx;
          font-weight: 550;
          margin-bottom: 24rpx;
        }
        .value {
          color: #3c3f49;
          font-size: 28rpx;
        }
      }
    }
  }
  .main {
    width: 100%;
    background: #ffffff;
    border-radius: 16rpx;
    padding: 12rpx 12rpx;
    box-sizing: border-box;
    // 阴影效果
    box-shadow: 0 2rpx 10rpx 0 rgba(0, 0, 0, 0.3);
  }
}

.header-target-item {
  /* 其他样式 */
  position: relative;
  overflow: hidden;
}

.header-target-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(171, 198, 255, 0.426);
  opacity: 0;
  transition: opacity 0.1s ease-in-out;
}

.header-target-item:hover::before {
  opacity: 1;
}
.tools-setting {
  /* 其他样式 */
  position: relative;
}

.tools-setting::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
  background-color: #333;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}

.tools-setting:hover::before {
  opacity: 1;
}
</style>
