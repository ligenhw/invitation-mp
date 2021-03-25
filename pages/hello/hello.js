
var api = require('../../invitation/api.js')

Page({
  onShareAppMessage() {
    return {
      title: 'invitation',
      path: 'page/hello/hello'
    }
  },
  onLoad: async function() {
    console.log('onLoad')
    wx.request({
      url: api.wedding,
      success: res => {
        if (200 == res.statusCode) {
          console.log(res.data)
          this.setData({ wedding: res.data})

          // this.playMusic(res.data.audio)
        }
      }
    })
  },
  onShow: function() {
    console.log("onShow")
  },
  playMusic(audio) {
    wx.playBackgroundAudio({
      dataUrl: audio.url,
      title: audio.name
    })
  }
})