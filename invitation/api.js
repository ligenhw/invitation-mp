import http from './http'

const host = 'https://bestlang.cn'
const basePath = host + '/api/invitation'

const wedding = (weddingId) => {
  return http.get(basePath + '/wedding/' + weddingId)
}

const queryComment = (weddingId, page, size) => {
  return http.get(basePath + '/comment/' + weddingId, {
    page: page,
    size: size
  })
}

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