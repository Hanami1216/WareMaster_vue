import request from '@/utils/request'

/**
 *获取用户信息
 * @returns data
 */
export function getReceive(params) {
  return request({
    url: '/goods/receive',
    method: 'get',
    params
  })
}

/**
 *添加用户信息
 * @returns data
 */
export function addReceive(data) {
  return request({
    url: '/goods/receive',
    method: 'post',
    data
  })
}

/**
 *修改用户信息
 * @returns data
 */
export function modifyReceive(data) {
  return request({
    url: '/goods/receive',
    method: 'put',
    data
  })
}
/**
 *删除用户信息
 * @returns data
 */
export function deleteReceive(id) {
  return request({
    url: '/goods/receive/' + id,
    method: 'delete'
  })
}

