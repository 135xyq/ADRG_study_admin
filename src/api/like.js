import request from '@/utils/request'

/**
 * 分页查询和获取数据
 * @param data
 * @returns {*}
 */
export function getLikePage(data) {
  return request({
    url: '/admin/like/page',
    method: 'post',
    data
  })
}

/**
 * 批量删除点赞信息
 * @param data
 * @returns {*}
 */
export function deleteLike(data) {
  return request({
    url: '/admin/like/delete',
    method: 'post',
    data
  })
}
