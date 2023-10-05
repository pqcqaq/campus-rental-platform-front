import Post from '@/model/Post'

interface PostShowNow {
  // 当前展示的帖子
  postShowNow: Post
  postId: string
}

export const usePostShowNowStore = defineStore('postShowNow', {
  state: (): PostShowNow => ({
    postShowNow: {},
    postId: ''
  }),
  getters: {},
  actions: {
    setPostShowNow(post: Post) {
      this.postShowNow = post
    },
    clearPostShowNow() {
      this.postShowNow = {}
    },
    setPostId(id: string) {
      this.postId = id
    },
    clearPostId() {
      this.postId = ''
    }
  }
})
