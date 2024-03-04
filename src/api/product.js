import request from '@/utils/request'

/**
 *获取物料信息
 * @returns data
 */
export function getAllProduct(params) {
  return request({
    url: '/product/info/all',
    method: 'get',
    params
  })
}

/**
 *添加物料信息
 * @returns data
 */
export function addProduct(data) {
  return request({
    url: '/product/info',
    method: 'post',
    data
  })
}

/**
 *修改零件信息
 * @returns data
 */
export function modifyProduct(data) {
  return request({
    url: '/product/info',
    method: 'put',
    data
  })
}

/**
 *删除零件信息
 * @returns data
 */
export function deleteProduct(id) {
  return request({
    url: '/product/info' + id,
    method: 'delete'
  })
}

