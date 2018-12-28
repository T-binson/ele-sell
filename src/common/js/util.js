// get the url params object
/*
*解析url参数
*@example: ?id=123&a=x
*@return Object {id: 123, a: x}
 */

export function urlParse () {
  let paramStr = window.location.search
  let obj = {}
  let reg = /[?&][^?&]+=[^?&]+/g
  let arr = paramStr.match(reg)
  if (arr) {
    arr.forEach((item) => {
      let tempArr = item.substr(1).split('=')
      let key = decodeURIComponent(tempArr[0])
      let val = decodeURIComponent(tempArr[1])
      obj[key] = val
    })
  }
  return obj
}
