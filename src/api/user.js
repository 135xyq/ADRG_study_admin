import request from '@/utils/request'
import md5 from 'md5'

// 登录
export function login(data) {
  return request({
    url: '/admin/login/login',
    method: 'post',
    data: {
      ...data,
      password: md5(data.password)
    }
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

// 修改密码
export function updatePassword(data) {
  return request({
    url: '/admin/login/updatepassword',
    method: 'post',
    data
  })
}
