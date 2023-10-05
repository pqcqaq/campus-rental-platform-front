<template>
  <view>
    <movable-area class="movable-area">
      <movable-view class="movable-view" :x="x" :y="y" direction="all">
        <slot name="body"></slot>
      </movable-view>
    </movable-area>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const x = ref<number>(25)
const y = ref<number>(650)
</script>

<style lang="scss">
$all_width: 96rpx;
$all_height: 96rpx;

.movable-area {
  height: 100vh;
  width: 750rpx;
  top: 0;
  position: fixed;
  pointer-events: none; //此处要加，鼠标事件可以渗透
  .movable-view {
    width: $all_width;
    height: $all_height;
    pointer-events: auto; //恢复鼠标事件
    image {
      width: $all_width;
      height: $all_height;
    }
  }
}
</style>
