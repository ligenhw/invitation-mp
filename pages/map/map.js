Page({
  onNavigation: function() {
    wx.openLocation({
      latitude: 40.457256,  // 要去的地址经度，浮点数
      longitude:124.06639,  // 要去的地址纬度，浮点数
      name: '凤城宾馆'
    })
  }
})