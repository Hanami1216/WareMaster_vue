import request from '@/utils/request'

/**
 *获取用户信息
 * @returns data
 */
export function getReceive(params) {
  return request({
    url: '/record/in/info/all',
    method: 'get',
    params
  })
}

/**
 *添加用户信息
 * @returns data
 */
export function addReceive(data) {
  return request({
    url: '/record/in',
    method: 'post',
    data: {
      record_id: data.record_id,
      record_num: data.record_num,
      record_time: data.record_time,
      record_supplier_id: data.supplier.supplier_id,
      record_goods_id: data.goods.goods_id,
      record_person_id: data.user.user_id
    }
  })
}

/**
 *修改用户信息
 * @returns data
 */
export function modifyReceive(data) {
  return request({
    url: '/record/in',
    method: 'put',
    data: {
      record_id: data.record_id,
      record_num: data.record_num,
      record_time: data.record_time,
      record_supplier_id: data.supplier.supplier_id,
      record_goods_id: data.goods.goods_id,
      record_person_id: data.user.user_id
    }
  })
}

/**
 *删除用户信息
 * @returns data
 */
export function deleteReceive(id) {
  return request({
    url: '/record/in/' + id,
    method: 'delete'
  })
}

