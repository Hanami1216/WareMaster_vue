import request from '@/utils/request'

/**
 *获取物料信息
 * @returns data
 */
export function getAllBom(params) {
  return request({
    url: '/bom/info/',
    method: 'get',
    params
  })
}

/**
 *添加物料信息
 * @returns data
 */
export function addBom(data) {
  return request({
    url: '/bom/info',
    method: 'post',
    data
  })
}

/**
 *修改零件信息
 * @returns data
 */
export function modifyBom(data) {
  return request({
    url: '/bom/info',
    method: 'put',
    data
  })
}

/**
 *删除零件信息
 * @returns data
 */
export function deleteBom(id) {
  return request({
    url: '/bom/info' + id,
    method: 'delete'
  })
}

