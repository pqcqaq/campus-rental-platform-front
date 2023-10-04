import UserInfo from './UserInfo'

export default class Comment {
  id: string = ''
  author: UserInfo = {
    linkMan: null,
    username: null,
    mobile: null,
    nickName: null,
    avatar: null,
    school: null,
    token: null
  }
  detail: string = ''
  createTime: string = ''
}
