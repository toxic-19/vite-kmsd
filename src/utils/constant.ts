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
const zeroFill = (str, length, after) => {
  str += ''
  if (str.length >= length) {
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
export const cloneData = (myObj) => {
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
export const runNum = (str, fixed) => {
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
