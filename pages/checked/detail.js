// pages/checked/detail.js
import { getDetail } from '../../api/api'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    APPNAME: getApp().globalData.APPNAME
  },
  back() {
    wx.navigateBack({
      delta: 1
    })
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
  async getDetail() {
    let params = {
      preId: this.data.id
    }
    try {
      const result = await getDetail(params)

      // 通过微信小程序自带方法将base64转为二进制去除特殊符号，再转回base64
      let sign = wx.arrayBufferToBase64(wx.base64ToArrayBuffer(result.sign))
      // 拼接请求头，data格式可以为image/png或者image/jpeg等，看需求
      if (sign) {
        sign = 'data:image/png;base64,' + sign
      }
      let pharmacistCa = wx.arrayBufferToBase64(wx.base64ToArrayBuffer(result.pharmacistCa))
      if (pharmacistCa) {
        pharmacistCa = 'data:image/png;base64,' + pharmacistCa
      }
      const diags = JSON.parse(result.diag)
      let diagsValue = ''
      diags.forEach((item) => {
        diagsValue += item.diagnosis + '，'
      })
      diagsValue = diagsValue.substr(0, diagsValue.length - 1)
      let date = this.getDate(new Date(result.date.replace(/T/g, ' ').replace(/-/g, '/')))
      let pharmacistCaTime = this.getDate(new Date(result.pharmacistCaTime.replace(/T/g, ' ').replace(/-/g, '/')))
      this.setData({
        result: result,
        pateintInfo: result.pateintInfo,
        drug: result.drug,
        emrInfo: result.emrInfo,
        diagsValue,
        sign,
        date,
        pharmacistCaTime,
        pharmacistCa
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
      this.getDetail()
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
