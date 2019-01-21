var app = getApp()
Page({
  data: {
    couponInfo: {},
    picWidth: wx.getSystemInfoSync().windowWidth,
    platformTypeUrl: "../../images/taobao.png",
    loadingBtn: false,
    showStatus: false,
    taoKouLing: "",
    maxLength: 0
  },
  onShow: function () {
    wx.setStorageSync('isDetailBack', true)
  },
  onLoad: function (options) {
    this.setData({
      couponInfo: wx.getStorageSync('couponInfo')
    })
    if (this.data.couponInfo.PlatformType == "天猫")
      this.setData({
        platformTypeUrl: "../../images/tmall.png"
      })
  },
  hideView: function () {
    this.setData({
      showStatus: false
    })
  },
  getCoupon: function (options) {
    var that = this;
    that.setData({
      loadingBtn: true
    })
    wx.request({
      url: "http://192.168.31.88:8080/hui/app/createTpwd",
      data: {
        "numIid": that.data.couponInfo.num_iid,
        "sellerId": that.data.couponInfo.seller_id,
        "title": that.data.couponInfo.shop_title + that.data.couponInfo.coupon_info,
        "clickUrl": that.data.couponInfo.coupon_click_url,
        "logoUrl": that.data.couponInfo.pict_url
      },
      method: "POST",
      success: function (resRequest) {
        if (resRequest.data.code == 0) {
          that.setData({
            taoKouLing: resRequest.data.data.model,
            loadingBtn: false,
            showStatus: true,
            maxLength: resRequest.data.data.model.length
          })
          wx.setClipboardData({
            data: resRequest.data.data.model,
            success: function (res) {
              wx.getClipboardData({
                success: function (res) {
                  console.log(res.data);
                }
              })
            }
          })
        }
      }
    })
  },
  getCode: function (options) {
    var that = this;
    wx.setClipboardData({
      data: that.data.taoKouLing,
      success: function(res) {
        wx.getClipboardData({
          success: function(res) {
            console.log(res.data);
          }
        })
      }
    })
  }
})
