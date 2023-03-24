import request from '@/utils/request'

/**
 * 分页查询和获取数据
 * @param data
 * @returns {*}
 */
export function getStarPage(data) {
  return request({
    url: '/admin/star/page',
    method: 'post',
    data
  })
}

/**
 * 批量删除收藏信息
 * @param data
 * @returns {*}
 */
export function deleteStar(data) {
  return request({
    url: '/admin/star/delete',
    method: 'post',
    data
  })
}
