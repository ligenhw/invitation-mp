import http from '../../invitation/http'
import api from '../../invitation/api'

Page({
  data: {
    markers: [],
    showLocation: true
  },
  onNavigation: function() {
    wx.openLocation({
      latitude: this.data.wedding.address.latitude,  // 要去的地址经度，浮点数
      longitude:this.data.wedding.address.longitude,  // 要去的地址纬度，浮点数
      name: this.data.wedding.address.text
    })
  },
  async onLoad() {
    var wedding = await http.get(api.wedding)
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
  }
})