(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/Main1/TurnScene.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fa9b1igKT9CmbjhkUvquDgB', 'TurnScene', __filename);
// Scripts/Main1/TurnScene.js

"use strict";

var _properties;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

    properties: (_properties = {
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
        clickAudio: {
            url: cc.AudioClip,
            default: null
        },
        help: cc.Node,
        mask: cc.Node,
        //获取用户名字节点
        nameUser: {
            default: null,
            type: cc.Node
        },
        //获取用户头像及诶但
        pictureUser: {
            default: null,
            type: cc.Node
        },
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
        backButton: cc.Node,
        notice: cc.Node
    }, _defineProperty(_properties, "mask", cc.Node), _defineProperty(_properties, "shareIcon", cc.Node), _defineProperty(_properties, "shareText", cc.Node), _defineProperty(_properties, "helpBtn", cc.Node), _defineProperty(_properties, "singleBtn", cc.Node), _defineProperty(_properties, "warBtn", cc.Node), _defineProperty(_properties, "worldRank", cc.Node), _defineProperty(_properties, "friendRank", cc.Node), _properties),

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        if (CC_WECHATGAME) {
            //隐藏游戏圈
            cc.find("PebmanentNode").getComponent("UserInfo").gameClubButton.show();
        }
        var self = this;
        this.helpX = this.help.x;
        this.mask.active = false;
        this.mask.on("touchstart", function () {
            self.mask.active = false;
            var runBack = cc.moveTo(0.5, cc.p(self.helpX, 960));
            self.help.runAction(runBack);
        }.bind(this));
        console.log("加载排行榜页面");
        this.MAIN_MENU = '';
        this.topScore = 0;
        this.mask.active = false;
        this.noticeX = this.notice.x;
        this.noticeY = this.notice.y;
        //按钮能够点击
        this.canClick = true;
        // if(cc.find("PebmanentNode").getComponent("UserInfo").pictureUser=="")
        // {
        //     cc.find("PebmanentNode").getComponent("UserInfo").pictureUser="http://image.baidu.com/search/detail?ct=503316480&z=0&ipn=d&word=%E5%9B%BE%E7%89%87&hs=0&pn=7&spn=0&di=135898298690&pi=0&rn=1&tn=baiduimagedetail&is=0%2C0&ie=utf-8&oe=utf-8&cl=2&lm=-1&cs=2260926939%2C1550208231&os=2086677986%2C2932337668&simid=0%2C0&adpicid=0&lpn=0&ln=30&fr=ala&fm=&sme=&cg=&bdtype=0&oriquery=&objurl=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01690955496f930000019ae92f3a4e.jpg%402o.jpg&fromurl=ippr_z2C%24qAzdH3FAzdH3Fooo_z%26e3Bzv55s_z%26e3Bv54_z%26e3BvgAzdH3Fo56hAzdH3FZNTAaMzMy_z%26e3Bip4s%3FfotpviPw2j%3D5g&gsm=0&islist=&querylist=";
        // }
        // if(cc.sys.isNative){
        //     cc.log(cc.find("PebmanentNode").getComponent("UserInfo").pictureUser+"++++++++++++++++++++++++++++++++++++++++++++++++++++");
        //     cc.find("PebmanentNode").getComponent("UserInfo").LoadUser(cc.find("PebmanentNode").getComponent("UserInfo").pictureUser,cc.find("PebmanentNode").getComponent("UserInfo").nameUser,cc.find("Canvas/UserName"),cc.find("Canvas/UserPicture"));
        // }
        if (CC_WECHATGAME) {
            cc.find("PebmanentNode").getComponent("UserInfo").loadUserPictureByWx(cc.find("PebmanentNode").getComponent("UserInfo").pictureUser, cc.find("Canvas/UserPicture"));
            this.node.getChildByName("UserName").getComponent(cc.Label).string = cc.find("PebmanentNode").getComponent("UserInfo").nameUser;
        }
        this.backButton.on("touchstart", function () {
            if (this.canClick) {
                cc.audioEngine.play(this.clickAudio, false, 1);
                if (cc.sys.os === cc.sys.OS_ANDROID) {
                    //返回手机桌面
                    cc.director.end();
                }
            }
        }.bind(this));
        this.notice.on("touchstart", function () {
            var action = cc.moveTo(0.5, cc.p(this.noticeX, this.noticeY));
            this.notice.runAction(action);
            this.mask.active = false;
        }.bind(this));
        this.mask.on("touchstart", function () {
            var action = cc.moveTo(0.5, cc.p(this.noticeX, this.noticeY));
            this.notice.runAction(action);
            this.mask.active = false;
        }.bind(this));
        this.shareIcon.on('touchstart', function () {
            if (this.canClick) {
                if (CC_WECHATGAME) {
                    console.log("首页share");
                    cc.find("PebmanentNode").getComponent("UserInfo").shareFriends();
                } else if (cc.sys.isNative) {
                    //原生平台分享
                    // cc.find("PebmanentNode").getComponent("UserInfo").nativeShare();
                }
            }
        }.bind(this));
        this.shareText.on('touchstart', function () {
            if (this.canClick) {
                if (CC_WECHATGAME) {
                    console.log("首页share");
                    cc.find("PebmanentNode").getComponent("UserInfo").shareFriends();
                } else if (cc.sys.isNative) {
                    //原生平台分享
                    // cc.find("PebmanentNode").getComponent("UserInfo").nativeShare();
                }
            }
        }.bind(this));
    },
    start: function start() {},

    //跳转单人选择场景
    TurnOneChoose: function TurnOneChoose() {
        cc.log("#####################");
        if (CC_WECHATGAME) {
            wx.showLoading({
                title: '火速加载中...',
                mask: true
            });
        }
        cc.audioEngine.play(this.clickAudio, false, 1);
        //转到切换模式界面
        cc.director.loadScene("OneChoose", function () {
            if (CC_WECHATGAME) {
                //隐藏加载中
                wx.hideLoading();
            }
        });
    },
    //跳转多人选择场景
    TurnPersonsChoose: function TurnPersonsChoose() {
        if (CC_WECHATGAME) {
            wx.showLoading({
                title: '火速加载中...',
                mask: true
            });
        }
        cc.audioEngine.play(this.clickAudio, false, 1);
        cc.log("++++++++++++++++++++++++++++++++++++++++++++++++++");
        cc.director.loadScene("PersonsChoose", function () {
            if (CC_WECHATGAME) {
                //隐藏加载中
                wx.hideLoading();
            }
        });
    },
    helpFun: function helpFun() {
        console.log("进入help");
        this.mask.active = true;
        var runA = cc.moveTo(0.5, cc.p(540, 960));
        //显示帮助节点
        this.help.runAction(runA);
    },
    showRank: function showRank() {
        if (CC_WECHATGAME) {
            this.canClick = false;
            //显示黑色背景
            cc.find("PebmanentNode/dark").active = true;
            //其他按钮不允许点击
            console.log("helpBtn is ", this.helpBtn.getComponent(cc.Button));
            console.log("backButton is ", this.backButton.getComponent(cc.Button));
            console.log("singleBtn  is ", this.singleBtn.getComponent(cc.Button));
            console.log("warBtn is ", this.warBtn.getComponent(cc.Button));
            this.helpBtn.getComponent(cc.Button).interactable = false;
            this.backButton.getComponent(cc.Button).interactable = false;
            this.singleBtn.getComponent(cc.Button).interactable = false;
            this.warBtn.getComponent(cc.Button).interactable = false;
            this.worldRank.getComponent(cc.Button).interactable = false;
            this.friendRank.getComponent(cc.Button).interactable = false;
            //显示排行榜页面
            cc.find("PebmanentNode").getComponent("UserInfo").showRank();
            //显示排行榜
            cc.find("PebmanentNode").getComponent("UserInfo").rankNode.active = true;
        }
    },
    //显示世界排行
    showWorldRank: function showWorldRank() {
        this.canClick = false;
        if (CC_WECHATGAME) {
            //其他按钮不允许点击
            this.helpBtn.getComponent(cc.Button).interactable = false;
            this.backButton.getComponent(cc.Button).interactable = false;
            this.singleBtn.getComponent(cc.Button).interactable = false;
            this.warBtn.getComponent(cc.Button).interactable = false;
            this.worldRank.getComponent(cc.Button).interactable = false;
            this.friendRank.getComponent(cc.Button).interactable = false;
            //显示世界排行榜页面
            cc.find("PebmanentNode").getComponent("UserInfo").showWorldRank();
        }
    },
    update: function update(dt) {},

    share: function share() {
        if (CC_WECHATGAME) {
            console.log("首页share");
            cc.find("PebmanentNode").getComponent("UserInfo").shareFriends();
        } else if (cc.sys.isNative) {
            //原生平台分享
            // cc.find("PebmanentNode").getComponent("UserInfo").nativeShare();
        }
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
        //# sourceMappingURL=TurnScene.js.map
        