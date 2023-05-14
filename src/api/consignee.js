import request from '@/utils/request'

/**
 *获取供应商信息
 * @returns data
 */
export function getConsignee(params) {
  return request({
    url: '/consignee',
    method: 'get',
    params
  })
}

/**
 *添加供应商信息
 * @returns data
 */
export function addConsignee(data) {
  return request({
    url: '/consignee',
    method: 'post',
    data
  })
}

/**
 *修改供应商信息
 * @returns data
 */
export function modifyConsignee(data) {
  return request({
    url: '/consignee',
    method: 'put',
    data
  })
}

/**
 *删除供应商信息
 * @returns data
 */
export function deleteConsignee(id) {
  return request({
    url: '/consignee/' + id,
    method: 'delete'
  })
}

