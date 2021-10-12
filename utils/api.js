/*
用Promise封装API
*/

// 定义前缀URL
const baseUrl = "http://localhost:3000";

// 请求方法
function request(method, url, data) {
  let token = wx.getStorageSync('user').token;
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
    let cookie = wx.getStorageSync('user').cookie;
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
    data.cookie = wx.getStorageSync('user').cookie;
    return request("GET", "/login/status", data);
  },
  // 获取用户歌单
  getUserPlaylist: (data) => {
    data.cookie = wx.getStorageSync('user').cookie;
    return request("GET", "/user/playlist", data);
  }
}