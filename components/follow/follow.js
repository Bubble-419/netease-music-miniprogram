// components/follow.js
const api = require("../../utils/api");
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 初始关注状态
    followed: {
      type: Boolean,
      value: false
    },
    // 是否是mini关注按键
    mini: {
      type: Boolean,
      value: false
    },
    // 传入的id
    itemId: {
      type: Number,
      value: 0
    }
  },
  observers: {
    'followed': function (val) {
      if (val !== undefined) {
        this.setData({
          myFollowed: val
        })
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    // 用户自己的id
    uid: app.globalData.uid,
    /**
     * 后续状态，考虑到数据的单向流动性，这里不对properties的followed直接修改，也不通过事件修改父组件（当通过遍历产生节点时，很难直接修改父组件），
     * 因此这里只通过内化properties为组件内部data来改变视图层
     * */
    myFollowed: false
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 关注或取关
    follow: function () {
      let t = this.properties.followed ? 0 : 1;
      api.follow({
        id: this.properties.itemId,
        t
      }).then(res => {
        if (res.data.code === 200) {
          this.setData({
            myFollowed: !this.data.myFollowed
          })
        }
      })
    }
  }
})