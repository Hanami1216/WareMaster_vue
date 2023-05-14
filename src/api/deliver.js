import request from '@/utils/request'

/**
 *获取用户信息
 * @returns data
 */
export function getOut(params) {
  return request({
    url: '/goods/out',
    method: 'get',
    params
  })
}

/**
 *添加用户信息
 * @returns data
 */
export function addOut(data) {
  return request({
    url: '/goods/out',
    method: 'post',
    data: {
      record_id: data.record_id,
      record_number: data.record_number,
      record_time: data.record_time,
      record_consignee_id: data.consignee.consignee_id,
      record_goods_id: data.goods.goods_id,
      record_person_id: data.user.user_id
    }
  })
}

/**
 *修改用户信息
 * @returns data
 */
export function modifyOut(data) {
  return request({
    url: '/goods/out',
    method: 'put',
    data: {
      record_id: data.record_id,
      record_number: data.record_number,
      record_time: data.record_time,
      record_consignee_id: data.consignee.consignee_id,
      record_goods_id: data.goods.goods_id,
      record_person_id: data.user.user_id
    }
  })
}

/**
 *删除用户信息
 * @returns data
 */
export function deleteOut(id) {
  return request({
    url: '/goods/out/' + id,
    method: 'delete'
  })
}

