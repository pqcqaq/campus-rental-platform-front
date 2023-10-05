<template>
  <hd-loading></hd-loading>
  <hd-toast></hd-toast>
  <view class="main">
    <!-- 添加九宫格 -->
    <view class="grid">
      <view v-for="(item, index) in imgs" :key="item.id" class="grid-item">
        <!-- 如果当前格子有图片，则显示图片 -->
        <hd-icon @click="handleDelImg(item)" class="del" name="ic_deletepic_fill" size="55rpx" color="#FA6A6A"></hd-icon>
        <image class="img" :src="item.url" @click="lookImg(index)" mode="aspectFill"></image>
      </view>
      <!-- 如果当前格子没有图片，则显示一个加号图标，点击后触发选择图片操作 -->
      <view v-if="imgs.length < 9" class="grid-item" @click="handleChooseImages">
        <image class="img" src="@/static/add.png"></image>
      </view>
    </view>
    <view class="info">
      <!-- 信息输入框 -->
      <Inputfield class="field" clearable placeholder="请输入标题" type="text" v-model="title" :maxlength="20">
        <template #title>
          <div><hd-icon name="ic_edit_line"></hd-icon></div>
        </template>
      </Inputfield>
      <!-- 详情 -->
      <div class="field detail">
        <textarea placeholder="介绍一下吧" v-model="detail" maxlength="500" ref="textareaRef" />
      </div>
    </view>
    <button class="publish" @click="handlePublish">发布</button>
  </view>
</template>

<script lang="ts" setup>
import ImgSelect from '@/model/ImgSelect'
import router from '@/router'
import { useToast } from '@/uni_modules/fant-mini-plus'
import Inputfield from '@/components/Inputfield.vue'
import PostApi from '@/api/PostApi'
import { useInfoRecords } from '@/store/UserInfoRecords'

onMounted(() => {
  if (useAuthStore().isVisitor) {
    toast.showToast({
      title: '请先登录',
      icon: 'error'
    })
    useAuthStore().logout()
  }
})

const baseURL = import.meta.env.VITE_BASEURL
const toast = useToast()
const { userInfo } = storeToRefs(useAuthStore())

const imgs = ref<ImgSelect[]>([])

const selectCount = computed(() => {
  return 9 - imgs.value.length
})

const handleChooseImages = () => {
  uni.chooseImage({
    count: selectCount.value,
    sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album', 'camera'], //从相册或者相机选择
    success: async (res) => {
      const tempFilePaths = res.tempFilePaths //拿到选择的图片，是一个数组
      for (let i = 0; i < tempFilePaths.length; i++) {
        uni.uploadFile({
          url: baseURL + '/attachment/img',
          filePath: tempFilePaths[i],
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
              imgs.value.push({
                id: result.data,
                url: tempFilePaths[i],
                show: true
              })
            } else {
              toast.showToast({
                title: result.msg,
                icon: 'error'
              })
            }
          },
          fail: (err) => {
            console.log(err)

            toast.showToast({
              title: '上传失败',
              icon: 'error'
            })
          }
        })
      }
    }
  })
}

const lookImg = (val) => {
  const urls = imgs.value.map((item) => item.url)
  const current = val
  uni.previewImage({
    urls,
    current
  })
}

const test = () => {
  console.log(imgs.value)
  console.log(selectCount.value)
}

const handleDelImg = (val) => {
  // 设置为不显示
  val.show = false
  const index = imgs.value.indexOf(val)
  imgs.value.splice(index, 1)
}

const title = ref<string>('')
const detail = ref<string>('')

const handlePublish = () => {
  PostApi.publishPost({
    title: title.value,
    intro: detail.value,
    imgs: imgs.value
  })
    .then((resp) => {
      toast.showToast({
        title: '发布成功',
        icon: 'success'
      })
      router.replaceAll({ name: 'home' })
    })
    .catch((error) => {
      toast.showToast({
        title: error.data.data,
        icon: 'error'
      })
    })
}
</script>

<style lang="scss" scoped>
.main {
  min-height: calc(100vh - var(--window-top) - var(--window-bottom));
  width: 100vw;
  box-sizing: border-box;
  background: #f4f9ff;
  padding: 0 24rpx 24rpx;
  .publish {
    width: 80%;
    height: 80rpx;
    background: #ffc600;
    border-radius: 10rpx;
    color: #fff;
    font-size: 36rpx;
    line-height: 100rpx;
    //内部文字上下居中
    display: flex;
    justify-content: center;
    align-items: center;
    // 放置在界面的最下面
    position: fixed;
    bottom: 150rpx;
    left: 10%;
  }
  // 按钮按下的变化
  .publish:active {
    transform: scale(0.98);
    // 颜色变暗
    background: #e6b800;
  }
  .grid {
    padding-top: 20rpx;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    // 添加圆角背景和阴影
    border-radius: 20rpx;
    box-shadow: 0rpx 10rpx 100rpx 1rpx rgba(0, 0, 0, 0.3);
    background-color: #f6faff;
    .grid-item {
      position: relative;
      width: 210rpx;
      height: 210rpx;
      margin-left: 15rpx;
      margin-right: 5px;
      margin-bottom: 10px;
      border-radius: 20rpx;
      background-color: #f5f5f5;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      .trans {
        background-color: #e6b800;
      }
      .img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 20rpx;
        box-shadow: 3rpx 3rpx 20rpx 0rpx rgba(0, 0, 0, 0.186);
      }
      .del {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 1;
      }
    }

    .grid-item:last-child {
      margin-right: 0;
    }
  }

  .info {
    margin-top: 20rpx;
    // 圆角背景
    border-radius: 20rpx;
    background-color: #f6faff;
    padding: 20rpx;
    .field {
      width: 100%;
      //圆角
      border-radius: 50rpx 50rpx 50rpx 50rpx;
      // 背景阴影
      box-shadow: 0rpx 3rpx 0rpx 0rpx rgba(0, 0, 0, 0.3);
      margin-top: 20rpx;
    }
    .detail {
      //高度跟随内部元素
      height: auto;
      display: flex;
      border-radius: 50rpx 50rpx 50rpx 50rpx;
      // 背景阴影
      box-shadow: 0rpx 3rpx 100rpx 0rpx rgba(0, 0, 0, 0.3);
      font-size: 32rpx;
      textarea {
        overflow-x: hidden;
        overflow-y: auto;
        padding: 35rpx;
        width: 100%;
        border: 5;
        font-size: 32rpx;
        color: #333;
      }
    }
  }
}
</style>
