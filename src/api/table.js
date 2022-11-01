import request from '@/utils/request'

export function getList(params) {
  return request({
    url: '/user',
    method: 'get',
    params
  })
}
