import request from '@/utils/request'

/**
 * 分页获取数据
 * @param data {Object}
 * *page:页码 *limit：每页数量 *name：名称查找 *status：状态
 * @returns {*}
 */
export function page(data) {
  return request({
    url: '/admin/studycategory/page',
    method: 'post',
    data
  })
}

/**
 *  删除一个分类
 * @param data {Object}
 * id：要删除的数据id
 * @returns {*}
 */
export function deleteCategory(data) {
  return request({
    url: '/admin/studycategory/delete',
    method: 'post',
    data
  })
}

/**
 * 修改分类数据
 * @param data {Object}
 * id：修改数据的id  *name:分类名称 *description:分类描述 *status：状态 *sort排序
 * @returns {*}
 */
export function update(data) {
  return request({
    url: '/admin/studycategory/update',
    method: 'post',
    data
  })
}

/**
 * 新增一个分类
 * @param data {Object}
 * name: 分类名称  *description：分类描述 *status：状态 *sort: 排序
 * @returns {*}
 */
export function add(data) {
  return request({
    url: '/admin/studycategory/add',
    method: 'post',
    data
  })
}

/**
 * 获取分类列表
 * @returns {*}
 */
export function getList() {
  return request({
    url: '/admin/studycategory/list',
    method: 'post'
  })
}
