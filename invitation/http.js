
function getHeader() {
  if (wx.getStorageSync('cookie')) {
    return {
      'content-type': 'application/json',
      'cookie': getCookie('SESSION')
    }
  }
  return {
    'content-type': 'application/json'
  }
}
 
function showErrToast(e) {
  wx.showToast({
    title: e.data.msg,
    icon: 'none',
    duration: 1500
  })
}
 
function getPromise(url, data, method) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${url}`,
      header: getHeader(),
      method: method,
      data: data,
      success: function(res) {
        if (res.statusCode === 200) {
          resolve(res.data)
          handleCookie(res.cookies)
        } else {
          handleError(res, reject)
        }
      },
      fail: function(err) {
        reject(err)
      }
    })
  }).catch(function(e) {
    console.error(e)
    showErrToast(e)
  })
}

const handleCookie = cookies => {
  if (cookies instanceof Array && cookies.length > 0) {
    console.log('handleCookie : ', cookies)
    wx.setStorageSync('cookie', cookies)
  }
}

const getCookie = key => {
  let cookies = wx.getStorageSync('cookie')
  if (cookies instanceof Array && cookies.length > 0) {
    let keyCookie = cookies.map(c => reMatch(c)).filter(o => o.key === key)

    if (keyCookie.length > 0) {
      return keyCookie[0].key + '=' + keyCookie[0].value
    }
  }
}

const reMatch = cookie => {
  let re = /([^=]*)=([^;]*)/
  let result = cookie.match(re)
  return {
    key: result[1],
    value: result[2]
  }
}

const handleError = (res, reject) => {
  if (res.statusCode === 403 && res.data.code === 'Unauthorized') {
    wx.navigateTo({
      url: '/pages/login/index',
    })
  } else {
    reject(res)
  }
}
 
const http = {
  get: function(url, data) {
    return getPromise(url, data, 'GET')
  },
  post: function(url, data) {
    return getPromise(url, data, 'POST')
  },
  put: function(url, data) {
    return getPromise(url, data, 'PUT')
  },
  delete: function(url, data) {
    return getPromise(url, data, 'DELETE')
  }
}

export default http
