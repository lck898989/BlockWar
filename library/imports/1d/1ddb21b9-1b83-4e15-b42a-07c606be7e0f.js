"use strict";
cc._RF.push(module, '1ddb2G5G4NOFbQqB8YGvn4P', 'MatchUser');
// Scripts/ChooseGame/MatchUser.js

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
        backButton: cc.Node,
        tetirsComment: cc.Node,
        stoneComment: cc.Node,
        puyouComment: cc.Node,
        figureComment: cc.Node,
        mask: cc.Node,
        clickAudio: {
            default: null,
            url: cc.AudioClip
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        if (CC_WECHATGAME) {
            //隐藏游戏圈
            cc.find("PebmanentNode").getComponent("UserInfo").gameClubButton.hide();
        }
        //播放背景音乐
        if (cc.director.isPaused) {
            console.log("多人选择界面暂停了");
            cc.director.resume();
        }
        this.tetirsX = this.tetirsComment.x;
        this.stoneX = this.stoneComment.x;
        this.puyouX = this.puyouComment.x;
        this.figureX = this.figureComment.x;
        this.mask.active = false;
        var self = this;
        this.loadMatchUserSuccess = false;
        if (cc.sys.isNative) {
            cc.find("PebmanentNode").getComponent("UserInfo").LoadUser(cc.find("PebmanentNode").getComponent("UserInfo").pictureUser, cc.find("PebmanentNode").getComponent("UserInfo").nameUser, cc.find("Canvas/UserName"), cc.find("Canvas/UserPicture"));
        }
        if (CC_WECHATGAME) {
            this.node.getChildByName("UserName").getComponent(cc.Label).string = cc.find("PebmanentNode").getComponent("UserInfo").nameUser;
            cc.find("PebmanentNode").getComponent("UserInfo").loadUserPictureByWx(cc.find("PebmanentNode").getComponent("UserInfo").pictureUser, cc.find("Canvas/UserPicture"));
        }
        this.backButton.on("touchstart", function () {
            cc.director.loadScene("Main");
        });
        //加入场景预加载
        cc.director.preloadScene("MatchUser", function () {
            self.loadMatchUserSuccess = true;
        });
        var self = this;
        this.mask.on("touchstart", function () {
            console.log("俄罗斯方块的x坐标是 ", self.tetirsComment.x);
            var tX = Number(self.tetirsComment.x.toFixed(2));
            var sX = Number(self.stoneComment.x.toFixed(2));
            var pX = Number(self.puyouComment.x.toFixed(2));
            var fX = Number(self.figureComment.x.toFixed(2));
            console.log("tx is ", tX);
            if (tX === 0) {
                console.log("TTTTTTTTTTTTTTTTTTTTT");
                var backA = cc.moveTo(0.4, cc.p(self.tetirsX, self.tetirsComment.y));
                self.tetirsComment.runAction(backA);
            } else if (sX === 0) {
                var backb = cc.moveTo(0.4, cc.p(self.stoneX, self.stoneComment.y));
                self.stoneComment.runAction(backb);
            } else if (pX === 0) {
                var backc = cc.moveTo(0.4, cc.p(self.puyouX, self.puyouComment.y));
                self.puyouComment.runAction(backc);
            } else if (fX === 0) {
                var backd = cc.moveTo(0.4, cc.p(self.figureX, self.figureComment.y));
                self.figureComment.runAction(backd);
            }
            self.mask.active = false;
        }.bind(this));
    },

    //点击俄罗斯方块匹配玩家
    PressBlock: function PressBlock() {
        if (CC_WECHATGAME) {
            wx.showLoading({
                title: '火速加载中...',
                mask: true
            });
        }
        if (this.loadMatchUserSuccess) {
            cc.director.loadScene("MatchUser", function () {
                if (CC_WECHATGAME) {
                    wx.hideLoading();
                }
            });
        } else {
            new Promise(function (resolve, reject) {
                cc.director.preloadScene("MatchUser", function () {
                    self.loadMatchUserSuccess = true;
                    resolve("OK");
                });
            }).then(function (data) {
                console.log("data is " + data);
                cc.director.loadScene("MatchUser", function () {
                    if (CC_WECHATGAME) {
                        wx.hideLoading();
                    }
                });
            });
        }
        cc.find("PebmanentNode").getComponent("UserInfo").nGameType = "1";
        cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg({ "tag1": 1, "type": "1", "score": cc.find("PebmanentNode").getComponent("UserInfo").nUserScore, "nMapRow": "", "nMapCol": "" });
        // cc.director.loadScene("MatchUser");
    },
    //点击宝石方块匹配玩家
    PressStoneBlock: function PressStoneBlock() {
        // if(this.loadMatchUserSuccess){
        //     cc.director.loadScene("MatchUser");
        // }else{
        //     new Promise(function(resolve,reject){
        //         cc.director.preloadScene("MatchUser",function(){
        //             self.loadMatchUserSuccess = true;
        //             resolve("OK");
        //         })
        //     }).then(function(data){
        //         console.log("data is " + data);
        //         cc.director.loadScene("MatchUser");
        //     });
        // }
        // cc.find("PebmanentNode").getComponent("UserInfo").nGameType="2";
        // cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg({"tag1":1,"type":"2","score":cc.find("PebmanentNode").getComponent("UserInfo").nUserScore,"nMapRow":"","nMapCol":""});
    },
    //点击画像方块匹配玩家
    PressFigureBlock: function PressFigureBlock() {
        if (CC_WECHATGAME) {
            wx.showLoading({
                title: '火速加载中...',
                mask: true
            });
        }
        if (this.loadMatchUserSuccess) {
            cc.director.loadScene("MatchUser", function () {
                if (CC_WECHATGAME) {
                    wx.hideLoading();
                }
            });
        } else {
            new Promise(function (resolve, reject) {
                cc.director.preloadScene("MatchUser", function () {
                    self.loadMatchUserSuccess = true;
                    resolve("OK");
                });
            }).then(function (data) {
                console.log("data is " + data);
                cc.director.loadScene("MatchUser", function () {
                    if (CC_WECHATGAME) {
                        wx.hideLoading();
                    }
                });
            });
        }
        cc.find("PebmanentNode").getComponent("UserInfo").nGameType = "4";
        cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg({ "tag1": 1, "type": "4", "score": cc.find("PebmanentNode").getComponent("UserInfo").nUserScore, "nMapRow": "", "nMapCol": "" });
    },
    rundomChoose: function rundomChoose() {
        var r = Math.floor(Math.random() * 2);
        //随机俄罗斯方块和画像方块
        if (r === 0) {
            this.PressBlock();
        } else {
            this.PressFigureBlock();
        }
    },
    helpLeft: function helpLeft(event, tag) {
        if (typeof tag === "string" && tag.length === 2) {
            console.log("进入左移菜单");
            //左边的游戏类型
            var targetLeft = tag[0];
            console.log("进入左边的游戏类型菜单是 ", targetLeft);
            //当前菜单的类型
            var currentMenu = tag[1];
            console.log("进入当前的游戏类型菜单是 ", targetLeft);

            this.moveMenu(currentMenu, targetLeft);
        }
    },
    helpRight: function helpRight(event, tag) {
        if (typeof tag === "string" && tag.length === 2) {
            console.log("进入右移菜单");
            //当前菜单的类型
            var currentMenu = tag[0];
            console.log("进入当前的游戏类型是 ", currentMenu);
            //右边菜单的类型
            var targetRight = tag[1];
            console.log("进入右边的游戏菜单类型是 ", targetRight);
            this.moveMenu(currentMenu, targetRight);
        }
    },
    moveMenu: function moveMenu(currentMenu, targetMenu) {
        //进入moveMenu
        console.log("进入moveMenu方法");
        switch (currentMenu) {
            case "1":
                var backA = cc.moveTo(0.4, cc.p(this.tetirsX, this.tetirsComment.y));
                this.tetirsComment.runAction(backA);
                break;
            case "2":
                var backB = cc.moveTo(0.4, cc.p(this.stoneX, this.stoneComment.y));
                this.stoneComment.runAction(backB);
                break;
            case "3":
                var backC = cc.moveTo(0.4, cc.p(this.puyouX, this.puyouComment.y));
                this.puyouComment.runAction(backC);
                break;
            case "4":
                var backD = cc.moveTo(0.4, cc.p(this.figureX, this.figureComment.y));
                this.figureComment.runAction(backD);
                break;
        }
        //缓慢的移动到显示的位置
        var moveAction = cc.moveTo(0.5, cc.p(0, 0));
        console.log("进入选择targetMenu 分支");
        switch (targetMenu) {
            //俄罗斯方块
            case "1":
                this.tetirsComment.runAction(moveAction);
                break;
            //宝石方块    
            case "2":
                this.stoneComment.runAction(moveAction);
                break;
            //噗哟噗哟    
            case "3":
                this.puyouComment.runAction(moveAction);
                break;
            //画像方块    
            case "4":
                this.figureComment.runAction(moveAction);
                break;
        }
    },
    help: function help() {
        //显示俄罗斯方块的说明
        this.mask.active = true;
        var moveAction = cc.moveTo(0.5, cc.p(0, 0));
        this.tetirsComment.runAction(moveAction);
    },
    //分享
    share: function share() {
        if (CC_WECHATGAME) {
            console.log("首页share");
            cc.find("PebmanentNode").getComponent("UserInfo").shareFriends();
        } else if (cc.sys.isNative) {
            //原生平台分享
            cc.find("PebmanentNode").getComponent("UserInfo").nativeShare();
        }
    },
    start: function start() {}
}
// update (dt) {},
);

cc._RF.pop();