const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function convertToStarsArray(stars) {
  var num = stars.toString().substring(0, 1)
  var array = []
  for (var i = 1; i <= 5; i++) {
    if (i <= num) {
      array.push(1)
    } else {
      array.push(0)
    }
  }
  return array
}

function http(url, callback) {
  wx.request({
    url: url,
    header: {
      'Content-Type': 'application/xml' // bug
    },
    method: 'GET',
    success: function (res) {
      callback(res.data)
    },
    fail: function (error) {
      console.log(error)
    }
  })
}

function convertToCastsString(casts) {
  var castsJoin = ""
  for (var idx in casts) {
    castsJoin = castsJoin + casts[idx].name + " / "
  }
  return castsJoin.substring(0, castsJoin.length - 2)
}

function convertToCastsInfos(casts) {
  var castsArray = []
  for (var idx in casts) {
    var cast = {
      img: casts[idx].avatars ? casts[idx].avatars.large : "",
      name: casts[idx].name
    }
    castsArray.push(cast)
  }
  return castsArray
}

module.exports = {
  formatTime: formatTime,
  convertToStarsArray: convertToStarsArray,
  http: http,
  convertToCastsString: convertToCastsString,
  convertToCastsInfos: convertToCastsInfos
}
