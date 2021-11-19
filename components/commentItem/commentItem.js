// components/commentItem/commentItem.js
const api = require("../../utils/api");
const util = require("../../utils/util");

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    commentItem: {
      type: Object,
      value: {}
    },
    itemId: {
      type: Number,
      value: 0
    },
    type: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 展示回复
    showReply: false,
    // 回复数据
    replyData: {},
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 展示回复
    changeShowRepley: function () {
      this.setData({
        showReply: !this.data.showReply
      });
    },
    // 获取回复
    getFloor: function () {
      api.getFloorComments({
        parentCommentId: this.properties.commentItem.commentId,
        id: this.properties.itemId,
        type: this.properties.type,
        time: this.data.replyData.time ? this.data.replyData.time : ''
      }).then(res => {
        if (res.data.code === 200) {
          let replyData = res.data.data;
          replyData.comments.map(com => {
            com.time = util.getReplyTime(com.time);
          })
          if (this.data.replyData.time) {
            this.setData({
              ['replyData.comments']: this.data.replyData.comments.concat(replyData.comments),
              ['replyData.time']: replyData.time,
            })
          } else {
            this.setData({
              replyData
            });
          };
        };
      });
    },
  }
})