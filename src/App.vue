<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
onLaunch((_ctx) => {
  console.log('App Launch')
})
onShow(() => {
  console.log('App Show')
})
onHide(() => {
  console.log('App Hide')
})
</script>
<style>
@import '@/uni_modules/fant-mini-plus/libs/iconfont/iconfont.css';
::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>
