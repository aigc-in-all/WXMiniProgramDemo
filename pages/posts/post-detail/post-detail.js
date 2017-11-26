var postsData = require("../../../data/posts-data.js")
var app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isPlayingMusic: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var globalData = app.globalData

    var postId = options.id
    this.setData({
      currentPostId: postId
    })
    var postData = postsData.postList[postId]
    this.setData({
      postData: postData
    })

    // 收藏数据结构
    // var postsCollected = {
    //   1: true,
    //   2: false,
    //   3: true,
    //   4: true,
    //   5: false
    // }

    var postsCollected = wx.getStorageSync('posts_collected')
    if (postsCollected) {
      var postCollected = postsCollected[postId]
      this.setData({
        collected: postCollected
      })
    } else {
      postsCollected = {}
      postsCollected[postId] = false
      wx.setStorageSync('posts_collected', postsCollected)
    }

    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId) {
      this.setData({
        isPlayingMusic: true
      })
    }

    this.setMusicMonitor()
  },

  setMusicMonitor: function() {
    var that = this
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isPlayingMusic: true
      })
      app.globalData.g_isPlayingMusic = true
      app.globalData.g_currentMusicPostId = that.data.currentPostId
    })

    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false
      app.globalData.g_currentMusicPostId = null
    })

    wx.onBackgroundAudioStop(function () {
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false
      app.globalData.g_currentMusicPostId = null
    })
  },

  onCollectionTap: function (event) {
    var postsCollected = wx.getStorageSync('posts_collected')
    var collected = postsCollected[this.data.currentPostId]
    collected = !collected
    postsCollected[this.data.currentPostId] = collected
    wx.setStorageSync('posts_collected', postsCollected)

    this.setData({
      collected: collected
    })

    wx.showToast({
      title: collected ? '收藏成功' : '取消收藏成功',
    })
  },

  onShareTap: function (event) {
    wx.showActionSheet({
      itemList: ['分享到微信好友', '分享到朋友圈'],
    })
  },

  onMusicTap: function(event) {
    var isPlayingMusic = this.data['isPlayingMusic']
    if (isPlayingMusic) {
      wx.pauseBackgroundAudio()
      this.setData({
        isPlayingMusic: false
      })
    } else {
      var postId = this.data.currentPostId
      var music = this.data.postData.music
      wx.playBackgroundAudio({
        dataUrl: music.url,
        title: music.title,
        coverImgUrl: music.coverImg
      })
      this.setData({
        isPlayingMusic: true
      })
    }
    
  }
})