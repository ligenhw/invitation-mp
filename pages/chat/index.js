// pages/chat/index.js
import api from '../../invitation/api'
import { pv } from "../../starry/collctApi"

const app = getApp()
const size = 10

Page({
    /**
     * 页面的初始数据
     */
    data: {
      commentList: [],
      inputValue: '',
      page: 0
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function(options) {
      var comment = await api.queryComment(0, size)
      this.setData({
        commentList: comment.content
      })
    },

    onPublish: async function() {
      await api.createComment(this.data.inputValue)

      const comment = await api.queryComment(0, size)
      this.setData({
        commentList: comment.content,
        page: 0,
        inputValue: ''
      })
      wx.pageScrollTo({
        scrollTop: 0,
      })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: async function () {
      pv('comment')
    },

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
      const nextPage = this.data.page + 1

      const comment = await api.queryComment(nextPage, size)
      const appendComment = this.data.commentList.concat(comment.content)
      this.setData({
        commentList: appendComment,
        page: nextPage
      })
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