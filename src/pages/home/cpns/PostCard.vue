<template>
  <div :style="postStyle" class="postCard" ref="postCard" @touchstart="touchS" @touchmove="touchM" @touchend="touchE" @click="handleClickPost">
    <image class="img" ref="img" src="https://img.yzcdn.cn/vant/cat.jpeg" mode="aspectFill" />
    <div class="postActions" ref="postActions">
      <button class="actionButton">
        <hd-icon name="ic_collection_fill" :color="btnIconColor" size="50rpx"></hd-icon>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const postStyle = ref({
  transform: 'scale(1)'
})

const btnIconColor = ref('#fff')
// #F97F7F

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
  if (moveX < 0 && offset > 200) {
    // 触发滑动事件,左移30%
    postStyle.value.transform = 'translate(-30%, 0)'
  } else {
    // 恢复原状
    postStyle.value.transform = 'translate(0, 0)'
  }
}

const handleClickPost = (e: MouseEvent) => {
  // 处理点击事件
}
</script>

<style lang="scss" scoped>
.postCard {
  width: 700rpx;
  height: 200rpx;
  background-color: #fff;
  border-radius: 20rpx;
  box-shadow: 3rpx 3rpx 20rpx 0rpx rgba(0, 0, 0, 0.186);
  position: relative;
  // 动画效果
  transition: transform 0.3s ease-in-out;

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
  .actionButton {
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
  }
  .actionButton:hover {
    background-color: #4c8fcb;
  }
}
</style>
