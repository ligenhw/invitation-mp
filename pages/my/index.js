// pages/my/index.js
import api from '../../invitation/api'
import { pv, cli } from "../../starry/collctApi";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners: [
      'http://oss.bestlang.cn/invitation/banner/CR2A6780.jpg',
      'http://oss.bestlang.cn/invitation/banner/CR2A6964.jpg',
      'http://oss.bestlang.cn/invitation/banner/CR2A6985.jpg',
      'http://oss.bestlang.cn/invitation/banner/CR2A7059.jpg',
      'http://oss.bestlang.cn/invitation/banner/CR2A7210.jpg',
      'http://oss.bestlang.cn/invitation/banner/CR2A7099.jpg'
    ],
    weddings: [
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    var weddings = await api.queryUserWedding()

    this.setData({
      weddings: weddings
    })

    wx.hideShareMenu({})
  },

  createWedding() {
    cli('createWedding')
    
    wx.navigateTo({
      url: '/pages/editor/index',
    })
  },

  async onDelete(e) {

    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
     success: async sm => {
        if (sm.confirm) {
            var wedding = e.currentTarget.dataset.content;
            console.log('onDelete', wedding)
            await api.deleteWedding(wedding.id)
            await this.onShow()
          } else if (sm.cancel) {
            console.log('用户点击取消')
          }
        }
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    pv('my')
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
  onPullDownRefresh: async function () {
    var weddings = await api.queryUserWedding()

    this.setData({
      weddings: weddings
    })

    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  onShareAppMessage: function (res) {
    const wedding = res.target.dataset.content
    cli('shareMyWedding-' + wedding.id)

    return {
      title: wedding.groom.name + ' ❤️ ' + wedding.bride.name + ' 邀请您参加我们的婚礼 🎉🎉🎉',
      path: '/pages/post/index?weddingId=' + wedding.id
    }
  }
})