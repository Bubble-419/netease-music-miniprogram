// components/like/like.js
const api = require("../../utils/api");

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 资源id
    itemId: {
      type: Number,
      value: 0
    },
    // 评论id
    cid: {
      type: Number,
      value: 0
    },
    // 点赞数目
    likedCount: {
      type: Number,
      value: 0
    },
    // 是否点赞
    liked: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 组件内用于展示的点赞数目和点赞状态
    myLikedCount: 0,
    myLiked: false
  },

  observers: {
    'likedCount': function (val) {
      if (val !== undefined) {
        this.setData({
          myLikedCount: val
        })
      }
    },
    'liked': function (val) {
      if (val !== undefined) {
        this.setData({
          myLiked: val
        })
      }
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    like: function () {
      api.like({
        id: this.properties.itemId,
        cid: this.properties.cid,
        t: this.properties.liked ? 0 : 1,
        type: 0
      }).then(res => {
        this.setData({
          myLiked: !this.data.myLiked,
          myLikedCount: !this.data.myLiked ? this.data.myLikedCount + 1 : this.data.myLikedCount - 1
        })
      })
    }
  }
})