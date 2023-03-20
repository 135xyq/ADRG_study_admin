import request from '@/utils/request'

/**
 * 分页获取或查找文章
 * @param data
 * @returns {*}
 */
export function getArticles(data) {
  return request({
    url: '/admin/article/page',
    method: 'post',
    data
  })
}

/**
 * 批量删除文章
 * @param data
 * @returns {*}
 */
export function deleteArticle(data) {
  return request({
    url: '/admin/article/delete',
    method: 'post',
    data
  })
}

/**
 * 新增一篇文章
 * @param data
 * @returns {*}
 */
export function addArticle(data) {
  return request(({
    url: '/admin/article/add',
    method: 'post',
    data
  }))
}

/**
 * 更新一篇文章信息
 * @param data
 * @returns {*}
 */
export function updateArticle(data) {
  return request(({
    url: '/admin/article/update',
    method: 'post',
    data
  }))
}

