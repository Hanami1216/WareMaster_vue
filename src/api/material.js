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
    data: {
      material_id: data.material_id,
      material_num: data.material_name,
      material_type_id: data.description,
      is_available: data.is_available,
      is_deleted: data.is_deleted,
      price: data.price,
      supplier_id: data.supplier_id
    }
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

