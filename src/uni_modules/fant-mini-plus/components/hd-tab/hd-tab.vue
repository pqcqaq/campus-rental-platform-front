<template>
  <view v-show="showContent">
    <slot></slot>
  </view>
</template>

<script lang="ts" setup>
import { computed, getCurrentInstance, inject, nextTick, onMounted, watch } from 'vue'
import { CommonUtil } from '../..'

interface Props {
  /**
   * @doc 选项卡标题
   */
  title: string
}
let props = withDefaults(defineProps<Props>(), {
  title: ''
})
let $tabList: any = inject('$tabList')
let $current: any = inject('$current')

const showContent = computed(() => {
  if ($tabList.value[$current.value]) {
    return proxy.$.uid === $tabList.value[$current.value].uid
  } else {
    return false
  }
})

const { proxy } = getCurrentInstance() as any

onMounted(() => {
  nextTick(() => {
    $tabList.value = CommonUtil.deepClone($tabList.value.concat([{ title: props.title, uid: proxy.$.uid }]))
  })
})
</script>

<style lang="scss" scoped></style>
