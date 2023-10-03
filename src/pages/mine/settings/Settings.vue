<template>
  <hd-modal></hd-modal>
  <hd-toast></hd-toast>
  <div class="main">
    <div class="userInfo">
      <div class="avatar" @click="handleChangeAvatar">
        <hd-image lazy-load width="100" height="100" mode="scaleToFill" :round="true" :src="userInfo?.avatar" />
      </div>
      <div class="nickName">
        <text>{{ userInfo?.nickName }}</text>
        <hd-icon class="ic_edit" name="ic_edit_line" style="color: rgb(62, 195, 14)" @click="handleEditNickName"></hd-icon>
      </div>
    </div>
  </div>
  <hd-popup :maskClick="false">
    <view>
      <div class="editor">
        <header class="title">
          <text>{{ title }}</text>
          <hd-icon class="close" name="ic_close_line" @click="handleClose"></hd-icon>
        </header>
        <main class="input">
          <Inputfield class="field" clearable :placeholder="msg" type="text" v-model="inputValue" :maxlength="30">
            <template #title>
              <div><hd-icon name="ic_edit_line"></hd-icon></div>
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
const baseURL = import.meta.env.VITE_BASEURL
const popup = usePopup()
const modal = useModal()
const toast = useToast()
// 解构pinia的store
const { userInfo } = storeToRefs(useAuthStore())
const handleEditNickName = () => {
  // 将文本切换为输入框，失去焦点时保存
  inputValue.value = userInfo.value?.nickName || ''
  popup.showPopup()
}
const title = ref('编辑昵称')
const msg = ref('请输入昵称')
const inputValue = ref('')
const handleClose = () => {
  popup.closePopup()
}
const handleSubmit = () => {
  if (inputValue.value == '') {
    toast.showToast('请输入昵称')
    return
  }
  // 保存昵称
  UserAPI.alter({
    nickName: inputValue.value,
    linkMan: userInfo.value?.linkMan || null,
    username: userInfo.value?.username || null,
    mobile: userInfo.value?.mobile || null,
    avatar: userInfo.value?.avatar || null,
    school: userInfo.value?.school || null,
    token: userInfo.value?.token || null
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
              formData: {
                token: userInfo.value?.token || null
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
</script>

<style lang="scss">
.main {
  min-height: calc(100vh - var(--window-top) - var(--window-bottom));
  width: 100vw;
  box-sizing: border-box;
  background: #e7f0ff;
}
// 头像居中
.userInfo {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 60px;
}
// 昵称
.nickName {
  font-size: 32rpx;
  color: #333;
  margin-top: 25rpx;
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
  height: 300rpx;
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
      box-shadow: 2rpx 2rpx 5rpx 0rpx rgba(0, 0, 0, 0.3);
    }
  }
  .footer {
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
</style>
