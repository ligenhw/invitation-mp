 
function getHeader() {
  if (wx.getStorageSync('token')) {
    return {
      'content-type': 'application/json',
      'x-token': wx.getStorageSync('token')
    }
  }
  return {
    'content-type': 'application/json'
  }
}
 
function showErrToast(e) {
  wx.showToast({
    title: "error",
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
        } else {
          reject(res.data)
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
