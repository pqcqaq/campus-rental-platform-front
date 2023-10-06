import Post from '@/model/Post'

interface ShowNow {
  // 当前展示的帖子
  postId: string
  userId: string
}

export const useShowNowStore = defineStore('showNow', {
  state: (): ShowNow => ({
    postId: '',
    userId: ''
  }),
  getters: {},
  actions: {
    setPostId(id: string) {
      this.postId = id
    },
    setUserId(id: string) {
      this.userId = id
    }
  }
})
