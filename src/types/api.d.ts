// 与接口相关的类型

declare namespace API {
  // 分页数据
  interface PageData<T = any> {
    records: T[]
    total: number
    page: number
    pageSize: number
  }
}
