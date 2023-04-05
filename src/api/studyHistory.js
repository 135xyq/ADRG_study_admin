import request from '@/utils/request'

/**
 * 分页查询和获取数据
 * @param data
 * @returns {*}
 */
export function getHistoryPage(data) {
  return request({
    url: '/admin/studyhistory/page',
    method: 'post',
    data
  })
}

/**
 * 批量删除学习记录信息
 * @param data
 * @returns {*}
 */
export function deleteHistory(data) {
  return request({
    url: '/admin/studyhistory/delete',
    method: 'post',
    data
  })
}
