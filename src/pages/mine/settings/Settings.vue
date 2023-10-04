<template>
  <hd-modal></hd-modal>
  <hd-toast></hd-toast>
  <div class="main">
    <div class="userInfo">
      <div class="avatar" v-if="userInfo?.avatar != ''" @click="handleChangeAvatar">
        <hd-image lazy-load width="230rpx" height="230rpx" mode="scaleToFill" :round="true" :src="userInfo?.avatar" />
      </div>
      <image v-else @click="handleChangeAvatar" src="@/static/guest.png" class="defaultAvatar" />
      <div class="info">
        <hd-icon class="ic_edit" name="ic_edit_line" size="50rpx" style="color: rgb(62, 195, 14)" @click="handleEdit"></hd-icon>
        <div class="nickName">{{ userInfo?.nickName }}</div>
        <div class="school">就读院校：{{ userInfo?.school }}</div>
        <div class="mobile">联系电话：{{ userInfo?.mobile }}</div>
      </div>
    </div>
    <div class="exit">
      <hd-cell title="退出当前账号" @click="doLogout" icon="ic_shutdown_line" is-link hasLine background="#C1C2F5" />
    </div>
  </div>
  <hd-popup :maskClick="false">
    <view>
      <div class="editor">
        <header class="title">
          <text>编辑个人信息</text>
          <hd-icon class="close" color="#111" size="55rpx" name="ic_close_line" @click="handleClose"></hd-icon>
        </header>
        <main class="input">
          <Inputfield class="field" clearable placeholder="请输入用户名" type="text" v-model="inputNickname" :maxlength="30">
            <template #title>
              <div><hd-icon name="ic_me_line1"></hd-icon></div>
            </template>
          </Inputfield>
          <Inputfield class="field" clearable placeholder="请输入就读院校" type="text" v-model="inputSchool" :maxlength="30">
            <template #title>
              <div><hd-icon name="ic_edit_line"></hd-icon></div>
            </template>
          </Inputfield>
          <Inputfield class="field" clearable placeholder="请输入手机号" type="text" v-model="inputMobile" :maxlength="11">
            <template #title>
              <div><hd-icon name="ic_phone_line"></hd-icon></div>
            </template>
          </Inputfield>
        </main>
        <footer class="footer">
          <hd-button class="btn" type="primary" size="normal" @click="handleSubmit">保存</hd-button>
        </footer>
      </div>
    </view>
  </hd-popup>
</template>

<script lang="ts" setup>
import { useModal, usePopup, useToast } from '@/uni_modules/fant-mini-plus'
import { ref } from 'vue'
import Inputfield from '@/components/Inputfield.vue'
import UserAPI from '@/api/UserAPI'
import router from '@/router'
const baseURL = import.meta.env.VITE_BASEURL
const popup = usePopup()
const modal = useModal()
const toast = useToast()
// 解构pinia的store
const { userInfo } = storeToRefs(useAuthStore())
const handleEdit = () => {
  // 将文本切换为输入框，失去焦点时保存
  inputNickname.value = userInfo.value?.nickName || ''
  inputSchool.value = userInfo.value?.school || ''
  inputMobile.value = userInfo.value?.mobile || ''
  popup.showPopup()
}
const inputNickname = ref('')
const inputSchool = ref('')
const inputMobile = ref('')
const handleClose = () => {
  popup.closePopup()
}
const handleSubmit = () => {
  if (inputNickname.value == '') {
    toast.showToast('请输入昵称')
    return
  }
  // 保存昵称
  UserAPI.alter({
    nickName: inputNickname.value,
    school: inputSchool.value,
    mobile: inputMobile.value
  })
    .then((resp: any) => {
      toast.showToast({
        title: '保存成功',
        icon: 'success'
      })
      userInfo.value = resp.data
    })
    .catch((error) => {
      toast.showToast({
        title: error.msg,
        icon: 'error'
      })
    })
  // 关闭弹窗
  popup.closePopup()
}
const handleChangeAvatar = () => {
  modal.showModal({
    title: '提示',
    content: '是否更换头像',
    showCancel: true,
    cancelText: '取消',
    confirmText: '确定',
    success: (res) => {
      if (res.confirm) {
        // 确定，打开图片
        uni.chooseImage({
          count: 1, //上传图片的数量，默认是9
          sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
          sourceType: ['album'], //从相册选择
          success: async (res) => {
            const tempFilePaths = res.tempFilePaths //拿到选择的图片，是一个数组
            uni.uploadFile({
              url: baseURL + '/common/avatar',
              filePath: tempFilePaths[0],
              name: 'avatar',
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
                  const avatarId = result.data
                  useAuthStore().setAvatar(avatarId)
                } else {
                  toast.showToast({
                    title: result.msg,
                    icon: 'error'
                  })
                }
              },
              fail: () => {}
            })
          }
        })
      } else if (res.cancel) {
        // 取消
      }
    }
  })
}

/**
 * 登出
 */
function doLogout() {
  modal.showModal({
    title: '提示',
    content: '确认退出当前登录账号吗？',
    success: (action) => {
      if (action.confirm) {
        // 点击的确认按钮
        useAuthStore().logout()
        router.replaceAll({ name: 'login' })
      }
    }
  })
}
</script>

<style lang="scss">
.main {
  min-height: calc(100vh - var(--window-top) - var(--window-bottom));
  width: 100vw;
  box-sizing: border-box;
  background: #e7f0ff;
  // 头像居中
  .userInfo {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 60px;
    .info {
      //淡蓝色圆角背景，带阴影
      position: relative;
      width: 620rpx;
      height: 300rpx;
      background: #f8fcff;
      border-radius: 50rpx 50rpx 50rpx 50rpx;
      padding: 20rpx 20rpx 20rpx 20rpx;
      // 背景阴影
      box-shadow: 0rpx 50rpx 100rpx 1rpx rgba(0, 0, 0, 0.3);
      margin-top: 50rpx;

      // 编辑按钮
      .ic_edit {
        margin-left: 5rpx;
        color: rgb(62, 195, 14);
        // 靠右上角
        position: absolute;
        top: 20rpx;
        right: 20rpx;
      }
      // 昵称
      .nickName {
        font-size: 50rpx;
        color: #828282;
        margin-top: 25rpx;
        margin-bottom: 20rpx;
        text-align: center;
      }
      // 学校
      .school {
        font-size: 30rpx;
        color: #6f6f6f;
        margin-top: 10rpx;
        text-align: center;
      }
      // 手机号
      .mobile {
        font-size: 28rpx;
        color: #818181;
        margin-top: 10rpx;
        text-align: center;
      }
    }
  }
}

.avatar_edit {
  position: relative;
  top: 0;
  right: 0;
  color: rgb(62, 195, 14);
  font-size: 50rpx;
}

// 编辑图标
.ic_edit {
  margin-left: 5rpx;
  color: rgb(62, 195, 14);
}
// 白色圆角背景
.editor {
  position: relative;
  width: 620rpx;
  height: 600rpx;
  background: #ecf7ff;
  border-radius: 50rpx 50rpx 50rpx 50rpx;
  padding: 20rpx 20rpx 20rpx 20rpx;
  // 背景阴影
  box-shadow: 0rpx 0rpx 5rpx 0rpx rgba(0, 0, 0, 0.3);

  .close {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    // 移到右上角
    position: absolute;
    top: 30rpx;
    right: 30rpx;

    font-size: 32rpx;
    color: #333;
    height: 40rpx;
  }
  .title {
    margin-top: 10rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 32rpx;
    color: #333;
    height: 40rpx;
  }
  .input {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 32rpx;
    color: #333;
    height: 180rpx;
    padding-top: 20rpx;
    .field {
      width: 620rpx;
      //圆角
      border-radius: 50rpx 50rpx 50rpx 50rpx;
      // 背景阴影
      box-shadow: 0rpx 3rpx 0rpx 0rpx rgba(0, 0, 0, 0.3);
      margin-top: 20rpx;
    }
  }
  .footer {
    margin-top: 280rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 32rpx;
    color: #333;
    height: 60rpx;
    .btn {
      // 背景阴影
      box-shadow: 2rpx 2rpx 15rpx 0rpx rgba(0, 0, 0, 0.3);
    }
  }
}

.exit {
  // 显示在界面的最下面
  position: absolute;
  box-sizing: border-box;
  border-radius: 16rpx;
  padding: 12rpx 12rpx;
  height: 100rpx;
  bottom: 200rpx;
  // 白底
  background: #ffffff;
  // 阴影
  box-shadow: 0rpx 5rpx 5rpx 0rpx rgba(0, 0, 0, 0.3);
  // 上下居中
  display: flex;
  justify-content: center;
  align-items: center;
  left: 25rpx;
}

.avatar {
  /* 其他样式 */
  border-radius: 50%;
  border: 5px solid #759eff;
  transition: transform 0.3s ease-in-out;
  // 阴影
  box-shadow: 0rpx 0rpx 100rpx 10rpx rgba(0, 0, 0, 0.3);
}

.avatar:hover {
  transform: scale(1.1);
}

.defaultAvatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 230rpx;
  height: 230rpx;
  border-radius: 50%;
  transition: transform 0.3s ease-in-out;
  // 阴影
  box-shadow: 0rpx 0rpx 100rpx 10rpx rgba(0, 0, 0, 0.3);
}

.defaultAvatar:hover {
  transform: scale(1.1);
}
</style>
