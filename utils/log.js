// 获取实时日志管理器对象
const log = wx.getRealtimeLogManager ? wx.getRealtimeLogManager() : null
// 获取系统信息
const sys = wx.getSystemInfoSync()

let currentPage = ''
const addFilters = () => {
  const pages = getCurrentPages() //获取页面栈
  const lastPage = (pages.pop() || {}).route //获取数组中最后一个页面的页面栈路由
  if (currentPage !== lastPage) {
    currentPage = lastPage
    const data = getApp().globalData
    ;['SDKVersion', 'model', 'platform', 'system', 'version'].map((key) => sys[key] && log.addFilterMsg(sys[key])) //log.addFilterMsg(sys[key]) 添加过滤关键字
    ;['openId', 'unionId', 'userId'].map((key) => data[key] && log.addFilterMsg(data[key]))
  }
}
const getRequireInfo = () => {
  const { SDKVersion, model, platform, system, version } = sys
  const { openId, unionId, userId, userInfo } = getApp().globalData
  const { nickName, realName, gender } = userInfo
  return [
    '[=== systemInfo ===]',
    { SDKVersion, model, platform, system, version },
    '[=== userInfo ===]',
    { openId, unionId, userId, nickName, realName, gender }
  ]
}

export default {
  info() {
    //__wxConfig.envVersion 当前体验版正式版信息
    if (__wxConfig.envVersion === 'develop') return
    if (!log) return
    addFilters()
    log.info.apply(log, [...arguments, ...getRequireInfo()])
  },
  warn() {
    if (__wxConfig.envVersion === 'develop') return
    if (!log) return
    addFilters()
    log.warn.apply(log, [...arguments, ...getRequireInfo()])
  },
  error() {
    if (__wxConfig.envVersion === 'develop') return
    if (!log) return
    addFilters()
    log.error.apply(log, [...arguments, ...getRequireInfo()])
  },
  setFilterMsg(msg) {
    if (__wxConfig.envVersion === 'develop') return
    // 从基础库2.7.3开始支持
    if (!log || !log.setFilterMsg) return
    if (typeof msg !== 'string') return
    addFilters()
    log.setFilterMsg(msg)
  },
  addFilterMsg(msg) {
    if (__wxConfig.envVersion === 'develop') return
    // 从基础库2.8.1开始支持
    if (!log || !log.addFilterMsg) return
    if (typeof msg !== 'string') return
    addFilters()
    log.addFilterMsg(msg)
  }
}