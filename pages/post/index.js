// pages/invitation/index.js
import api from '../../invitation/api'
import { pv } from "../../starry/collctApi";

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    musicStatus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const weddingId = options.weddingId || 1
    app.globalData.weddingId = weddingId

    var wedding = await api.wedding(weddingId)
    this.setData({
      wedding: wedding,
      musicStatus: wedding.audio.autoPlay || false
    })

    //创建动画
    var animation = wx.createAnimation({
      duration: 3600,
      timingFunction: "ease",
      delay: 600,
      transformOrigin: "50% 50%",
    })
    animation.scale(0.9).translate(10, 10).step();     //边旋转边放大

    //导出动画数据传递给组件的animation属性。
    this.setData({
      animationData: animation.export(),
    })

    // 播放背景音乐
    if (this.data.musicStatus) {
      wx.playBackgroundAudio({
        dataUrl: this.data.wedding.audio.url,
        title: this.data.wedding.audio.name
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    pv('post')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.wedding.groom.name + ' ❤️ ' + this.data.wedding.bride.name + ' 邀请您参加我们的婚礼 🎉🎉🎉',
      path: '/pages/post/index?weddingId=' + this.data.wedding.id
    }
  },
  play: function (event) {
    if (this.data.musicStatus) {
      wx.pauseBackgroundAudio();
      this.setData({
        musicStatus: false
      })
    } else {
      wx.playBackgroundAudio({
        dataUrl: this.data.wedding.audio.url,
        title: this.data.wedding.audio.name
      })
      this.setData({
        musicStatus: true
      })
    }
  }
})