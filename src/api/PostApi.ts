import http from '@/http/HttpClient'
import BaseResponse from '@/model/BaseResponse'
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
      .put(`posts/like/${postId}`)
      .then((res) => res.data)
  }

  static collectPost(postId: string): Promise<BaseResponse<boolean>> {
    return http
      .server()
      .put(`posts/collect/${postId}`)
      .then((res) => res.data)
  }

  static getPublishPosts(page: number, size: number, userId: string): Promise<BaseResponse<PageResult<Post>>> {
    return http
      .server()
      .get(`posts/publish/${page}/${size}/${userId}`)
      .then((res) => res.data)
  }

  static getCollectPosts(page: number, size: number, userId: string): Promise<BaseResponse<PageResult<Post>>> {
    return http
      .server()
      .get(`posts/collect/${page}/${size}/${userId}`)
      .then((res) => res.data)
  }

  static delPost(postId: string): Promise<BaseResponse<string>> {
    return http
      .server()
      .delete(`posts/${postId}`)
      .then((res) => res.data)
  }

  static getPostDetail(postId: string): Promise<BaseResponse<Post>> {
    return http
      .server()
      .get(`posts/${postId}`)
      .then((res) => res.data)
  }
}
