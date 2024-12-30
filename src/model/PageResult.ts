export default class PageResult<T> {
  pageNum: number = 0
  pageSize: number = 0
  total: number = 0
  data: T[] = []
}
