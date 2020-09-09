// pages/check/index.js
import { getPharList } from '../../api/api'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    total: '',
    pageNum: 1,
    pageSize: 30
  },
  toDetail(e) {
    let { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/check/detail?id=' + id
    })
  },
  async getList() {
    let { id } = getApp().globalData.userInfo
    let { pageNum, pageSize } = this.data
    let params = {
      pharmacistId: 0,
      pageNum,
      pageSize,
      status: 1
    }
    try {
      let result = await getPharList(params)
      let dataList = this.data.dataList.concat(result.records)
      this.setData({
        total: result.total,
        dataList
      })
    } catch (error) {
      console.log(error)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
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
  onPullDownRefresh: function () {
    this.data.pageNum += 1
    this.getList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {}
})
