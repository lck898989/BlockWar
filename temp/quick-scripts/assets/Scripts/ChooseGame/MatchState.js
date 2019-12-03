(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/ChooseGame/MatchState.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ea68aYX1BNJ1KyxIBQK1HkZ', 'MatchState', __filename);
// Scripts/ChooseGame/MatchState.js

"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

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
        // //获取用户名字节点
        // nodeName:{
        //     default:null,
        //     type:cc.Node
        // },
        // //获取用户头像节点
        // nodePicture:{
        //     default:null,
        //     type:cc.Node
        // },
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
        userNameLabel: cc.Label,
        rivalNameLabel: cc.Label,
        countDownAudio: {
            default: null,
            url: cc.AudioClip
        },
        clickAudio: {
            default: null,
            url: cc.AudioClip
        },
        backBtn: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this.userNameLabel.string = cc.find("PebmanentNode").getComponent("UserInfo").nameUser;
        if (cc.director.isPaused) {
            //如果游戏暂停了就恢复游戏
            console.log("匹配界面暂停了");
            cc.director.resume();
        }
        //判断是否匹配成功
        this.matchSuccess = false;
        //显示倒计时
        this.showCountDown = 0;
        //初始化计时器
        this.nSuccessTime = 0;
        //倒计时的开始时间
        this.startTime = 5;
        this.node.getChildByName("countDown").active = false;
        this.UserState();
        //预加载游戏场景
        var sceneArr = ["PersonsGame1", "FightFigure"];
        for (var i = 0; i < sceneArr.length; i++) {
            this.preLoadGameScene(sceneArr[i]);
        }
        this.progress = 0;
        this.resource = null;
        this.sceneLoad = false;
        //下载部分资源加快进入场景流程
        if (CC_WECHATGAME) {
            var self = this;
            this.urls = [{ url: 'res/raw-assets/Textures/cPart/tetrisbg.81dbd.png', type: 'png' }, { url: 'res/raw-assets/Textures/bPart/pink/44.1d79a.png', type: 'png' }, { url: 'res/raw-assets/Textures/bPart/yellow/10.b6d8f.png', type: 'png' }, { url: 'res/raw-assets/Textures/bPart/yellow/9.44e42.png', type: 'png' }, { url: 'res/raw-assets/Textures/bPart/yellow/11.68a0f.png', type: 'png' }, { url: 'res/raw-assets/Textures/bPart/yellow/7.cebf4.png', type: 'png' }, { url: 'res/raw-assets/Textures/bPart/yellow/14.7af40.png', type: 'png' }, { url: 'res/raw-assets/Textures/bPart/yellow/13.03702.png', type: 'png' }, { url: 'res/raw-assets/Textures/bPart/yellow/12.8986b.png', type: 'png' }, { url: 'res/raw-assets/Textures/bPart/yellow/8.10c64.png', type: 'png' }, { url: 'res/raw-assets/resources/Game4/-1.33262.png', type: 'png' }, { url: 'res/raw-assets/resources/Game4/7.cebf4.png', type: 'png' }, { url: 'res/raw-assets/resources/Game4/8.10c64.png', type: 'png' }, { url: 'res/raw-assets/resources/Game4/9.44e42.png', type: 'png' }, { url: 'res/raw-assets/resources/Game4/10.b6d8f.png', type: 'png' }, { url: 'res/raw-assets/resources/Game4/11.68a0f.png', type: 'png' }, { url: 'res/raw-assets/resources/Game4/12.8986b.png', type: 'png' }, { url: 'res/raw-assets/resources/Game4/13.03702.png', type: 'png' }, { url: 'res/raw-assets/resources/Game4/14.7af40.png', type: 'png' }, { url: 'res/raw-assets/resources/picture/0.1d79a.png', type: 'png' }, { url: 'res/raw-assets/resources/picture/1.c4498.png', type: 'png' }, { url: 'res/raw-assets/resources/picture/2.ad5ec.png', type: 'png' }, { url: 'res/raw-assets/resources/picture/3.8a1f4.png', type: 'png' }, { url: 'res/raw-assets/resources/picture/4.036f4.png', type: 'png' }, { url: 'res/raw-assets/resources/picture/5.d7fd4.png', type: 'png' }];
            this.clearAll();
            cc.loader.load(self.urls, self.progressCallback.bind(self), self.completeCallback.bind(self));
        }
    },

    clearAll: function clearAll() {
        for (var i = 0; i < this.urls.length; i++) {
            var u = this.urls[i];
            cc.loader.release(u);
        }
    },
    progressCallback: function progressCallback(completedCount, totalCount, res) {
        console.log("进入回调函数");
        console.log("已经完成的数量", completedCount);
        console.log("资源的总数量", totalCount);
        this.progress = completedCount / totalCount;
        console.log("进度是：", this.progress);
        this.resource = res;
    },
    completeCallback: function completeCallback(err, texture) {
        if (err) {
            console.log("下载图片失败");
        }
        console.log("texture is ", texture);
    },
    //预加载所有游戏场景
    preLoadGameScene: function preLoadGameScene(gameSceneName) {
        cc.director.preloadScene(gameSceneName, function () {
            console.log(gameSceneName + "场景预加载成功");
        });
    },
    //判断玩家的匹配状态
    UserState: function UserState() {
        //匹配状态加载两个头像加载自己的头像
        cc.find("PebmanentNode").getComponent("UserInfo").LoadTwoUser(cc.find("PebmanentNode").getComponent("UserInfo").pictureUser, cc.find("PebmanentNode").getComponent("UserInfo").pictureUser, cc.find("UserName"), cc.find("PebmanentNode").getComponent("UserInfo").nameUser, cc.find("UserPicture1"), cc.find("UserPicture"));
    },
    start: function start() {},

    backGame: function backGame() {
        cc.audioEngine.play(this.clickAudio, false, 1);
        //发送数据到服务器告诉他我退出匹配
        var jsonData = {
            tag1: 14,
            score: "",
            type: "",
            state1: "",
            changeMapList1: [],
            removeMapList1: 0,
            nMapRow: "",
            nMapCol: "",
            loading1: ""
        };
        cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg(jsonData);
        cc.director.loadScene("PersonsChoose");
    },
    update: function update(dt) {
        //五秒时间里下载所需要的资源
        console.log("--->>>>>>this.matchSuccess is ", this.matchSuccess);
        if (this.matchSuccess) {
            console.log("匹配成功了%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
            //隐藏back按钮
            this.backBtn.active = false;
            if (cc.find("PebmanentNode").getComponent("UserInfo").rivalName !== "") this.rivalNameLabel.string = cc.find("PebmanentNode").getComponent("UserInfo").rivalName;
            this.node.getChildByName("countDown").active = true;
            //将倒计时显示出来
            this.showCountDown += dt;
            this.nSuccessTime += dt;
            if (this.showCountDown >= 1 && this.startTime != 0) {
                this.playAudio(this.countDownAudio);
                this.node.getChildByName("countDown").getComponent(cc.Label).string = --this.startTime + "s进入游戏";
                this.showCountDown = 0;
            }
            if (this.nSuccessTime >= 5) {
                //获得游戏该用户的游戏类型根据用户的游戏类型跳转到各个不同的游戏场景
                var gameType = cc.find("PebmanentNode").getComponent("UserInfo").nGameType;
                console.log("gameType is " + gameType);
                // gameType = gameType.toString();
                console.log(typeof gameType === "undefined" ? "undefined" : _typeof(gameType));
                switch (gameType) {
                    //如果游戏类型是俄罗斯方块的话加载网络版俄罗斯方块
                    case "1":
                        console.log("游戏类型为俄罗斯");
                        this.nSuccessTime = 0;
                        cc.director.loadScene("PersonsGame1");
                        break;
                    //如果是宝石方块的话就加载网络版的宝石方块    
                    case "2":
                        this.nSuccessTime = 0;
                        cc.director.loadScene("FightStone");
                        break;
                    case "3":
                        break;
                    //如果是画像方块的话就加载网络版的画像方块
                    case "4":
                        this.nSuccessTime = 0;
                        cc.director.loadScene("FightFigure");
                        //初始化敌人地图和自己的地图
                        break;
                }
            }
        }
    },

    //播放音效
    playAudio: function playAudio(audioUrl) {
        cc.audioEngine.play(audioUrl, false, 1);
    },
    //分享方法
    share: function share() {
        if (CC_WECHATGAME) {
            console.log("首页share");
            cc.find("PebmanentNode").getComponent("UserInfo").shareFriends();
        } else if (cc.sys.isNative) {
            //原生平台分享
            cc.find("PebmanentNode").getComponent("UserInfo").nativeShare();
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
        //# sourceMappingURL=MatchState.js.map
        