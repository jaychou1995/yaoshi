// pages/check/reason.js
import { checkPharmacistCa } from '../../api/api'
const reasonList = ['用量超标', '用量太少', '其他']
Page({
  /**
   * 页面的初始数据
   */
  data: {
    reasonList,
    reason: reasonList[0],
    count: 0,
    showAutograph: false,
    errmsg: '',
    presCode: '',
    rejectContent: '',
    password: ''
  },
  bindReasonChange(e) {
    this.setData({
      reason: reasonList[e.detail.value]
    })
  },
  onClose() {
    this.setData({
      showAutograph: false
    })
  },
  wordlimit(e) {
    this.setData({
      count: e.detail.cursor,
      rejectContent: e.detail.value
    })
  },
  setpassword(e) {
    this.setData({
      password: e.detail
    })
  },
  confirm() {
    this.setData({
      showAutograph: true
    })
  },
  async getAutograph() {
    let { rejectContent, pharmacistId, presId, password } = this.data
    let { access_token } = getApp().globalData
    let params = {
      pharmacistId,
      caPwd: password,
      access_token
    }
    try {
      let result = await checkPharmacistCa(params)
      wx.navigateTo({
        url:
          '/pages/check/sign?presId=' +
          presId +
          '&rejectContent=' +
          rejectContent +
          '&password=' +
          password +
          '&pharmacistId=' +
          pharmacistId +
          '&img=' +
          result +
          '&type=2'
      })
    } catch (error) {
      this.setData({
        errmsg: '提示：密码不正确，请重新输入'
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(getApp().globalData.userInfo)
    if (options.presId) {
      this.setData({
        pharmacistId: getApp().globalData.userInfo.id,
        presId: options.presId
      })
    }
    // preId pharmacistId caPwd
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
