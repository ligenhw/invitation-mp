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

const createComment = (topic, content) => {
  return http.post(basePath + '/comment', {
    topic: topic,
    content: content
  })
}

const login = (code, userInfo) => {
  return http.post(basePath + '/login', {
    code: code,
    userInfo: userInfo
  })
}

const createWedding = wedding => {
  return http.post(basePath + '/wedding', wedding)
}

const queryUserWedding = () => {
  return http.get(basePath + '/wedding')
}

const deleteWedding = (weddingId) => {
  return http.delete(basePath + '/wedding/' + weddingId)
}

module.exports = {
  wedding,
  queryComment,
  createComment,
  login,
  createWedding,
  queryUserWedding,
  deleteWedding
}