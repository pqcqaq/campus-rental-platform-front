import Post from '@/model/Post'

interface PostShowNow {
  // 当前展示的帖子
  postId: string
}

export const usePostShowNowStore = defineStore('postShowNow', {
  state: (): PostShowNow => ({
    postId: ''
  }),
  getters: {},
  actions: {
    setPostId(id: string) {
      this.postId = id
    },
    clearPostId() {
      this.postId = ''
    }
  }
})
