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
    followed: {
      type: Boolean,
      value: false
    }
    // 
    // 点击后要跳转的页面,以及路由参数
    // TODO
  },
  data: {

  },
  methods: {
    onClick: function () {
      // TODO
    }
  },
  options: {
    addGlobalClass: true
  }
});