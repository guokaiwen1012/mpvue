let environment = "https://test.pt.api.auto-pai.com"//环境
let appid = "o3mrsy1n897m6ogx"
let token, userId;

//放在onShow,判断是否切换用户  若切换用户则需要重新登录
function isLogin() {
  let userInfoRussia = wx.getStorageSync('userInfoAssess')
  if (userInfoRussia) {    //存在已登录状态
    console.log(userInfoRussia, "存在本地的个人信息")
    wx.getUserInfo({
      success: function (res) {
        console.log(res, "获取系统用户信息成功")
        if (res.signature != userInfoRussia.signature) {  //不同用户，需要重新登录
          console.log('用户已切换跳入登录页面')
          return;
        } else {	//同一用户，直接上传分数，获取排行榜
          console.log('同一用户跳入主页面')
          let url = "../home/main";
          wx.redirectTo({
            url: url,
          });
        }
      },
      fail: function (error) {
        console.log(error, "获取系统用户信息失败")
        return;
      }
    })
  } else {	//未曾登录，第一次登陆
    console.log(userInfoRussia, "不存在本地存储的个人信息")
    console.log('首次登录跳入登录页面')
    return;
  }
}

//用户登录
function userLogin(resolve, reject) {
  wx.login({
    success: function (codea) {
      console.log(codea);
      wx.getUserInfo({
        success: message => {
          console.log(message, "获取系统用户信息成功")
          let userInfo = message;
          // 登录接口
          let data = {
            appid: appid,
            sign: "",
            encryptedData: message.encryptedData,
            iv: message.iv,
            signature: message.signature,
            data: {
              errMsg: message.errMsg,
              rawData: "",
              userInfo: {
                nickName: message.userInfo.nickName,
                city: message.userInfo.city,
                language: message.userInfo.language,
                province: message.userInfo.province,
                country: message.userInfo.country,
                gender: message.userInfo.gender,
                avatarUrl: message.userInfo.avatarUrl
              },
              wxCode: codea.code
            }
          }
          wx.request({
            url: "",
            method: "POST",
            dataType: "json",
            data: data,
            header: {
              "content-type": "application/json",
            },
            success: function (res) {
              console.log(res);
              if (res.data.code == '0000') {
                //登录成功

                //存储效验参数
                userId = res.data.data.userId
                token = res.data.data.token
                let efficacy = { "appid": appid, "token": token, "userId": userId }
                wx.setStorageSync('efficacyAssess', efficacy)

                //本地存储用户信息用来做判断
                wx.setStorageSync('userInfoAssess', userInfo)
                showToast("登录成功", 600, "none");
                resolve(true);
              } else if (res.data.code == 'E120002') {
                //登录失败去注册
                register(resolve, reject);
              } else {
                showToast("登录失败", 600, "none")
                reject(false);
              }
            }
          })
        },
        fail: function (e_message) {
          showToast('登录失败', 600, "none")
          console.log(e_message, "获取用户信息失败")
        }
      })
    },
    fail: function (e_code) {
      console.log(e_code, "获取code失败")
    }
  })
}
//用户注册
function register(resolve, reject) {
  wx.login({
    success: function (codea) {
      wx.getUserInfo({
        success: result => {
          console.log(result, "获取系统用户信息成功")
          // 注册接口
          let registerdata = {
            appid: "ca19xxu5fo0hckc8",
            data: {
              appid: "o3mrsy1n897m6ogx",
              wxCode: codea.code,
              errMsg: result.errMsg,
              rawData: result.rawData,
              signature: result.signature,
              encryptedData: result.encryptedData,
              iv: result.iv,
              userInfo: {
                mobile: result.userInfo.mobile,
                validCode: result.userInfo.validCode,
                nickName: result.userInfo.nickName,
                avatarUrl: result.userInfo.avatarUrl,
                gender: result.userInfo.gender
              }
            }
          };
          wx.request({
            url: "",
            method: "POST",
            dataType: "json",
            data: registerdata,
            header: {
              "content-type": "application/json",
            },
            success: regres => {
              console.log("注册", regres);
              if (regres.data.code == "0000") {
                //注册成功
                userLogin(resolve, reject)
              } else {
                //注册失败
                showToast("注册失败", 600, "none")
                reject(false);
              }
            }
          })
        },
        fail: function (e_message) {
          console.log(e_message, "获取用户信息失败")
        }
      })
    },
    fail: function (e_code) {
      console.log(e_code, "获取code失败")
    }
  })
}
//登录
function login() {
  return new Promise((resolve, reject) => {
    userLogin(resolve, reject);
  })
}

// 加载loading
function loading(title) {
  wx.showLoading({
    title: title,
  })
}

//消息提示窗
function showToast(title, time, icon) {
  wx.showToast({
    title: title,
    icon: icon,
    duration: time
  })
}
// 封装数据请求
function axios(url, method, data) {
  loading("加载中...")
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${environment}${url}`,
      method: method,
      dataType: "json",
      data: data,
      header: {
        "content-type": "application/json",
        "token": token || "1221321321",
        "userId": userId || "asdjhasjkdh"
      },
      success: function (res) {
        wx.hideLoading()
        resolve(res)
      },
      fail: function (e) {
        reject(e)
      },
    })
  })
}
//判断有无网络
function isnetwork() {
  return new Promise((resolve, reject) => {
    wx.getNetworkType({
      success: function (res) {
        if (res.networkType == "none") {
          reject(false)
        } else {
          resolve(true)
        }
      }
    })
  })
}

export default {
  axios,
  isLogin,
  isnetwork,
  login
}
//调用的时候 that.$axios.以上方法名 
//里边套有promise调用 that.$axios.以上方法名.then(res=>{},e=>{});res成功,e失败