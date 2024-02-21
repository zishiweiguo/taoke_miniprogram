var app = getApp();
var wxb = require('../utils/wxb.js');
Page({
  data: {
    color: '',
    datas: [],
    // service_tel: "0551-12345678", 服务电话
    // complaint_tel: "0551-12345678" 投诉电话
    setting: [],
    jdUrl: '',
    textdata: ''
  },

  jdUrlInputHandle(e){
    this.setData({
      jdUrl: e.detail.value
    });
  },

  // 搜索请求
  formBindsubmit: function (e) {

    wx.showLoading({
      title: '加载中...',
    }),
    // console.log(e.detail.value.jdUrl)
    wx.request({
      url: 'http://localhost:9090/manman/tk/convertLink',
      method: 'GET',
      dataType: 'json',
      data: {'originalLink': e.detail.value.jdUrl,'wxUserId':app.globalData.wxLoginData.openid},
      success:function(result){
        wx.hideLoading();
        console.log(result)
        wxb.that.setData({
            textdata: result.data.data
        })
      }
    })
    
  },

  _getUserInfo : function(){
    wx.login({
      success: function (res){
        // console.log(res.code)
          wx.request({
            url: 'http://localhost:9090/manman/wxlogin',
            method: 'GET',
            dataType: 'json',
            data: {'code': res.code},
            success:function(result){
              console.log(result)
              //将用户的基本信息保存到缓存中
              app.globalData.wxLoginData = result.data
            },
            fail: function (res){
              console.log(res);
            }
          })
      }
    })
  },

  userInfoAuth:function(){
    // 授权
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              console.log(res.userInfo)
            }
          })
        } else {
          // 用户没有授权
          // 可以引导用户去设置页打开授权
          wx.showModal({
            title: '提示',
            content: '需要您的授权才能获取到您的信息',
            success: function(res) {
              if (res.confirm) {
                wx.openSetting({
                  success: function(res) {
                    if (res.authSetting['scope.userInfo']) {
                      wx.getUserInfo({
                        success: function(res) {
                          console.log(res.userInfo)
                        }
                      })
                    }
                  }
                })
              }
            }
          })
        }
      }
    })
  },

  // 粘贴url复制到检索框中
  getClipboardUrl : function(e){
    wx.getClipboardData({
      success: function (res){
        wx.showToast({
          title: '粘贴成功',
        });
        wxb.that.setData({
          keyword: res.data
        })
      }
    })
  },

  copyUrl : function(e){
    wx.setClipboardData({data: wxb.that.data.textdata, 
        success: function (res) {wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功',
            });
            console.log(res.data) //打印赋值的数据
          }
        })
      }
    })
  },

  onShow: function () {
    wxb.that = this;   //正确打开海天应用的方式
    wxb.globalData = app.globalData; //正确打开海天应用的方式
    console.log(wxb.that.data.setting);
    console.log("欢迎")
    this.userInfoAuth();
    this._getUserInfo();
  },

  onLoad: function () {
    wxb.that = this;
    wxb.style();
    this.getHome();
    
  },

  getHome: function (e) {
    wxb.that = this;  
    wxb.globalData = app.globalData;
    wx.showLoading({
      title: '加载中...',
    })
    this.getClipboardUrl();
  },
  
})

Component({
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 0
        })
      }
    }
  }
})
