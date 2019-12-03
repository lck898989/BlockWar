(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/ChooseGame/chooseModel.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'a78e1tR/xBCKJe2pzGRhh3X', 'chooseModel', __filename);
// Scripts/ChooseGame/chooseModel.js

"use strict";

/*
 * @Author: mikey.zhaopeng 
 * @Date: 2018-06-20 09:51:08 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-08-19 14:56:55
 */
cc.Class({
    extends: cc.Component,

    properties: {
        nickName: cc.Node,
        icon: cc.Node,
        clickAudio: {
            url: cc.AudioClip,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        if (CC_WECHATGAME) {
            //隐藏游戏圈
            cc.find("PebmanentNode").getComponent("UserInfo").gameClubButton.hide();
        }
        // //预加载这些场景
        cc.director.preloadScene("Game1", function () {
            cc.log("俄罗斯方块预加载成功！！");
        });
        cc.director.preloadScene("Game2", function () {
            cc.log("宝石方块预加载成功");
        });
        // cc.director.preloadScene("Game3",function(){
        //     cc.log("噗哟噗哟预加载成功");
        // });
        cc.director.preloadScene("Game4", function () {
            cc.log("画像方块预加载成功");
        });
    },
    start: function start() {
        if (cc.sys.isNative) {
            // var userInfoScript = cc.find("PebmanentNode").getComponent("UserInfo");
            // this.nickName.getComponent(cc.Label).string = userInfoScript.nameUser;
            // userInfoScript.LoadUserPicture(userInfoScript.pictureUser,this.icon);
        }
        if (CC_WECHATGAME) {
            var userInfoScript = cc.find("PebmanentNode").getComponent("UserInfo");
            console.log("in chooseModel nameUser is ", userInfoScript.nameUser);
            this.nickName.getComponent(cc.Label).string = userInfoScript.nameUser;
            cc.find("PebmanentNode").getComponent("UserInfo").loadUserPictureByWx(cc.find("PebmanentNode").getComponent("UserInfo").pictureUser, cc.find("Canvas/icon"));
        }
    },

    //画像方块
    figureBlock: function figureBlock() {
        if (CC_WECHATGAME) {
            wx.showLoading({
                title: '火速加载中...',
                mask: true
            });
        }
        this.playClickMusic();
        cc.director.loadScene("Game4", function () {
            if (CC_WECHATGAME) {
                //隐藏加载框
                wx.hideLoading();
            }
        });
    },
    //噗哟噗哟
    puyoBlock: function puyoBlock() {
        // this.playClickMusic();
        // cc.director.loadScene("Game2");
    },
    //俄罗斯方块
    tetrisBlock: function tetrisBlock() {
        if (CC_WECHATGAME) {
            wx.showLoading({
                title: '火速加载中...',
                mask: true
            });
        }
        this.playClickMusic();
        cc.director.loadScene("Game1", function () {
            if (CC_WECHATGAME) {
                //隐藏加载框
                wx.hideLoading();
            }
        });
    },
    //宝石方块
    stoneBlock: function stoneBlock() {
        if (CC_WECHATGAME) {
            wx.showLoading({
                title: '火速加载中...',
                mask: true
            });
        }
        this.playClickMusic();
        cc.director.loadScene("Game3", function () {
            if (CC_WECHATGAME) {
                //隐藏加载框
                wx.hideLoading();
            }
        });
    },
    //匹配返回
    back: function back() {
        if (CC_WECHATGAME) {
            wx.showLoading({
                title: '火速加载中...',
                mask: true
            });
        }
        this.playClickMusic();
        cc.director.loadScene("Main", function () {
            if (CC_WECHATGAME) {
                wx.hideLoading();
            }
        });
    },
    share: function share() {
        if (CC_WECHATGAME) {
            console.log("首页share");
            cc.find("PebmanentNode").getComponent("UserInfo").shareFriends();
        } else if (cc.sys.isNative) {
            //原生平台分享
            // cc.find("PebmanentNode").getComponent("UserInfo").nativeShare();
        }
    },
    playClickMusic: function playClickMusic() {
        cc.audioEngine.play(this.clickAudio, false, 1);
    }
    // update (dt) {},

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
        //# sourceMappingURL=chooseModel.js.map
        