//Component Object
const api = require("../../utils/api")

Component({
  data: {
    // 搜索值
    value: "",
    // 是否展示搜索建议页
    showSuggest: false,
    // 搜索建议列表
    suggestList: [],
  },
  methods: {
    /**
     * 组件函数
     */
    // 向父组件通信，发送搜索关键词
    onEmitSearch: function (e) {
      this.setData({
        value: typeof e.detail === "string" ? e.detail : e.target.dataset.keywords,
      });
      this.triggerEvent('search', {
        value: this.data.value,
      });
    },
    // 搜索建议
    onChange: function (e) {
      this.setData({
        value: e.detail,
        showSuggest: true,
      })
      this.getSearchSuggest(e.detail);
      this.triggerEvent('showSuggest', {
        showSuggest: this.data.showSuggest,
      })
    },
    /**
     * API函数
     */
    // 搜索建议
    getSearchSuggest: function (keywords) {
      api.searchSuggest({
        keywords: keywords,
        type: 'mobile'
      }).then(res => {
        this.setData({
          suggestList: res.data.result.allMatch,
        })
      })
    },
  },
});