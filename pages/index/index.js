// pages/index/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    userInfo: wx.getStorageSync('userInfo'),
    APPNAME: getApp().globalData.APPNAME
  },
  toCheck(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  inputChange(e) {
    let { input } = e.currentTarget.dataset
    this.setData({
      [input]: e.detail
    })
  },
  failAuthorize() {
    this.setData({
      isAuthorizeShow: true
    })
  },
  agreeAuthorize() {
    this.setData({
      isAuthorizeShow: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    getApp()
      .wxLogin()
      .then(function (res) {
        if (res.userInfo.id) {
          that.setData({
            userInfo: wx.getStorageSync('userInfo'),
            show: true
          })
        } else {
          wx.clearStorage()
          wx.reLaunch({
            url: '/pages/entry/entry'
          })
        }
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}
})
