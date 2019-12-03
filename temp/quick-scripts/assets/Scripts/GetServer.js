(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/GetServer.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '73586nwM2tH5IUPBMKOv93U', 'GetServer', __filename);
// Scripts/GetServer.js

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
        //胜利音效
        winAudio: {
            url: cc.AudioClip,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {

        // //初始化token计时器
        // this.fTokenTime +=dt
        this.willDisappearRow = 0;
    },

    /**
     * @param  {} jsonMsg
     * jsonMsg.tag1 : Number
     * jsonMsg.nDisappear1 : String
     * 
     */
    //通过长链接 给服务器发消息
    SendLongMsg: function SendLongMsg(jsonMsg) {
        this.userMsg = { "tag": jsonMsg.tag1, "token": cc.find("PebmanentNode").getComponent("UserInfo").tokenMsg, "name": cc.find("PebmanentNode").getComponent("UserInfo").nameUser, "integral": jsonMsg.score, "type": jsonMsg.type, "url": cc.find("PebmanentNode").getComponent("UserInfo").pictureUser, "map": {}, "loadingState": 0, "changeMapList": [], "removeMapList": [], "state": 0, "nDisappear": 0 };
        console.log("tag is " + jsonMsg.tag1);
        //加分数据发送到服务器
        if ('nDisappear1' in jsonMsg && jsonMsg.hasOwnProperty('nDisappear1')) {
            //将该属性添加到json对象中去
            this.userMsg.nDisappear = jsonMsg.nDisappear1;
        }
        //惩罚相关数据发送服务器
        if ('removeRow' in jsonMsg && jsonMsg.hasOwnProperty('removeRow')) {
            this.userMsg.removeRow = jsonMsg.removeRow;
        }
        //游戏结束通知对手自己胜利了需要的参数
        if ('result' in jsonMsg && jsonMsg.hasOwnProperty('result')) {
            this.userMsg.result = jsonMsg.result;
        }
        console.log(this.userMsg + "this.userMsg555555555555555");
        this.userMsg.state = jsonMsg.state1;
        this.userMsg.changeMapList = jsonMsg.changeMapList1;
        this.userMsg.removeMapList = jsonMsg.removeMapList1;
        this.userMsg.map.row = jsonMsg.nMapRow;
        this.userMsg.map.col = jsonMsg.nMapCol;
        this.userMsg.loadingState = jsonMsg.loading1;
        //游戏结束所需要添加的字段
        if ('result_score' in jsonMsg && jsonMsg.hasOwnProperty('result_score')) {
            //将该属性添加到json对象中去
            this.userMsg.result_score = jsonMsg.result_score;
        }
        var b = JSON.stringify(this.userMsg);
        console.log("---->>>>b is " + b);
        console.log("@@@@@@@@@@@@@@@websocket is " + this.websocket);
        if (this.websocket != undefined) {
            this.websocket.send(b);
            console.log(this.userMsg + "this.userMsg666666666666666666666666");
        }
    },
    //长链接
    /**
     * @param  {长连接的类型} type
     */
    connectLongSerive: function connectLongSerive(type) {
        var self = this;
        cc.log("333333333333333333333333333333333333333");
        this.websocket.onopen = function (event) {
            cc.log("88888888888888888888888888888888888888888888888");
            self.SendLongMsg({ "tag1": 2, "type": "1", "score": cc.find("PebmanentNode").getComponent("UserInfo").nUserScore, "nMapRow": "", "nMapCol": "" });
            // 2,"1",cc.find("PebmanentNode").getComponent("UserInfo").nUserScore
        };
        this.websocket.onmessage = function (event) {
            var msg1 = JSON.parse(event.data);
            console.log("msg1 is " + msg1);
            cc.log(event.data + "9999999999999999999999999999999999999999999999999999999999999");
            console.log("event data is " + event.data);
            self.GetServerMsg(msg1);
        };
        this.websocket.onerror = function (event) {
            console.log("Send Text fired an error");
            console.log("error event ", event);
        };
        this.websocket.onclose = function (event) {
            //重新连接
            console.log("WebSocket instance closed.");
            console.log("重新连接了");
            cc.find("PebmanentNode").getChildByName("loseLink").active = true;
            console.log("close event ", event);
            console.log("code ", event.code);
            console.log("reason ", event.reason);
        };
    },
    //根据服务器返回的信息进行操作
    GetServerMsg: function GetServerMsg(msg1) {
        console.log("118", msg1);
        console.log("msg1.msg's out is  ", msg1.msg);
        var userInfoScript = cc.find("PebmanentNode").getComponent("UserInfo");
        if (msg1.result == "ok") {
            console.log("msg1.msg is ", msg1.msg);
            switch (msg1.msg) {
                case "getUser":
                    cc.find("Canvas").getComponent("WechatLogin").GetUserMsg();
                    break;
                //app版的接收用户信息            
                case "userMsg":
                    var score = JSON.parse(msg1.data);
                    userInfoScript.tokenMsg = msg1.token;
                    userInfoScript.nUserScore = score.integral;
                    this.websocket = new WebSocket("ws://m5ws.ykplay.com");
                    console.log("websocket is ", this.websocket);
                    this.connectLongSerive();
                    break;
                //微信小游戏接收用户信息 
                case "userMsg_1":
                    console.log("微信小程序服务器发送的数据来了");
                    var score = JSON.parse(msg1.data);
                    userInfoScript.tokenMsg = msg1.token;
                    userInfoScript.nUserScore = score.integral;
                    console.log("msg1.data is ", msg1.data);
                    userInfoScript.openid = score.openid;
                    console.log("openid is ", userInfoScript.openid);
                    var self = this;
                    this.websocket = new WebSocket("wss://m5ws.ykplay.com");
                    this.connectLongSerive();
                    break;
                case "linkSuccess":
                    cc.log(JSON.stringify(msg1) + "///////////////////////////////////////////////////");
                    cc.director.loadScene("Main", function () {
                        //隐藏加载中
                        if (CC_WECHATGAME) {
                            wx.hideLoading();
                        }
                    });
                    break;
                case "addMatching":
                    console.log("add Matching state");
                    userInfoScript.matchState = "addMatching";
                    //   cc.director.loadScene("MatchUser");
                    //   if( userInfoScript.isLoad)
                    //   {
                    //     userInfoScript.LoadTwoUser(userInfoScript.pictureUser,userInfoScript.pictureUser,cc.find("UserName"),userInfoScript.nameUser,cc.find("UserPicture1"),cc.find("UserPicture"));
                    //   }
                    break;
                case "broadcast":
                    /**
                     * 
                     * 进入匹配界面
                     * 
                     * */
                    //设置用户的匹配状态为true 
                    cc.find("Canvas").getComponent("MatchState").matchSuccess = true;
                    var msg2 = msg1.data;
                    console.log("--------------------------------------------------------");
                    console.log(userInfoScript.matchState + "555555555555555????????????????????????????????????????");
                    for (var _i = 0; _i < msg2.playerList.length; _i++) {
                        console.log("name is ", msg2.playerList[_i].name);
                        console.log("url is ", msg2.playerList[_i].url);
                        if (msg2.playerList[_i].name != userInfoScript.nameUser) {
                            //保存对手的信息
                            userInfoScript.pictureEnemy = msg2.playerList[_i].url;
                            userInfoScript.rivalName = msg2.playerList[_i].name;
                            console.log("对手的图片信息是：", userInfoScript.pictureEnemy);
                        }
                    }
                    console.log("广播消息是", "ddddddddddddddddd", cc.find("Canvas").getComponent("MatchState").matchSuccess);
                    //证明两个人都进入游戏界面加载对手的头像
                    if (cc.sys.isNative) {
                        userInfoScript.LoadUserPicture(userInfoScript.pictureEnemy, cc.find("EnemyPicture"));
                    }
                    if (CC_WECHATGAME) {
                        console.log("对手的图片是:", userInfoScript.pictureEnemy);
                        console.log("-------------------------->>>>>>>>>>>>>>");
                        //加载对手的图片
                        userInfoScript.LoadRivalPicture(userInfoScript.pictureEnemy, cc.find("EnemyPicture"));
                    }
                    break;
                case "loadOk":
                    var rowColArr = [];
                    if (userInfoScript.nGameType === "4" || userInfoScript.nGameType === "3" || userInfoScript.nGameType === "2") {
                        rowColArr.push(12);
                        rowColArr.push(6);
                    } else {
                        rowColArr.push(20);
                        rowColArr.push(10);
                    }
                    console.log("loadOk@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
                    cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg({ "tag1": 8, "type": userInfoScript.nGameType, "score": userInfoScript.nUserScore, "nMapRow": rowColArr[0].toString(), "nMapCol": rowColArr[1].toString() });
                    break;
                case "initMap":
                    // cc.log("ssssssssssssssssssssssssssss");
                    //初始化敌人的游戏类型
                    console.log("222222222222222222222222222222");
                    var nEnemyGame = "";
                    //初始化敌人的名字
                    var nameEnemy = "";
                    //初始化敌人的游戏类型
                    nEnemyGame = msg1.beginMap.nodeArray[0].type;
                    //初始化敌人的游戏类型数据
                    userInfoScript.rivalGameType = nEnemyGame;
                    console.log();
                    console.log(_typeof(msg1.data) + "ssssssssssssssssssssssssssss");
                    if (msg1.data.playerList[0].name == userInfoScript.nameUser) {
                        nameEnemy = msg1.data.playerList[1].name;
                    } else {
                        nameEnemy = msg1.data.playerList[0].name;
                    }
                    console.log(nameEnemy + "33333333333333333333333333333333333333333333333");
                    switch (nEnemyGame) {
                        //敌人为俄罗斯方块游戏
                        case "1":
                            console.log("敌人的游戏类型为俄罗斯方块");
                            if (userInfoScript.nGameType === "2" || userInfoScript.nGameType === "4") {
                                console.log("自己的游戏类型为画像方块和宝石方块");
                                cc.find("Canvas/rivalInfo/rivalName").getComponent(cc.Label).string = nameEnemy;
                                //当前的游戏类型为1初始化地图
                                cc.find("Canvas/rivalGame").getComponent("RivalGame").initMap(20, 10, "1");
                                var rivalIconNode = cc.find("Canvas/rivalInfo/rivalIcon");
                                //原生环境显示用户头像
                                if (cc.sys.isNative) {
                                    userInfoScript.LoadUserPicture(userInfoScript.pictureEnemy, rivalIconNode);
                                }
                                //微信小游戏显示头像
                                if (CC_WECHATGAME) {
                                    userInfoScript.LoadRivalPicture(userInfoScript.pictureEnemy, rivalIconNode);
                                }
                                //加载用户头像
                                var userIconNode = cc.find("Canvas/userIcon");
                                userInfoScript.LoadUserPicture(userInfoScript.pictureUser, userIconNode);
                            } else {
                                console.log("自己的游戏类型为俄罗斯方块");
                                cc.find("EnemyName").getComponent(cc.Label).string += nameEnemy;
                                //初始化自己和敌人状态
                                userInfoScript.LoadUserPicture(userInfoScript.pictureUser, cc.find("UserPicture"));
                                var rivalIconNode = cc.find("EnemyPicture");
                                if (CC_WECHATGAME) {
                                    userInfoScript.LoadRivalPicture(userInfoScript.pictureEnemy, rivalIconNode);
                                } else if (cc.sys.isNative) {
                                    userInfoScript.LoadUserPicture(userInfoScript.pictureEnemy, rivalIconNode);
                                }
                                console.log("initMap1111111111111111111111111111" + cc.find("Canvas").getComponent("PersonsGame1Main").enemyGroundChild);
                                //显示敌人的游戏地图
                                Global.CreatBackGround(cc.find("Canvas").getComponent("PersonsGame1Main").enemyGroundChild, 20, 10, cc.find("Canvas").getComponent("PersonsGame1Main").prefabEnemy, cc.find("Canvas").getComponent("PersonsGame1Main").nodeEnemyParent, Global.nServerWidth);
                                //生成方块
                                cc.find("Canvas").getComponent("PersonsGame1Main").GetBlock();
                            }
                            //   Global.CreatBackGround(this.userGroundChild,20,10,this.prefabUser,this.nodeUserParent,Global.nWidth);
                            break;
                        //敌人为宝石方块游戏类型
                        case "2":
                            if (userInfoScript.nGameType === "2" || userInfoScript.nGameType === "4") {
                                console.log("initMap");
                                this.initMapForTwoAndFour(nameEnemy, userInfoScript, "2");
                            } else {
                                //自己的游戏类型为俄罗斯方块或者噗呦噗呦
                                cc.log("initMap");
                                cc.find("EnemyName").getComponent(cc.Label).string += nameEnemy;
                                cc.log("initMap1111111111111111111111111111" + cc.find("Canvas").getComponent("PersonsGame1Main").enemyGroundChild);
                                //初始化自己和敌人状态
                                userInfoScript.LoadUserPicture(userInfoScript.pictureUser, cc.find("UserPicture"));
                                var rivalIconNode = cc.find("EnemyPicture");
                                userInfoScript.LoadRivalPicture(userInfoScript.pictureEnemy, rivalIconNode);
                                //显示敌人的游戏地图
                                cc.find("Canvas").getComponent("PersonsGame1Main").initRivalMap(8, 8, cc.find("Canvas").getComponent("PersonsGame1Main").prefabEnemy1[1], 12, 6);
                                //    Global.CreatBackGround(cc.find("Canvas")
                                //    .getComponent("PersonsGame1Main").initRivalMap();
                                //    Global.initMapForEnemy(8,8,cc.find("Canvas").getComponent("PersonsGame1Main").prefabEnemy1[2],12,6);
                                //生成方块
                                cc.find("Canvas").getComponent("PersonsGame1Main").GetBlock();
                            }
                            break;
                        case "3":
                            break;
                        case "4":
                            if (userInfoScript.nGameType === "2" || userInfoScript.nGameType === "4") {
                                console.log("initMap");
                                this.initMapForTwoAndFour(nameEnemy, userInfoScript, "4");
                            } else {
                                cc.log("initMap");
                                cc.find("EnemyName").getComponent(cc.Label).string += nameEnemy;
                                cc.log("initMap1111111111111111111111111111" + cc.find("Canvas").getComponent("PersonsGame1Main").enemyGroundChild);
                                //初始化自己和敌人状态
                                userInfoScript.LoadUserPicture(userInfoScript.pictureUser, cc.find("UserPicture"));
                                var rivalIconNode = cc.find("EnemyPicture");
                                if (CC_WECHATGAME) {
                                    userInfoScript.LoadRivalPicture(userInfoScript.pictureEnemy, rivalIconNode);
                                } else {
                                    userInfoScript.LoadUserPicture(userInfoScript.pictureEnemy, rivalIconNode);
                                }
                                //显示敌人的游戏地图
                                cc.find("Canvas").getComponent("PersonsGame1Main").initRivalMap(8, 8, cc.find("Canvas").getComponent("PersonsGame1Main").prefabEnemy1[2], 12, 6);
                                //    Global.CreatBackGround(cc.find("Canvas")
                                //    .getComponent("PersonsGame1Main").initRivalMap();
                                //    Global.initMapForEnemy(8,8,cc.find("Canvas").getComponent("PersonsGame1Main").prefabEnemy1[2],12,6);
                                //生成方块
                                cc.find("Canvas").getComponent("PersonsGame1Main").GetBlock();
                            }
                            break;
                    }
                    break;

                case "changeMap":
                    var msg2 = msg1.changeMap;
                    console.log("=================msg2=============== is " + msg2);
                    var rivalGameType = userInfoScript.rivalGameType;
                    var userType = userInfoScript.nGameType;
                    console.log("#############################", rivalGameType, userType);
                    if (rivalGameType === "2" || rivalGameType === "4") {
                        console.log("<<<<<<<<<<<<<<<<<<<<<<=========>>>>>>>>>>>>>>>>>Enter forEach function");
                        msg2.forEach(function (element) {
                            //当前的节点所在的行
                            var row = element.row;
                            //节点所在的列
                            var col = element.col;
                            //该节点类型名
                            var typeName = "";
                            if (rivalGameType === "4") {
                                switch (element.color) {
                                    case "-1":
                                        typeName = "-1";
                                        break;
                                    case "0":
                                        typeName = "7";
                                        break;
                                    case "1":
                                        typeName = "8";
                                        break;
                                    case "2":
                                        typeName = "9";
                                        break;
                                    case "3":
                                        typeName = "10";
                                        break;
                                    case "4":
                                        typeName = "11";
                                        break;
                                    case "5":
                                        typeName = "12";
                                        break;
                                    case "6":
                                        typeName = "13";
                                        break;
                                    case "7":
                                        typeName = "14";
                                        break;
                                }
                            } else {
                                switch (element.color) {
                                    case "-1":
                                        typeName = "-1";
                                        break;
                                    case "0":
                                        typeName = "20";
                                        break;
                                    case "1":
                                        typeName = "19";
                                        break;
                                    case "2":
                                        typeName = "18";
                                        break;
                                    case "3":
                                        typeName = "16";
                                        break;
                                }
                            }

                            //动态加载图片
                            console.log("==================>>>>typeName is " + typeName);
                            console.log("==================>>>>row is " + row);
                            console.log("==================>>>> col is " + col);
                            if (typeName != undefined) {
                                if (userType === "2" || userType === "4") {
                                    var start = new Date().getMilliseconds();
                                    if (userType === "4") {
                                        new Promise(function (resolve, reject) {
                                            console.log("进入Lck游戏类型Promise");
                                            cc.loader.loadRes("Game4/" + typeName, cc.SpriteFrame, function (err, frame) {
                                                console.log("进入加载图片过程");
                                                var end = new Date().getMilliseconds();
                                                cc.find("Canvas/rivalGame").getComponent("RivalGame").backGroundArr[row][col].getComponent(cc.Sprite).spriteFrame = frame;
                                                resolve(end - start);
                                            });
                                        }).then(function (delay) {
                                            console.log("加载资源所用时间:" + delay);
                                        });
                                    } else {
                                        new Promise(function (resolve, reject) {
                                            console.log("进入Lck游戏类型Promise");
                                            cc.loader.loadRes("Game3/" + typeName, cc.SpriteFrame, function (err, frame) {
                                                console.log("进入加载图片过程");
                                                var end = new Date().getMilliseconds();
                                                cc.find("Canvas/rivalGame").getComponent("RivalGame").backGroundArr[row][col].getComponent(cc.Sprite).spriteFrame = frame;
                                                resolve(end - start);
                                            });
                                        }).then(function (delay) {
                                            console.log("加载资源所用时间:" + delay);
                                        });
                                    }
                                } else if (userType === "1" || userType === "3") {
                                    console.log("改变地图用户游戏类型小泉");
                                    cc.loader.loadRes("Game4/" + typeName, cc.SpriteFrame, function (err, txt) {
                                        console.log(element.col + "改变地图用户游戏类型");
                                        console.log(element.row + "改变地图用户游戏类型为小泉游戏");
                                        cc.find("Canvas").getComponent("PersonsGame1Main").enemyGroundChild[element.row][element.col].getComponent(cc.Sprite).spriteFrame = txt;
                                    });
                                }
                            }
                        });
                        console.log("===================>>>>>>>>>>");
                    } else {
                        //存取颜色
                        console.log("对手的游戏类型为小泉的游戏");
                        var arratColor = [];
                        msg2.forEach(function (element) {
                            var color1 = "";
                            switch (element.color) {
                                case "red":
                                    color1 = "3";
                                    break;
                                case "blue":
                                    color1 = "2";
                                    break;
                                case "green":
                                    color1 = "1";
                                    break;
                                case "white":
                                    color1 = "0";
                                    break;
                            }
                            console.log("游戏类型color1 is --->>" + color1);
                            if (userType === "1" || userType === "3") {
                                console.log("改变地图用户游戏类型小泉");
                                cc.loader.loadRes("picture/" + color1, cc.SpriteFrame, function (err, txt) {
                                    console.log(element.col + "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                                    console.log(element.row + "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
                                    console.log();
                                    cc.find("Canvas").getComponent("PersonsGame1Main").enemyGroundChild[element.col][element.row].getComponent(cc.Sprite).spriteFrame = txt;
                                });
                            } else if (userType === "2" || userType === "4") {
                                console.log("改变地图用户游戏类型Lck");
                                cc.loader.loadRes("picture/" + color1, cc.SpriteFrame, function (err, txt) {
                                    console.log(element.col + " 改变地图用户游戏类型");
                                    console.log(element.row + " 改变地图用户游戏类型为Lck游戏");
                                    cc.find("Canvas/rivalGame").getComponent("RivalGame").backGroundArr[element.col][element.row].getComponent(cc.Sprite).spriteFrame = txt;
                                });
                            }
                        });
                    }
                    break;
                //绘制敌人惩罚地图              
                case "punishMap":
                    var msg2 = msg1.punishMap;
                    for (var i = 0; i <= msg1.punishMap.length - 1; i++) {
                        cc.log(JSON.stringify(msg1.punishMap[i]));
                    }
                    cc.log(msg1.punishMap.toString());

                    //获得用户游戏类型（因为这个消息是服务器给被惩罚人发的这里被惩罚人就是当前玩家）
                    var userType = userInfoScript.nGameType;
                    console.log("punishMap Canvas is ", cc.find("Canvas"));
                    console.log("punishMap----->>", userType);
                    switch (userType) {
                        case "1":
                            console.log(msg1 + "punishMap111111111111111111111111");
                            console.log("punishMap ", msg1.rows);
                            cc.find("Canvas").getComponent("PersonsGame1Main").PunishUp(msg1.rows);
                            msg2.forEach(function (element) {
                                var color1 = "";
                                switch (element.color) {
                                    case "red":
                                        color1 = "3";
                                        break;
                                    case "blue":
                                        color1 = "2";
                                        break;
                                    case "green":
                                        color1 = "1";
                                        break;
                                    case "white":
                                        color1 = "0";
                                        break;
                                }
                                if (element.color != "white") {
                                    cc.loader.loadRes("picture/" + color1, cc.SpriteFrame, function (err, txt) {
                                        var nodePunish = cc.instantiate(cc.find("Canvas").getComponent("PersonsGame1Main").punishPrefab);
                                        nodePunish.parent = cc.find("Canvas").getComponent("PersonsGame1Main").boxParent;
                                        nodePunish.setPosition(cc.find("Canvas").getComponent("PersonsGame1Main").groundChild[element.col][element.row].getPositionX(), cc.find("Canvas").getComponent("PersonsGame1Main").groundChild[element.col][element.row].getPositionY());
                                        nodePunish.getComponent(cc.Sprite).spriteFrame = txt;
                                        cc.find("Canvas").getComponent("PersonsGame1Main").groundChild[element.col][element.row].getComponent("PrefabState").stringColor = element.color;
                                        cc.find("Canvas").getComponent("PersonsGame1Main").groundChild[element.col][element.row].getComponent("PrefabState").isBox = true;
                                    });
                                }
                            });
                            for (var i = 0; i <= msg1.punishMap.length - 1; i++) {
                                cc.find("Canvas").getComponent("PersonsGame1Main").arrayChangeNode.push(msg1.punishMap[i]);
                            }
                            cc.find("Canvas").getComponent("PersonsGame1Main").isPunish = true;
                            break;
                        case "2":
                            //宝石游戏惩罚方式
                            break;
                        case "3":
                            break;
                        case "4":
                            console.log("punishMap44444444444444444444444");
                            //如果敌人游戏类型为是4的话按照游戏四进行惩罚
                            cc.find("Canvas/Game").getComponent("Game4Fight").wasPunishedByRival(msg1.punishMap);
                            break;

                    }

                    break;
                case "enemyDisappear":
                    cc.log(msg1 + "enemyDisappear111111111111111111111111111111111");
                    //打开敌人消行开关
                    var rivalGameType = userInfoScript.rivalGameType;
                    var userGameType = userInfoScript.nGameType;
                    switch (userGameType) {
                        case "1":
                            cc.find("Canvas").getComponent("PersonsGame1Main").isDisppearEnemy = true;
                            break;
                        case "2":
                            cc.find("Canvas/Game").getComponent("FightGame3").rivalTouchBarry = true;
                            break;
                        case "3":
                            break;
                        case "4":
                            console.log("接收到监听敌人是否下落的指示");
                            cc.find("Canvas/Game").getComponent("Game4Fight").rivalTouchBarry = true;
                            console.log("-->接收敌人信息!!!!!!!!!!!!!!!!!");
                            break;
                    }

                    break;
                case "addScore":
                    console.log("in addScore msg1 is " + msg1);
                    console.info(msg1);
                    var keyArr = Object.keys(msg1);
                    keyArr.forEach(function (element) {
                        console.log(element);
                        console.log("in addScore msg1[" + element + "] is " + msg1[element]);
                    });
                    //显示敌人分数
                    var userGameType = userInfoScript.nGameType;
                    //敌人的游戏类型
                    var rivalGameType = userInfoScript.rivalGameType;
                    console.log("in addScore 对手的游戏类型是", rivalGameType);
                    console.log("in addScore 用户游戏类型是", userGameType);
                    //四种游戏类型
                    if (userGameType === "2" || userGameType === "4") {
                        //加分操作
                        console.log("in addScore 我是游戏类型2或者4我要加分了", msg1);
                        console.log("in addScore (((((((((msg1.removeRows is " + msg1.removeRows.toString());
                        //检查对手的游戏类型每种游戏类型的计分方式不同
                        if (rivalGameType === "2" || rivalGameType === "4") {
                            console.log("in addScore 对手的游戏类型为2或者4自己的游戏类型为2或者4");
                            cc.find("Canvas/rivalInfo/score").getComponent(cc.Label).string = msg1.removeRows.toString();
                        } else {
                            console.log("in addScore 对手的游戏类型为1或者3自己的游戏类型为2或者4");
                            cc.find("Canvas/Game").getComponent("Game4Fight").showScoreForGame1(msg1.removeRows, cc.find("Canvas/rivalInfo/score"));
                        }
                    } else if (userGameType === "1" || userGameType === "3") {
                        console.log("in addScore 我是游戏类型1或者3我要加分了", msg1);
                        //游戏类型2或者4直接发送的是分数直接显示分数就完了
                        if (rivalGameType === "2" || rivalGameType === "4") {
                            console.log("in addScore 对手的游戏类型为2或者4自己的游戏类型为1或者3");
                            cc.find("EnemyScore").getComponent(cc.Label).string = msg1.removeRows;
                        } else {
                            console.log("in addScore 对手的游戏类型为1或者3自己的游戏类型为1或者3");
                            cc.find("Canvas").getComponent("PersonsGame1Main").ShowScore(msg1.removeRows, cc.find("EnemyScore"));
                        }
                    }
                    break;
                //游戏结束结算            
                case "result_exit":
                    console.log("in result_exit-----------------");
                    //接收的结算信息的时候将结算节点不显示
                    //自己的游戏类型
                    var userGameType = userInfoScript.nGameType;
                    //对手的游戏类型
                    var rivalGameType = userInfoScript.rivalGameType;
                    //获得用户数据
                    console.log("msg1 is ", msg1);
                    var userInfo = msg1.data;
                    console.log("userInfo is ", userInfo);
                    if (userGameType === "2" || userGameType === "4") {
                        console.log("in result_exit 自己的游戏类型为画像或者宝石");
                        if (!cc.find("Canvas/Over").active) {
                            cc.find("Canvas/Over").active = true;
                            cc.find("Canvas/Over_light_widget").active = true;
                            //自己失败显示失败
                            cc.find("Canvas/Over").getChildByName("lose").active = false;
                            //自己没有赢不显示胜利的标记
                            cc.find("Canvas/Over").getChildByName("win").active = true;
                        }
                        cc.find("Canvas/Over/result").active = false;
                        //显示自己的积分
                        cc.find("Canvas/Over/Score").getComponent(cc.Label).string = userInfo.integral.toString();
                        //暂停当前游戏
                        // cc.director.pause();
                        // cc.find("Canvas/Over/again").on("touchstart",function(){
                        //     cc.director.loadScene("PersonsChoose");
                        // });
                        // cc.find("Canvas/Over/quit").on("touchstart",function(){
                        //     cc.director.loadScene("PersonsChoose");
                        // });
                    } else if (userGameType === "1" || userGameType === "3") {
                        if (cc.find("Canvas").getComponent("PersonsGame1Main").lose == true) {
                            cc.find("NodeOverLose/Score").getComponent(cc.Label).string += userInfo.integral.toString();
                            cc.find("NodeOverLose/wait").active = false;
                        } else {
                            cc.find("NodeOverWin/Score").getComponent(cc.Label).string += userInfo.integral.toString();
                            cc.find("NodeOverWin/wait").active = false;
                            cc.find("Canvas").getComponent("PersonsGame1Main").isWin = true;
                            // cc.find("Canvas").getComponent()
                            // cc.director.pause();
                        }

                        //显示俄罗斯方块的结束界面
                        console.log("in result_exit 自己的游戏类型为俄罗斯方块游戏结束");
                    }
                    break;
                case "getResult":
                    //该用户胜利了
                    cc.audioEngine.play(this.winAudio, false, 1);
                    var userGameType = userInfoScript.nGameType;
                    console.log("getResult ...................." + userGameType);
                    if (userGameType === "2" || userGameType === "4") {
                        console.log("in getResult 自己的游戏类型为画像或者宝石");
                        cc.find("Canvas/Game").getComponent("Game4Fight").isWin = true;
                        //进入画像或者宝石方块的游戏结束界面
                        //其他下降，旋转按钮，左右移动按钮处于不可激活状态
                        cc.find("Canvas/down").interactable = false;
                        cc.find("Canvas/rotate").interactable = false;
                        cc.find("Canvas/slide").interactable = false;
                        //显示结束动画
                        cc.find("Canvas/Over_light_widget").active = true;
                        // var animation = this.gameOverAnimation.getComponent(cc.Animation);
                        // animation.play("Over_light"); 
                        cc.find("Canvas/Over").active = true;
                        cc.find("Canvas/mask").active = true;
                        //自己失败显示失败
                        cc.find("Canvas/Over").getChildByName("lose").active = false;
                        //自己没有赢不显示胜利的标记
                        cc.find("Canvas/Over").getChildByName("win").active = true;
                        //暂停当前游戏
                        // cc.director.pause();
                        // cc.find("Canvas/Over/again").on("touchstart",function(){
                        //     cc.director.loadScene("PersonsChoose");
                        // });
                        // cc.find("Canvas/Over/quit").on("touchstart",function(){
                        //     cc.director.loadScene("PersonsChoose");
                        // });
                        //给服务器发送赢家的分数消息
                        var jsonData = {
                            tag1: 4,
                            score: "",
                            type: userGameType,
                            state1: "",
                            changeMapList1: [],
                            removeMapList1: 0,
                            nMapRow: "",
                            nMapCol: "",
                            loading1: "",
                            result_score: ""
                            //获得赢家的分数
                        };jsonData.result_score = cc.find("Canvas/score").getComponent(cc.Label).string;
                        //给服务器发送消息
                        this.SendLongMsg(jsonData);
                    } else if (userGameType === "1" || userGameType === "3") {
                        console.log("getResult ....................");
                        cc.find("New Sprite(Splash)").opacity = 120;
                        // //初始化我赢了
                        // this.gameResult=true;
                        cc.find("NodeOverWin").active = true;
                        //给服务器发送赢家的分数消息
                        var jsonData = {
                            tag1: 4,
                            score: "",
                            type: userGameType,
                            state1: "",
                            changeMapList1: [],
                            removeMapList1: 0,
                            nMapRow: "",
                            nMapCol: "",
                            loading1: "",
                            result_score: ""
                            // if(userGameType=="1")
                            // {
                            //     jsonData.tag1=1;
                            // }
                            // else
                            // {
                            //     jsonData.tag1=3;
                            // }
                            //获得赢家的分数
                        };jsonData.result_score = cc.find("UserScore").getComponent(cc.Label).string;
                        this.SendLongMsg(jsonData);
                        //显示胜利界面   
                        //显示俄罗斯方块的结束界面
                        console.log("in result_exit 自己的游戏类型为俄罗斯方块游戏结束");
                    }
                    //暂停游戏
                    cc.director.pause();
                    break;
                //服务器断开我的链接
                case "relink":

                    break;

            }
        } else {
            cc.find("PebmanentNode").getComponent(cc.Label).string = "此用户为非法用户";
        }
    },
    //初始化地图
    initMapForTwoAndFour: function initMapForTwoAndFour(nameEnemy, userInfoScript, gameType) {
        cc.find("Canvas/rivalInfo/rivalName").getComponent(cc.Label).string = nameEnemy;
        var rivalIconNode = cc.find("Canvas/rivalInfo/rivalIcon");
        if (cc.sys.isNative) {
            userInfoScript.LoadUserPicture(userInfoScript.pictureEnemy, rivalIconNode);
        }
        if (CC_WECHATGAME) {
            userInfoScript.LoadRivalPicture(userInfoScript.pictureEnemy, rivalIconNode);
        }
        //加载用户头像
        var userIconNode = cc.find("Canvas/userIcon");
        userInfoScript.LoadUserPicture(userInfoScript.pictureUser, userIconNode);
        //当前的游戏类型为1初始化地图
        if (gameType === "1") {} else {
            cc.find("Canvas/rivalGame").getComponent("RivalGame").initMap(12, 6, gameType);
        }
    },
    start: function start() {},
    update: function update(dt) {
        // var userInfoScript = cc.find("PebmanentNode").getComponent("UserInfo");
        // //监听Game4Fight的isTouch看看对手是否触底
        // var rivalGameType = userInfoScript.rivalGameType;
        // var userGameType = userInfoScript.nGameType;
        // //是否能够发送惩罚消息到服务器
        // this.canSendDataForDisappear = false;
        // if(userGameType === "2" || userGameType === "4"){
        //     //检查对手的游戏类型
        //     switch(rivalGameType){
        //         case "1":
        //             break;
        //         case "2":
        //             break;
        //         case "3":
        //             break;
        //         case "4":
        //             //检查对手画像方块游戏方块是否触底
        //             this.canSendDataForDisappear = cc.find("Canvas/Game").getComponent("Game4Fight").isTouch;
        //             //如果对手触底发送数据到服务器
        //             if(this.canSendDataForDisappear){

        //             }
        //     }
        // }
        // //如果对手已经触底
        // if(this.canSendDataForDisappear){

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
        //# sourceMappingURL=GetServer.js.map
        