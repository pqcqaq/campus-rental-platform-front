import UserInfo from './UserInfo'

export default class Comment {
  id: string = ''
  author: UserInfo = {
    id: null,
    linkMan: null,
    username: null,
    mobile: null,
    nickName: null,
    avatar: null,
    background: null,
    school: null,
    token: null,
    role: null,
    followNum: null,
    fansNum: null,
    isFollow: null
  }
  detail: string = ''
  comments: Comment[] = []
  createTime: string = ''
}
