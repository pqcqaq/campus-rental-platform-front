<template>
  <div>详情 :{{ route.params.id }}</div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'

const route = useRoute() as any
const id = route.params.id

onMounted(() => {})
</script>

<style lang="stylus" scoped></style>
