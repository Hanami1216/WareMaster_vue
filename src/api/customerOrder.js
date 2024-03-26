import request from '@/utils/request'

/**
 *获取物料信息
 * @returns data
 */
export function getAllCustomerOrder(params) {
  return request({
    url: '/customerOrder/info/all',
    method: 'get',
    params
  })
}

/**
 *添加物料信息
 * @returns data
 */
export function addCustomerOrder(data) {
  return request({
    url: '/customerOrder/info',
    method: 'post',
    data
  })
}

/**
 *修改零件信息
 * @returns data
 */
export function modifyCustomerOrder(data) {
  return request({
    url: '/customerOrder/info',
    method: 'put',
    data
  })
}

/**
 *删除零件信息
 * @returns data
 */
export function deleteCustomerOrder(id) {
  return request({
    url: '/customerOrder/info',
    method: 'delete',
    params: { id: id }
  })
}

