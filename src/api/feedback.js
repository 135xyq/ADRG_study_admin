import request from '@/utils/request'

/**
 * 分页查询和获取数据
 * @param data
 * @returns {*}
 */
export function getFeedbackPage(data) {
  return request({
    url: '/admin/feedback/page',
    method: 'post',
    data
  })
}

/**
 * 批量删除用户反馈
 * @param data
 * @returns {*}
 */
export function deleteFeedback(data) {
  return request({
    url: '/admin/feedback/delete',
    method: 'post',
    data
  })
}

/**
 * 回复用户反馈
 * @param data
 * @returns {*}
 */
export function responseFeedback(data) {
  return request({
    url: '/admin/feedback/response',
    method: 'post',
    data
  })
}
