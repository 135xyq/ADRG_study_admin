import request from '@/utils/request'

/**
 * 分页获取或查找视频
 * @param $data
 * @returns {*}
 */
export function getVideos(data) {
  return request({
    url: '/admin/video/page',
    method: 'post',
    data
  })
}

/**
 * 批量删除视频
 * @param data
 * @returns {*}
 */
export function deleteVideo(data) {
  return request({
    url: '/admin/video/delete',
    method: 'post',
    data
  })
}

/**
 * 新增一个视频
 * @param data
 * @returns {*}
 */
export function addVideo(data) {
  return request(({
    url: '/admin/video/add',
    method: 'post',
    data
  }))
}

/**
 * 更新一个视频信息
 * @param data
 * @returns {*}
 */
export function updateVideo(data) {
  return request(({
    url: '/admin/video/update',
    method: 'post',
    data
  }))
}
/**
 * 视频详情
 * @param data
 * @returns {*}
 */
export function videoDetail(data) {
  return request(({
    url: '/admin/video/detail',
    method: 'post',
    data
  }))
}
