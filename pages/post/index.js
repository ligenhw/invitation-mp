// pages/invitation/index.js
import api from '../../invitation/api'
import { pv, cli } from "../../starry/collctApi";
import webScoket from '../../utils/socket'
let stompClient = ''

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    demoData: false,
    musicStatus: false,
    barrageValue: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const weddingId = options.weddingId || app.globalData.weddingId
    app.globalData.weddingId = weddingId
    if (weddingId === '1') {
      this.setData({
        demoData: true
      })
    }

    var wedding = await api.wedding(weddingId)
    this.setData({
      wedding: wedding,
      musicStatus: wedding.audio && wedding.audio.autoPlay || false
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    pv('post')
    
    if (this.data.demoData) {
      return;
    }

    console.log('init Socket')
    Promise.all([webScoket.init(), webScoket.client()]).then(result => {
      stompClient = result[1]
      stompClient.connect({}, () => {
          stompClient.subscribe('/topic/greetings', response => {
            console.log('收到订阅消息', response)
            if (response.body) {
              const res = JSON.parse(response.body)
    
              // 业务逻辑
              console.log('add data', res)
              const color = ['red', 'rgb(0, 255, 0)', '#0000FF']
              const getRandom = (max = 10, min = 0) => Math.floor(Math.random() * (max - min) + min)
              const colorId = getRandom(color.length)
              this.barrage.addData([{
                content: res.content,
                color: color[colorId]
              }]);
            }
          })
        })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('onHide')
    app.globalData.isReConnect = false
    if (stompClient)
      stompClient.disconnect()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('onUnload')
    app.globalData.isReConnect = false
    if (stompClient)
      stompClient.disconnect()
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
    cli('sharePostWedding-' + this.data.wedding.id)

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
  },
  onReady() {
    this.addBarrage()
  },
  addBarrage() {
    const barrageComp = this.selectComponent('.barrage')
    this.barrage = barrageComp.getBarrageInstance({
      font: 'bold 16px sans-serif', // 字体
      duration: 60, // 弹幕时间 （移动 2000px 所需时长）
      lineHeight: 2, // 弹幕行高
      mode: 'overlap', // 弹幕重叠 overlap 不重叠 separate
      padding: [10, 10, 10, 10], // 弹幕区四周
      range: [0, 1],
      tunnelShow: false,
    })
    this.barrage.open()
    // const data = mockData(100)
    // this.barrage.addData(data)
    // this.timer = setInterval(() => {
    //   const data = mockData(100);
    //   this.barrage.addData(data);
    // }, 2000)
  },
  handleInput(e) {
    this.setData({
      barrageValue: e.detail.value,
    })
  },
  handleAddClick(e) {
    cli('barrage')
    
    stompClient.send("/app/hello", {}, JSON.stringify({
      name: this.data.barrageValue
    }));
    this.setData({
      barrageValue: '',
    })
  },
})