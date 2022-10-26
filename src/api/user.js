import request from '@/utils/request'
// 登录接口
export function login(data) {
  return request({
    url: 'user/login',
    method: 'post',
    data
  })
}
// 获取用户信息
export function getInfo(token) {
  return request({
    url: '/user',
    method: 'get',
    params: { token }
  })
}

// 退出登录
export function logout() {
  return request({
    url: '/user',
    method: 'post'
  })
}
