<template>
  <div>
    <hd-loading></hd-loading>
    <hd-toast></hd-toast>
    <hd-modal></hd-modal>
  </div>
</template>

<script lang="ts" setup>
import Post from '@/model/Post'
import { useLoading, useToast, useModal } from '@/uni_modules/fant-mini-plus'

const loading = useLoading()
const toast = useToast()
const modal = useModal()

defineProps({
  post: {
    type: Post,
    required: true
  }
})
</script>

<style lang="stylus" scoped></style>
