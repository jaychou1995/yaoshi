// pages/entry/entry.js
import Tips from '../../utils/Tips'
import { getMobileCode, checkPhoneCode, getUserInfo } from '../../api/api'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isLoginShow: true,
    captcha: '',
    phone: '',
    loading: false,
    countDownNum: 60,
    btnshow: true //验证码禁用状态
  },
  inputChange(e) {
    let { input } = e.currentTarget.dataset
    this.setData({
      [input]: e.detail
    })
  },
  async login() {
    const message =
      (!/^1[3456789]\d{9}$/.test(this.data.phone) && '请输入正确的手机号') || (!this.data.captcha && '请输入验证码')
    if (message) return wx.showToast({ title: message, icon: 'none' })
    console.log(getApp().globalData)
    let params = {
      phoneNum: this.data.phone,
      messageCode: this.data.captcha
    }
    try {
      let result = await checkPhoneCode(params)
      result && console.log(result)
      try {
        const { openId } = getApp().globalData

        const userInfo = await getUserInfo({ openId, phoneNumber: this.data.phone })
        getApp().globalData.userInfo = userInfo
        wx.setStorageSync('userInfo', userInfo)
        getApp().getToken()
        Tips.toast('登录成功')
        wx.reLaunch({
          url: '/pages/index/index'
        })
      } catch (error) {
        console.log('err', error)
      }
    } catch (error) {
      console.log('err', error)
      // Tips.toast('验证码错误', 'none')
    }
  },
  async getCaptcha(e) {
    let timer = null
    clearInterval(timer)
    const message = !/^1[3456789]\d{9}$/.test(this.data.phone) && '请输入正确的手机号'
    if (message) return wx.showToast({ title: message, icon: 'none' })
    try {
      let params = {
        mobilePhone: this.data.phone
      }
      // /platform/login/checkPhoneCode
      // /platform/center/requestVerifyPharmacist
      await getMobileCode(params)
      Tips.toast('验证码已发送')
      let countDownNum = this.data.countDownNum
      this.setData({
        btnshow: false
      })

      //验证码倒计时
      timer = setInterval(() => {
        if (countDownNum <= 0) {
          this.setData({
            btnshow: true,
            countDownNum: '60'
          })
          clearInterval(timer)
          return
        } else {
          this.setData({
            countDownNum: countDownNum--
          })
        }
      }, 1000)
    } catch (err) {
      console.log('err', err)
      if (err.code === 10000000) {
        Tips.toast(err.message, 'none')
      }
      if (err.code === 500) {
        Tips.toast('该用户暂无权限', 'none')
      }
    }
  },
  async agreeAuthorize(event) {
    // console.log(event);
    // if (this.data.loading) return
    // if (!event.detail.userInfo) throw
    // this.setData({ loading: true })
    // // let a = event.detail
    // console.log(event.detail);
    // try {
    //   let result = await request.get(`/platform/login/loginByPhone`,params)
    // } catch (error) {
    //   console.error(error)
    // } finally {
    //   this.setData({ loading: false })
    // }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 初始化表单验证规则
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
