import { isPlainObject } from './util'

// 只需要对普通对象进行转换
export function transformRequest(data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}
