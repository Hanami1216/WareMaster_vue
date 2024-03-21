import request from '@/utils/request'

/**
 *获取客户信息
 * @returns data
 */
export function getCustomer(params) {
  return request({
    url: '/customer/info/all',
    method: 'get',
    params
  })
}

/**
 *添加客户信息
 * @returns data
 */
export function addConsignee(data) {
  return request({
    url: '/customer/info/one',
    method: 'post',
    data
  })
}

/**
 *修改客户信息
 * @returns data
 */
export function modifyConsignee(data) {
  return request({
    url: '/customer/info',
    method: 'put',
    data
  })
}

/**
 *删除客户信息
 * @returns data
 */
export function deleteConsignee(params) {
  return request({
    url: '/customer/info',
    method: 'delete',
    params
  })
}

