const api = require("../../utils/api");
const app = getApp();
const bam = app.globalData.bam;

// pages/playSong/playSong.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 歌曲信息
    song: {},
    // 播放状态
    isPlaying: true,
    // 歌曲总时长（无格式）
    songDuration: '',
    // 歌曲当前秒数（无格式）
    songCurr: '',
    // 进度条状态
    onSlide: false,
    // 歌词状态
    jumpLyc: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setSongDetail(options.ids);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 页面函数
   */

  // 播放或暂停
  play: function () {
    if (this.data.isPlaying) {
      bam.pause();
    } else {
      bam.play();
    }
    this.setData({
      isPlaying: !this.data.isPlaying,
    })
  },

  // 监听进度条组件的拖动事件
  onSildeProg: function () {
    this.setData({
      onSlide: true
    });
  },

  // 监听进度条改变事件
  onChangeProg: function (e) {
    // 改变音频进度
    bam.seek(e.detail.songCurr);
    this.setData({
      songCurr: e.detail.songCurr,
      // 改变歌词进度
      jumpLyc: true,
      onSlide: false
    });
  },

  // 监听歌词跳跃结束事件
  onJumpEnd: function () {
    this.setData({
      jumpLyc: false
    })
  },

  // 监听切歌事件
  onSwitchSong: function (e) {
    let wsl = app.globalData.waitingSongsList;
    let pos = wsl.findIndex(s => {
      return s.id === this.data.song.id
    });
    let target = pos + 1;
    // true:next false:prev
    if (e.detail.flag) {
      // 当前已经是最后一首时，循环播放
      if (target > wsl.length - 1) {
        target = 0;
      }
    } else {
      target = pos - 1;
      // 第一首时，跳到最后一首
      if (target < 0) {
        target = wsl.length - 1;
      }
    }
    let curPages = getCurrentPages();
    curPages[curPages.length - 1].onLoad({
      ids: wsl[target].id
    });
  },

  /**
   * API函数
   */

  // 获取歌曲详情
  setSongDetail: function (ids) {
    api.getSongDetail({
      ids: ids
    }).then(res => {
      if (res.data.code === 200) {
        this.setData({
          song: res.data.songs[0]
        });
        this.initBackgroundAudioManager();
      }
    })
  },

  /**
   * 对音频管理器实例的处理：
   * 1. 通过 wx.getBackgroundAudioManager 获取全局唯一的音频管理器实例，并给它的src赋值为歌曲的src
   * 2. 实例的duration属性可获得音频总长度，currentTime属性可获得当前播放位置，单位都为秒，利用onTimeUpdate()可以实时更新currentTime数据
   * 3. 进度条slider的总长度即为duration属性，同时值和currentTime双向绑定
   * 4. 歌词的滚动：把每一行歌词对应的秒数赋值给其lid，监听currentTime属性时，一旦到了对应秒数，该行高亮并向上滚动
   */
  initBackgroundAudioManager: function () {
    api.getSongUrl({
      id: this.data.song.id
    }).then(res => {
      if (res.data.code === 200 && res.data.data[0].url) {
        bam.src = res.data.data[0].url;
        // 给实例的其他属性值赋值
        bam.title = this.data.song.name;
        bam.epname = this.data.song.al.name;
        bam.coverImgUrl = this.data.song.al.picUrl;
        bam.singer = this.data.song.ar[0].name;
        bam.onTimeUpdate(() => {
          this.setData({
            songDuration: bam.duration,
          });
          if (!this.data.onSlide) {
            this.setData({
              songCurr: bam.currentTime,
            })
          }
        });
        bam.onEnded(() => {
          this.onSwitchSong({
            detail: {
              flag: true
            }
          });
        });
      }
    })
  },
})