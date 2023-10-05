export default class BaseResponse<T> {
  code: Nullable<number> = null
  msg: Nullable<string> = null
  data: Nullable<T> = null
}
