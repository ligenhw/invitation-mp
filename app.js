// app.js


const oldPage = Page;
Page = function (args) {
  const oldOnShow = args.onShow;
  args.onShow = function (opts) {
    const _self = this;
    if (oldOnShow) {
      oldOnShow.call(_self, opts);
    }
    onLoadTrace.call(_self);
  }

  oldPage(args);
}

import api from './invitation/api'

App({
  async onLaunch() {
    console.log('app onLaunch')
    // 展示本地存储能力
    const openId = wx.getStorageSync('openId')
    if (openId === '') {
      // 登录
      wx.login({
        success: async res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          console.log(res)
          const openIdRes = await api.queryOpenId(res.code)
          console.log(`query openId : ${openIdRes.openid}`)
          this.globalData.openId = openIdRes.openid
          wx.setStorageSync('openId', openIdRes.openid)
        }
      })
    } else {
      this.globalData.openId = openId
    }
  },
  globalData: {
    openId: '',
    weddingId: '1',
    isConnected: false,
    isReConnect: true,
    reConnectLimit: -1,
    msgQueue: [],
    wsUrl: 'wss://bestlang.cn/nanomsg',
    ws: {}
  }
})

import { pv } from "./starry/collctApi";

function onLoadTrace() {
  // 自定义的埋点处理
  const _self = this;
  pv(_self.route)
}