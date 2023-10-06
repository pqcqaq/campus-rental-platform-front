import http from '@/http/HttpClient'
import BaseResponse from '@/model/BaseResponse'
import Comment from '@/model/Comment'

export default class CommentApi {
  static getCommentList(postId: string): Promise<BaseResponse<Comment[]>> {
    return http
      .server()
      .get(`comment/${postId}`)
      .then((res) => res.data)
  }

  //   static getCommentDetail(id: string): Promise<BaseResponse<Comment>> {
  //     return http
  //       .server()
  //       .get('comment/getCommentDetail', {
  //         params: {
  //           id
  //         }
  //       })
  //       .then((res) => res.data)
  //   }

  //   static addComment(comment: Comment): Promise<BaseResponse<Comment>> {
  //     return http
  //       .server()
  //       .post('comment/addComment', comment)
  //       .then((res) => res.data)
  //   }

  //   static deleteComment(id: string): Promise<BaseResponse<string>> {
  //     return http
  //       .server()
  //       .post('comment/deleteComment', {
  //         id
  //       })
  //       .then((res) => res.data)
  //   }

  //   static likeComment(id: string): Promise<BaseResponse<string>> {
  //     return http
  //       .server()
  //       .post('comment/likeComment', {
  //         id
  //       })
  //       .then((res) => res.data)
  //   }

  //   static cancelLikeComment(id: string): Promise<BaseResponse<string>> {
  //     return http
  //       .server()
  //       .post('comment/cancelLikeComment', {
  //         id
  //       })
  //       .then((res) => res.data)
  //   }
}
