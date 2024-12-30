export default function rpxToPx(rpx) {
  const screenWidth = uni.getSystemInfoSync().screenWidth
  //   return (rpx * Number.parseInt(screenWidth)) / 750
  return (rpx * screenWidth) / 375
}
