import request from '@/utils/request'

/**
 *获取供应商信息
 * @returns data
 */
export function getSupplier(params) {
  return request({
    url: '/supplier',
    method: 'get',
    params
  })
}

/**
 *添加供应商信息
 * @returns data
 */
export function addSupplier(data) {
  return request({
    url: '/supplier',
    method: 'post',
    data
  })
}

/**
 *修改供应商信息
 * @returns data
 */
export function modifySupplier(data) {
  return request({
    url: '/supplier',
    method: 'put',
    data
  })
}
/**
 *删除供应商信息
 * @returns data
 */
export function deleteSupplier(id) {
  return request({
    url: '/supplier/' + id,
    method: 'delete'
  })
}

