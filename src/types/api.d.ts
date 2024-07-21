declare namespace API {
  interface PageData<T = any> {
    records: T[]
    total: number
    page: number
    pageSize: number
  }
}
