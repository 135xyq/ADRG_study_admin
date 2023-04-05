/**
 * 导出类型
 * @param type
 * @returns {(function(*): ({icon: string, title: string}))|*}
 */
export function getType(type) {
  switch (type) {
    case 1:
      return {
        icon: 'info',
        title: '视频'
      }
    case 2:
      return {
        icon: 'success',
        title: '文章'
      }
    case 3:
      return {
        icon: 'warning',
        title: '帖子'
      }
  }
}
