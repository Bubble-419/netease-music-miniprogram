// pages/rankList/rankList.js
const api = require("../../utils/api");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    rankList: [],
    rankSimpleList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setRankList();
  },

  // API函数
  setRankList: function () {
    api.getRankList({}).then(res => {
      if (res.data.code === 200) {
        this.setData({
          rankList: res.data.list.filter(val => {
            return val.tracks.length !== 0
          }),
          rankSimpleList: res.data.list.filter(val => {
            return val.tracks.length === 0
          }),
        })
      }
    })
  }
})