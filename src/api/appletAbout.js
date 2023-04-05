import request from '@/utils/request'

// 获取小程序的使用指南
export function getAppletAbout() {
  return request({
    url: '/admin/appletabout/getappletabout',
    method: 'post'
  })
}

// 修改小程序的使用指南
export function updateAppletAbout(data) {
  return request({
    url: '/admin/appletabout/addappletabout',
    method: 'post',
    data
  })
}

