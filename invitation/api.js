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

const queryUser = () => {
  return http.get(basePath + '/user')
}

const queryOpenId = code => {
  return http.get(basePath + `/openId?code=${code}`)
}

const queryBanner = () => {
  return http.get(basePath + `/banner`)
}

const createGift = (gift) => {
  return http.post(basePath + '/gift', gift)
}

const queryGift = (tag) => {
  return http.get(basePath + `/gift?tag=${tag}`)
}

const deleteGift = (giftId) => {
  return http.delete(basePath + '/gift/' + giftId)
}

module.exports = {
  wedding,
  queryComment,
  createComment,
  login,
  createWedding,
  queryUserWedding,
  deleteWedding,
  queryUser,
  queryOpenId,
  queryBanner,
  createGift,
  queryGift,
  deleteGift
}