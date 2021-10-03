//Component Object
Component({
  properties: {
    // 因为是通用组件，所以不能像songItem一样直接接收父组件的对象
    // 专辑或歌单的封面
    coverUrl: {
      type: String,
      value: "",
    },
    // 标题
    titleInfo: {
      type: String,
      value: "",
    },
    // 别名（专辑）
    alias: {
      type: String,
      value: "",
    },
    // 附加信息
    extra: {
      type: String,
      value: "",
    },
    // 标签组
    tags: [],
    // 是否为用户
    user: {
      type: Boolean,
      value: false
    },
    // 是否关注
    followed: {
      type: Boolean,
      value: false
    },
    // id
    itemId: {
      type: Number,
      value: 0
    },
    // 是否是mini组件
    mini: {
      type: Boolean,
      value: false
    }
  },
  data: {

  },
  methods: {
    onClick: function () {
      console.log(this.properties.itemId);
      if (!this.data.user) {
        wx.navigateTo({
          url: '../playlistDetail/playlistDetail?id=' + this.properties.itemId,
        });
      } else {
        // TODO
      }
    }
  },
  options: {
    addGlobalClass: true
  }
});