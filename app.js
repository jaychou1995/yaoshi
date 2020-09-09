//app.js
import request from 'utils/request'
import { login, getToken } from './api/api'

const $devtools = /devtools/i.test(__wxConfig.platform) // 编辑器环境
const $vconsole = !$devtools && __wxConfig.debug // 真机且debug模式
const $consoleColor = {
  green: '#87d068',
  red: '#f50',
  blue: '#2db7f5',
  yellow: '#faad14',
  pink: '#eb2f96'
}

const SUB =
  {
    develop: 'https://consult.gxmuyfy.cn:2443', // 开发版
    trial: 'https://consult.gxmuyfy.cn:2443', // 体验版
    release: 'https://consult.gxmuyfy.cn:2443' // 线上版
  }[__wxConfig.envVersion] || ''

const APIHOST = 'https://consult.gxmuyfy.cn:2443'
// https://consult.healthan.net

App({
  globalData: {
    $devtools,
    $vconsole,
    $consoleColor,

    APPNAME: '广西医科大第一附属医院',

    APIHOST,

    appId: __wxConfig.accountInfo.appId,
    unionId: wx.getStorageSync('unionId'),
    openId: wx.getStorageSync('openId'),
    sessionKey: wx.getStorageSync('sessionKey'),
    userInfo: wx.getStorageSync('userInfo'),
    access_token: wx.getStorageSync('access_token')
  },
  onLaunch: function () {},

  loading(value) {
    this.globalData.loadingCount = Math.max(0, (this.globalData.loadingCount || 0) + value)
    const { loadingCount } = this.globalData
    loadingCount === 1 && wx.showNavigationBarLoading()
    loadingCount === 0 && wx.hideNavigationBarLoading()

    // loadingCount === 1 && Tips.loading()
    // loadingCount === 0 && Tips.loaded()
  },

  /**
   *  微信小程序用户登录
   */
  promiseWxLogin: null,
  wxLogin() {
    const { appId } = this.globalData
    return (
      this.promiseWxLogin ||
      (this.promiseWxLogin = new Promise((resolve, reject) =>
        wx.login({
          success: async ({ code, errMsg }) => {
            if (code) {
              try {
                const userInfo = await login({ code })
                Object.assign(this.globalData, {
                  userInfo
                })
                wx.setStorageSync('userInfo', userInfo)
                this.getToken()
                resolve(this.globalData)
              } catch (error) {
                error.code === 1404 && wx.hideToast()
                delete this.promiseWxLogin
              }
            } else {
              delete this.promiseWxLogin
              console.log('wx.login-errMsg:', errMsg)
              reject(errMsg)
            }
          },
          fail: (error) => {
            delete this.promiseWxLogin
            console.log('wx.login-fail:', error)
            reject(error)
          }
        })
      ))
    )
  },
  async getToken() {
    let { mobilePhone } = this.globalData.userInfo
    let params = {
      client_id: 'pharmacist-client',
      client_secret: 'pharmacist-client-app',
      grant_type: 'password',
      password: 'waixingren',
      scope: 'auth',
      username: mobilePhone
    }
    try {
      let result = await getToken(params)
      if (result) {
        Object.assign(this.globalData, {
          access_token: result.access_token
        })
        wx.setStorageSync('access_token', result.access_token)
      }
    } catch (error) {
      console.log('获取token失败' + error)
    }
  }
})
