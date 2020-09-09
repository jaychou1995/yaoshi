// pages/check/sign.js
import { pressAudit } from '../../api/api'
import Tips from '../../utils/Tips'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    img: ''
  },
  async confirm() {
    let { rejectContent, pharmacistId, presId, password, type } = this.data
    let { access_token } = getApp().globalData
    let params = {
      type,
      rejectContent,
      pharmacistId,
      preId: presId,
      caPwd: password,
      access_token
    }
    console.log(params)
    try {
      await pressAudit(params)
      Tips.success('审核完成').then((res) => {
        // let pages = getCurrentPages()
        // if(pages[pages.length-2].route == 'pages/check/detail'){
        //   wx.navigateBack({
        //     delta: 2
        //   })
        // }else if(pages[pages.length-2].route == 'pages/check/reason'){
        //   wx.navigateBack({
        //     delta: 3
        //   })
        // }
        wx.reLaunch({
          url: '/pages/check/index'
        })
      })
    } catch (error) {
      console.log(error)
      this.setData({
        errmsg: '提示：密码不正确，请重新输入'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options) {
      // 通过微信小程序自带方法将base64转为二进制去除特殊符号，再转回base64
      let img = wx.arrayBufferToBase64(wx.base64ToArrayBuffer(options.img))
      // 拼接请求头，data格式可以为image/png或者image/jpeg等，看需求
      img = 'data:image/png;base64,' + img
      let { presId, rejectContent, password, pharmacistId, type } = options
      this.setData({
        presId,
        rejectContent,
        password,
        pharmacistId,
        type,
        name: getApp().globalData.userInfo.name,
        img
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let pages = getCurrentPages()
    console.log(pages)
    // if(pages[pages.length-2].route == 'pages/check/detail'){
    //   wx.navigateBack({
    //     delta: 2
    //   })
    // }else if(pages[pages.length-2].route == 'pages/check/reason'){
    //   wx.navigateBack({
    //     delta: 3
    //   })
    // }
  },

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
