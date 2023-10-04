import http from '@/http/HttpClient'
import BaseResponse from '@/model/BaseResponse'
import Chanel from '@/model/Chanel'
import PageResult from '@/model/PageResult'
import Post from '@/model/Post'

export default class PostApi {
  static getPostsList(page: number, size: number): Promise<BaseResponse<PageResult<Post>>> {
    return http
      .server()
      .get(`posts/list/${page}/${size}`)
      .then((res) => res.data)
  }

  static publishPost(post: Post): Promise<BaseResponse<boolean>> {
    return http
      .server()
      .post('posts/publish', post)
      .then((res) => res.data)
  }

  static likePost(postId: string): Promise<BaseResponse<boolean>> {
    return http
      .server()
      .get(`posts/like/${postId}`)
      .then((res) => res.data)
  }

  static collectPost(postId: string): Promise<BaseResponse<boolean>> {
    return http
      .server()
      .get(`posts/collect/${postId}`)
      .then((res) => res.data)
  }
}
