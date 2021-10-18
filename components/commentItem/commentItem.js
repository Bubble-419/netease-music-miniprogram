// components/commentItem/commentItem.js
const api = require("../../utils/api");

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
      console.log('changeShow');
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
          if (this.data.replyData.time) {
            this.setData({
              ['replyData.comments']: this.data.replyData.comments.concat(res.data.data.comments),
              ['replyData.time']: res.data.data.time,
            })
          } else {
            this.setData({
              replyData: res.data.data
            });
          };
        };
      });
    },
  }
})