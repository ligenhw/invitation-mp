// pages/invitation/index.js
import http from '../../invitation/http'
import api from '../../invitation/api'

const app = getApp()

var touchDot = 0;//触摸时的原点  
var time = 0;// 时间记录，用于滑动时且时间小于1s则执行左右滑动 
var interval = "";// 记录/清理时间记录 
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
    var wedding = await http.get(api.wedding)
    this.setData({
      wedding: wedding
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
    app.shareHandle();
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