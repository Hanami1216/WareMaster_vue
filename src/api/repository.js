import request from '@/utils/request'

/**
 *获取仓库信息
 * @returns data
 */
export function getRepository(params) {
  return request({
    url: '/repository/',
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
    url: '/repository/',
    method: 'post',
    data: {
      repository_id: 1,
      repository_address: '广州市花都区学府1号',
      repository_area: 999,
      repository_level: 1,
      repository_desc: '广州城市理工学院',
      goods: [
        {
          goods_id: 1,
          goods_num: 1234,
          goods_type_id: 1,
          goodsType: null,
          repositoryList: null
        }
      ]
    }
  })
}

/**
 *修改仓库信息
 * @returns data
 */
export function modifyRepository(data) {
  return request({
    url: '/repository/',
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
    url: '/repository/' + id,
    method: 'delete'
  })
}

