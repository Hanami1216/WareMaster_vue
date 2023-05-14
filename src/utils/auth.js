import Cookies from 'js-cookie'

const TokenKey = 'token'

export function getToken() {
  // 此处与TokenKey相同，此写法解决初始化时Cookies中不存在TokenKey报错
  return Cookies.get(TokenKey) || sessionStorage.getItem(TokenKey)
}

export function setToken(data) {
  //   ? Cookies.set(TokenKey, dataString, {
  //       expires: expires / 86400000
  //     })
  Cookies.set(TokenKey, data)
  sessionStorage.setItem(TokenKey, data)
}

export function removeToken() {
  Cookies.remove(TokenKey)
  sessionStorage.removeItem(TokenKey)
}
