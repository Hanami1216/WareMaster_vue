import request from '@/utils/request'

const API_BASE_URL = 'material_inventory'
/**
 *获取物料信息
 * @returns data
 */
export function getAllInventory(params) {
  return request({
    url: API_BASE_URL + '/info/all',
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
    url: API_BASE_URL + '/info',
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
    url: API_BASE_URL + '/info',
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
    url: API_BASE_URL + '/info',
    method: 'delete',
    params: { id: id }
  })
}

