const api = require("../../utils/api");
const util = require("../../utils/util");

// pages/playSong/playSong.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 歌曲信息
    song: {},
    // 是否喜欢歌曲
    like: false,
    //歌曲评论数展示
    commentNum: '',
    // 播放状态
    isPlaying: true,
    // 歌曲总时长（格式为[00:00]）
    songDurationShow: '',
    // 歌曲当前秒数（格式为[00:00]）
    songCurrShow: '',
    // 歌曲总时长（无格式）
    songDuration: '',
    // 歌曲当前秒数（无格式）
    songCurr: '',
    // 是否显示歌词
    showLyrics: false,
    // 歌词数组
    lyrics: [],
    // 歌词滚动top值
    scrollVal: 0,
    // 当前歌词index
    lyricIndex: 0,
    // 控制进度条滑动
    onSlide: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setSongDetail(options.ids);
    this.setLike(options.ids);
    this.setCommentInfo(options.ids);
    this.setLyrics(options.ids);
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
    const bam = wx.getBackgroundAudioManager();
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
   * 对歌词的处理
   * 响应结果的歌词是一个字符串，最终要转化成一个歌词对象的数组，歌词对象包括lid和lrc两个属性值
   * lid表示该句歌词对应的秒数，lrc表示这句歌词的字符串
   * 处理思路：
   * 1. 利用split方法把歌词按照"\n"分隔成字符串数组，注意数组的最末元素是一个空字符串，需要处理掉
   * 2. 通过indexOf()获得']'所在下标，分割字符串
   */
  formatLyrics: function (lrc) {
    let lrcArr = lrc.split("\n");
    lrcArr.pop();
    let res = [];
    for (let lyric of lrcArr) {
      let pos = lyric.indexOf(']');
      let lid = util.formatLyc(lyric.slice(1, pos));
      if (pos !== -1) {
        res.push({
          lid,
          lrc: lyric.slice(pos + 1)
        })
      }
    }
    return res;
  },
  // 对评论徽标的处理
  getCommentNum: function (total) {
    if (total > 999) {
      return '999+';
    } else if (total > 9999) {
      return '1w+';
    } else {
      return total;
    };
  },
  // 点击切换专辑封面和歌词
  changePlayer: function () {
    this.setData({
      showLyrics: !this.data.showLyrics,
    })
  },
  // 跳转去评论页面
  goToComments: function () {
    wx.navigateTo({
      url: `../comments/comments?itemId=${this.data.song.id}&type=0`,
    });
  },
  // 拖动进度条,拖动时会有闪回
  sildeProg: function () {
    this.setData({
      onSlide: true
    });
  },
  // 改变歌曲进度，可以通过拖动进度条或者滚动歌词触发，传参为歌曲时间的终值
  changeSongProg: function (songCurr) {
    const bam = wx.getBackgroundAudioManager();
    // 改变音频进度
    bam.seek(songCurr);
    this.setData({
      songCurr
    });
    // 改变歌词进度，要使得lyricIndex和scrollVal跳到正确地方
    let lyricIndex = this.data.lyrics.findIndex((lyc, index, lycs) => {
      return lyc.lid < songCurr && lycs[index + 1].lid > songCurr;
    });
    this.setData({
      scrollVal: lyricIndex * 34,
      lyricIndex,
    });
  },
  // 拖动进度条触发
  changeProg: function (e) {
    this.changeSongProg(e.detail.value);
    this.setData({
      onSlide: false,
    })
  },
  /**
   * 处理歌词跳动：参数为当前歌词所在index以及要跳动的行数
   * 歌词跳动有两种情况：
   * 1. 随着音乐播放自动跳向下一行
   * 2. 在歌词界面拉动或者拖动进度条，跳到别的地方，歌词随音乐变化
   * 如果要做歌词滚动的话，不用scroll-view的事件，要新增一个app那样的播放键，再绑定事件，等有空再写！！
   */
  dumpLyric: function (e) {
    console.log(e);
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
        const bam = wx.getBackgroundAudioManager();
        bam.src = res.data.data[0].url;
        // 给实例的其他属性值赋值
        bam.title = this.data.song.name;
        bam.epname = this.data.song.al.name;
        bam.coverImgUrl = this.data.song.al.picUrl;
        bam.singer = this.data.song.ar[0].name;
        bam.onTimeUpdate(() => {
          this.setData({
            songDuration: bam.duration,
            songDurationShow: util.formatSec(bam.duration, true),
            songCurrShow: util.formatSec(bam.currentTime, true),
          });
          if (!this.data.onSlide) {
            this.setData({
              songCurr: bam.currentTime,
            })
          }
          // 因为currentTime的值基本不可能和歌词秒数对上，所以这里要通过比较判断歌词到哪一行了
          // this.dumpLyric(this.data.lyricIndex, 1);
          if (bam.currentTime > this.data.lyrics[this.data.lyricIndex + 1].lid && bam.currentTime < this.data.lyrics[this.data.lyricIndex + 2].lid) {
            this.setData({
              lyricIndex: this.data.lyricIndex + 1,
              scrollVal: this.data.lyricIndex * 34
            })
          }
        });
      }
    })
  },
  // 获取用户喜欢状态
  setLike: function (id) {
    api.getUserLikeList({
      uid: wx.getStorageSync('user').uid
    }).then(res => {
      if (res.data.code === 200) {
        if (res.data.ids.includes(parseInt(id))) {
          this.setData({
            like: true
          })
        }
      }
    })
  },
  // 获取歌曲评论信息
  setCommentInfo: function (id) {
    api.getComments({
      id: id,
      type: 0
    }).then(res => {
      if (res.data.code === 200) {
        this.setData({
          commentNum: this.getCommentNum(res.data.data.totalCount),
        })
      }
    })
  },
  // 获取歌词
  setLyrics: function (id) {
    api.getLyrics({
      id: id
    }).then(res => {
      if (res.data.code === 200) {
        if (res.data.uncollected) {
          this.setData({
            lyrics: "暂时没找到相关歌词"
          });
        } else if (res.data.nolyric) {
          this.setData({
            lyrics: "纯音乐，无歌词"
          });
        } else {
          this.setData({
            lyrics: this.formatLyrics(res.data.lrc.lyric)
          });
        }
      }
    })
  },
})