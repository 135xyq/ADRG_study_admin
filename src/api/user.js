import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: '/admin/login/login',
    method: 'post',
    data
  })
}

// 获取管理员信息
export function getInfo(token) {
  return request({
    url: '/admin/login/getInfo',
    method: 'get',
    params: { token }
  })
}

// 退出登录
export function logout(data) {
  return request({
    url: '/admin/login/logout',
    method: 'post',
    data: {
      token: data
    }
  })
}
