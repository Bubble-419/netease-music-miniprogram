// components/songProgress.js
const app = getApp();
const util = require("../../utils/util");

Component({
  properties: {
    // 歌曲总时长（无格式）
    songDuration: '',
    // 歌曲当前秒数（无格式）
    songCurr: '',
  },
  data: {
    // 歌曲总时长（格式为[00:00]）
    songDurationShow: '00:00',
    // 歌曲当前秒数（格式为[00:00]）
    songCurrShow: '00:00',
  },
  observers: {
    'songDuration': function (val) {
      if (val) {
        this.setData({
          songDurationShow: util.formatSec(this.properties.songDuration),
        })
      }
    },
    'songCurr': function (val) {
      if (val) {
        this.setData({
          songCurrShow: util.formatSec(this.properties.songCurr),
        })
      }
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 拖动进度条,拖动时会有闪回
    sildeProg: function () {
      this.triggerEvent('sildeProg');
    },
    // 拖动进度条触发值改变
    changeProg: function (e) {
      this.triggerEvent('changeSongProg', {
        songCurr: e.detail.value,
      });
    },
  }
})