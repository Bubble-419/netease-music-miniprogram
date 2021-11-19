// pages/personalFM/personalFM.js
const api = require("../../utils/api");
const app = getApp();
const bam = app.globalData.bam;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // fm歌曲列表, 只会返回两首歌
    fmSongList: [],
    // 当前播放歌曲的index
    playingIndex: 0,
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
    wx.getStorage({
      key: 'user',
      success: (res) => {
        this.setFM();
        this.setPlayList();
      },
      fail: () => {
        wx.redirectTo({
          url: '../login/login',
        });
      }
    });
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
  /**
   * 切换fm歌曲
   * 由于fm列表里只有3首歌，当playingIndex等于列表长度-1时，就要重新请求
   * 切换歌曲时封面要有一个过渡动画
   */
  onSwitchSong: function () {
    console.log('switch');
    if (this.data.playingIndex === this.data.fmSongList.length - 1) {
      this.setFM();
      this.setData({
        playingIndex: 0
      })
    } else {
      this.setData({
        playingIndex: this.data.playingIndex + 1,
      })
    }
    this.initBackgroundAudioManager();
  },
  initBackgroundAudioManager: function () {
    api.getSongUrl({
      id: this.data.fmSongList[this.data.playingIndex].id
    }).then(res => {
      if (res.data.code === 200 && res.data.data[0].url) {
        let currSong = this.data.fmSongList[this.data.playingIndex];
        bam.src = res.data.data[0].url;
        // 给实例的其他属性值赋值
        bam.title = currSong.name;
        bam.epname = currSong.album.name;
        bam.coverImgUrl = currSong.album.picUrl;
        bam.singer = currSong.artists[0].name;
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
          this.onSwitchSong();
        });
      }
    })
  },
  /**
   * 事件处理函数
   */
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

  // 
  /**
   * API函数
   */
  setFM: function () {
    api.getFM({}).then(res => {
      if (res.data.code === 200) {
        this.setData({
          fmSongList: res.data.data
        });
        console.log(this.data.fmSongList);
        this.initBackgroundAudioManager();
      }
    })
  }
})