import request from '@/utils/request'

/**
 *获取零件信息
 * @returns data
 */
export function getGoods(params) {
  return request({
    url: '/goods/basic/',
    method: 'get',
    params
  })
}

/**
 *添加零件信息
 * @returns data
 */
export function addGoods(data) {
  return request({
    url: '/goods/basic/',
    method: 'post',
    data: {
      goods_id: data.goods_id,
      goods_num: data.goods_num,
      goods_type_id: data.goods_type_id
    }
  })
}

/**
 *修改零件信息
 * @returns data
 */
export function modifyGoods(data) {
  return request({
    url: '/goods/basic/',
    method: 'put',
    data
  })
}
/**
 *删除零件信息
 * @returns data
 */
export function deleteGoods(id) {
  return request({
    url: '/goods/basic/' + id,
    method: 'delete'
  })
}

