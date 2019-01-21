var app = getApp()
Page({
  data: {
    couponList: [],
    pageIndex: 0,
    isLoading: true,
    loadOver: false,
    categoryList: [{ CategoryID: "", CategoryName: "其它" }, { CategoryID: "all", CategoryName: "全部" }],
    selectCategory: "all",
    showCategoryName: "全部",
    selectIndex: 0,
    inputContent: "" 
  },
  onLoad: function (options) {
    this.getCategoryList()
  },
  onShow: function () {
    if (wx.getStorageSync('isDetailBack')) {
      wx.removeStorageSync('isDetailBack')
      return
    }
    this.setData({
      couponList: [],
      pageIndex: 0,
      isLoading: true,
      loadOver: false,
      selectCategory: wx.getStorageSync('selectCategory') == "" ? "all" : wx.getStorageSync('selectCategory'),
      showCategoryName: wx.getStorageSync('showCategoryName') == "" ? "全部" : wx.getStorageSync('showCategoryName'),
      selectIndex: wx.getStorageSync('selectIndex') == "" ? this.data.categoryList.length - 1 : wx.getStorageSync('selectIndex'),
      inputContent: wx.getStorageSync('inputContent')
    })
    this.getMoreCouponList()
  },
  getMoreCouponList: function () {
    var that = this
    wx.request({
      url: "http://192.168.31.88:8080/hui/app/getCouponItem",
      data: {
        "Acount": {
          "UserName": app.globalData.Acount.UserName,
          "PassWord": app.globalData.Acount.PassWord
        },
        "query": {
          "PageSize": 10,
          "PageIndex": that.data.pageIndex,
          "OrderField": "ZongHeBiLi",
          "Direction": "DESC",
          "ItemName": that.data.inputContent,
          "ShareCategory": that.data.selectCategory
        }
      },
      method: "POST",
      success: function (resRequest) {
        console.log("111111111");
        if (resRequest.data.code == 0) {
          if (resRequest.data.data != null && resRequest.data.data.length > 0) {
            console.log("2222222222222");
            resRequest.data.data.forEach(function (coupon) {
              console.log(coupon);
              console.log("33333333333")
              coupon.ZongHeBiLiText = parseInt(coupon.commission_rate * 10) + "%"
              // coupon.CouponEndTime = coupon.CouponEndTime.substring(0, 10)
            })
            console.log(resRequest.data.data);
            that.setData({
              couponList: that.data.couponList.concat(resRequest.data.data),
              isLoading: false
            })
          }
          else {
            that.setData({
              isLoading: true,
              loadOver: true
            })
          }
        }
      }
    })
  },
  getCategoryList: function () {
    var that = this
    wx.request({
      url: "http://192.168.31.88:8080/hui/app/getCouponItem",
      data: {
        "Acount": {
          "UserName": app.globalData.Acount.UserName,
          "PassWord": app.globalData.Acount.PassWord
        }
      },
      method: "POST",
      success: function (resRequest) {
        if (resRequest.data.Result == "请求成功") {
          console.log(data.tbk_item_get_response.results.n_tbk_item);
          console.log("111111111");
          that.setData({
            categoryList: resRequest.data.Categorys.concat(data.tbk_item_get_response.results.n_tbk_item),
            selectIndex: resRequest.data.Categorys.length + 1
          })
        }
      }
    })
  },
  bindPickerChange: function (e) {
    this.setData({
      couponList: [],
      loadOver: false,
      isLoading: true,
      pageIndex: 0,
      selectIndex: e.detail.value,
      selectCategory: this.data.categoryList[e.detail.value].CategoryID
    })
    if (this.data.selectCategory != 'C100' && this.data.selectCategory != 'C010' && this.data.selectCategory != 'C110') {
      this.setData({
        showCategoryName: this.data.categoryList[e.detail.value].CategoryName
      })
      wx.setStorageSync('showCategoryName', this.data.categoryList[e.detail.value].CategoryName)
    }
    else {
      this.setData({
        showCategoryName: "全部"
      })
      wx.setStorageSync('showCategoryName', "全部")
    }
    this.getMoreCouponList()
    wx.setStorageSync('selectCategory', this.data.categoryList[e.detail.value].CategoryID)
    wx.setStorageSync('selectIndex', e.detail.value)
  },
  selectByCategory: function (e) {
    var selectNum = 0
    this.data.categoryList.every(function (categoryItem, i) {
      if (categoryItem.CategoryID == e.currentTarget.dataset.categoryId) {
        selectNum = i
        return false
      }
      return true
    })
    this.setData({
      couponList: [],
      loadOver: false,
      isLoading: true,
      pageIndex: 0,
      showCategoryName: "全部",
      selectCategory: e.currentTarget.dataset.categoryId,
      selectIndex: selectNum,
    })
    this.getMoreCouponList()
    wx.setStorageSync('showCategoryName', "全部")
    wx.setStorageSync('selectCategory', e.currentTarget.dataset.categoryId)
    wx.setStorageSync('selectIndex', selectNum)
  },
  selectByItemName: function () {
    this.setData({
      couponList: [],
      loadOver: false,
      isLoading: true,
      pageIndex: 0
    })
    this.getMoreCouponList()
  },
  selectAll: function () {
    this.setData({
      couponList: [],
      pageIndex: 0,
      isLoading: true,
      loadOver: false,
      selectCategory: "all",
      showCategoryName: "全部",
      selectIndex: this.data.categoryList.length - 1,
      inputContent: ""
    })
    this.getMoreCouponList()
    wx.setStorageSync('showCategoryName', "全部")
    wx.setStorageSync('selectCategory', "all")
    wx.setStorageSync('inputContent', "")
    wx.setStorageSync('selectIndex', this.data.categoryList.length - 1)
  },
  bindInputChange: function (e) {
    this.setData({
      inputContent: e.detail.value
    })
    wx.setStorageSync('inputContent', e.detail.value)
  },
  setCouponInfo: function (e) {
    wx.setStorageSync('couponInfo', this.data.couponList[e.currentTarget.dataset.index])
  },
  onPullDownRefresh: function () {
    this.setData({
      couponList: [],
      loadOver: false,
      isLoading: true,
      pageIndex: 0
    })
    wx.stopPullDownRefresh()
    this.getMoreCouponList()
  },
  onReachBottom: function () {
    this.setData({
      isLoading: true,
      loadOver: false,
      pageIndex: this.data.pageIndex + 1
    })
    this.getMoreCouponList()
  }
})
