const host = 'https://bestlang.cn'
const basePath = host + '/api'
const collect = basePath + '/collect'

const pv = name => {
  let data = {
    app: 'invitation-mp',
    uid: 'test',
    ts: new Date().getTime(),
    url: name,
    evt: 'pv'
  }

  wx.request({
    url: collect + '?' + qs(data),
    method: 'POST',
    success: res => {
      console.log('data', data , ' log collect success ')
    },
    fail: res => {
      console.error('data', data , ' log collect failed')
    }
  })
}

const qs = obj =>  {
  let arr = [];
  for (var o in obj) {
    arr.push(encodeURIComponent(o) + "=" + encodeURIComponent(obj[o]));
  }
  return arr.join("&");
}

module.exports = {
  pv
}