import request from '@/utils/request'

/**
 * 分页查询和获取数据
 * @param data
 * @returns {*}
 */
export function getCommentPage(data) {
  return request({
    url: '/admin/comment/page',
    method: 'post',
    data
  })
}

/**
 * 批量删除评论
 * @param data
 * @returns {*}
 */
export function deleteComment(data) {
  return request({
    url: '/admin/comment/delete',
    method: 'post',
    data
  })
}

/**
 * 审核评论
 * @param data
 * @returns {*}
 */
export function auditComment(data) {
  return request({
    url: '/admin/comment/audit',
    method: 'post',
    data
  })
}
