import ImgSelect from './ImgSelect'
import UserInfo from './UserInfo'

export default class Post {
  id?: string = ''
  title?: string = ''
  intro?: string = ''
  imgs?: ImgSelect[] = []
  createTime?: string = ''
  updateTime?: string = ''
  // 作者
  author?: UserInfo = {
    linkMan: null,
    username: null,
    mobile: null,
    nickName: null,
    avatar: null,
    background: null,
    school: null,
    token: null,
    role: null
  }
  likeNum?: number = 0
  commentNum?: number = 0
  comments?: Comment[] = []
  collectNum?: number = 0
  isLike?: boolean = false
  isCollect?: boolean = false
  shareNum?: number = 0
  viewNum?: number = 0
  status?: string = ''
  editable?: boolean = false
}
