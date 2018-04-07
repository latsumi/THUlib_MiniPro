// pages/info/dutyForm.js
var util = require('../../utils/util.js');  
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    persons: [
      "吴智光 邵宗义 于洋懿 张雨萌 李焕星",
      "萧霭静 盛忠凯 李颖柯 郭一橙 俞发磊 耿耀君 孙立猛",
      "陈九成 王杰 马晓辉 郑在文 张丁月 杨哲 王玉 冉林鑫",
      "周杰伦 林俊杰 潘玮柏 陈奕迅",

      "周磊 次仁曲吉 葛书源 涂俊 李璐效",
      "2",
      "3",
      "4",

    ],
    week: ["周一","周二","周三","周四","周五","周六","周日"],
    classes: ["早班   8:00-9:30", "午班 13:00-15:00", "晚一 18:00-20:00", "晚二 20:10-22:10",],
    classesHoliday: ["早班  9:00-11:00", "午班 15:00-17:00",],
  },
    currentDay: '', //当天星期

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var date = new Date();
    var day = date.getDay();
    this.setData({
      currentDay: day,
    }); 

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
    if (app.globalData.authority < 1) {
      wx.showModal({
        title: '请先登录',
        content: '大哥你谁啊？',
        confirmText: '去登录',
        showCancel: false,
        success(res) {
          wx.switchTab({
            url: '../me/me',
          })
        }
      })
    }
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