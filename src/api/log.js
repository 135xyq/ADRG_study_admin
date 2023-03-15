import request from '@/utils/request'

/**
 * 分页获取数据
 * @param data {Object} 查询对象
 * page：页码 limit：每页数量 type：种类 username：管理员 create_time：时间段
 * @returns {*}
 */
export function page(data) {
  return request({
    url: '/admin/log/page',
    method: 'post',
    data
  })
}

/**
 * 删除日志、可以删除多个日志文件
 * @param data {Object}
 * @returns {*}
 */
export function deleteLog(data) {
  return request({
    url: '/admin/log/delete',
    method: 'post',
    data
  })
}

/**
 * 获取日志详情
 * @param data {Object} 传入id
 * @returns {*}
 */
export function detail(data) {
  return request({
    url: '/admin/log/detail',
    method: 'post',
    data
  })
}
