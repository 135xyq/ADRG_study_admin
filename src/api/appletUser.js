import request from '@/utils/request'

/**
 * 分页获取用户数据
 * @param data
 * @returns {*}
 */
export function getAppletUsers(data) {
  return request({
    url: '/admin/appletuser/page',
    method: 'post',
    data
  })
}

/**
 * 查询获取用户列表
 * @param data
 * @returns {*}
 */
export function getAppletUserList(data) {
  return request({
    url: '/admin/appletuser/searchuserlist',
    method: 'post',
    data
  })
}
