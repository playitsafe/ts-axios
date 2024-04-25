import { isDate, isObject } from './util'

function encode(val: string): string {
  // 对特殊字符进行转义
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildURL(url: string, params?: any): string {
  if (!params) return url

  // 定义键值对数组
  const parts: string[] = []

  Object.keys(params).forEach(key => {
    const val = params[key]
    // 如果值为null或undefined，则跳过
    if (val === null || typeof val === 'undefined') {
      return
    }

    let values = []
    // 如果值为数组，则赋值给values
    /**
     * params: {
        foo: ['bar', 'baz']
      }
     */
    // 最终请求的 url 是 /base/get?foo[]=bar&foo[]=baz'
    if (Array.isArray(val)) {
      values = val
      key += '[]'
    } else {
      values = [val]
    }

    values.forEach(val => {
      // 如果值为日期类型，则调用toISOString()方法
      if (isDate(val)) {
        val = val.toISOString()
      } else if (isObject(val)) {
        // 如果值为对象类型，则调用JSON.stringify()方法
        val = JSON.stringify(val)
      }
      // 将键值对拼接为字符串，并进行URL编码
      parts.push(`${encode(key)}=${encode(val)}`)
    })
  })

  let serializedParams = parts.join('&')

  // 如果序列化后的参数不为空，则去掉hash标记
  if (serializedParams) {
    const markIndex = url.indexOf('#')
    if (markIndex !== -1) {
      url = url.slice(0, markIndex)
    }

    // 判断url中是否已经存在参数，如果存在则追加参数，否则添加参数
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams
  }
  return url
}
