var postsData = require("../../data/posts-data.js")

Page({
  data: {
    
  },

  onLoad: function (options) {
    this.setData({
      postList: postsData.postList
    })
  },

  onPostTap: function(event) {
    var postId = event.currentTarget.dataset.postid
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId,
    })
  },

  onSwiperTap: function(event) {
    // target指的是当前点击的组件
    // currentTarget指的是事件捕获的组件
    // 这里target指Image，currentTarget指swiper
    var postId = event.target.dataset.postid
    if (postId != null) {
      wx.navigateTo({
        url: 'post-detail/post-detail?id=' + postId,
      })
    }
    
  }
})