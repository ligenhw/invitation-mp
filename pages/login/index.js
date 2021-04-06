// index.js
import { pv } from "../../starry/collctApi";
import api from '../../invitation/api'

// 获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData: wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName') // 如需尝试获取用户信息可改为false
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {

  },
  login() {
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log('wx.getUserProfile : ', res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })

        this.invitationLogin(res.userInfo)
      }
    })
  },
  invitationLogin(userInfo) {
    wx.login({
      success: async res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log('wx.login : ', res, userInfo)
        await api.login(res.code, userInfo)
        console.log('invitationLogin login finish')

        // TODO: 不显示
        wx.showToast({
          title: '登陆成功',
          icon: 'none',
          duration: 1500
        })
        wx.navigateBack()
      }
    })
  },
  onShow() {
    pv('login')
  }
})
