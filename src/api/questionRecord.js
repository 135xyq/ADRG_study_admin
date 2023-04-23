import request from '@/utils/request'

/**
 * 分页查询获取刷题记录
 * @param data {Object}
 * @returns {*}
 */
export function getQuestionRecordPage(data) {
  return request({
    url: '/admin/questionRecord/getQuestionRecordPage',
    method: 'post',
    data
  })
}

/**
 *  批量删除记录
 * @param data {Object}
 * @returns {*}
 */
export function deleteQuestionRecord(data) {
  return request({
    url: '/admin/questionRecord/deleteQuestionRecord',
    method: 'post',
    data
  })
}

/**
 * 根据刷题记录获取用户的答题记录
 * @param data {Object}
 * @returns {*}
 */
export function getRecordQuestionDetail(data) {
  return request({
    url: '/admin/questionRecord/getUserSubmitRecordQuestionDetail',
    method: 'post',
    data
  })
}
