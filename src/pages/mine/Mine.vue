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
        <image :src="userInfo?.avatar" class="header-user-avatar"></image>
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
        <view class="header-target-item" v-for="(item, key) of target" :key="key" @click="handlePageShow(item)">
          <text class="label">{{ item.value }}</text>
          <text class="value">{{ key }}</text>
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
import myRecord from '@/model/myRecord'
import { useModal, useToast } from '@/uni_modules/fant-mini-plus'
const modal = useModal()
const toast = useToast()

const { userInfo } = storeToRefs(useAuthStore()) // 解构pinia的store
const router = useRouter()
const target = ref<Record<string, myRecord>>({
  我的租赁: {
    value: 0,
    routerName: 'lease'
  },
  我的出租: {
    value: 0,
    routerName: 'hire'
  },
  我的收藏: {
    value: 0,
    routerName: 'collect'
  },
  我的发布: {
    value: 0,
    routerName: 'publish'
  }
})

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
  }
}
</style>
