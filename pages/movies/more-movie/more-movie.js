const util = require('../../../utils/util.js')

var app = getApp()

Page({

  data: {
    navigateTitle: "",
    requestUrl: "",
    totalCount: 0,
    movies: {},
    isEmpty: true
  },

  onLoad: function (options) {
    var category = options.category
    this.setData({
      navigateTitle: category
    })

    var dataUrl = ""
    switch (category) {
      case '正在热映':
        dataUrl = app.globalData.doubanBase + '/v2/movie/in_theaters'
        break
      case '即将上映':
        dataUrl = app.globalData.doubanBase + '/v2/movie/coming_soon'
        break
      case 'Top250':
        dataUrl = app.globalData.doubanBase + '/v2/movie/top250'
        break
    }

    this.setData({
      requestUrl: dataUrl
    })

    util.http(dataUrl, this.callback)
  },

  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle
    })
  },

  callback: function (data) {
    var movies = []
    for (var idx in data.subjects) {
      var subject = data.subjects[idx]
      var title = subject.title
      if (title.length >= 6) {
        title = title.substring(0, 6) + '...'
      }

      var temp = {
        'stars': util.convertToStarsArray(subject.rating.stars),
        'title': title,
        'average': subject.rating.average,
        'converageUrl': subject.images.large,
        'movieId': subject.id
      }
      movies.push(temp)
    }

    var totalMovies = {}
    if(!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies)
    } else {
      totalMovies = movies
      this.data.isEmpty = false
    }

    var totalCount = totalMovies.length

    this.setData({
      movies: totalMovies,
      totalCount: totalCount
    })

    wx.hideNavigationBarLoading()
    wx.stopPullDownRefresh()
  },

  onScrollToLower: function () {
    
  },

  onPullDownRefresh: function () {
    console.log('下拉刷新')
    var refreshUrl = this.data.requestUrl + "?start=0&count=20"
    this.data.movies = {}
    this.data.isEmpty = true
    util.http(refreshUrl, this.callback)
  },

  onReachBottom: function () {
    console.log('加载更多')
    var nextUrl = this.data.requestUrl + "?start=" + this.data.totalCount + "&count=20"
    util.http(nextUrl, this.callback)
    wx.showNavigationBarLoading()
  },
})