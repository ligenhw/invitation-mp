import api from '../../invitation/api'
import { cli } from "../../starry/collctApi";

const app = getApp()

Page({
  data: {
    videoList: {
      videos: []
    },
  },
  async onLoad(options) {
    const videoListId = options.videoListId || '606ad8a2c9eb4e2ef28563ce'
    var videoList = await api.queryVideoList(videoListId)
    this.setData({
      videoList
    })

    console.log(videoList)
  },

  onShareAppMessage() {
    return {
      title: this.data.videoList.title,
      path: '/pages/video/video?videoListId=' + this.data.videoList.id
    }
  },

  onHide() {

  },

  bindInputBlur(e) {
    this.inputValue = e.detail.value
  },
  toComment() {
    app.globalData.weddingId = this.data.videoList.id
    wx.switchTab({
      url: '/pages/chat/index',
    })
    cli('videoListComment')
  },
  videoErrorCallback(e) {
    console.log('视频错误信息:')
    console.log(e.detail.errMsg)
  }
})