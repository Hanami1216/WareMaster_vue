import request from '@/utils/request'

/**
 *获取物料信息
 * @returns data
 */
export function getAllCustomerDispatchNote(params) {
  return request({
    url: '/customerDispatchNote/info/all',
    method: 'get',
    params
  })
}

/**
 *添加物料信息
 * @returns data
 */
export function addCustomerDispatchNote(data) {
  return request({
    url: '/customerDispatchNote/info',
    method: 'post',
    data
  })
}

/**
 *修改零件信息
 * @returns data
 */
export function modifyCustomerDispatchNote(data) {
  return request({
    url: '/customerDispatchNote/info',
    method: 'put',
    data
  })
}

/**
 *删除零件信息
 * @returns data
 */
export function deleteCustomerDispatchNote(id) {
  return request({
    url: '/customerDispatchNote/info',
    method: 'delete',
    params: { id: id }
  })
}

