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
    // // 回复数组
    // replies: [],
    // // 回复总数
    // totalCount: 0,
    // // 最后一条的时间（用于分页）
    // time: '',
    // 回复数据
    replyData: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 展示回复
    changeShowRepley: function () {
      this.setData({
        showReply: !this.data.showReply
      })
    },
    // 获取回复
    getFloor: function () {
      console.log('floor');
      api.getFloorComments({
        parentCommentId: this.properties.commentItem.commentId,
        id: this.properties.itemId,
        type: this.properties.type,
        time: this.data.replyData.time ? this.data.replyData.time : ''
      }).then(res => {
        console.log(res);
        if (res.data.code === 200) {
          this.setData({
            // replies: res.data.data.comments,
            // totalCount: res.data.data.totalCount,
            // time: res.data.data.time
            replyData: res.data.data
          })
        }
      })
    }
  }
})