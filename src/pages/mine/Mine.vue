<template>
  <hd-modal></hd-modal>
  <hd-toast></hd-toast>

  <view class="mine">
    <view class="tools">
      <hd-icon name="ic_scan_line" size="48rpx" color="#292C39" @click="doScan"></hd-icon>
      <hd-icon name="ic_setup_fill" size="48rpx" color="#292C39" @click="setup"></hd-icon>
    </view>
    <view
      class="header"
      :style="{
        'background-image': 'url(' + userInfo?.background + ')',
        'background-repeat': 'no-repeat',
        width: '100%',
        height: '100%',
        'background-size': 'cover',
        'background-position': 'center'
      }"
    >
      <!-- <image :src="userInfo?.background" mode="aspectFill" class="background" /> -->
      <view class="header-user" @click="handleOpenDetials">
        <image v-if="userInfo?.avatar != ''" :src="userInfo?.avatar" class="header-user-avatar" />
        <image v-else src="@/static/guest.png" class="header-user-avatar" />
        <view class="header-user-nickname">
          <view class="nickname">{{ userInfo?.nickName }}</view>
          <view class="info">{{ userInfo?.school }}</view>
          <view class="phone">{{ userInfo?.mobile }}</view>
        </view>
        <view class="header-user-more" @click="handleChangeBackground">
          <hd-icon name="ic_sort_fill" size="48rpx" color="#8d8d8d"></hd-icon>
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
import { useShowNowStore } from '../../store/postShowNow/index'
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
      })
      .catch((error) => {
        toast.showToast({
          title: error.msg,
          icon: 'error'
        })
      })
  }
})

onShow(() => {
  // 获取我的信息
  UserApi.getMyInfo().then((resp) => {
    infoRecords.value = resp.data || []
  })
})

const baseURL = import.meta.env.VITE_BASEURL
const handleChangeBackground = () => {
  // 更换背景提示
  modal.showModal({
    title: '提示',
    content: '是否更换背景',
    showCancel: true,
    cancelText: '取消',
    confirmText: '确定',
    success: (res) => {
      if (res.confirm) {
        // 确定，打开图片
        doChangeBackground()
      }
    }
  })
}
const doChangeBackground = () => {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], //从相册或者相机选择
    success: async (res) => {
      uni.uploadFile({
        url: baseURL + '/attachment/img',
        filePath: res.tempFilePaths[0],
        name: 'img',
        header: {
          token: userInfo.value?.token || 'null'
        },
        success: (res) => {
          const result = JSON.parse(res.data)
          if (result.code == 200) {
            toast.showToast({
              title: '上传成功',
              icon: 'success'
            })
            UserApi.saveAlterBackground(result.data)
              .then((_resp) => {
                useAuthStore().setBackground(result.data || '')
              })
              .catch((error) => {
                toast.showToast({
                  title: error.msg,
                  icon: 'error'
                })
              })
          } else {
            toast.showToast({
              title: result.msg,
              icon: 'error'
            })
          }
        },
        fail: (err) => {
          toast.showToast({
            title: '上传失败',
            icon: 'error'
          })
        }
      })
    }
  })
}

const handleOpenDetials = () => {
  useShowNowStore().setUserId(userInfo.value!.id!)
  router.push({ name: 'userDetails' })
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
    position: relative;
    // 模糊效果
    backdrop-filter: blur(10rpx);

    // .background {
    //   // 作为整个view的背景
    //   position: absolute;
    //   top: 0;
    //   left: 0;
    //   width: 100%;
    //   height: 100%;
    //   z-index: 1;
    //   opacity: 0.4;
    //   // 模糊
    //   filter: blur(10);
    //   // 穿透
    //   pointer-events: none;
    //   border-radius: 16rpx;
    // }
    width: 100%;
    // background: #f6f9fe;
    border-radius: 16rpx;
    padding: 32rpx;
    box-sizing: border-box;
    margin-bottom: 24rpx;
    // 阴影效果
    box-shadow: 0 2rpx 10rpx 0 rgba(0, 0, 0, 0.3);
    &-user {
      display: flex;
      margin-bottom: 56rpx;
      // 背景模糊
      backdrop-filter: blur(10rpx);
      border-radius: 30rpx;
      padding: 10rpx;
      // 白色边框
      border: 1rpx solid #8d8d8d;
      // 阴影
      box-shadow: 0 2rpx 10rpx 0 rgba(0, 0, 0, 0.3);

      &-avatar {
        flex: 0 0 auto;
        border-radius: 50%;
        width: 128rpx;
        height: 128rpx;
        // overflow: hidden;
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
          color: #575757;
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
          color: #3a3a3a;
          mix-blend-mode: difference;
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
  // overflow: hidden;
  // 背景模糊
  backdrop-filter: blur(10rpx);
  // 白色边框
  border: 1rpx solid #8d8d8d;
  // 阴影
  box-shadow: 0 2rpx 10rpx 0 rgba(0, 0, 0, 0.3);
  border-radius: 30rpx;
  margin-left: 10rpx;
  margin-right: 10rpx;
  padding: 10rpx;
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
