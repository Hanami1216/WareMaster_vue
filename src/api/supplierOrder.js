import request from '@/utils/request'

/**
 *获取物料信息
 * @returns data
 */
export function getAllSupplierOrder(params) {
  return request({
    url: '/supplierOrder/info/all',
    method: 'get',
    params
  })
}

/**
 *添加物料信息
 * @returns data
 */
export function addSupplierOrder(data) {
  return request({
    url: '/supplierOrder/info',
    method: 'post',
    data
  })
}

/**
 *修改零件信息
 * @returns data
 */
export function modifySupplierOrder(data) {
  return request({
    url: '/supplierOrder/info',
    method: 'put',
    data
  })
}

/**
 *删除零件信息
 * @returns data
 */
export function deleteSupplierOrder(id) {
  return request({
    url: '/supplierOrder/info',
    method: 'delete',
    params: { id: id }
  })
}

