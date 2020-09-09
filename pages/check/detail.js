// pages/check/detail.js
import { getDetail, checkPharmacistCa } from '../../api/api'
import Tips from '../../utils/Tips'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showAutograph: false,
    errmsg: '', //提示：密码不正确，请重新输入
    password: '',
    APPNAME: getApp().globalData.APPNAME
  },
  adopt() {
    this.setData({
      showAutograph: true
    })
  },
  onClose() {
    this.setData({
      showAutograph: false
    })
  },
  setpassword(e) {
    this.setData({
      password: e.detail
    })
  },
  reject() {
    wx.navigateTo({
      url: '/pages/check/reason?presId=' + this.data.result.presId
    })
  },
  formatTime(date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    const formatNumber = (n) => {
      n = n.toString()
      return n[1] ? n : '0' + n
    }

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  },
  getDate(date, type = 3) {
    const d = new Date(date)
    const y = d.getFullYear()
    const m = d.getMonth() + 1
    const day = d.getDate()
    const H = d.getHours()
    const M = d.getMinutes()
    const s = d.getSeconds()
    function add0(num) {
      return num > 9 ? num : '0' + num
    }
    const ymd = `${y}-${add0(m)}-${add0(day)}`
    const hm = `${add0(H)}:${add0(M)}`
    let str = ''
    switch (type) {
      case 1:
        str = ymd
        break
      case 2:
        str = ymd + ' ' + hm
        break
      case 3:
        str = ymd + ' ' + hm + ':' + add0(s)
    }
    return str
  },
  async getAutograph() {
    let { pharmacistId, password } = this.data
    let presId = this.data.result.presId
    let params = {
      pharmacistId,
      caPwd: password
    }
    try {
      let result = await checkPharmacistCa(params)
      wx.navigateTo({
        url:
          '/pages/check/sign?presId=' +
          presId +
          '&password=' +
          password +
          '&pharmacistId=' +
          pharmacistId +
          '&img=' +
          result +
          '&type=1'
      })
    } catch (error) {
      this.setData({
        errmsg: '提示：密码不正确，请重新输入'
      })
    }
  },
  async getDetail() {
    let params = {
      preId: this.data.id
    }
    try {
      let result = await getDetail(params)

      // 通过微信小程序自带方法将base64转为二进制去除特殊符号，再转回base64
      let sign = wx.arrayBufferToBase64(wx.base64ToArrayBuffer(result.sign))
      // 拼接请求头，data格式可以为image/png或者image/jpeg等，看需求
      if (sign) {
        sign = 'data:image/png;base64,' + sign
      }
      const diags = JSON.parse(result.diag)
      let diagsValue = ''
      diags.forEach((item) => {
        diagsValue += item.diagnosis + '，'
      })
      diagsValue = diagsValue.substr(0, diagsValue.length - 1)
      let date = this.getDate(new Date(result.date.replace(/T/g, ' ').replace(/-/g, '/')))
      this.setData({
        result: result,
        pateintInfo: result.pateintInfo,
        drug: result.drug,
        emrInfo: result.emrInfo,
        diagsValue,
        date,
        sign,
        presId: this
      })
    } catch (error) {
      console.log(error)
      Tips.modal(error.message).then((res) => {
        wx.navigateBack({
          delta: 1
        })
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      this.data.id = options.id
      ;(this.data.pharmacistId = getApp().globalData.userInfo.id), this.getDetail()
    }
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
