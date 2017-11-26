// pages/movies/movie-detail/movie-detail.js

const util = require('../../../utils/util.js')

var app = getApp()

Page({

  data: {
    navigateTitle: "",
    movie: {}
  },

  onLoad: function (options) {
    var navTitle = options.navTitle
    this.setData({
      navigateTitle: navTitle
    })

    var movieId = options.id
    var url = app.globalData.doubanBase + "/v2/movie/subject/" + movieId
    util.http(url, this.processDoubanData)
  },

  onReady: function() {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle,
    })
  },

  processDoubanData: function (data) {
    if (!data) {
      return
    }

    var director = {
      avatar: "",
      name: "",
      id: ""
    }

    if (data.directors[0] != null) {
      if (data.directors[0].avatars != null) {
        director.avatar = data.directors[0].avatars.large
      }
      director.name = data.directors[0].name
      director.id = data.directors[0].id
    }

    var movie = {
      movieImg: data.images ? data.images.large : "",
      country: data.countries ? data.countries[0] : "",
      title: data.title,
      originalTitle: data.original_title,
      wishCount: data.wish_count,
      commentsCount: data.comments_count,
      year: data.year,
      generes: data.genres.join('、'),
      stars: util.convertToStarsArray(data.rating.stars),
      score: data.rating.average,
      director: director,
      casts: util.convertToCastsString(data.casts),
      castsInfo: util.convertToCastsInfos(data.casts),
      summary: data.summary,
    }

    console.log(movie)

    this.setData({
      movie: movie
    })
  },

  viewMoviePostImg: function (event) {
    var src = event.currentTarget.dataset.src
    wx.previewImage({
      urls: [src],
      current: src
    })
  }
})