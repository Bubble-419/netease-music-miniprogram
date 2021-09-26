// pages/searchRes/searchRes.js
const api = require("../../utils/api");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 搜索关键字
    value: "",
    // 是否展示搜索建议页
    showSuggest: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOpenerEventChannel().on("searchValue", function (data) {
      console.log(data);
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * API函数
   */
  // 综合搜索

})