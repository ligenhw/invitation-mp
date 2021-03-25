// pages/chat/index.js
import http from '../../invitation/http'
import api from '../../invitation/api'

const app = getApp();
const utils = require('../../utils/util')

Page({
    /**
     * 页面的初始数据
     */
    data: {
      chatNum: 0,
      inputValue: '',
      chatList: [],
      limit: 9,
      skip: 0,
      count: 0,
      loading: false
    },
    async getComment () {
      var comment = await http.get(api.comment)
      this.setData({
        comment: comment
      })
      if (comment.last) {
        // wx.showToast({
        //   title: '已经到底了',
        //   icon: 'none',
        //   duration: 2000
        // })
      } else {
        let chatNum = mainInfo.data.length + this.data.chatNum
        let chatList = this.data.chatList.concat(mainInfo.data)
        this.setData({
          chatNum: chatNum,
          chatList: chatList
        })
        const skip = mainInfo.data.length + this.data.skip
        if (this.data.limit === 9) {
          this.setData({
            limit: 10,
            count: mainInfo.data.length,
            skip: skip
          })
        } else {
          this.setData({
            limit: 9,
            count: mainInfo.data.length,
            skip: skip
          })
        }
      }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function(options) {
      await this.getComment()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: async function () {},

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {
      console.log('onPullDownRefresh')
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: async function () {
      await this.getComment()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
      app.shareHandle();
    },
    bindKeyInput: function(e) {
        this.setData({
            inputValue: e.detail.value
        })
    }
})