<template>
  <div>详情 :{{ route.params.id }}</div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'

const route = useRoute() as any
const id = ref(route.params.id)

onMounted(() => {
  console.log('id', id)
})
</script>

<style lang="stylus" scoped></style>
