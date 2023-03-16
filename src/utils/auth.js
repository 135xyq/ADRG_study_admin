import Cookies from 'js-cookie'

const TokenKey = 'ADRG_study_Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  // 计算过期时间
  // const millisecond = new Date().getTime()
  // const expiresTime = new Date(millisecond + 60 * 1000 * 7)
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
