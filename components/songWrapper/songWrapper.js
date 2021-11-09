// components/songWrapper/songWrapper.js
const api = require("../../utils/api");
const util = require("../../utils/util");

Component({
  options: {
    addGlobalClass: true
  },
  /**
   * 组件的属性列表
   */
  properties: {
    // 判断是歌曲还是私人fm
    flag: '',
    // 歌曲id
    sid: 0,
    // 专辑封面
    picUrl: '',
    // 歌曲名
    songName: '',
    // 歌手
    ar: [],
    // 播放状态
    isPlaying: true,
    // 歌曲当前秒数（无格式）
    songCurr: '',
    // 是否是拉进度条引起的歌词跳动
    jumpLyc: false
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 是否显示歌词
    showLyrics: false,
    // 歌词数组
    lyrics: [],
    // 歌词滚动top值
    scrollVal: 0,
    // 当前歌词index
    lyricIndex: 0,
  },
  observers: {
    'sid': function (val) {
      if (val) {
        this.setLyrics(val);
      }
    },
    'songCurr': function (val) {
      /**
       * 通过监听songCurr（即bam中的currentTime）来改变歌词跳动的行数，因为currentTime的值基本不可能和歌词秒数对上，所以这里要通过比较判断歌词到哪一行了
       * 歌词位置有两种情况：
       * 1. 歌词位于除了最后一行以外其他的行
       * 2. 歌词已经处于最后一行
       * 处理歌词跳动，歌词跳动有两种情况：
       * 1. 随着音乐播放自动跳向下一行
       * 2. 在歌词界面拉动或者拖动进度条，跳到别的地方，歌词随音乐变化
       */
      if (val) {
        // 歌词跳去某一句
        if (this.properties.jumpLyc) {
          let lyricIndex = this.data.lyrics.findIndex(lyc => {
            return this.properties.songCurr < lyc.lid;
          }) - 1;
          this.setData({
            scrollVal: lyricIndex * 34,
            lyricIndex,
          });
          this.triggerEvent('jumpEnd');
        } else if (this.data.lyricIndex < this.data.lyrics.length - 1) {
          // 歌词正常往下移动
          if (val >= this.data.lyrics[this.data.lyricIndex + 1].lid) {
            this.setData({
              lyricIndex: this.data.lyricIndex + 1,
              scrollVal: this.data.lyricIndex * 34
            });
          };
        };
      };
    },
  },
  lifetimes: {
    // attached: function () {
    //   this.setLyrics(this.properties.sid);
    // }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 点击切换专辑封面和歌词
    changePlayer: function () {
      this.setData({
        showLyrics: !this.data.showLyrics,
      })
    },
    /**

     * 如果要做歌词滚动的话，不用scroll-view的事件，要新增一个app那样的播放键，再绑定事件，等有空再写！！
     */
    jumpLyric: function (e) {
      console.log(e);
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
    // 获取歌词
    setLyrics: function (id) {
      api.getLyrics({
        id: id
      }).then(res => {
        if (res.data.code === 200) {
          if (res.data.uncollected) {
            this.setData({
              lyrics: [{
                lid: bam.duration,
                lyc: "暂时没找到相关歌词"
              }]
            });
          } else if (res.data.nolyric) {
            this.setData({
              lyrics: [{
                lid: bam.duration,
                lyc: "纯音乐，无歌词"
              }],
            });
          } else {
            this.setData({
              lyrics: this.formatLyrics(res.data.lrc.lyric),
            });
          };
          this.setData({
            lyricIndex: 0
          });
        }
      })
    },
  }
})