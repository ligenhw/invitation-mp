import api from '../../invitation/api'
import { cli } from "../../starry/collctApi";

const app = getApp()

Page({
  data: {
    markers: [],
    showLocation: true
  },
  onNavigation: function() {
    cli('navigation')

    wx.openLocation({
      latitude: this.data.wedding.address.latitude,  // 要去的地址经度，浮点数
      longitude:this.data.wedding.address.longitude,  // 要去的地址纬度，浮点数
      name: this.data.wedding.address.text
    })
  },
  async onLoad(options) {
    const weddingId = options.weddingId || app.globalData.weddingId
    app.globalData.weddingId = weddingId
    var wedding = await api.wedding(weddingId)

    this.setData({
      wedding: wedding
    })
    this.setData({
      markers: [
        {
          id: 1,
          latitude: wedding.address.latitude,
          longitude: wedding.address.longitude,
          iconPath: "../../image/address.png",
          width: 50,
          height: 50
        }
      ]
    })
  },
  callhe() {
    cli('callGroom')

    wx.makePhoneCall({
      phoneNumber: this.data.wedding.groom.tel,
    })
  },
  callshe() {
    cli('callBride')
    
    wx.makePhoneCall({
      phoneNumber: this.data.wedding.bride.tel,
    })
  }
})