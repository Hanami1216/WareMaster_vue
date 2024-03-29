import request from '@/utils/request'

/**
 *获取物料信息
 * @returns data
 */
export function getAllSupplierDispatchNote(params) {
  return request({
    url: '/supplierDispatchNote/info/all',
    method: 'get',
    params
  })
}

/**
 *添加物料信息
 * @returns data
 */
export function addSupplierDispatchNote(data) {
  return request({
    url: '/supplierDispatchNote/info',
    method: 'post',
    data
  })
}

/**
 *修改零件信息
 * @returns data
 */
export function modifySupplierDispatchNote(data) {
  return request({
    url: '/supplierDispatchNote/info',
    method: 'put',
    data
  })
}

/**
 *删除零件信息
 * @returns data
 */
export function deleteSupplierDispatchNote(id) {
  return request({
    url: '/supplierDispatchNote/info',
    method: 'delete',
    params: { id: id }
  })
}

