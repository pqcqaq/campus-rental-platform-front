import myRecord from '@/model/myRecord'
import { defineStore } from 'pinia'

interface InfoRecords {
  // 我的信息
  infoRecords: myRecord[]
}

// defineStore 调用后返回一个函数，调用该函数获得 Store 实体
export const useInfoRecords = defineStore('userInfoRecords', {
  state: (): InfoRecords => ({
    infoRecords: [
      {
        name: '我的租赁',
        value: 0,
        routerName: 'lease'
      },
      {
        name: '我的出租',
        value: 0,
        routerName: 'hire'
      },
      {
        name: '我的收藏',
        value: 0,
        routerName: 'collect'
      },
      {
        name: '我的发布',
        value: 0,
        routerName: 'publish'
      }
    ]
  }),
  getters: {},
  actions: {
    setRecords(records: myRecord[]) {
      this.infoRecords = records
    }
  }
})
