<template>
  <div :style="postStyle" class="postCard" ref="postCard" @touchstart="touchS" @touchmove="touchM" @touchend="touchE">
    <div class="img" @click="handleClickPost">
      <image class="img" ref="img" :src="firstImageUrl" mode="aspectFill" lazy-load :lazy-load-margin="1" @error="imageError($event)" />
    </div>
    <div class="info">
      <div class="title">
        {{ post.title }}
      </div>
      <!-- 数量信息 -->
      <div class="nums">
        <!-- 收藏数目 -->
        <div class="collect">
          <image src="@/static/star-fill.png" lazy-load :lazy-load-margin="1"></image>
          <text class="numText">{{ collectNum }}</text>
        </div>
        <!-- 点赞数目 -->
        <div class="like">
          <image src="@/static/like.png" lazy-load :lazy-load-margin="1"></image>
          <text class="numText">{{ likeNum }}</text>
        </div>
      </div>
    </div>
    <div class="postActions" ref="postActions">
      <div class="action" v-if="props.showAction">
        <button class="likeButton" @click="handleCollect">
          <hd-icon class="likeBtn" name="ic_collection_fill" :color="btnIconColor" size="50rpx"></hd-icon>
        </button>
      </div>
      <div class="exAction">
        <!-- 编辑按钮 -->
        <button v-if="props.post.editable || isAdmin" class="editButton" @click="handleEdit">
          <hd-icon class="editBtn" name="ic_edit_line" color="#863B3B" size="50rpx"></hd-icon>
        </button>
        <!-- 删除按钮 -->
        <button v-if="props.post.editable && props.showDel" class="delButton" @click="props.handleDel(props.post.id, props.post.author)">
          <hd-icon class="delBtn" name="ic_close_line" color="#000" size="50rpx"></hd-icon>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import PostApi from '@/api/PostApi'
import Post from '@/model/Post'
import router from '@/router'
import { transIdToUrl } from '@/utils/ImageUtils'
import { ref } from 'vue'
import UserInfo from '@/model/UserInfo'

onMounted(async () => {
  const imgList = props.post.imgs || []
  if (imgList.length > 0) {
    const url = await transIdToUrl(imgList[0].id)
    firstImageUrl.value = url
  } else {
    firstImageUrl.value = 'https://t.mwm.moe/ai/'
  }
  // 设置按钮颜色
  btnIconColor.value = props.post.isCollect ? '#F7CA59' : '#fff'
})

const imageError = (e: Event) => {
  // 图片加载失败
  firstImageUrl.value = 'https://t.mwm.moe/ai/'
}

const props = defineProps({
  height: {
    type: String,
    default: '380rpx'
  },
  width: {
    type: String,
    default: '700rpx'
  },
  post: {
    type: Post,
    required: true
  },
  showAction: {
    type: Boolean,
    default: true
  },
  handleAction: {
    type: Function,
    default: (postId: string, action: boolean) => {}
  },
  showDel: {
    type: Boolean,
    default: false
  },
  handleDel: {
    type: Function,
    default: (postId: string, author: UserInfo) => {}
  }
})

const postStyle = ref({
  transform: 'scale(1)',
  height: props.height,
  width: props.width
})

const firstImageUrl = ref('')

const btnIconColor = ref('#fff')

let startX = 0
let moveX = 0

const touchS = (e: TouchEvent) => {
  startX = e.touches[0].clientX
}

const touchM = (e: TouchEvent) => {
  moveX = e.touches[0].clientX - startX
}

const touchE = (e: TouchEvent) => {
  const offset = Math.abs(moveX)
  if (moveX < 0 && offset > 100) {
    // 触发滑动事件,左移30%
    postStyle.value.transform = 'translate(-30%, 0)'
  }
  if (moveX > 0 && offset > 100) {
    // 恢复原状
    postStyle.value.transform = 'translate(0, 0)'
  }
}

const handleClickPost = (e: MouseEvent) => {
  // 处理点击事件
  router.push({ name: 'detail', params: { id: props.post.id || '' } })
}

// 收藏数量
const collectNum = ref<number>(props.post.collectNum || 0)
// 点赞数量
const likeNum = ref<number>(props.post.likeNum || 0)

const handleCollect = (e: MouseEvent) => {
  // 处理收藏事件
  PostApi.collectPost(props.post.id || '')
    .then((resp) => {
      if (resp.data) {
        // 点赞成功
        btnIconColor.value = '#F7CA59'
        // 更新点赞数目
        collectNum.value++
      } else {
        // 取消点赞
        btnIconColor.value = '#fff'
        // 更新点赞数目
        collectNum.value--
      }
      props.handleAction(props.post.id, resp.data)
    })
    .catch((error) => {
      console.log(error)
    })
  // 恢复原状
  postStyle.value.transform = 'translate(0, 0)'
}

const handleEdit = (e: MouseEvent) => {
  // 处理编辑事件
  router.push({ name: 'edit', params: { id: props.post.id || '' } })
  // 恢复原状
  postStyle.value.transform = 'translate(0, 0)'
}

const isAdmin = useAuthStore().isAdmin()
</script>

<style lang="scss" scoped>
.postCard {
  background-color: #fff;
  border-radius: 20rpx;
  box-shadow: 3rpx 3rpx 20rpx 0rpx rgba(0, 0, 0, 0.186);
  position: relative;
  // 动画效果
  transition: transform 0.3s ease-in-out;

  .info {
    .title {
      // 文字显示在图片的右下角
      position: absolute;
      bottom: 15rpx;
      right: 15rpx;
      padding: 15rpx;
      // 文字背景
      background: rgba(218, 218, 218, 0.5);
      border-radius: 20rpx 20rpx 20rpx 20rpx;
      // 标题颜色
      color: #000000ae;
      // 阴影
      box-shadow: 3rpx 3rpx 20rpx 0rpx rgba(0, 0, 0, 0.186);
      // 阴影模糊效果
      backdrop-filter: blur(10rpx);
    }
    .nums {
      position: absolute;
      left: 15rpx;
      bottom: 15rpx;
      display: flex;
      // 阴影模糊效果
      backdrop-filter: blur(10rpx);
      // 阴影
      box-shadow: 3rpx 3rpx 20rpx 0rpx rgba(0, 0, 0, 0.186);
      padding: 5rpx;
      // 文字背景
      background: rgba(218, 218, 218, 0.5);
      border-radius: 20rpx 20rpx 20rpx 20rpx;
      // 标题颜色
      color: #000000ae;
      image {
        width: 25rpx;
        height: 25rpx;
        margin-right: 10rpx;
      }
      .collect {
        margin-left: 10rpx;
        margin-right: 10rpx;
      }
      .like {
        margin-right: 10rpx;
      }

      .numText {
        margin-right: 10rpx;
        font-size: 25rpx;
        color: #000000ae;
      }
    }
  }
  .img {
    width: 100%;
    height: 100%;
    border-radius: 20rpx;
    object-fit: cover;
    transition: transform 0.3s ease-in-out;
  }
  .postActions {
    position: absolute;
    top: 0;
    right: -100px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    transition: right 0.3s ease-in-out;
  }
  .likeButton {
    width: 120rpx;
    height: 120rpx;
    margin-top: 10rpx;
    background-color: #b5daff;
    color: #fff;
    border: none;
    border-radius: 50%;
    margin-bottom: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;
    // 阴影
    box-shadow: 3rpx 3rpx 20rpx 0rpx rgba(0, 0, 0, 0.186);
    .likeBtn {
      transition: transform 0.3s ease-in-out;
    }
  }
  .likeButton:hover {
    background-color: #4c8fcb;
  }
  .exAction {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .editButton {
    width: 120rpx;
    height: 120rpx;
    margin-top: 10rpx;
    background-color: #ffd5d0;
    color: #fff;
    border: none;
    border-radius: 50%;
    margin-bottom: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;
    // 阴影
    box-shadow: 3rpx 3rpx 20rpx 0rpx rgba(0, 0, 0, 0.186);
    .editBtn {
      transition: transform 0.3s ease-in-out;
    }
  }
  .editButton:hover {
    background-color: #ff967e;
  }
  .delButton {
    width: 120rpx;
    height: 120rpx;
    margin-top: 10rpx;
    background-color: #ff7869;
    color: #fff;
    border: none;
    border-radius: 50%;
    margin-bottom: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;
    // 阴影
    box-shadow: 3rpx 3rpx 20rpx 0rpx rgba(0, 0, 0, 0.186);
    .delBtn {
      transition: transform 0.3s ease-in-out;
    }
  }
  .delButton:hover {
    background-color: #ff2a13;
  }
}
</style>
