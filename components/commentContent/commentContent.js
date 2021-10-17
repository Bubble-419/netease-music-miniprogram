// components/commentContent/commentContent.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 评论
    commentItem: {
      type: Object,
      value: {}
    },
    // 点赞所需的资源id
    itemId: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    showReply: function () {
      this.triggerEvent('showReply');
    }
  }
})