// pages/comments/comments.js
const api = require("../../utils/api");
const util = require("../../utils/util");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 发送请求所需参数
    comReq: {
      // 需要评论的资源的id
      id: 0,
      // 该资源的类型
      type: 0,
      // 切换评论区，1:按推荐排序,2:按热度排序,3:按时间排序
      // 可恶的api，1和2得到的结果是一样的
      sortType: 1,
      // 分页
      pageNo: 1,
    },
    // 总评论数
    totalCount: 0,
    // 评论数组
    comments: [],
    // 加载中
    isLoading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.itemId);
    this.setData({
      ['comReq.id']: options.itemId,
      ['comReq.type']: options.type
    });
    // 首次请求，默认sortType和pageNo都是1
    this.setCommentInfo({
      ...this.data.comReq
    });
  },
  /**
   * 页面函数
   */
  // 切换评论标签
  changeTab: function (e) {
    this.setData({
      ['comReq.sortType']: parseInt(e.currentTarget.dataset.sort),
      ['comReq.pageNo']: 1,
      isLoading: true
    });
    this.setCommentInfo({
      ...this.data.comReq
    });
  },
  // 到底触发分页
  onReachBottom: function () {
    this.setData({
      isLoading: true,
      ['comReq.pageNo']: this.data.comReq.pageNo + 1,
    });
    console.log(this.data.comReq);
    this.setCommentInfo({
      ...this.data.comReq
    })
  },

  // 获取歌曲评论信息
  setCommentInfo: function (payload) {
    api.getComments({
      ...payload
    }).then(res => {
      console.log(res.data);
      if (res.data.code === 200) {
        let resComments = res.data.data.comments;
        for (let com of resComments) {
          com.time = util.getReplyTime(com.time);
        };
        this.setData({
          totalCount: res.data.data.totalCount,
          comments: payload.pageNo > 1 ? this.data.comments.concat(resComments) : resComments,
          isLoading: false
        })
      }
    })
  },
})