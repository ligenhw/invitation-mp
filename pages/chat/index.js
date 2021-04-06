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
      demoData: false,
      bless: false,
      commentList: [],
      inputValue: '',
      page: 0
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function(options) {
      const weddingId = options.weddingId || app.globalData.weddingId
      app.globalData.weddingId = weddingId
      if (weddingId === '1') {
        this.setData({
          demoData: true
        })
      }

      var comment = await api.queryComment(weddingId, 0, size)
      this.setData({
        commentList: comment.content
      })
    },

    onPublish: async function() {
      if (this.data.inputValue.trim().length === 0) {
        wx.showToast({
          title: '请输入留言内容!',
          icon: 'none'
        })
        return
      }

      await api.createComment(app.globalData.weddingId, this.data.inputValue)

      const comment = await api.queryComment(app.globalData.weddingId, 0, size)
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

      const comment = await api.queryComment(app.globalData.weddingId, nextPage, size)
      const appendComment = this.data.commentList.concat(comment.content)
      this.setData({
        commentList: appendComment,
        page: nextPage
      })
    },
    bindKeyInput: function(e) {
        this.setData({
            inputValue: e.detail.value
        })
    },
    bless() {
      this.setData({
        bless: true
      })
    }
})