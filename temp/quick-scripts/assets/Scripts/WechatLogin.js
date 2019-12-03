(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/WechatLogin.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '8c0ebm62TJLSqo6MMDrfor2', 'WechatLogin', __filename);
// Scripts/WechatLogin.js

"use strict";

// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        waitServer: cc.Node,
        clickAudio: {
            url: cc.AudioClip,
            default: null
        },
        startBtn: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {

        //初始化用code获取的accesstoken
        this.accessToken = "";
        //初始化用code获取的openid
        this.openId = "";
        //初始化用code获取的refeshtoken
        this.refshToken = "";

        //初始化accessToken计时器
        this.fTokenTime = 0;
        //初始化accessToken计时开关
        this.isTokenTime = false;
        // this.waitServer.active = false;
        //    //初始化是否刷新refsh
        //    this.isRefsh=false;
        // this.is=false;
        this.screenAdapt();
        this.wxLoginSuccess = false;
    },

    //微信登陆i
    WechatLogin: function WechatLogin() {
        if (CC_WECHATGAME) {
            //显示加载中提升用户体验
            wx.showLoading({
                title: '获取用户信息...',
                mask: true
            });
        }
        //播放背景音乐
        this.current = cc.audioEngine.play(this.clickAudio, false, 1);
        if (cc.sys.isNative) {
            console.log("登录方法进入原环境");
            // jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity","wxLogin","()V");
            cc.director.loadScene("Main");
        } else {
            //进入微信小游戏开发环境
            if (CC_WECHATGAME) {
                this.waitServer.active = true;
                console.log("进入微信小游戏开发平台");
                var self = this;
                wx.checkSession({
                    success: function success() {
                        console.log("登录信息没有过期");
                        self.wechatGameLogin();
                    },
                    fail: function fail() {
                        //session_key失效之后再重新登录
                        console.log("微信登录已经过期重新登录微信");
                        self.wechatGameLogin();
                    },
                    complete: function complete() {}
                });
            } else {
                cc.director.loadScene("Main");
            }
        }
    },
    //微信小游戏微信登录方法
    wechatGameLogin: function wechatGameLogin() {
        var self = this;
        wx.login({
            success: function success(code) {
                console.log("code is ", code);
                code.appid = "wx659abd0e802de13a";
                code.secret = "49cc1d1dd2fac12d4aa622eebe403605";
                if (code != null) {
                    //发起微信请求
                    wx.request({
                        url: "https://m5.ykplay.com/LoginCode",
                        data: code,
                        header: {},
                        method: "POST",
                        dataType: "json",
                        success: function success(res) {
                            console.log("res is ", res);
                            //获得session_key
                            self.sessionKey = res.data;
                            console.log(res.data);
                            wx.getUserInfo({
                                success: function success(res) {
                                    console.log("res is ", res);
                                    res.sessionKey = self.sessionKey.data;
                                    //保存用户信息
                                    console.log("在微信登录里面昵称是 :" + res.userInfo.nickName);
                                    cc.find("PebmanentNode").getComponent("UserInfo").nameUser = res.userInfo.nickName;
                                    console.log("用户名是：", cc.find("PebmanentNode").getComponent("UserInfo").nameUser);
                                    //保存用户头像信息
                                    cc.find("PebmanentNode").getComponent("UserInfo").pictureUser = res.userInfo.avatarUrl;
                                    wx.request({
                                        url: "https://m5.ykplay.com/UserInfo",
                                        data: res,
                                        header: {},
                                        method: "POST",
                                        dataType: "json",
                                        success: function success(result) {
                                            console.log("res is ", result);
                                            cc.find("PebmanentNode").getComponent("GetServer").GetServerMsg(result.data);
                                        },
                                        fail: function fail(res) {
                                            console.log(res);
                                            console.log("userInfo request fail");
                                        },
                                        complete: function complete() {}
                                    });
                                }
                            });
                        },
                        fail: function fail() {
                            console.log("fail");
                        },
                        complete: function complete() {}

                    });
                }
            },
            fail: function fail() {},
            complete: function complete() {}
        });
    },
    //通过code获取微信accesstoken
    GetAccessToken: function GetAccessToken(code1) {
        console.log("in getAccessToken code1 is " + code1);
        var url = "https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx72f9006d0b1d9b7f&secret=fe9036e8fdb8bc990a318227d0e68a5e&code=" + code1 + "&grant_type=authorization_code";
        // var str = "shop=钻石";
        // var str="name=1&password=1";
        var self = this;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
                console.log("微信相应");
                var response = xhr.responseText;
                console.log("in getAccessToken response is " + response);
                self.SendServer(response);
                var msg = JSON.parse(response);
                self.accessToken = msg.access_token;
                self.openId = msg.openid;
                self.refshToken = msg.refresh_token;
            }
        };

        //    xhr.send("name=100"+"&password=1");
        xhr.open("GET", url, true);
        xhr.send();
    },
    //将获取到的accesstoken信息发给服务器

    SendServer: function SendServer(str) {
        var url = "https://m5.ykplay.com/login";
        var str1 = "{\"tag\":\"wxLogin\",\"body\":" + str + "}";
        var xhr = new XMLHttpRequest();
        var self = this;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
                console.log("相应信息。。。");
                var response = xhr.responseText;
                console.log("response is " + response);
                var msg1 = JSON.parse(response);
                cc.find("PebmanentNode").getComponent("GetServer").GetServerMsg(msg1);
            }
        };
        console.log("发送信息到服务器");
        xhr.open("POST", url);
        xhr.send(str1);
    },
    //登陆成功后访问微信获取用户信息
    GetUserMsg: function GetUserMsg() {
        var url = "https://api.weixin.qq.com/sns/userinfo?access_token=" + this.accessToken + "&openid=" + this.openId;
        // var str = "shop=钻石";
        // var str="name=1&password=1";
        var self = this;
        self.isTokenTime = true;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
                var response = xhr.responseText;
                cc.log(response);
                var msg2 = JSON.parse(response);
                cc.find("PebmanentNode").getComponent("UserInfo").nameUser = msg2.nickname;
                cc.log(msg2.headimgurl + "");
                //  msg2.headimgurl="";
                //  if(msg2.headimgurl==""||msg2.headimgurl==null||msg2.headimgurl==undefined)
                //  {
                //      cc.log("===================================");

                //      cc.find("PebmanentNode").getComponent("UserInfo").pictureUser="http://image.baidu.com/search/detail?ct=503316480&z=0&ipn=d&word=%E5%9B%BE%E7%89%87&hs=0&pn=7&spn=0&di=135898298690&pi=0&rn=1&tn=baiduimagedetail&is=0%2C0&ie=utf-8&oe=utf-8&cl=2&lm=-1&cs=2260926939%2C1550208231&os=2086677986%2C2932337668&simid=0%2C0&adpicid=0&lpn=0&ln=30&fr=ala&fm=&sme=&cg=&bdtype=0&oriquery=&objurl=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01690955496f930000019ae92f3a4e.jpg%402o.jpg&fromurl=ippr_z2C%24qAzdH3FAzdH3Fooo_z%26e3Bzv55s_z%26e3Bv54_z%26e3BvgAzdH3Fo56hAzdH3FZNTAaMzMy_z%26e3Bip4s%3FfotpviPw2j%3D5g&gsm=0&islist=&querylist=";
                //      self.SendUserInfo(JSON.stringify(msg2));
                //  }
                //  else
                //  {
                //     cc.find("PebmanentNode").getComponent("UserInfo").pictureUser=msg2.headimgurl;
                //     self.SendUserInfo(JSON.stringify(msg2));
                //  }
                cc.find("PebmanentNode").getComponent("UserInfo").pictureUser = msg2.headimgurl;
                //  //保存图片的texture2D到全局对象中
                //  cc.find("PebmanentNode").getComponent("UserInfo").userImage = cc.find("PebmanentNode").getComponent("UserInfo").getUserPicture(msg2.headimgurl);
                self.SendUserInfo(JSON.stringify(msg2));
            }
        };
        //    xhr.send("name=100"+"&password=1");
        xhr.open("GET", url, true);
        xhr.send();
    },
    //访问并新刷新accesstoken
    RefreshToken: function RefreshToken() {
        this.isRefsh = true;
        var url = "https://api.weixin.qq.com/sns/oauth2/refresh_token?appid=wx72f9006d0b1d9b7f&grant_type=refresh_token&refresh_token=" + this.refshToken;
        // var str = "shop=钻石";
        // var str="name=1&password=1";
        var self = this;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
                var response = xhr.responseText;
                self.SendServer(response);
                var msg = JSON.parse(response);
                self.accessToken = msg.access_token;
                self.openId = msg.openid;
                self.refshToken = msg.refresh_token;
            }
        };
        //    xhr.send("name=100"+"&password=1");
        xhr.open("GET", url, true);
        xhr.send();
    },
    //将获取到的用户信息发给服务器
    SendUserInfo: function SendUserInfo(str) {
        var url = "https://m5.ykplay.com/UserMsg";
        var str1 = "{\"tag\":\"UserMsg\"," + "\"type\":1," + "\"body\":" + str + "}";
        var xhr = new XMLHttpRequest();
        var self = this;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
                var response = xhr.responseText;
                var msg1 = JSON.parse(response);
                //接受服务器用户并判断是否为非法用户
                cc.find("PebmanentNode").getComponent("GetServer").GetServerMsg(msg1);
            }
        };
        xhr.open("POST", url);
        xhr.send(str1);
    },
    start: function start() {},

    //屏幕适配
    screenAdapt: function screenAdapt() {
        var size = cc.view.getFrameSize();
        var size1 = cc.director.getWinSize();

        console.log("设计分辨率的宽是", size1.width);
        console.log("设计分辨率的高是", size1.height);
        console.log("手机屏幕的宽是", size.width);
        console.log("手机屏幕的高是", size.height);
    },
    update: function update(dt) {
        // if(this.isTokenTime)
        // { 
        //     this.fTokenTime +=dt; 
        //     if(this.fTokenTime>7000)
        //     {
        //         this.RefreshToken();
        //         this.isTokenTime=false;
        //         this.fTokenTime=0;
        //     }
        // }
        // if(!this.wxLoginSuccess){
        //     if(cc.sys.isNative){
        //         //判断用户微信是否登录
        //         var loginState = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity","GetWeChatState","()I")
        //         console.log("微信登录状态是",loginState + typeof(loginState));
        //         console.log("loginState === 1",loginState === 1);
        //         if(loginState === 1){
        //             var code = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity","GetCode","()Ljava/lang/String;");
        //             console.log("in update code is ",code);
        //             this.GetAccessToken(code);
        //             jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity","Init","()V");
        //             this.wxLoginSuccess = true;
        //         }
        //     }
        // }
        // if(Global.wechatSuccess){
        //     //显示等待节点
        //     this.waitServer.active = true;
        // }
        // this.glinkTime += dt;
        // if(this.glinkTime >= 1.5){

        // }
        if (this.startBtn.opacity > 100) {
            this.startBtn.opacity -= dt * 100;
        }
        if (this.startBtn.opacity <= 100) {
            this.startBtn.opacity = 255;
        }
        //登录成功之后设置开始游戏按钮透明度为255
        // if(this.wxLoginSuccess){
        //     this.startBtn.opacity = 255;
        // }
    }
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=WechatLogin.js.map
        