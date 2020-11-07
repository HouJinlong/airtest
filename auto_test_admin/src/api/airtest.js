import request from '@/utils/request'

export function get_gits(params) {
  return request({
    url: '/airtest/gits/get',
    method: 'get',
    params
  })
}
export function add_gits(data) {
  return request({
    url: '/airtest/gits/add',
    method: 'post',
    data
  })
}

export function update_gits(data) {
  return request({
    url: '/airtest/gits/update',
    method: 'post',
    data
  })
}

export function del_gits({ id }) {
  return request({
    url: '/airtest/gits/del',
    method: 'post',
    data: {
      id
    }
  })
}

export function get_airs(params) {
  return request({
    url: '/airtest/airs/get',
    method: 'get',
    params
  })
}
export function add_airs(data) {
  return request({
    url: '/airtest/airs/add',
    method: 'post',
    data
  })
}

export function update_airs(data) {
  return request({
    url: '/airtest/airs/update',
    method: 'post',
    data
  })
}

export function del_airs({ _id }) {
  return request({
    url: '/airtest/airs/del',
    method: 'post',
    data: {
      _id
    }
  })
}
export function del_tasks(data) {
  return request({
    url: '/airtest/tasks/del',
    method: 'post',
    data
  })
}

export function add_tasks(data) {
  return request({
    url: '/airtest/tasks/add',
    method: 'post',
    data
  })
}

export function get_tasks_list(params) {
  return request({
    url: '/airtest/tasks/get_list',
    method: 'get',
    params
  })
}

export function update_tasks(data) {
  return request({
    url: '/airtest/tasks/update',
    method: 'post',
    data
  })
}

export function get_devices(params) {
  return request({
    url: '/airtest/devices/get',
    method: 'get',
    params
  })
}

export function get_analysis(params) {
  return request({
    url: '/airtest/other/analysis',
    method: 'get',
    params
  })
}

