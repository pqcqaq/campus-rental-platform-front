<template>
  <div>
    <hd-loading></hd-loading>
    <hd-toast></hd-toast>
    <hd-modal></hd-modal>
    <div class="header"></div>
    <div class="body"></div>
    <div class="footer"></div>
  </div>
</template>

<script lang="ts" setup>
import { useLoading, useToast, useModal } from '@/uni_modules/fant-mini-plus'
import Comment from '@/model/Comment'

const loading = useLoading()
const toast = useToast()
const modal = useModal()

const props = defineProps({
  comment: {
    type: Object as PropType<Comment>,
    required: true
  }
})
</script>

<style lang="scss" scoped>
.body {
  border: 10rpx solid #000;
  height: 100rpx;
}
</style>
