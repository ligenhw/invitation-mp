const appData = getApp()
const webScoket = {
  // 创建基于STOMP协议的WebSocket
  client: function () {
    const Stomp = require('./stomp.js').Stomp
    // setInterval是用来发心跳包的，而小程序没有window对象，所以要重新定义
    Stomp.setInterval = (interval, f) => {
      return setInterval(f, interval)
    }
    Stomp.clearInterval = (id) => {
      return clearInterval(id)
    }
    return new Promise((resolve, reject) => {
      try {
        const stompClient = Stomp.over(appData.globalData.ws)
        resolve(stompClient)
      } catch (e) {
        reject(e)
      }
    })
  },
  // 初始化
  init: function (url = '') {
    // 增加全局webscoket配置
    appData.globalData.isConnected = false
    appData.globalData.isReConnect = true // 允许断线重连
    appData.globalData.reConnectLimit = -1 // 断线重连次数，-1不限次数
    appData.globalData.msgQueue = []
    appData.globalData.wsUrl = url || 'wss://bestlang.cn/nanomsg'
    appData.globalData.ws = {
      send: this.sendMsg,
      close: this.disConnect,
      onopen: null,
      onclose: null,
      onmessage: null
    }
    const that = this
    return new Promise((resolve, reject) => {
      //连接
      this.connect({
        success(msg) {
          that.onOpen() // 打开连接
          that.onMsg() //接收数据
          that.onError() //监听连接错误
          that.onClose() // 监听连接是否关闭
          resolve(msg)
        },
        fail(err) {
          reject(err)
        }
      })
    })
  },
  // 创建一个WebSocket连接，params:{url:'String',success:'successCallback',fail:'failCallback'}
  connect: function (params = {}) {
    console.log('connect')
    wx.connectSocket({
      url: appData.globalData.wsUrl,
      success: (msg) => {
        if (params.hasOwnProperty('success')) {
          params.success(msg)
        }
      },
      fail: (err) => {
        if (params.hasOwnProperty('fail')) {
          params.fail(err)
        }
      }
    })
  },
  // 监听WebSocket连接打开事件
  onOpen: function () {
    console.log('onopen')
    wx.onSocketOpen((res) => {
      console.log('WebSocket连接已打开')
      appData.globalData.isConnected = true
      // 执行队列里未发送的任务
      appData.globalData.msgQueue.forEach(item => {
        this.sendMsg(item)
      })
      appData.globalData.msgQueue = []
      appData.globalData.ws.onopen && appData.globalData.ws.onopen()
    })
  },
  // 发送消息
  sendMsg: function (msg) {
    console.log('sendmsg')
    // 如果WebSocket已连接则发送消息
    if (appData.globalData.isConnected) {
      wx.sendSocketMessage({
        data: msg
      })
    } else {
      // WebSocket没有连接将消息放入队列中
      appData.globalData.msgQueue.push(msg)
    }
  },
  // 监听WebSocket接受到服务器的消息事件
  onMsg: function () {
    console.log('onmsg')
    wx.onSocketMessage((res) => {
      console.log('WebSocket收到消息事件：', res)
      appData.globalData.ws.onmessage && appData.globalData.ws.onmessage(res)
    })
  },
  // 监听WebSocket连接错误事件
  onError: (res) => {
    console.log('onerror')
    wx.onSocketError((res) => {
      console.log("WebSocket错误事件：", res)
    })
  },
  // 关闭WebSocket连接
  disConnect: function () {
    console.log('disconnect')
    wx.closeSocket()
  },
  // 监听WebSocket连接关闭事件
  onClose: function () {
    console.log('onclose')
    wx.onSocketClose((res) => {
      console.log('WebSocket连接关闭：', res)
      console.log(new Date())
      appData.globalData.ws.onclose && appData.globalData.ws.onclose(res)
      appData.globalData.isConnected = false
      // 断线重连
      if (appData.globalData.isReConnect) {
        // 调整重连的次数
        if (!appData.globalData.hasOwnProperty('reConnectLimit') || appData.globalData.reConnectLimit === 0) {
          appData.globalData.isReConnect = false
        } else {
          if (appData.globalData.reConnectLimit > 0) {
            appData.globalData.reConnectLimit--
          }
          console.log('剩余重连次数：', appData.globalData.reConnectLimit)
          this.connect({
            fail(err) {
              console.log('重新连接失败：', err)
            }
          })
        }
      }
    })
  }
}

export default webScoket
