import http from './http'

const host = 'https://bestlang.cn'
const basePath = host + '/api/invitation'
const wedding = basePath + '/wedding/1'
const queryComment = basePath + '/comment/1'

const createComment = content => {
  return http.post(basePath + '/comment', {
    topic: 1,
    content: content
  })
}

const login = (code, userInfo) => {
  return http.post(basePath + '/login', {
    code: code,
    userInfo: userInfo
  })
}

module.exports = {
  wedding,
  queryComment,
  createComment,
  login
}