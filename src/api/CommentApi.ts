import http from '@/http/HttpClient'
import BaseResponse from '@/model/BaseResponse'
import Comment from '@/model/Comment'
import PageResult from '@/model/PageResult'

export default class CommentApi {
  //  @GetMapping("/{page}/{size}/{postId}")
  static pageComments(page: number, size: number, postId: string): Promise<BaseResponse<PageResult<Comment>>> {
    return http
      .server()
      .get(`/comments/${page}/${size}/${postId}`)
      .then((res) => res.data)
  }
}
