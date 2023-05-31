import request from '@/utils/request'

/**
 *获取仓库信息
 * @returns data
 */
export function getWareHouse(params) {
  return request({
    url: '/warehouse/info/all',
    method: 'get',
    params
  })
}

/**
 *添加仓库信息
 * @returns data
 */
export function addRepository(data) {
  return request({
    url: '/warehouse/info',
    method: 'post',
    data: {
      warehouse: {}
    }
  })
}

/**
 *修改仓库信息
 * @returns data
 */
export function modifyRepository(data) {
  return request({
    url: '/warehouse/info',
    method: 'put',
    data
  })
}

/**
 *删除仓库信息
 * @returns data
 */
export function deleteRepository(id) {
  return request({
    url: '/warehouse/info' + id,
    method: 'delete'
  })
}

