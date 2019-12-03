(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/Main1/ShowUser.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'f5724YT7vNIXZlD7rNtHSth', 'ShowUser', __filename);
// Scripts/Main1/ShowUser.js

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

        rankNode: cc.Node,
        display: cc.Sprite
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this.display.active = false;
        this.mask.active = false;
        this.noticeX = this.notice.x;
        this.noticeY = this.notice.y;
        // if(cc.find("PebmanentNode").getComponent("UserInfo").pictureUser=="")
        // {
        //     cc.find("PebmanentNode").getComponent("UserInfo").pictureUser="http://image.baidu.com/search/detail?ct=503316480&z=0&ipn=d&word=%E5%9B%BE%E7%89%87&hs=0&pn=7&spn=0&di=135898298690&pi=0&rn=1&tn=baiduimagedetail&is=0%2C0&ie=utf-8&oe=utf-8&cl=2&lm=-1&cs=2260926939%2C1550208231&os=2086677986%2C2932337668&simid=0%2C0&adpicid=0&lpn=0&ln=30&fr=ala&fm=&sme=&cg=&bdtype=0&oriquery=&objurl=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01690955496f930000019ae92f3a4e.jpg%402o.jpg&fromurl=ippr_z2C%24qAzdH3FAzdH3Fooo_z%26e3Bzv55s_z%26e3Bv54_z%26e3BvgAzdH3Fo56hAzdH3FZNTAaMzMy_z%26e3Bip4s%3FfotpviPw2j%3D5g&gsm=0&islist=&querylist=";
        // }
        if (cc.sys.isNative) {
            cc.log(cc.find("PebmanentNode").getComponent("UserInfo").pictureUser + "++++++++++++++++++++++++++++++++++++++++++++++++++++");
            cc.find("PebmanentNode").getComponent("UserInfo").LoadUser(cc.find("PebmanentNode").getComponent("UserInfo").pictureUser, cc.find("PebmanentNode").getComponent("UserInfo").nameUser, cc.find("Canvas/UserName"), cc.find("Canvas/UserPicture"));
        }
        if (wx !== undefined) {
            cc.find("PebmanentNode").getComponent("UserInfo").loadUserPictureByWx(cc.find("PebmanentNode").getComponent("UserInfo").pictureUser, cc.find("Canvas/UserPicture"));
            this.node.getChildByName("UserName").getComponent(cc.Label).string = cc.find("PebmanentNode").getComponent("UserInfo").nameUser;
        }
        this.backButton.on("touchstart", function () {
            cc.audioEngine.play(this.clickAudio, false, 1);
            if (cc.sys.os === cc.sys.OS_ANDROID) {
                //返回手机桌面
                cc.director.end();
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
            console.log("首页share");
            cc.find("PebmanentNode").getComponent("UserInfo").shareFriends();
        }.bind(this));
        this.shareText.on('touchstart', function () {
            console.log("首页share");
            cc.find("PebmanentNode").getComponent("UserInfo").shareFriends();
        }.bind(this));
    },
    start: function start() {},

    // showNotice : function(){
    //     cc.audioEngine.play(this.clickAudio,false,1);
    //     this.mask.active= true;
    //     let action = cc.moveTo(1,cc.p(545,980));
    //     this.notice.runAction(action);
    // },

    onDestroy: function onDestroy() {},
    share: function share() {
        console.log("首页share");
        cc.find("PebmanentNode").getComponent("UserInfo").shareFriends();
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
        //# sourceMappingURL=ShowUser.js.map
        