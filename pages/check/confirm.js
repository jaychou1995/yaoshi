// pages/check/confirm.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSuccess: false,
    showFail: false
  },
  confirm() {
    let pages = getCurrentPages() //获取当前页面js里面的pages里的所有信息。
    console.log(pages);
    let prevPage = pages[ pages.length - 3 ] //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
    prevPage.route === 'pages/check/reason' &&
    this.setData({
      showFail: true
    })
    prevPage.route === 'pages/check/detail' &&
    this.setData({
      showSuccess: true
    })

  },
  getData(){
    let {access_token} = getApp().globalData
    let parasm = {
      preId: this.data.preId,
      access_token
    }
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options){
      this.data.preId = options.preId
    }
    this.getData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  }
})