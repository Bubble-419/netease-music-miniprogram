import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
const api = require("../../utils/api");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPopup: false,
    phone: "",
    captcha: {
      val: "",
      sentStatus: false,
    },
  },

  /**
   * 页面函数
   */
  // 控制登录的弹出层
  showPopup: function () {
    this.setData({
      showPopup: true
    })
  },
  closePopup: function () {
    this.setData({
      showPopup: false
    })
  },
  // 输入手机号时
  setPhone: function (e) {
    this.setData({
      phone: e.detail
    })
  },
  // 输入验证码时
  setCaptcha: function (e) {
    this.setData({
      ['captcha.val']: e.detail
    })
  },
  // 获取验证码
  getCaptcha: function () {
    api.getCaptcha({
      phone: this.data.phone
    }).then(res => {
      if (res.data.code === 200 && res.data.data === true) {
        this.setData({
          ['captcha.sentStatus']: true
        })
      } else {
        Dialog.alert({
          message: res.data.message,
        })
      }
    })
  },
  // 手机+验证码登录
  login: function () {
    api.login({
      phone: this.data.phone,
      captcha: this.data.captcha.val
    }).then(res => {
      if (res.data.code !== 200) {
        // msg弹窗
        Dialog.alert({
          message: res.data.message,
        })
      } else {
        // 保存用户信息+token
        wx.setStorage({
          key: 'user',
          data: {
            uid: res.data.account.id,
            token: res.data.token,
            cookie: res.data.cookie,
          },
          success: (result) => {
            // 跳转至原界面
            // wx.navigateBack({
            //   delta: 1
            // });
            wx.switchTab({
              url: '/pages/center/center',
            });
          },
        });
      }
    })
  }
})