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
    url: '/admin/video/page',
    method: 'post',
    data
  })
}
