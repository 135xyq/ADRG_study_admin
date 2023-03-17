/**
 * 格式化时间 x时x分x秒
 * @param date
 * @returns {string}
 */
export function formateDate(date) {
  date = Number(date)
  const hour = Math.floor(date / 3600)
  const minute = Math.floor((date - hour * 3600) / 60)
  const second = Math.floor(date % 60)
  return `${hour}时${minute}分${second}秒`
}

