<template>
  <view class="home">
    <!-- <hd-cell title="清除登录信息" icon="ic_shutdown_line" is-link hasLine /> -->
  </view>
  <DragBall />
</template>

<script lang="ts" setup>
import DragBall from '@/components/DragBall.vue'
</script>

<style lang="scss" scoped>
.home {
  min-height: calc(100vh - var(--window-top) - var(--window-bottom));
  width: 100vw;
  box-sizing: border-box;
  background: #fff;
}
</style>
