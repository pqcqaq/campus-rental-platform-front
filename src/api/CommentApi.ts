import http from '@/http/HttpClient'
import BaseResponse from '@/model/BaseResponse'
import Comment from '@/model/Comment'
import CommentParam from '@/model/CommentParam'
import PageResult from '@/model/PageResult'

export default class CommentApi {
  //  @GetMapping("/{page}/{size}/{postId}")
  static pageComments(page: number, size: number, postId: string): Promise<BaseResponse<PageResult<Comment>>> {
    return http
      .server()
      .get(`/comments/${page}/${size}/${postId}`)
      .then((res) => res.data)
  }

  static publishComment(comment: CommentParam): Promise<BaseResponse<Comment>> {
    return http
      .server()
      .post('/comments/publish', comment)
      .then((res) => res.data)
  }
}
