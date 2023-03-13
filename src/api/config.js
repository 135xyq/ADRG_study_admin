import request from '@/utils/request'
import qs from 'qs'
// 获取小程序的配置文件
export function getConfig() {
  return request({
    url: '/admin/appletconfig/get',
    method: 'post'
  })
}

// 修改小程序的配置文件
export function updateConfig(data) {
  return request({
    url: '/admin/appletconfig/update',
    method: 'post',
    data
  })
}

// 新增小程序的配置文件
export function addConfig(data) {
  return request({
    url: '/admin/appletconfig/add',
    method: 'post',
    data
  })
}

export function test(data) {
  console.log(qs.stringify(data))
  return request({
    url: '/admin/appletconfig/test',
    method: 'post',
    data: qs.stringify(data)
  })
}

