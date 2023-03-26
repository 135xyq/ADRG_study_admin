// 问题的筛选条件

export const type = [{
  key: '单选题',
  value: 0
}, {
  key: '多选题',
  value: 1
}, {
  key: '填空题',
  value: 2
}, {
  key: '问答题',
  value: 3
}]

export const level = [{
  key: '简单',
  value: 0
}, {
  key: '中等',
  value: 1
}, {
  key: '困难',
  value: 2
}]
export const status = [{
  key: '正常',
  value: 1
}, {
  key: '禁用',
  value: 0
}]

export const sort = [{
  key: '做题人数',
  value: 'test_count'
}, {
  key: '答对人数',
  value: 'solve_count'
}]

export const parse = [{
  key: '有解析',
  value: '1'
}, {
  key: '无解析',
  value: '0'
}]

