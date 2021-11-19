// components/songInfoFooter/songInfoFooter.js
const api = require("../../utils/api");

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 是fm的底部还是歌曲页面的底部
    flag: '',
    // 歌曲id
    sid: 0,
    // 播放状态
    isPlaying: true,
    // 歌曲总时长（无格式）
    songDuration: '',
    // 歌曲当前秒数（无格式）
    songCurr: '',
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 是否喜欢歌曲
    like: false,
    //歌曲评论数展示
    commentNum: '',
  },
  observers: {
    'sid': function (val) {
      if (val) {
        this.setLike(val);
        this.setCommentInfo(val);
      }
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 事件处理函数
     */
    // 播放或暂停
    play: function () {
      this.triggerEvent('playPressed')
    },
    // 下一首
    nextSong: function () {
      this.triggerEvent('switchSong', {
        flag: true
      })
    },
    // 上一首
    prevSong: function () {
      this.triggerEvent('switchSong', {
        flag: false
      })
    },
    // 把进度条事件向上传递
    sildeProg: function () {
      this.triggerEvent('sildeProg');
    },
    changeProg: function (e) {
      this.triggerEvent('changeSongProg', {
        songCurr: e.detail.songCurr,
      });
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

    // 跳转去评论页面
    goToComments: function () {
      wx.navigateTo({
        url: `../comments/comments?itemId=${this.data.sid}&type=0`,
      });
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

    /**
     * API函数
     */
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

    // 喜欢/不喜欢歌曲
    changeLike: function () {
      // 考虑到交互流畅性，先处理视图层，再发送请求
      let like = this.data.like;
      this.setData({
        like: !like
      });
      this.animate('.like', [{
          scale: [1.2, 1.2],
          ease: 'ease'
        },
        {
          scale: [0.8, 0.8],
          ease: 'ease'
        },
        {
          scale: [1, 1],
          ease: 'ease'
        },
      ], 1000, () => {
        this.clearAnimation('.like');
      });
      api.like({
        id: this.data.sid,
        like: this.data.like,
      }).then(res => {
        if (res.data.code >= 300) {
          // 处理失败情况
          console.log('fail');
          this.setData({
            like
          })
        }
      })
    },
  }
})