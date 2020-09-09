import dayjs from 'dayjs'
import log from './log'

const showLog = (option, request, response) => {
  const { $devtools, $vconsole, $consoleColor, APIHOST } = getApp().globalData
  const message = response.message
  ;/(error|fail)/.test(option.tag) && message && wx.showToast({ title: message, duration: 2000, icon: 'none' })

  $devtools && console.group(`[${request.method}]${request.url.replace(APIHOST, '')}`)

  switch (option.tag) {
    case 'success':
      log.info('[request-success]', request)
      if ($devtools) {
        // console.log(`%c${option.times.join('\n')}`, `color:${$consoleColor.yellow}`)
        request.data && console.log('%c[params]', `color:${$consoleColor.blue}`, request.data)
        console.log('%c[result]', `color:${$consoleColor.green}`, response.result || response)
      }
      if ($vconsole) {
        console.debug(`[${request.method}]${request.url}`)
        // console.debug(`${option.times.join('\n')}`)
        request.data && console.debug('[params]', request.data)
        console.debug('[result]', response.result || response)
      }
      break
    case 'error':
      log.warn(`[request-warn-${option.networkType}]`, request, response)
      if ($devtools) {
        console.log(`%c${option.times.join('\n')}`, `color:${$consoleColor.yellow}`)
        request.data && console.log('%c[params]', `color:${$consoleColor.red}`, request.data)
        console.log('%c[code]', `color:${$consoleColor.red}`, response.code || response.error)
        console.log('%c[message]', `color:${$consoleColor.red}`, response.message)
        console.log('%c[result]', `color:${$consoleColor.red}`, response.result || response)
      }
      if ($vconsole) {
        console.error(`[${request.method}]${request.url}`)
        console.debug(`${option.times.join('\n')}`)
        request.data && console.debug('[params]', request.data)
        console.debug('[code]', response.code || response.error)
        console.debug('[message]', response.message)
        console.debug('[result]', response.result || response)
      }
      break
    case 'fail':
      log.error(`[request-fail-${option.networkType}]`, request, response)
      if ($devtools) {
        console.log(`%c${option.times.join('\n')}`, `color:${$consoleColor.yellow}`)
        request.data && console.log('%c[params]', `color:${$consoleColor.red}`, request.data)
        console.log('%c[fail]', `color:${$consoleColor.red}`, response)
      }
      if ($vconsole) {
        console.error(`[${request.method}]${request.url}`)
        console.debug(`${option.times.join('\n')}`)
        request.data && console.debug('[params]', request.data)
        console.debug('[fail]', response)
      }
      break
  }
  $devtools && console.groupEnd()
}

const request = (options) =>
  new Promise(async (resolve, reject) => {
    try {
      Object.keys(options || {}).map((key) => !options[key] && delete options[key])
      const { APIHOST } = getApp().globalData

      options.url = (/^http(s)?\:\/\//.test(options.url) && options.url) || `${APIHOST}${options.url}`
      const noTokenUrl = [`/mnLogin`, `/mnInfo`, `/oauth/token`, `/requestVerifyPharmacist`, `/login/checkPhoneCode`]
      if (!noTokenUrl.some((item) => new RegExp(item).test(options.url))) {
        const { access_token } = getApp().globalData || ''
        options.data.access_token = access_token
      }
      options.header = {
        ...options.header,
        identity: '2',
        'Content-type': 'application/x-www-form-urlencoded'
      }
      console.log(options)
      getApp().loading(1)

      // ["[request] 11h 13m 29s 184ms"]
      const format = ' H[h] m[m] s[s] SSS[ms]'
      const times = [dayjs().format(`[[request]]${format}`)]

      const networkType = await new Promise((resolve) =>
        //获取网络类型
        wx.getNetworkType({
          success: ({ networkType }) => resolve(networkType),
          fail: (error) => resolve(error)
        })
      )

      wx.request({
        ...options,
        success: async ({ data }) => {
          if (data.error === 'invalid_token') {
            wx.removeStorageSync({
              key: 'access_token'
            })
            getApp().globalData.access_token = null
            await getApp().getToken()
            wx.showToast({ title: '登录失效,重新登录中', duration: 2000, icon: 'none' })
            setTimeout(() => {
              wx.reLaunch({
                url: '/pages/index/index'
              })
            }, 2000)
            return
          }
          if (data.code === 1404) {
            console.log('该微信尚未登录,请进行登录')
            const { unionid, openid, sessionKey } = data.result || {}
            Object.assign(getApp().globalData, {
              unionId: unionid,
              openId: openid,
              sessionKey
            })
            wx.setStorageSync('unionId', unionid)
            wx.setStorageSync('openId', openid)
            wx.setStorageSync('sessionKey', sessionKey)
            // wx.clearStorage()
            wx.reLaunch({
              url: '/pages/entry/entry'
            })
            reject(data)
          }
          if (data.error || (data.code !== 0 && data.code != 200 && data.code != 1200 && data.code != null)) {
            times.push(dayjs().format(`[[error]]${format}`))
            showLog({ tag: 'error', times, networkType }, options, data)
            reject(data)
          } else {
            times.push(dayjs().format(`[[success]]${format}`))
            showLog({ tag: 'success', times, networkType }, options, data)
            resolve(data.result !== undefined ? data.result : data)
          }
        },
        fail: (error) => {
          times.push(dayjs().format(`[[fail]]${format}`))
          showLog({ tag: 'fail', times, networkType }, options, error)
          reject(error)
        },
        complete: () => getApp().loading(-1)
      })
    } catch (error) {
      reject(error)
    }
  })

/**
 * request
 * @param url URL地址
 * @param data 传参数据
 * @param header 请求头设置
 *
 * 使用方法
 * import request from '../../utils/request'
 *
 * request.get(url, [data], [header])
 * request.post(url, [data], [header])
 * ......
 */

export default {
  get: (url, data, header) => request({ url, method: 'GET', data, header }),
  post: (url, data, header) => request({ url, method: 'POST', data, header })
}
