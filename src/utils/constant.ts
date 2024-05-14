/**
 * 转换为 2024-04-09 16:00:00
 * @param timeStr '2024-04-09T16:00:00.000Z'
 */
export const showCorrectTime = (timeStr: string) => {
  const data = new Date(timeStr).toLocaleString('zh-cn', { timeZone: 'Asia/Shanghai' })
  return data.replace(/\//g, '-')
}
/**
 * 通过结束时间和开始时间获取人日
 * @param timeEnd '2024-04-09T18:00:00.000Z'
 * @param timeStart '2024-04-09T16:00:00.000Z'
 */
export const diffInHours = (timeEnd: string, timeStart: string) => {
  if (timeStart === '') return 0
  const date1 = new Date(timeEnd)
  const date2 = new Date(timeStart)
  const differenceInMilliseconds = Math.abs(date1 - date2)
  const hours = differenceInMilliseconds / (1000 * 60 * 60)
  return (hours / 24).toFixed(1)
}
/**
 * 补零
 * @param str
 * @param length
 * @param after
 * @returns {*}
 */
const zeroFill = (str?: string, length: number, after) => {
  str += ''
  if (str?.length && str.length >= length) {
    return str
  }
  let _str = '',
    _ret = ''
  for (let i = 0; i < length; i++) {
    _str += '0'
  }
  if (after || typeof after === 'undefined') {
    _ret = (_str + '' + str).substr(length * -1)
  } else {
    _ret = (str + '' + _str).substr(0, length)
  }
  return _ret
}
/**
 * 时间戳转时间格式
 * @param format
 * @param v
 * @returns {string}
 */
export const formatDate = (format, v) => {
  if (format === '') {
    format = 'Y-m-d H:i:s'
  }
  let dateObj
  if (v instanceof Date) {
    dateObj = v
  } else {
    if (typeof v === 'undefined') {
      v = new Date().getTime()
    } else if (/^(-)?\d{1,10}$/.test(v)) {
      v = v * 1000
    } else if (/^(-)?\d{1,13}$/.test(v)) {
      v = v * 1000
    } else if (/^(-)?\d{1,14}$/.test(v)) {
      v = v * 100
    } else if (/^(-)?\d{1,15}$/.test(v)) {
      v = v * 10
    } else if (/^(-)?\d{1,16}$/.test(v)) {
      v = v * 1
    } else {
      return v
    }
    dateObj = new Date(v)
  }
  format = format.replace(/Y/g, dateObj.getFullYear())
  format = format.replace(/m/g, zeroFill(dateObj.getMonth() + 1, 2))
  format = format.replace(/d/g, zeroFill(dateObj.getDate(), 2))
  format = format.replace(/H/g, zeroFill(dateObj.getHours(), 2))
  format = format.replace(/i/g, zeroFill(dateObj.getMinutes(), 2))
  format = format.replace(/s/g, zeroFill(dateObj.getSeconds(), 2))
  return format
}

/**
 * 克隆对象
 * @param myObj
 * @returns {*}
 */
export const cloneData = (myObj: any) => {
  if (typeof myObj !== 'object') return myObj
  if (myObj === null) return myObj
  //
  if (typeof myObj.length === 'number') {
    const [...myNewObj] = myObj
    return myNewObj
  } else {
    const { ...myNewObj } = myObj
    return myNewObj
  }
}

/**
 * 相当于 intval
 * @param str
 * @param fixed
 * @returns {number}
 */
export const runNum = (str: string, fixed: string) => {
  let _s = Number(str)
  if (_s + '' === 'NaN') {
    _s = 0
  }
  if (/^[0-9]*[1-9][0-9]*$/.test(fixed)) {
    _s = _s.toFixed(fixed)
    const rs = _s.indexOf('.')
    if (rs < 0) {
      _s += '.'
      for (let i = 0; i < fixed; i++) {
        _s += '0'
      }
    }
  }
  return _s
}
/**
 * 切换不同的icon
 * @param iconName 该icon的所属
 * @param initIcon 初始状态的iconName
 * @param changedIcon 切换之后的iconName
 */
export const getChangedIcon = (iconName: any, initIcon: string, changedIcon: string) => {
  return iconName === initIcon ? changedIcon : initIcon
}
export const base64Encode = (str: string) => {
  let out = ''
  let c1, c2, c3
  const len = str.length
  let i = 0
  const base64EncodeChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'
  while (i < len) {
    c1 = str.charCodeAt(i++) & 0xff
    if (i == len) {
      out += base64EncodeChars.charAt(c1 >> 2)
      out += base64EncodeChars.charAt((c1 & 0x3) << 4)
      out += '=='
      break
    }
    c2 = str.charCodeAt(i++)
    if (i == len) {
      out += base64EncodeChars.charAt(c1 >> 2)
      out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4))
      out += base64EncodeChars.charAt((c2 & 0xf) << 2)
      out += '='
      break
    }
    c3 = str.charCodeAt(i++)
    out += base64EncodeChars.charAt(c1 >> 2)
    out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4))
    out += base64EncodeChars.charAt(((c2 & 0xf) << 2) | ((c3 & 0xc0) >> 6))
    out += base64EncodeChars.charAt(c3 & 0x3f)
  }
  return out
}
export const utf16to8 = (str: string) => {
  let out, i, c
  out = ''
  const len = str.length
  for (i = 0; i < len; i++) {
    c = str.charCodeAt(i)
    if (c >= 0x0001 && c <= 0x007f) {
      out += str.charAt(i)
    } else if (c > 0x07ff) {
      out += String.fromCharCode(0xe0 | ((c >> 12) & 0x0f))
      out += String.fromCharCode(0x80 | ((c >> 6) & 0x3f))
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3f))
    } else {
      out += String.fromCharCode(0xc0 | ((c >> 6) & 0x1f))
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3f))
    }
  }
  return out
}
