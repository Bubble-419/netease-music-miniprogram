App({
  globalData: {
    uid: wx.getStorageSync("user").uid,
    // 待播列表
    waitingSongsList: [],
    bam: wx.getBackgroundAudioManager(),
  }
})