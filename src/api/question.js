import request from '@/utils/request'

/**
 * 分页获取数据
 * @param data {Object}
 * @returns {*}
 */
export function page(data) {
  return request({
    url: '/admin/question/page',
    method: 'post',
    data
  })
}

/**
 *  批量删除题目
 * @param data {Object}
 * @returns {*}
 */
export function deleteQuestion(data) {
  return request({
    url: '/admin/question/delete',
    method: 'post',
    data
  })
}

/**
 * 修改题目数据
 * @param data {Object}
 * @returns {*}
 */
export function updateQuestion(data) {
  return request({
    url: '/admin/question/update',
    method: 'post',
    data
  })
}

/**
 * 新增一个题目
 * @param data {Object}
 * @returns {*}
 */
export function addQuestion(data) {
  return request({
    url: '/admin/question/add',
    method: 'post',
    data
  })
}

