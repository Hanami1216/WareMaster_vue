import request from '@/utils/request'

// 登录接口
export function login(data) {
  console.log(data)
  return request({
    url: '/login/',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getInfo(params) {
  return request({
    url: '/login/getUserInfo',
    method: 'get',
    params: { name: params }
  })
}

// 退出登录
export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

/**
 *获取用户信息
 * @returns data
 */
export function getUser(params) {
  return request({
    url: '/user',
    method: 'get',
    params
  })
}

/**
 *添加用户信息
 * @returns data
 */
export function addUser(data) {
  return request({
    url: '/user',
    method: 'post',
    data
  })
}

/**
 *修改用户信息
 * @returns data
 */
export function modifyUser(data) {
  return request({
    url: '/user',
    method: 'put',
    data
  })
}

/**
 *删除用户信息
 * @returns data
 */
export function deleteUser(id) {
  return request({
    url: '/user/' + id,
    method: 'delete'
  })
}

