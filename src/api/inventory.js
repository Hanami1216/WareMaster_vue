import request from '@/utils/request'

/**
 *获取物料信息
 * @returns data
 */
export function getAllInventory(params) {
  return request({
    url: '/inventory/info/all',
    method: 'get',
    params
  })
}

/**
 *添加物料信息
 * @returns data
 */
export function addInventory(data) {
  return request({
    url: '/inventory/info',
    method: 'post',
    data
  })
}

/**
 *修改零件信息
 * @returns data
 */
export function modifyInventory(data) {
  return request({
    url: '/inventory/info',
    method: 'put',
    data
  })
}

/**
 *删除零件信息
 * @returns data
 */
export function deleteInventory(id) {
  return request({
    url: '/inventory/info',
    method: 'delete',
    params: { id: id }
  })
}

