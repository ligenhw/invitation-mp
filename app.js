// app.js

import { pv } from "./starry/collctApi";

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

function onLoadTrace() {
  // 自定义的埋点处理
  const _self = this;
  pv(_self.route)
}


App({
  async onLaunch() {
    console.log('app onLaunch')
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res)
      }
    })
  },
  globalData: {
    weddingId: '1',
    isConnected: false,
    isReConnect: true,
    reConnectLimit: -1,
    msgQueue: [],
    wsUrl: 'wss://bestlang.cn/nanomsg',
    ws: {}
  }
})
