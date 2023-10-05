export default class OperationOption {
  label: string = '' // 操作的标题（用于展示）
  name: string | string[] = '' // 操作真实值用于代码传参
  value: KV<any>[] = [] // 操作项数组
}
