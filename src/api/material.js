import request from '@/utils/request'

/**
 *获取物料信息
 * @returns data
 */
export function getAllMaterial(params) {
  return request({
    url: '/material/info/all',
    method: 'get',
    params
  })
}

/**
 *添加物料信息
 * @returns data
 */
export function addMaterial(data) {
  return request({
    url: '/material/info',
    method: 'post',
    data
  })
}

/**
 *修改零件信息
 * @returns data
 */
export function modifyMaterial(data) {
  return request({
    url: '/material/info',
    method: 'put',
    data
  })
}

/**
 *删除零件信息
 * @returns data
 */
export function deleteMaterial(id) {
  return request({
    url: '/material/info' + id,
    method: 'delete'
  })
}

