interface Operation {
  text: string // 操作项文字
  value: string // 操作项值
  confirmNeed: boolean // 操作项是否需要确认
  confirmText: Nullable<string> // 确认文本
  type: 'success' | 'error' | 'warn' | 'info' // 操作类型
}

interface Ucn {
  id: string // id
  name: string // 名称
}

declare type Nullable<T> = T | null
