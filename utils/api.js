/*
用Promise封装API
*/

// 定义前缀URL
const baseUrl = "http://localhost:3000";
// cookie
const cookie = wx.getStorageSync('user').cookie;
// token
const token = wx.getStorageSync('user').token;

// 请求方法
function request(method, url, data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl + url,
      data: data,
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + token ? token : '',
      },
      method: method,
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      },
    });
  })
}

// 导出API
module.exports = {
  // 搜索相关API
  // 1. 搜索
  search: (data) => {
    return request("GET", "/search", data);
  },
  // 2. 热门搜索
  searchHot: (data) => {
    return request("GET", "/search/hot/detail", data);
  },
  // 3. 搜索建议
  searchSuggest: (data) => {
    return request("GET", "/search/suggest", data);
  },
  // 4. 搜索默认词
  searchDefault: (data) => {
    return request("GET", "/search/default", data);
  },
  // 轮播图
  getBanner: (data) => {
    return request("GET", "/banner", data);
  },
  // 圆形入口列表
  getHomeicons: (data) => {
    return request("GET", "/homepage/dragon/ball", data);
  },
  // 推荐歌单
  getHomePlaylist: (data) => {
    return request("GET", "/personalized", data);
  },
  // 歌单详情
  getPlaylistDetail: (data) => {
    if (cookie) data.cookie = cookie;
    return request("GET", "/playlist/detail", data);
  },
  // 获取验证码
  getCaptcha: (data) => {
    return request("GET", "/captcha/sent", data);
  },
  // 登录
  login: (data) => {
    return request("POST", "/login/cellphone", data);
  },
  // 获取用户信息
  getLoginStatus: (data) => {
    data.cookie = cookie;
    return request("GET", "/login/status", data);
  },
  // 获取用户歌单(需要登录)
  getUserPlaylist: (data) => {
    data.cookie = cookie;
    return request("GET", "/user/playlist", data);
  },
  // 获取歌曲详情
  getSongDetail: (data) => {
    return request("GET", "/song/detail", data);
  },
  // 获取音乐url
  getSongUrl: (data) => {
    return request("GET", "/song/url", data);
  },
  // 获取歌词
  getLyrics: (data) => {
    return request("GET", "/lyric", data);
  },
  // 获取用户的喜欢音乐的列表
  getUserLikeList: (data) => {
    data.cookie = cookie;
    return request("GET", "/likelist", data);
  },
  // 获取评论
  getComments: (data) => {
    return request("GET", '/comment/new', data);
  },
  // 关注/取关用户(需要登录)
  follow: (data) => {
    data.cookie = cookie;
    return request("GET", "/follow", data);
  },
  // 点赞(需要登录)
  like: (data) => {
    data.cookie = cookie;
    return request("GET", "/like", data);
  },
  // 获取评论的楼层回复
  getFloorComments: function (data) {
    return request("GET", "/comment/floor", data);
  }
}