"use strict";
cc._RF.push(module, '6fca8/5wtRBEaPSMxIzGAV4', 'Game4Fight');
// Scripts/FightGame4/Game4Fight.js

"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/*
 * @Author: mikey.zhaopeng 
 * @Date: 2018-06-25 14:28:29 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-08-19 14:52:20
 */
var comm = require("../game3/Common");
var game3 = require("../game3/game");
var statuMachine = require("../game4/StatuMachine");
//引用异步操作模块
cc.Class({
    extends: cc.Component,

    properties: {
        imagePrefabArr: {
            default: [],
            type: [cc.Prefab]
        },
        girdSize: 120,
        back: cc.Prefab,
        nextShape: {
            default: null,
            type: cc.Node
        },
        next2: {
            default: null,
            type: cc.Node
        },
        downButton: {
            default: null,
            type: cc.Node
        },
        slideButton: {
            default: null,
            type: cc.Node
        },
        rotateButton: {
            default: null,
            type: cc.Node
        },
        //遮罩层
        mask: {
            default: null,
            type: cc.Node
        },
        //昵称label
        nickName: {
            default: null,
            type: cc.Node
        },
        //分数label
        scoreLabel: {
            default: null,
            type: cc.Node
        },
        //游戏结束菜单
        overMenu: {
            default: null,
            type: cc.Node
        },
        gameOverAnimation: cc.Node,
        gameSlide: cc.Node,
        //点击按钮的声音
        clickAudio: {
            url: cc.AudioClip,
            default: null
        },
        //胜利音效
        winAudio: {
            url: cc.AudioClip,
            default: null
        },
        //失败音效
        loseAudio: {
            url: cc.AudioClip,
            default: null
        },
        //消除音效
        removeAudio: {
            url: cc.AudioClip,
            default: null
        },
        //快速下落音效
        downAudio: {
            url: cc.AudioClip,
            default: null
        },
        handNode: cc.Node,
        darkNode: cc.Node,
        noticeButton: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        if (CC_WECHATGAME) {}
        //预加载需要的场景
        cc.director.preloadScene("PersonsChoose", function () {
            console.log("多人选择界面预加载成功");
        });
        cc.director.preloadScene("MatchUser", function () {
            console.log("匹配界面预加载成功");
        });
        this.showNoticeHelp = true;
        this.handNode.on("touchstart", function () {
            this.handNode.active = false;
            this.darkNode.active = false;
            this.noticeButton.active = false;
            this.showNoticeHelp = false;
        }.bind(this));
        this.darkNode.on("touchstart", function () {
            this.handNode.active = false;
            this.darkNode.active = false;
            this.noticeButton.active = false;
            this.showNoticeHelp = false;
        }.bind(this));
        //发送到服务器中的数据
        cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg({ "tag1": 10, "type": "", "score": cc.find("PebmanentNode").getComponent("UserInfo").nUserScore, "nMapRow": "", "nMapCol": "", "loading1": 1 });
        this.normalSpeed = 0.8;
        this.quickSpeed = 0.07;
        this.giveIn = false;
        //如果游戏是处于暂停状态的时候让游戏继续运行
        if (cc.director.isPaused()) {
            cc.director.resume();
        }
        //发给服务器的数据
        this.jsonMsgToServer = {
            tag1: 9,
            score: "",
            type: "",
            state1: "",
            changeMapList1: [],
            removeMapList1: 0,
            nMapRow: "",
            nMapCol: "",
            loading1: ""
        };
        console.log("!!!!!!!!!!!!!!!!!!!" + this.jsonMsgToServer.changeMapList1.length);
        this.nickName.getComponent(cc.Label).string = cc.find("PebmanentNode").getComponent("UserInfo").nameUser;
        this.nodeHeight = this.node.height;
        this.nodeWidth = this.node.width;
        this.up = 12;
        this.lr = 10;
        this.back.width = 120;
        this.back.height = 120;
        this.initMap(this.up, this.lr, this.back, comm.MAP_ROW, comm.MAP_COL);
        //创建一个空节点用来盛放生成的预制体
        this.nodeArr = this.initImage(this.node, null);
        this.createNext();
        //从游戏屏幕上下落的次数
        this.times = 0;
        //  //开始下落
        //  this.downFunction(this.nodeArr,1);
        this.iState = 0;
        this.totalTime = 0;
        this.registerKeyBoard();
        this.quick = false;
        this.time = 0;
        this.xltime = this.normalSpeed;
        this.cishu = 0;
        //监听下落按钮按下的时候
        this.downButton.on("touchstart", function () {
            this.xltime = this.quickSpeed;
            this.downButton.children[0].opacity = 120;
            this.playAudio(this.clickAudio);
        }.bind(this));
        //下落按钮离开时候
        this.downButton.on("touchend", function () {
            this.xltime = this.normalSpeed;
            this.downButton.children[0].opacity = 0;
        }.bind(this));
        this.gameOver = false;
        this.status = 0;
        Array.prototype.contain = function (node) {
            if (node != undefined) {
                for (var i = 0; i < this.length; i++) {
                    if (this[i].x === node.x && this[i].y === node.y && this[i].getComponent("Figure").type === node.getComponent("Figure").type) {
                        return true;
                    }
                }
                return false;
            }
            return false;
        };
        //对发送给服务器中的数据进行去重
        Array.prototype.isContain = function (data) {
            if (data !== undefined) {
                for (var j = 0; j < this.length; j++) {
                    if (this[j].row === data.row && this[j].col === data.col && this[j].color === data.color) {
                        return true;
                    }
                }
                return false;
            }
            return false;
        };
        // console.log("nickName is " + this.nickName);
        this.tempNodes = [];
        this.san = 0;
        //计分数字
        this.score = 0;
        //旋转按钮旋转
        // var rotateAction = cc.rotateBy(3,360).easing(cc.easeCubicActionOut());
        // var rf = cc.repeatForever(rotateAction);
        // this.rotateButton.runAction(rf);

        // Menu.prototype.onLoad();

        //不显示遮罩层
        this.mask.active = false;
        //不显示游戏结束菜单
        this.overMenu.active = false;
        //当前的行号
        this.nCol = 0;
        this.gameOverAnimation.active = false;
        var self = this;
        // this.pause.on("touchstart",function(){
        //     if(!self.gameOver){
        //         //暂停游戏
        //         console.log("点击了网络版的暂停");
        //         self.mask.active = true;
        //         self.pauseMenu.active = true;
        //     }
        // }.bind(this))
        // this.pauseGaveIn.on("touchstart",function(){
        //     self.mask.active = false;
        //     // this.pauseMenu.active = false;
        //     self.pauseMenu.active = false;
        //     self.giveIn = true;
        //     // //向服务器发送投降消息
        //     // self.gameBye();
        //     var jsonData = {
        //         tag1            : 5,
        //         score           : "",
        //         type            : "4",
        //         state1          : "",
        //         changeMapList1  : [],
        //         removeMapList1  : 0,
        //         nMapRow         : "",
        //         nMapCol         : "",
        //         loading1        : "",
        //     }
        //     cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg(jsonData);
        //     //显示失败
        //     this.playAudio(this.loseAudio);
        //     //其他下降，旋转按钮，左右移动按钮处于不可激活状态
        //     this.downButton.interactable = false;
        //     this.rotateButton.interactable = false;
        //     this.slideButton.interactable = false;
        //     //显示结束动画
        //     this.gameOverAnimation.active = true;
        //     // var animation = this.gameOverAnimation.getComponent(cc.Animation);
        //     // animation.play("Over_light"); 
        //     this.overMenu.active = true;
        //     this.mask.active = true;
        //     //自己失败显示失败
        //     this.overMenu.getChildByName("lose").active = true;
        //     //自己没有赢不显示胜利的标记
        //     this.overMenu.getChildByName("win").active = false;
        //     //显示分数
        //     this.overMenu.getChildByName("Score").getComponent(cc.Label).string = this.score.toString();
        //     cc.director.loadScene("PersonsChoose");
        // }.bind(this));
        // this.pauseRestart.on("touchstart",function(){
        //     cc.director.resume();

        //     self.mask.active = false;
        //     self.pauseMenu.active = false;
        //     var jsonData = {
        //         tag1            : 5,
        //         score           : "",
        //         type            : "4",
        //         state1          : "",
        //         changeMapList1  : [],
        //         removeMapList1  : 0,
        //         nMapRow         : "",
        //         nMapCol         : "",
        //         loading1        : "",
        //     }
        //     cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg(jsonData);
        //     //显示失败
        //     this.playAudio(this.loseAudio);
        //     //其他下降，旋转按钮，左右移动按钮处于不可激活状态
        //     this.downButton.interactable = false;
        //     this.rotateButton.interactable = false;
        //     this.slideButton.interactable = false;
        //     //显示结束动画
        //     this.gameOverAnimation.active = true;
        //     // var animation = this.gameOverAnimation.getComponent(cc.Animation);
        //     // animation.play("Over_light"); 
        //     this.overMenu.active = true;
        //     this.mask.active = true;
        //     //自己失败显示失败
        //     this.overMenu.getChildByName("lose").active = true;
        //     //自己没有赢不显示胜利的标记
        //     this.overMenu.getChildByName("win").active = false;
        //     //显示分数
        //     this.overMenu.getChildByName("Score").getComponent(cc.Label).string = this.score.toString();
        //     cc.director.loadScene("PersonsChoose");
        // }.bind(this));
        // this.pauseReturn.on("touchstart",function(){
        //     cc.director.resume();
        //     self.mask.active = false;
        //     self.pauseMenu.active = false;
        //     //发送消息给服务器
        //     var jsonData = {
        //         tag1            : 5,
        //         score           : "",
        //         type            : "4",
        //         state1          : "",
        //         changeMapList1  : [],
        //         removeMapList1  : 0,
        //         nMapRow         : "",
        //         nMapCol         : "",
        //         loading1        : "",
        //     }
        //     cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg(jsonData);
        //     //加载多人选择界面
        //     cc.director.loadScene("PersonsChoose");
        // }.bind(this));
        // //监听游戏暂时退出按钮
        // this.overMenu.getChildByName("quit").on("touchstart",function(){
        //     //加载多人匹配界面
        //     cc.director.loadScene("PersonsChoose");
        // });
        // //监听再来一局按钮
        // this.overMenu.getChildByName("again").on("touchstart",function(){
        //     //加载多人匹配界面
        //     cc.director.loadScene("PersonsChoose");
        // });
        // this.overMenu.getChildByName("share").on("touchstart",function(){
        //     //战绩分享

        // });

        //监听敌人是否下落成功
        this.rivalTouchBarry = false;
        //敌人是否落地
        this.isTouch = false;
        //是不是处于惩罚状态
        this.isPunish = false;
        this.invokeRemoveTime = 0;
        //游戏结束是否已经处理过了
        this.hasOver = false;
        //检查自己是否胜利
        this.isWin = false;
    },

    noticeFun: function noticeFun() {
        this.handNode.active = false;
        this.darkNode.active = false;
        this.noticeButton.active = false;
        this.showNoticeHelp = false;
    },
    registerKeyBoard: function registerKeyBoard() {
        //是否在滑动节点上
        this.onSlide = false;
        this.onGameSlide = false;
        var self = this;
        //注册键盘监听
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        //滑动按钮监听
        this.slideButton.on("touchstart", function (event) {
            // this.onSlide = true;
            //获得当前点击的全局坐标
            this.slideButton.children[0].opacity = 120;
            // self.slidePosition = event.getLocation();
            cc.log("self.slidePositionX is " + self.slidePositionX);
        }.bind(this));
        //在滑动节点上移动的时候
        this.slideButton.on("touchmove", function (event) {
            this.onSlide = true;
            //获得当前点击的全局坐标
            this.slideButton.children[0].opacity = 120;
            self.slidePosition = event.getLocation();
            cc.log("slidePositionX is " + self.slidePositionX);
        }.bind(this));
        this.slideButton.on("touchcancel", function (event) {
            //获得当前点击的全局坐标
            this.slideButton.children[0].opacity = 0;
            self.slidePosition = event.getLocation();
            this.onSlide = false;
        }.bind(this));
        //在滑动节点上离开的时候
        this.slideButton.on("touchend", function (event) {
            //获得当前点击的全局坐标
            this.slideButton.children[0].opacity = 0;
            self.slidePosition = event.getLocation();
            this.onSlide = true;
        }.bind(this));

        // 滑动节点上方的空节点
        this.gameSlide.on("touchstart", function (event) {
            cc.log("点击了gameSlide节点");
        }.bind(this));
        this.gameSlide.on("touchmove", function (event) {
            this.onGameSlide = true;
            self.gameSlidePosition = event.getLocation();
        }.bind(this));
        this.gameSlide.on("touchend", function (event) {
            this.onGameSlide = true;
            self.gameSlidePosition = event.getLocation();
        }.bind(this));
        this.gameSlide.on("touchcancel", function (event) {
            this.onGameSlide = false;
            self.gameSlidePosition = event.getLocation();
        }.bind(this));
    },
    //返回触点对应的列数
    getTouchLine: function getTouchLine(touchNode, worldPosition) {
        //将触点的x坐标转化为本地坐标系
        var localX = touchNode.convertToNodeSpaceAR(cc.v2(worldPosition.x, worldPosition.y)).x;
        cc.log("local is " + localX);
        if (localX > 0) {
            var n1 = Math.floor(localX / (touchNode.width / 6));
            if (n1 >= 0 && n1 < 1) {
                this.nCol = 3;
            } else if (n1 >= 1 && n1 < 2) {
                this.nCol = 4;
            } else if (n1 >= 2 && n1 < 3) {
                this.nCol = 5;
            }
        } else if (localX < 0) {
            var n2 = Math.floor(-localX / (touchNode.width / 6));
            if (n2 >= 0 && n2 < 1) {
                this.nCol = 2;
            } else if (n2 >= 1 && n2 < 2) {
                this.nCol = 1;
            } else if (n2 >= 2 && n2 < 3) {
                this.nCol = 0;
            }
        }
        return this.nCol;
    },
    onKeyDown: function onKeyDown(event) {
        switch (event.keyCode) {
            case cc.KEY.down:
                this.xltime = this.quickSpeed;
                break;
            case cc.KEY.left:
                this.moveLeft();
                cc.log("<-----");
                break;
            case cc.KEY.right:
                this.moveRight();
                cc.log("----->");
                break;
            case cc.KEY.f:
                this.rotate();
                //旋转操作
                break;
        }
    },
    onKeyUp: function onKeyUp(event) {
        switch (event.keyCode) {
            case cc.KEY.down:
                this.xltime = this.normalSpeed;
                break;
            case cc.KEY.left:
                break;
            case cc.KEY.right:
                break;
            case cc.KEY.f:
                //旋转操作
                break;
        }
    },
    onDestroy: function onDestroy() {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },
    start: function start() {},

    createRandomX: function createRandomX(randomNumber) {
        return this.backGroundArr[0][randomNumber];
    },
    //产生随机数
    createRandom: function createRandom(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    },
    //初始化游戏场景主背景12行6列的网格
    /**
     * @param  {外框上边缘的厚度} up
     * @param  {外框左右边缘的厚度} lr
     * @param  {背景网格的预制体} back
     * @param  {行数} row
     * @param  {列数} col
     */
    initMap: function initMap(up, lr, back, row, col) {
        //初始化y坐标
        var y = this.nodeHeight / 2 - this.girdSize / 2 - up;
        //初始化x坐标
        var x = -this.nodeWidth / 2 + this.girdSize / 2 + lr;
        console.log("--->>>>x is " + x);
        console.log("--->>>>row is " + row);
        console.log("--->>>>col is " + col);
        this.backGroundArr = [];
        this.map = [];
        //12行6列的网格
        for (var i = 0; i < row; i++) {
            //设置它的y坐标
            var tempY = y - i * this.girdSize - 1;
            tempY = Number(tempY.toFixed(2));
            console.log("--->>>>tempY is " + tempY);
            this.backGroundArr[i] = [];
            this.map[i] = [];
            for (var j = 0; j < col; j++) {
                var outArr = this.backGroundArr[i];
                var mapData = this.map[i];
                var tempX = x + j * this.girdSize + 1;
                tempX = Number(tempX.toFixed(2));
                console.log("--->>>>tempX is " + tempX);
                //y坐标不变，x坐标要变
                var tempPrefab = this.setPrefabPosition(back, tempX, tempY, this.node);
                if (arguments.length === 6) {
                    tempPrefab.getComponent(arguments[5]).isFilled = 0;
                    // tempPrefab.isFilled = 0;
                    // console.log("tempPrefab.isFilled is " + tempPrefab.isFilled);
                    tempPrefab.getComponent(arguments[5]).type = -1;
                    tempPrefab.getComponent(arguments[5]).innerNode = null;
                } else if (arguments.length === 5) {
                    // var node = new Shape(tempPrefab,-1);
                    tempPrefab.getComponent("Back").isFilled = 0;
                    // tempPrefab.isFilled = 0;
                    // console.log("tempPrefab.isFilled is " + tempPrefab.isFilled);
                    tempPrefab.getComponent("Back").type = -1;
                    tempPrefab.getComponent("Back").innerNode = null;
                }

                // var shape = new Shape(tempPrefab,-1);
                outArr[j] = tempPrefab;
                mapData[j] = 0;
            }
        }
        console.log("backGroundArr is " + this.backGroundArr);
    },
    //生成形状在这个节点数组中加入父节点
    initImage: function initImage(parentNode, addJsonData) {
        this.times = 0;
        //动态生成一个新的节点将生成的预制体节点加入到该父节点上
        // var newNode = new cc.Node();
        // parentNode.addChild(newNode);
        //用来存放预制体的数组
        //定义从哪一列开始下落
        if (addJsonData === null) {
            var randomCol = game3.prototype.createRandom(2, 4);
        } else {
            //如果是惩罚的话获得在哪一列开始惩罚
            var randomCol = addJsonData.col;
        }
        var prefabArrTemp = [];
        this.cishu = 0;
        //是否生成成功并且全部显示完毕
        this.isCreateOver = false;
        var loopCount = 2;
        //从上往下生成
        if (addJsonData === null) {
            loopCount = 2;
        } else {
            //获得生成惩罚方块的个数
            loopCount = addJsonData.generateCount;
        }
        // var y = this.nodeHeight/2 + this.girdSize/2+1*this.girdSize;
        for (var i = 0; i < loopCount; i++) {
            // var offSet = i * this.prefabHeight;
            // cc.log("offSet is " + offSet);
            // //产生0-8的随机数
            if (addJsonData === null) {
                var index = this.controlRandom();
            } else {
                var index = addJsonData.punishType;
            }
            // //将对应的颜色索引存放到该数组中
            // // this.boxColorArr.push(this.prefabArr[index].color);
            // cc.log("index is " + index);
            // //将对应的预制体取出来转化为节点然后显示
            var prefabNode = game3.prototype.createPrefab(this.imagePrefabArr[index]);
            // cc.log("x is " + x + " and y is "+ y - offSet);
            //设置预制节点的位置
            prefabNode.setPosition(this.backGroundArr[0][randomCol].x, this.backGroundArr[0][randomCol].y);
            cc.log("prefabNode is " + prefabNode);
            prefabNode.getComponent("Figure").type = index;
            prefabNode.getComponent("Figure").col = randomCol;
            prefabNode.getComponent("Figure").row = 0;
            prefabNode.active = false;
            // this.backGroundArr[i][randomCol].node = prefabNode;
            cc.log("------type is " + prefabNode.getComponent("Figure").type);
            //将该预制节点添加为parentNode的孩子
            parentNode.addChild(prefabNode);
            // var shape = new Shape(prefabNode,index);
            //将当前预制体节点存放到预制体临时数组里面
            prefabArrTemp.push(prefabNode);
        }
        console.log(prefabArrTemp);
        //生成父节点
        return prefabArrTemp;
    },
    //改变随机数出现的概率
    controlRandom: function controlRandom() {
        var id;
        var rnd = Math.random();
        if (rnd < 0.15) {
            id = 0;
        } else if (rnd < 0.3) {
            id = 1;
        } else if (rnd < 0.45) {
            id = 2;
        } else if (rnd < 0.6) {
            id = 3;
        } else if (rnd < 0.7) {
            id = 4;
        } else if (rnd < 0.8) {
            id = 5;
        } else if (rnd < 0.9) {
            id = 6;
        } else if (rnd < 1) {
            id = 7;
        }
        return id;
    },
    //生成下一个形状
    createNext: function createNext() {
        if (this.next2Block === undefined) {
            this.nextBlock = this.generateNext(this.node);
            //显示下一个形状
            this.showNextShape(this.nextBlock, this.nextShape);
        }
        // //生成下下个形状
        // this.next2Block = this.generateNext(this.node);
        // //显示下下个形状
        // this.showNextShape(this.next2Block,this.next2);
    },
    //生成下一个形状
    generateNext: function generateNext(parentNode) {
        return this.initImage(parentNode, null);
    },
    //显示下一个形状
    showNextShape: function showNextShape(nextBlock, parentNode) {
        //显示下一个形状之前删除这个节点的所有子节点
        if (parentNode.childrenCount > 0) {
            for (var k = 0; k < parentNode.childrenCount; k++) {
                //销毁该子节点,如果销毁节点成功的话就显示下一个形状
                parentNode.children[k].destroy();
            }
        }
        //依次生成预制节点组成的节点数组
        for (var i = 0; i < 2; i++) {
            var type = nextBlock[i].getComponent("Figure").type;
            // var spriteFrame = nextBlock[i].getComponent("cc.Sprite").spriteFrame;
            this.setPrefabPosition(this.imagePrefabArr[type], 0, 60 - i * this.girdSize, parentNode);
        }
        // for(let k = 0;k<3;k++){
        //     var pre = ;
        //     this.setPrefabPosition(,50,50+k*this.prefabHeight,this.nextShape);
        // }
    },
    /**
    @param prefab:将要生成预制节点的预制体
    @param x     :将要生成预制节点的x坐标
    @param y     :将要生成预制节点的y坐标
    @param parentNode : 生成的预制节点的父节点
    */
    setPrefabPosition: function setPrefabPosition(prefab, x, y, parentNode) {
        var prefab = this.createPrefab(prefab);
        prefab.setPosition(x, y);
        parentNode.addChild(prefab);
        return prefab;
    },
    //创建一个预制体节点
    createPrefab: function createPrefab(prefab) {
        var prefabNode = cc.instantiate(prefab);
        return prefabNode;
    },
    //查看当前的棍处于哪一列
    getColumn: function getColumn(node) {
        //竖行的条
        var indexGrid = this.chooseColumnByLocation(node.x);
        //放回列号
        return indexGrid;
    },
    //根据坐标选择位于哪个列
    chooseColumnByLocation: function chooseColumnByLocation(x) {
        switch (x) {
            case this.backGroundArr[0][0].x:
                return 0;
            case this.backGroundArr[0][1].x:
                return 1;
            case this.backGroundArr[0][2].x:
                return 2;
            case this.backGroundArr[0][3].x:
                return 3;
            case this.backGroundArr[0][4].x:
                return 4;
            case this.backGroundArr[0][5].x:
                return 5;
        }
    },
    //根据坐标获得位于哪一行
    getRow: function getRow(node) {
        var yIndexResult;
        cc.log("node is " + node);
        yIndexResult = this.chooseRawByLocation(node.y);
        return yIndexResult;
    },
    /***
        根据y坐标数值得到对应的行
        返回对应的行数
        @param : y 传入方法中的y坐标
        @return 返回坐标对应的行号
    * */
    chooseRawByLocation: function chooseRawByLocation(y) {
        switch (y) {
            case this.backGroundArr[11][0].y:
                return 11;
            case this.backGroundArr[10][0].y:
                return 10;
            case this.backGroundArr[9][0].y:
                return 9;
            case this.backGroundArr[8][0].y:
                return 8;
            case this.backGroundArr[7][0].y:
                return 7;
            case this.backGroundArr[6][0].y:
                return 6;
            case this.backGroundArr[5][0].y:
                return 5;
            case this.backGroundArr[4][0].y:
                return 4;
            case this.backGroundArr[3][0].y:
                return 3;
            case this.backGroundArr[2][0].y:
                return 2;
            case this.backGroundArr[1][0].y:
                return 1;
            case this.backGroundArr[0][0].y:
                return 0;
        }
    },
    getNodeArrMaxCol: function getNodeArrMaxCol() {
        var maxCol;
        var colArr = [];
        for (var i = 0; i < this.nodeArr.length; i++) {
            colArr.push(this.nodeArr[i].getComponent("Figure").col);
        }
        maxCol = Math.max.apply(Math, colArr);
        //返回最大列
        return maxCol;
    },
    getNodeArrMinCol: function getNodeArrMinCol() {
        var minCol;
        var colArr = [];
        for (var i = 0; i < this.nodeArr.length; i++) {
            colArr.push(this.nodeArr[i].getComponent("Figure").col);
        }
        minCol = Math.min.apply(Math, colArr);
        //返回最小列
        return minCol;
    },
    update: function update(dt) {
        //当提示信息显示的时候游戏不会运行
        if (!this.showNoticeHelp) {
            if (this.onSlide || this.onGameSlide) {
                if (this.onSlide) {
                    var column = this.getTouchLine(this.slideButton, this.slidePosition);
                    this.onSlide = false;
                } else {
                    var column = this.getTouchLine(this.gameSlide, this.gameSlidePosition);
                    this.onGameSlide = false;
                }
                //如果当前列比节点数组中最大列还大的话就右移
                if (column > this.getNodeArrMaxCol()) {
                    //右移
                    this.moveRight();
                } else if (column < this.getNodeArrMinCol()) {
                    //左移
                    this.moveLeft();
                }
            }
            switch (this.status) {
                case statuMachine.STATE_BEGIN:
                    cc.log("开始游戏");
                    break;
                case statuMachine.STATE_PLAY:
                    cc.log("游戏中");
            }
            //如果游戏结束了就不在进行下落
            if (!this.gameOver) {
                this.san += dt;
                this.time += dt;
                if (this.cishu === 0 && this.xltime < this.normalSpeed) {
                    this.xltime = this.normalSpeed;
                }
                if (this.time > this.xltime) {
                    if (this.cishu < 2) {
                        //这种情况不让它旋转
                        if (this.cishu === 0) {
                            if (this.map[0][this.nodeArr[1].getComponent("Figure").col] === 1) {
                                this.gameOver = true;
                            } else {
                                this.nodeArr[1].active = true;
                                var sendJsonData = {
                                    row: 0,
                                    col: this.nodeArr[1].getComponent("Figure").col,
                                    color: this.nodeArr[1].getComponent("Figure").type.toString()
                                };
                                console.log("this.jsonMsgToServer is " + this.jsonMsgToServer);
                                console.log(".................消除之后为什么不能下落................");
                                this.jsonMsgToServer.changeMapList1.push(sendJsonData);
                                //发送数据到服务器
                                this.jsonMsgToServer.score = this.score;
                                this.sendDown = true;
                            }
                        } else if (this.cishu === 1) {
                            if (this.map[1][this.nodeArr[1].getComponent("Figure").col] != 1) {
                                this.nodeArr[1].y = this.backGroundArr[1][this.nodeArr[1].getComponent("Figure").col].y;
                                this.nodeArr[1].getComponent("Figure").row = 1;
                                this.nodeArr[0].active = true;
                                this.nodeArr[0].y = this.backGroundArr[0][this.nodeArr[0].getComponent("Figure").col].y;
                                this.nodeArr[0].getComponent("Figure").row = 0;
                                // let arr = [];
                                var sendJsonData1 = {
                                    row: 1,
                                    col: this.nodeArr[1].getComponent("Figure").col,
                                    color: this.nodeArr[1].getComponent("Figure").type.toString()
                                };
                                var sendJsonData0 = {
                                    row: 0,
                                    col: this.nodeArr[0].getComponent("Figure").col,
                                    color: this.nodeArr[0].getComponent("Figure").type.toString()
                                };
                                this.jsonMsgToServer.changeMapList1.push(sendJsonData1);
                                this.jsonMsgToServer.changeMapList1.push(sendJsonData0);
                                this.jsonMsgToServer.score = this.score;
                                this.sendDown = true;
                            } else {
                                this.gameOver = true;
                            }
                        }
                        this.cishu++;
                        //表示节点数组已经生成完毕可以进行旋转操作
                        if (this.cishu === 2) {
                            //两个方块已经生成完毕
                            this.isCreateOver = true;
                        }
                    } else {
                        //更新节点的位置信息
                        this.updatePrefatY(this.nodeArr);
                    }
                    this.time = 0;
                }
                /**
                 * 发送给服务器数据开始
                 */
                //发送下落的数据
                if (this.sendDown) {
                    this.sendChangeDataToServer();
                    //发送完毕关闭该开关
                    this.sendDown = false;
                }
                //发送向左移动的数据
                if (this.sendLeft) {
                    this.sendChangeDataToServer();
                    this.sendLeft = false;
                }
                //发送向右移动的数据
                if (this.sendRight) {
                    this.sendChangeDataToServer();
                    this.sendRight = false;
                }
                //发送旋转的相关数据
                if (this.sendRotate) {
                    this.sendChangeDataToServer();
                    this.sendRotate = false;
                }
                /**
                 * 发送给服务器数据结束
                 */
            } else {
                // //自己的游戏状态为是否游戏结束重置为true
                // cc.find("PebmanentNode").getComponent("UserInfo").isOver = true;
                //自己被敌人打败
                if (!this.hasOver) {
                    console.log("进入自己失败的游戏界面");
                    if (!this.isWin) {
                        this.gameBye();
                    }
                }
            }
        }
        //监听敌人是不是被自己打败
    },

    sendChangeDataToServer: function sendChangeDataToServer() {
        cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg(this.jsonMsgToServer);
        console.log("================发送数据结束================");
        this.jsonMsgToServer.changeMapList1 = [];
    },
    //游戏结束是否是被敌人打败
    gameBye: function gameBye() {
        //播放失败音效
        this.playAudio(this.loseAudio);
        //其他下降，旋转按钮，左右移动按钮处于不可激活状态
        this.downButton.interactable = false;
        this.rotateButton.interactable = false;
        this.slideButton.interactable = false;
        //显示结束动画
        this.gameOverAnimation.active = true;
        // var animation = this.gameOverAnimation.getComponent(cc.Animation);
        // animation.play("Over_light"); 
        this.overMenu.active = true;
        this.mask.active = true;
        //自己失败显示失败
        this.overMenu.getChildByName("lose").active = true;
        //自己没有赢不显示胜利的标记
        this.overMenu.getChildByName("win").active = false;
        //显示分数
        this.overMenu.getChildByName("Score").getComponent(cc.Label).string = this.score.toString();
        //显示等级
        //游戏结束向服务器发送游戏结束事件
        //被对手打败发送消息到服务器
        //被敌人打败发送消息到服务器告诉服务器我输了
        var gameOverJson = {
            tag1: 4,
            score: "",
            type: "4",
            state1: "",
            changeMapList1: [],
            removeMapList1: 0,
            nMapRow: "",
            nMapCol: "",
            loading1: "",
            result_score: ""
            //告诉对方我的游戏结束了
        };var gameOverJson1 = {
            tag1: 13,
            score: "",
            type: "4",
            state1: "",
            changeMapList1: [],
            removeMapList1: 0,
            nMapRow: "",
            nMapCol: "",
            loading1: "",
            result: -1
        };
        gameOverJson.result_score = this.score.toString();
        console.log("进入游戏结束给服务器发送游戏结束信息");
        //如果游戏结束没有发送给服务器发送一次
        cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg(gameOverJson);
        cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg(gameOverJson1);
        // this.overCost += dt;
        //游戏结束已经处理过了
        this.hasOver = true;
        //显示广告内容
        cc.find("PebmanentNode").getComponent("UserInfo").showAdvice();
        //暂停游戏
        cc.director.pause();
    },
    //更新预制体节点的y坐标
    updatePrefatY: function updatePrefatY(nodeArr) {
        var self = this;
        //如果允许下落的话条的y坐标向下移动
        if (this.CheckIsDown(nodeArr)) {
            //下落节点数组,如果是横向的话分开这连个节点
            this.down(nodeArr);
        } else {
            console.log("对手是否触底---->>>> " + this.rivalTouchBarry);
            if (this.rivalTouchBarry) {
                var next = function next(data) {
                    //处于闭包环境下该方法需要绑定对象
                    //计算消除的次数
                    removeJsonToServerWithPunish.removeRow = data;
                    //发送惩罚相关数据
                    console.log("============================发送惩罚相关数据到服务器");
                    cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg(removeJsonToServerWithPunish);
                    //惩罚完毕关闭惩罚
                    self.isPunish = false;
                    //监听对手是否触底开关关闭
                    self.rivalTouchBarry = false;
                    self.invokeRemoveTime = 0;
                };
                //异步操作       


                console.log("对手触底了吗？", this.rivalTouchBarry);
                // console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$>>>>>>>>>>>>>Enter the rivalTouchBarry");
                //如果对手碰到障碍物了就将isTouch重置为true
                this.isTouch = true;
                //改变地图信息
                this.changeMap(this.nodeArr);
                var removeTime = 0;
                //发送给服务器的惩罚所需要的数据
                var removeJsonToServerWithPunish = {
                    tag1: 12,
                    score: "",
                    type: "4",
                    state1: "",
                    changeMapList1: [],
                    removeRow: 0,
                    nMapRow: "",
                    nMapCol: "",
                    loading1: ""
                };
                console.log("准备发送数据hahahahahahhaah");
                self.checkNodeArr(self.nodeArr, removeTime).then(function () {
                    console.log("最终的消除次数是：" + removeTime);
                    console.log("在更新预制体坐标位置的全局消除次数是", self.invokeRemoveTime);
                    next(self.invokeRemoveTime);
                });
                console.log("消除惩罚开关是否关闭", self.isPunish);
                console.log("消除监听对手惩罚开关是否关闭", self.rivalTouchBarry);
                //消除次数是
                console.log("准备给服务器发送12消息 消除次数是-----", removeTime);
                //等待上一步的异步操作
                console.log("?????????????????????/////消除发送给服务器数据");
            } else {
                var _next = function _next(data) {
                    var jsonR = {
                        row: data,
                        col: 0
                    };
                    removeJsonToServer.removeMapList1.push(jsonR);
                    //向服务器发送消除的次数以便进行惩罚
                    console.log("在next方法中消除次数是" + jsonR.data);
                    cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg(removeJsonToServer);
                    //重置消除次数
                    self.invokeRemoveTime = 0;
                };

                console.log("::::::::this.rivalTouchBarry");
                console.log("对手触底了吗？", this.rivalTouchBarry);
                //改变地图信息
                this.changeMap(this.nodeArr);
                var removeTime = 0;
                //消除个数或者是消除次数发给服务器
                var removeJsonToServer = {
                    tag1: 6,
                    score: "",
                    type: "4",
                    state1: "",
                    changeMapList1: [],
                    removeMapList1: [],
                    nMapRow: "",
                    nMapCol: "",
                    loading1: ""
                };

                self.checkNodeArr(self.nodeArr, removeTime).then(function () {
                    console.log("最终的消除次数是：" + removeTime);
                    console.log("在更新预制体坐标位置的全局消除次数是", self.invokeRemoveTime);
                    if (self.invokeRemoveTime != 0) {
                        _next(self.invokeRemoveTime);
                    }
                });
                // function waitCheck(){
                //     //查看这个节点数组中是否可以消除如果满足条件进行消除返回一个Promise对象
                //     return self.checkNodeArr(self.nodeArr,removeTime);
                // }       
                // waitCheck().then(function(data){
                //     //检查完成之后进行下一步操作
                //     // console.log("记录递归调用的次数是"+this.invokeRemoveTime);
                //     // console.log("then 操作----->>>",data);
                //     console.log("消除次数是："+removeTime);
                //     //如果消除的次数为零的话该数据不发送给服务器
                //     if(removeTime != 0){
                //         //消除次数不为零的情况发送给服务器
                //         next(removeTime);

                //     }
                // });   
                //等待上一步的异步操作上一步的异步操作完成之后给服务器发送数据
            }
            //如果是不在惩罚状态的话就正常下落如果是处于惩罚状态的话就等待惩罚进行完毕之后进行下落

            //生成下一个形状
            self.nodeArr = self.nextBlock;
            //生成下一个形状
            self.createNext();
        }
    },
    share: function share() {
        if (CC_WECHATGAME) {
            console.log("首页share");
            cc.find("PebmanentNode").getComponent("UserInfo").shareFriends();
        } else if (cc.sys.isNative) {
            //原生平台分享
            cc.find("PebmanentNode").getComponent("UserInfo").nativeShare();
        }
    },
    //检查一个节点数组是否满足消除条件
    checkNodeArr: function checkNodeArr(nodeArr, removeTime) {
        var self = this;
        if (nodeArr.length > 0) {
            //临时数组存放待消节点
            var waitQueue = [];
            if (this.canRemove(nodeArr, waitQueue).isRemove) {
                //如果是可以消除的话进行消除这时候待消队列已经填满了节点
                // this.remove(this.nodeArr);
                //检测完这两个下落的方块的待消队列
                for (var j = 0; j < waitQueue.length; j++) {
                    //如果该节点已经删除的话不对它操作
                    if (waitQueue[j] === null) {
                        //将它从该数组删除
                        waitQueue.splice(j, 1);
                    }
                    //将这些待消除的标记为可消除的
                    waitQueue[j].getComponent("Figure").isRemove = true;
                }
                this.tempNodes = waitQueue;
                //加分
                this.addScore(waitQueue.length);
                return self.remove(waitQueue, removeTime).then(function (data) {
                    console.log("在检查节点的时候消除次数是：", removeTime);
                    console.log("上一次remove执行完毕");
                });
                // return new Promise(function(resolve,reject){
                //     //检测是否可以消除操作
                //     var b = self.remove(waitQueue,removeTime);
                //     console.log("b is ",b);
                //     if(b){
                //         //如果消除完毕就告诉Promise执行完毕了
                //         resolve(removeTime);
                //     }
                //     // resolve(removeTime);
                // });
            } else {
                //不能消除的时候发送零
                if (this.rivalTouchBarry) {
                    console.log("对手不能消除在发送消息给服务器！！！！！！");
                    // callback(0);
                    return new Promise(function (resolve, reject) {
                        console.log("进入消除零次的Promise");
                        resolve(0);
                    });
                } else {
                    //如果是自己的话消除零次发送给服务器但是在不能下落的时候不发送该数据
                    return new Promise(function (resolve, reject) {
                        console.log("对手没有给我发消息");
                        resolve(0);
                    });
                }
            }
        }
    },
    //消除操作，先播放消除动画删除相应节点，上面的节点依次下落
    remove: function remove(waitQueue, removeTime) {
        //播放消除音效
        this.playAudio(this.removeAudio);
        //先不删除这些节点等找到所有这些待消节点上方的节点之后删除他们
        //找到这几个待消节点上面的所有节点让他们自动执行下落动作（节点所挂的消除下落方法）
        var scoreLabel = this.scoreLabel.getComponent(cc.Label);
        removeTime++;
        //记录消除次数
        this.invokeRemoveTime++;
        if (removeTime >= 2) {
            if (removeTime === 2) {
                //产生一次连击
                this.score += 10;
            } else if (removeTime === 3) {
                //产生两次连击
                this.score += 20;
            } else if (removeTime === 4) {
                //产生3次连击
                this.score += 30;
            } else if (removeTime === 5) {
                //产生4次连击
                this.score += 40;
            } else if (removeTime === 6) {
                this.score += 50;
            } else if (removeTime === 7) {
                //六连击
                this.score += 60;
            }
            scoreLabel.string = this.score.toString();
        }
        // this.jsonMsgToServer.removeMapList1 = removeTime;
        // this.jsonMsgToServer.score = this.score.toString();

        var waitDownArr = [];
        for (var m = 0; m < waitQueue.length; m++) {
            var cRow = waitQueue[m].getComponent("Figure").row;
            var cCol = waitQueue[m].getComponent("Figure").col;
            this.upFindNodes(cRow, cCol, waitDownArr);
        }
        cc.log("待下落节点数组为：" + waitDownArr);
        //得到激活之后的节点
        var activeNode = this.deleteNodeFromParent(waitQueue);
        // if(!waitDownArr.contain(activeNode))
        //     waitDownArr.push(activeNode);
        //下落其他节点
        for (var j = 0; j < waitDownArr.length; j++) {
            waitDownArr[j].getComponent("Figure").afterRemoveDown(this.map, this.backGroundArr, true);
        }
        if (activeNode.length > 0) {
            for (var i = 0; i < activeNode.length; i++) {
                if (!waitDownArr.contain(activeNode[i])) {
                    //将该激活节点加入到下降节点队列里检测是否可以再次消除
                    waitDownArr.push(activeNode[i]);
                }
            }
        }
        // cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg(this.jsonMsgToServer);
        //检测下降的节点数组看看是否可以再次消除
        //0.5秒后检测下落的节点数组，为了防止下落块还没有执行action完又来了个action这样moveTo方法会出现错误
        //连消检测
        var self = this;
        function next() {
            //向服务器发送分数信息
            var jsonMsgToServer = {
                tag1: 11,
                score: 0,
                type: "4",
                state1: "",
                changeMapList1: [],
                removeMapList1: 0,
                nMapRow: "",
                nMapCol: "",
                loading1: "",
                nDisappear1: 0
            };
            jsonMsgToServer.tag1 = 11;
            jsonMsgToServer.score = self.score;
            jsonMsgToServer.nDisappear1 = self.score;
            cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg(jsonMsgToServer);
            // return true;
        }
        console.log("1031");
        function waitPromise() {
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    console.log("1034 line " + removeTime);
                    //检查是否能再次消除
                    var isP = self.checkNodeArr(waitDownArr, removeTime);
                    if (isP instanceof Promise) {
                        console.log("1038 --->" + isP);
                        isP.then(function (data) {
                            resolve(data);
                        });
                    }
                }, 500);
            });
        }
        return waitPromise().then(function (data) {
            console.log("在消除方法中消除次数是", removeTime);
            console.log("全局的消除变量是", self.invokeRemoveTime);
            next();
            // overPromise();
        });
    },
    //改变地图信息
    changeMap: function changeMap(nodeArr) {
        if (nodeArr.length > 0) {
            for (var k = 0; k < nodeArr.length; k++) {
                //将所有的坐标变成只保留两位小数的数字
                nodeArr[k].x = Number(nodeArr[k].x.toFixed(2));
                nodeArr[k].y = Number(nodeArr[k].y.toFixed(2));
            }
            for (var i = 0; i < nodeArr.length; i++) {
                //当前停止的节点对应的地图位置
                var row = nodeArr[i].getComponent("Figure").row;
                var col = nodeArr[i].getComponent("Figure").col;
                //如果有块在停止的时候更新了地图就不在这里更新地图信息了
                if (!nodeArr[i].getComponent("Figure").hasDown) {
                    this.map[row][col] = 1;
                    //将背景方格的属性状态改为该节点数组对应的类型
                    this.backGroundArr[row][col].getComponent("Back").type = nodeArr[i].getComponent("Figure").type;
                    this.backGroundArr[row][col].getComponent("Back").innerNode = nodeArr[i];
                } else {
                    //将该节点的移动状态改为初始值
                    nodeArr[i].getComponent("Figure").hasDown = false;
                }
            }
        }
    },
    //检查该节点数组是否可以消除
    /**
     * @param  {待检测的节点数组} nodeArr
     * @param  {待消队列} waitQueue
     * @return {JSON}    result
     */
    canRemove: function canRemove(nodeArr, waitQueue) {
        //返回结果
        var result = {
            isRemove: false,
            queue: null
        };
        for (var m = 0; m < nodeArr.length; m++) {
            var tempArr = [];
            var cRow = nodeArr[m].getComponent("Figure").row;
            var cCol = nodeArr[m].getComponent("Figure").col;
            var cType = nodeArr[m].getComponent("Figure").type;
            this.find(nodeArr[m], cRow, cCol, cType, tempArr);
            if (tempArr.length >= 3) {
                for (var k = 0; k < tempArr.length; k++) {
                    var nodeType = tempArr[k].getComponent("Figure").type;
                    //画像方块的类型在0-3之间才允许加进去
                    if (!waitQueue.contain(tempArr[k]) && nodeType < 4 && nodeType >= 0) {
                        //如果数组里面有这个节点的信息了说明已经加到数组里面了不用再重复加入了
                        waitQueue.push(tempArr[k]);
                    } else {
                        cc.log("该类型不在加入的条件");
                    }
                }
            }
        }
        //递归的方式把待消队列找出来
        if (waitQueue.length >= 3) {
            result.isRemove = true;
            result.queue = waitQueue;
        } else {
            result.isRemove = false;
            result.queue = [];
        }
        return result;
    },
    /**
     * 依据带消除队列里的长度进行计算分数
     * @param  {待消除队列的长度} waitQueueLength
     */
    addScore: function addScore(waitQueueLength) {
        var scoreLabel = this.scoreLabel.getComponent(cc.Label);
        switch (waitQueueLength) {
            case 3:
                this.score += 30;
                break;
            case 4:
                this.score += 40;
                break;
            case 5:
                this.score += 50;
                break;
            case 6:
                this.score += 60;
                break;
            case 7:
                this.score += 70;
                break;
            case 8:
                this.score += 80;
                break;
            case 9:
                this.score += 90;
                break;
        }
        //显示分数
        scoreLabel.string = this.score;
    },

    /**
     * @param  {待消除队列} waitQueue
     */
    deleteNodeFromParent: function deleteNodeFromParent(waitQueue) {
        var _console;

        //激活节点数组
        var activeNodeArr = [];
        var jsonMsgToServer = {
            tag1: 9,
            score: "",
            type: "4",
            state1: "",
            changeMapList1: [],
            removeMapList1: 0,
            nMapRow: "",
            nMapCol: "",
            loading1: "",
            nDisappear1: ""
        };
        for (var i = 0; i < waitQueue.length; i++) {
            var row = waitQueue[i].getComponent("Figure").row;
            var col = waitQueue[i].getComponent("Figure").col;
            // var upNodes = this.upFindNodes(row,col);
            //检查待消除方格的周围有没有封印的方格小块
            this.checkHasSealBlock(row, col, activeNodeArr);
            //恢复地图信息
            this.map[row][col] = 0;
            //恢复背景方格的原始属性
            this.backGroundArr[row][col].getComponent("Back").type = -1;
            this.backGroundArr[row][col].getComponent("Back").innerNode = null;
            waitQueue[i].getComponent("Figure").shine();
            var removeJsonInfo = {
                row: row,
                col: col,
                color: "-1"
            };
            jsonMsgToServer.changeMapList1.push(removeJsonInfo);
        }

        console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
        (_console = console).log.apply(_console, _toConsumableArray(jsonMsgToServer.changeMapList1));
        cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg(jsonMsgToServer);
        //返回激活队列
        return activeNodeArr;
        // if(activeNodeArr.length > 0){
        //     //检查激活过的节点是否存在消除的可能
        //     this.checkNodeArr(activeNodeArr);
        // }
    },
    //查看一个节点周围有没有封印的画像方块
    checkHasSealBlock: function checkHasSealBlock(row, col, activeNodeArr) {
        //四个方向的位置
        var directionArr = [[row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1]];
        for (var m = 0; m < directionArr.length; m++) {
            var crow = directionArr[m][0];
            var ccol = directionArr[m][1];
            //如果行或者列超出了边界位置就继续下一个方向数组对应的行和列
            if (crow > 11 || crow < 0 || ccol > 5 || ccol < 0) {
                continue;
            } else {
                var node = this.backGroundArr[crow][ccol].getComponent("Back").innerNode;
                if (node === null) {
                    continue;
                }
                //如果是待消除的方块的话就跳过该节点
                if (node.getComponent("Figure").isRemove === true) {
                    continue;
                }
                var nodeType = this.backGroundArr[crow][ccol].getComponent("Back").type;
                if (nodeType >= 4 && nodeType <= 7) {
                    // var nodeName = Number(node.name);
                    //证明该行该列存在封印的画像动态加载图片
                    cc.log("nodeType is " + nodeType);
                    var anim = node.getComponent(cc.Animation);
                    //激活状态设置为true
                    node.getComponent("Figure").isActive = true;
                    if (!activeNodeArr.contain(node)) {
                        //将该激活节点加入到激活队列里
                        activeNodeArr.push(node);
                    }
                    var sendJson = {
                        row: crow,
                        col: ccol,
                        color: "2"
                    };
                    if (nodeType === 4) {
                        this.playAnimAndChangeState(anim, 0, "7", crow, ccol, node, sendJson);
                    } else if (nodeType === 5) {
                        this.playAnimAndChangeState(anim, 1, "8", crow, ccol, node, sendJson);
                    } else if (nodeType === 6) {
                        this.playAnimAndChangeState(anim, 2, "9", crow, ccol, node, sendJson);
                    } else if (nodeType === 7) {
                        this.playAnimAndChangeState(anim, 3, "10", crow, ccol, node, sendJson);
                    }
                    this.jsonMsgToServer.changeMapList1.push(sendJson);
                    cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg(this.jsonMsgToServer);
                    //置空改变地图json对象数组
                    this.jsonMsgToServer.changeMapList1 = [];
                    console.log("=====================查找待激活的节点并将它传到服务器并且改变数组=========================");
                }
            }
        }
    },
    /**
     * 播放破壳动画及变换背景方格的类型
     * @param  {动画对象} anim
     * @param  {背景方格对应的类型} type
     * @param  {该节点即将改变的名字} name
     * @param  {待破壳节点的行} crow
     * @param  {待破壳节点的列} ccol
     * @param  {改变的节点} node
     * @param  {发送给服务器的json数据} sendJson
     */
    playAnimAndChangeState: function playAnimAndChangeState(anim, type, name, crow, ccol, node, sendJson) {
        for (var j = 0; j < node.childrenCount; j++) {
            node.children[j].setPositionX(0);
            node.children[j].active = true;
        }
        anim.play("game_yellow_stone_unlock");
        //改变背景方格的对应的状态类型
        this.backGroundArr[crow][ccol].getComponent("Back").type = type;
        sendJson.color = type.toString();
        //设置该节点的类型为0
        node.getComponent("Figure").type = type;
        node.name = name;
    },
    //动态修改图片的spriteFrame
    /**
     * @param  {节点的名字} nodeName
     * @param  {待修改节点} node
     */
    dynamicLoad: function dynamicLoad(nodeName, node) {
        nodeName = Number(nodeName);
        function callback(err, spriteFrame) {
            if (err) {
                console.log(err);
            }
            node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            //加载完之后修改精灵的名字
            cc.log("设置");
        }
        (function test(callback) {
            cc.loader.loadRes("Game4/" + nodeName - 4, cc.SpriteFrame, callback);
        })(callback.bind(this));
    },

    //向上找节点
    /**
     * @param  {本节点的行} row
     * @param  {本节点的列} col
     * @param  {存放该节点以上的所有节点数组} arr
     */
    upFindNodes: function upFindNodes(row, col, arr) {
        if (arguments.length === 2) {
            var tempArr = [];
        }
        while (row > 0) {
            row--;
            var upNode = this.backGroundArr[row][col].getComponent("Back").innerNode;
            if (upNode != null) {
                if (upNode.getComponent("Figure").isRemove === true) {
                    continue;
                } else {
                    if (arguments.length === 3) {
                        //将不是待消节点添加到数组中去
                        if (!arr.contain(upNode)) {
                            //如果该数组中还没有该节点的话就加进去
                            arr.push(upNode);
                        }
                    } else {
                        if (!tempArr.contain(upNode)) tempArr.push(upNode);
                    }
                }
            } else {
                //如果upNode是空的话
                break;
            }
        }
        if (arguments.length === 2) {
            return tempArr;
        }
    },
    //
    /**
     * 递归查找该节点上下左右四个方向是否有跟自己的类型相同的节点
     * @param  {待检测节点} node
     * @param  {待检测节点所在的行} row
     * @param  {待检测节点所在的列} col
     * @param  {待检测节点的类型} type
     * @param  {待消除队列} arr
     */
    find: function find(node, row, col, type, arr) {
        //定义上下左右四个方向数组
        var round = [[row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1]];
        if (!arr.contain(node)) {
            //如果当前数组中不包含该节点就加入数组
            arr.push(node);
        }
        for (var i = 0; i < round.length; i++) {
            //如果计算的行或者列超出了边界继续下一个行列
            if (round[i][0] < 0 || round[i][0] > 11 || round[i][1] > 5 || round[i][1] < 0) {
                continue;
            }
            var checkType = this.backGroundArr[round[i][0]][round[i][1]].getComponent("Back").type;
            if (checkType === type && checkType < 4 && checkType >= 0) {
                var waitDeleteNode = this.backGroundArr[round[i][0]][round[i][1]].getComponent("Back").innerNode;
                if (!arr.contain(waitDeleteNode)) {
                    arr.push(waitDeleteNode);
                    //递归寻找节点
                    this.find(waitDeleteNode, round[i][0], round[i][1], type, arr);
                }
            }
        }
    },
    //方块下落方法
    down: function down(nodeArr) {
        //在update里面发送下落数据标记
        this.sendDown = true;
        this.jsonMsgToServer.score = this.score;
        //获得最小行
        var minRow = Math.min.apply(Math, Array.of(nodeArr[0].getComponent("Figure").row, nodeArr[1].getComponent("Figure").row));
        var colArr = []; //= Array.of(nodeArr[0].getComponent("Figure").col,nodeArr[1].getComponent("Figure").col);
        for (var m = 0; m < 2; m++) {
            var colNum = nodeArr[m].getComponent("Figure").col;
            //数组去重
            if (!colArr.includes(colNum)) {
                colArr.push(colNum);
            }
        }
        //位移2个方格
        for (var i = nodeArr.length - 1; i >= 0; i--) {
            var row = this.getRow(nodeArr[i]);
            var col = this.getColumn(nodeArr[i]);
            nodeArr[i].y = this.backGroundArr[row + 1][col].y;
            //改变该节点的行数
            nodeArr[i].getComponent("Figure").row = row + 1;
            var afterDownRow = nodeArr[i].getComponent("Figure").row;
            //将这些行的信息存到json数组里发送给服务器
            var currentJson = {};
            currentJson.row = afterDownRow;
            currentJson.col = col;
            currentJson.color = nodeArr[i].getComponent("Figure").type.toString();
            this.jsonMsgToServer.changeMapList1.push(currentJson);
            if (afterDownRow - 1 === minRow) {
                //如果是同行不同列的情况的话遍历各个列
                for (var j = 0; j < colArr.length; j++) {
                    var upZero = {};
                    upZero.row = minRow;
                    upZero.col = colArr[j];
                    upZero.color = "-1";
                    this.jsonMsgToServer.changeMapList1.push(upZero);
                }
            }
        }
        console.log("jsonMstToLServer is " + this.jsonMsgToServer);
        console.log("tag1 is " + this.jsonMsgToServer.tag1);
        console.log("score is " + this.jsonMsgToServer.score);
        console.log("changeMapList1 is " + this.jsonMsgToServer.changeMapList1.length);
        console.log("=================下落发送数据到服务器开始==================");
    },
    //将这两个预制体的坐标数值保留两位小数
    remainTwoNumber: function remainTwoNumber(nodeArr) {
        for (var k = 0; k < nodeArr.length; k++) {
            //将所有的坐标变成只保留两位小数的数字
            nodeArr[k].x = Number(nodeArr[k].x.toFixed(2));
            nodeArr[k].y = Number(nodeArr[k].y.toFixed(2));
        }
    },
    //旋转方法
    rotate: function rotate() {
        if (!this.gameOver) {
            //记录下旋转的位置
            // this.unscheduleAllCallbacks();
            if (this.isCreateOver) {
                this.playAudio(this.clickAudio);
                this.rotateButton.children[0].opacity = 120;
                var self = this;
                //旋转中心
                var x0 = this.nodeArr[1].x;
                var y0 = this.nodeArr[1].y;
                var x0Row = this.getRow(this.nodeArr[1]);
                var x0Col = this.getColumn(this.nodeArr[1]);

                // var rotateArr = [[x0Row-1,x0Col],[x0Row,x0Col+1],[x0Row+1,x0Col],[x0Row,x0Col-1 ]];
                //旋转0度对应的坐标
                var x = this.nodeArr[0].x;
                var y = this.nodeArr[0].y;

                //旋转45度对应的坐标
                var rotate45X = (x - x0) * Math.cos(-Math.PI / 4) - (y - y0) * Math.sin(-Math.PI / 4) + x0;
                var rotate45Y = (x - x0) * Math.sin(-Math.PI / 4) + (y - y0) * Math.cos(-Math.PI / 4) + y0;
                //节点的旋转状态
                var nodeAngle = this.nodeArr[0].getComponent("Figure").angle;
                var canAction = false;
                if (nodeAngle === 0) {
                    //边界旋转
                    if (x0Col === 5) {
                        //改变旋转中心进行旋转内部进行判断是否可以旋转
                        this.changeRotateCenter(nodeAngle, x0Col);
                    } else {
                        if (this.checkIsRotate(x0Row, x0Col, nodeAngle)) {
                            //旋转90度对应的坐标位置
                            var bezier = this.dealRotate(nodeAngle, x0Row, x0Col, rotate45X, rotate45Y, x, y, 1);
                            //能够旋转
                            canAction = true;
                        }
                    }
                } else if (nodeAngle === 1) {
                    if (this.checkIsRotate(x0Row, x0Col, nodeAngle)) {
                        var bezier = this.dealRotate(nodeAngle, x0Row, x0Col, rotate45X, rotate45Y, x, y, 2);
                        canAction = true;
                    }
                } else if (nodeAngle === 2) {
                    //边界旋转判断改为顺时针旋转（以#0块为旋转中心）
                    if (x0Col === 0) {
                        this.changeRotateCenter(nodeAngle, x0Col);
                    } else {
                        if (this.checkIsRotate(x0Row, x0Col, nodeAngle)) {
                            var bezier = this.dealRotate(nodeAngle, x0Row, x0Col, rotate45X, rotate45Y, x, y, 3);
                            canAction = true;
                        }
                    }
                } else if (nodeAngle === 3) {
                    if (this.checkIsRotate(x0Row, x0Col, nodeAngle)) {
                        //创建贝塞尔曲线所对应的最少坐标
                        var bezier = this.dealRotate(nodeAngle, x0Row, x0Col, rotate45X, rotate45Y, x, y, 0);
                        canAction = true;
                    }
                }
                if (canAction) {
                    var pro = function pro() {
                        cc.log("承诺正常执行########");
                        cc.log("@@@@@@@@@@" + self.nodeArr[0].x);
                        cc.log("@@@@@@@@@@" + self.nodeArr[0].y);
                    };

                    (function test(cb) {
                        var bezierAction = cc.bezierTo(0.008, bezier);
                        self.nodeArr[0].runAction(bezierAction);
                        cb();
                    })(pro);

                    cc.log("结束旋转动作!!!!!");
                }
            }
            this.scheduleOnce(function () {
                this.rotateButton.children[0].opacity = 0;
            }, 0.5);
        }
    },
    //处理旋转
    /**
     * @param  {当前需要旋转的节点的角度代码属性} angle
     * @param  {旋转中心所在的行} row
     * @param  {选装中心所在的列} col
     * @param  {旋转45度对应的x坐标} rotate45X
     * @param  {旋转45度对应的y坐标} rotate45Y
     * @param  {旋转之前的x坐标} x
     * @param  {旋转之前对应的y坐标} y
     * @param  {旋转之后该节点对应的角度属性代号} angleCode
     */
    dealRotate: function dealRotate(angle, row, col, rotate45X, rotate45Y, x, y, angleCode) {
        var nodeZeroType = this.nodeArr[0].getComponent("Figure").type.toString();
        var nodeOneType = this.nodeArr[1].getComponent("Figure").type.toString();
        var json1, json2, json3;
        if (angle === 0) {
            var rotate90X = this.backGroundArr[row][col + 1].x;
            var rotate90Y = this.backGroundArr[row][col + 1].y;
            this.nodeArr[0].getComponent("Figure").row = row;
            this.nodeArr[0].getComponent("Figure").col = col + 1;
            console.log("$$$$$$$$$$$$$$$$$$$$$");
            //发送json对象到服务器
            json1 = this.createJsonDateForServer(row - 1, col, "-1");
            json2 = this.createJsonDateForServer(row, col, nodeOneType);
            json3 = this.createJsonDateForServer(row, col + 1, nodeZeroType);
        } else if (angle === 1) {
            var rotate90X = this.backGroundArr[row + 1][col].x;
            var rotate90Y = this.backGroundArr[row + 1][col].y;
            this.nodeArr[0].getComponent("Figure").row = row + 1;
            this.nodeArr[0].getComponent("Figure").col = col;
            console.log("$$$$$$$$$$$$$$$$$$$$");
            json1 = this.createJsonDateForServer(row, col + 1, "-1");
            json2 = this.createJsonDateForServer(row, col, nodeOneType);
            json3 = this.createJsonDateForServer(row + 1, col, nodeZeroType);
        } else if (angle === 2) {
            var rotate90X = this.backGroundArr[row][col - 1].x;
            var rotate90Y = this.backGroundArr[row][col - 1].y;
            this.nodeArr[0].getComponent("Figure").row = row;
            this.nodeArr[0].getComponent("Figure").col = col - 1;
            json1 = this.createJsonDateForServer(row + 1, col, "-1");
            json2 = this.createJsonDateForServer(row, col, nodeOneType);
            json3 = this.createJsonDateForServer(row, col - 1, nodeZeroType);
        } else if (angle === 3) {
            var rotate90X = this.backGroundArr[row - 1][col].x;
            var rotate90Y = this.backGroundArr[row - 1][col].y;
            this.nodeArr[0].getComponent("Figure").row = row - 1;
            this.nodeArr[0].getComponent("Figure").col = col;
            json1 = this.createJsonDateForServer(row, col - 1, "-1");
            json2 = this.createJsonDateForServer(row, col, nodeOneType);
            json3 = this.createJsonDateForServer(row - 1, col, nodeZeroType);
        }
        try {
            this.sendRotate = true;
            console.log("*************进入try语句块****************");
            var jsonArr = Array.of(json1, json2, json3);
            this.pushChangeMapList(jsonArr);
        } catch (e) {
            console.log(e);
        }

        //创建贝塞尔曲线所对应的最少坐标
        var bezier = [cc.p(x, y), cc.p(rotate45X, rotate45Y), cc.p(rotate90X, rotate90Y)];
        // //初始向量
        // var startV = cc.v2(x,y).sub(cc.v2(x0,y0));
        // var result = startV.rotate(Math.PI/2);
        this.nodeArr[0].x = rotate90X;
        this.nodeArr[0].y = rotate90Y;
        //旋转之后变成相应的角度
        this.nodeArr[0].getComponent("Figure").angle = angleCode;
        return bezier;
    },
    //创建一个json数组
    pushChangeMapList: function pushChangeMapList(jsonArr) {
        for (var i = 0; i < jsonArr.length; i++) {
            this.jsonMsgToServer.changeMapList1.push(jsonArr[i]);
        }
    },
    //创建发送给服务器的json数据
    /**
     * @param  {发送给服务器的行} row
     * @param  {发送给服务器的列} col
     * @param  {发送给服务器的类型} color
     */
    createJsonDateForServer: function createJsonDateForServer(row, col, color) {
        var jsonData = {
            row: row,
            col: col,
            color: color
        };
        return jsonData;
    },
    //发送数据到服务器
    sendDataToServer: function sendDataToServer(jsonMsg) {
        //发送json数据到服务器
        cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg(jsonMsg);
    },
    //变换旋转中心
    changeRotateCenter: function changeRotateCenter(nodeAngle, col) {
        var canRotate = false;
        var self = this;
        var x00 = this.nodeArr[0].x;
        var y00 = this.nodeArr[0].y;
        var x00Row = this.getRow(this.nodeArr[0]);
        var x00Col = this.getColumn(this.nodeArr[0]);

        var xx = this.nodeArr[1].x;
        var yy = this.nodeArr[1].y;

        //旋转45度方向
        var rotate45Xc = (xx - x00) * Math.cos(-Math.PI / 4) - (yy - y00) * Math.sin(-Math.PI / 4) + x00;
        var rotate45Yc = (xx - x00) * Math.sin(-Math.PI / 4) + (yy - y00) * Math.cos(-Math.PI / 4) + y00;
        if (nodeAngle === 0 && col === 5) {
            //检查是否可以旋转
            var json1, json2, json3;
            var nodeZeroType = this.nodeArr[0].getComponent("Figure").type;
            var nodeOneType = this.nodeArr[1].getComponent("Figure").type;
            if (this.checkIsRotateByRotateCenter(x00Row, x00Col, nodeAngle)) {
                var rotate90X = this.backGroundArr[x00Row][x00Col - 1].x;
                var rotate90Y = this.backGroundArr[x00Row][x00Col - 1].y;
                this.nodeArr[1].getComponent("Figure").row = x00Row;
                this.nodeArr[1].getComponent("Figure").col = x00Col - 1;

                //发送数据到服务器
                json1 = this.createJsonDateForServer(x00Row + 1, x00Col, "-1");
                json2 = this.createJsonDateForServer(x00Row, x00Col, nodeZeroType);
                json3 = this.createJsonDateForServer(x00Row, x00Col - 1, nodeOneType);

                canRotate = true;
            }
        } else if (nodeAngle === 2 && col === 0) {
            if (this.checkIsRotateByRotateCenter(x00Row, x00Col, nodeAngle)) {
                var rotate90X = this.backGroundArr[x00Row][x00Col + 1].x;
                var rotate90Y = this.backGroundArr[x00Row][x00Col + 1].y;
                this.nodeArr[1].getComponent("Figure").row = x00Row;
                this.nodeArr[1].getComponent("Figure").col = x00Col + 1;
                //发送数据到服务器
                json1 = this.createJsonDateForServer(x00Row - 1, x00Col, "-1");
                json2 = this.createJsonDateForServer(x00Row, x00Col, nodeZeroType);
                json3 = this.createJsonDateForServer(x00Row, x00Col + 1, nodeOneType);
                canRotate = true;
            }
        }
        //如果能旋转的话就进行执行贝塞尔曲线
        if (canRotate) {
            var pro = function pro() {
                cc.log("承诺正常执行########");
                cc.log("@@@@@@@@@@" + self.nodeArr[0].x);
                cc.log("@@@@@@@@@@" + self.nodeArr[0].y);
            };

            try {
                this.sendRotate = true;
                var jsonArr = Array.of(json1, json2, json3);
                this.pushChangeMapList(jsonArr);
            } catch (e) {
                console.log(e);
            }
            //创建贝塞尔曲线所对应的最少坐标
            var bezier = [cc.p(xx, yy), cc.p(rotate45Xc, rotate45Yc), cc.p(rotate90X, rotate90Y)];
            // //初始向量
            this.nodeArr[1].x = rotate90X;
            this.nodeArr[1].y = rotate90Y;
            //旋转之后变成270度
            if (nodeAngle === 2 && col === 0) {
                this.nodeArr[0].getComponent("Figure").angle = 3;
            } else if (nodeAngle === 0 && col === 5) {
                this.nodeArr[0].getComponent("Figure").angle = 1;
            }
            //执行贝塞尔曲线动作
            (function test(cb) {

                var bezierAction = cc.bezierTo(0.008, bezier);
                self.nodeArr[1].runAction(bezierAction);
                cb();
            })(pro.bind(self));
        }
    },
    /**
     * 检查以0号数组元素为旋转中心检查是否可以旋转
     * @param  {以零号数组节点所在的行} centerRow
     * @param  {以零号数组节点所在的列} centerCol
     * @param  {以零号数组节点所在的角度} angle
     */
    checkIsRotateByRotateCenter: function checkIsRotateByRotateCenter(centerRow, centerCol, angle) {
        if (angle === 2 && centerCol === 0) {
            if (this.map[centerRow - 1][centerCol + 1] != 1 && this.map[centerRow][centerCol + 1] != 1) {
                return true;
            } else {
                return false;
            }
        } else if (angle === 0 && centerCol === 5) {
            if (this.map[centerRow + 1][centerCol - 1] != 1 && this.map[centerRow][centerCol - 1] != 1) {
                return true;
            } else {
                return false;
            }
        }
    },
    //检查是否可以旋转
    /**
     * @param  {旋转中心节点所在的行} centerRow
     * @param  {旋转中心节点所在的列} centerCol
     * @param  {待旋转节点的角度属性} angle
     */
    checkIsRotate: function checkIsRotate(centerRow, centerCol, angle) {
        //四个方向
        //如果当前方向是0的话就看看一方向对应的背景方格的状态是什么
        if (angle === 0) {
            //检查旋转中心节点的右边背景方格的状态是否为1和检查#0块右边对应的背景方格是否为1
            if (this.map[centerRow - 1][centerCol + 1] != 1 && this.map[centerRow][centerCol + 1] != 1) {
                return true;
            } else {
                return false;
            }
        } else if (angle === 1) {
            if (this.map[centerRow + 1][centerCol + 1] != 1 && this.map[centerRow + 1][centerCol] != 1) {
                return true;
            } else {
                return false;
            }
        } else if (angle === 2) {
            if (this.map[centerRow + 1][centerCol - 1] != 1 && this.map[centerRow][centerCol - 1] != 1) {
                return true;
            } else {
                return false;
            }
        } else if (angle === 3) {
            if (this.map[centerRow - 1][centerCol - 1] != 1 && this.map[centerRow - 1][centerCol] != 1) {
                return true;
            } else {
                return false;
            }
        }
    },
    //左移方法
    moveLeft: function moveLeft() {
        if (!this.gameOver) {
            this.remainTwoNumber(this.nodeArr);
            if (this.CheckIsLeft()) {
                //打开发送向左移动的开关
                this.sendLeft = true;
                //获得最大列
                var maxCol = Math.max.call(null, this.nodeArr[0].getComponent("Figure").col, this.nodeArr[1].getComponent("Figure").col);
                var rowArr = [this.nodeArr[0].getComponent("Figure").row, this.nodeArr[1].getComponent("Figure").row];

                for (var i = 0; i < this.nodeArr.length; i++) {
                    this.leftMove(this.nodeArr[i]);
                }
                //如果生成方块的个数是一个的话加发送两个数据给服务器就行了
                for (var j = 0; j < rowArr.length; j++) {
                    var jsonDataToServer = {
                        row: rowArr[j],
                        col: maxCol,
                        color: "-1"
                        //将该信息添加到json对象中去发送到服务器并且进行去重
                    };console.log("是否包含该对象：", this.jsonMsgToServer.changeMapList1.isContain(jsonDataToServer));
                    if (!this.jsonMsgToServer.changeMapList1.isContain(jsonDataToServer)) {
                        this.jsonMsgToServer.changeMapList1.push(jsonDataToServer);
                    }
                }
            }
        }
    },
    leftMove: function leftMove(node) {
        var row = node.getComponent("Figure").row;
        var col = node.getComponent("Figure").col;
        //将当前背景节点的node改为null
        // this.backGroundArr[row][col].node = null;
        node.x = this.backGroundArr[row][col - 1].x;
        node.getComponent("Figure").row = row;
        node.getComponent("Figure").col = col - 1;
        var afterLeftJson = {
            row: row,
            col: col - 1,
            color: node.getComponent("Figure").type.toString()
        };
        if (!this.jsonMsgToServer.changeMapList1.isContain(afterLeftJson)) {
            this.jsonMsgToServer.changeMapList1.push(afterLeftJson);
        }
    },
    //右移方法
    moveRight: function moveRight() {
        if (!this.gameOver) {
            this.remainTwoNumber(this.nodeArr);
            //获得最小列
            var minCol = Math.min.call(null, this.nodeArr[0].getComponent("Figure").col, this.nodeArr[1].getComponent("Figure").col);
            var rowArr = [this.nodeArr[0].getComponent("Figure").row, this.nodeArr[1].getComponent("Figure").row];
            if (this.CheckIsRight()) {
                this.sendRight = true;
                for (var i = 0; i < this.nodeArr.length; i++) {
                    this.rightMove(this.nodeArr[i]);
                }
            }
            for (var _i = 0; _i < rowArr.length; _i++) {
                var jsonDataToServer = {
                    row: rowArr[_i],
                    col: minCol,
                    color: "-1"
                    //将该信息添加到json对象中去发送到服务器
                };if (!this.jsonMsgToServer.changeMapList1.isContain(jsonDataToServer)) {
                    this.jsonMsgToServer.changeMapList1.push(jsonDataToServer);
                }
            }
            console.log("================发送数据开始================");
        }
    },
    rightMove: function rightMove(node) {
        var row = node.getComponent("Figure").row;
        var col = node.getComponent("Figure").col;
        //将当前背景节点的node改为null
        node.x = this.backGroundArr[row][col + 1].x;
        node.getComponent("Figure").row = row;
        node.getComponent("Figure").col = col + 1;
        var afterRightJson = {
            row: row,
            col: col + 1,
            color: node.getComponent("Figure").type.toString()
        };
        if (!this.jsonMsgToServer.changeMapList1.isContain(afterRightJson)) {
            this.jsonMsgToServer.changeMapList1.push(afterRightJson);
        }
    },
    /**
        检测是否可以向下移动
        返回true或者false
        @return true  : 可以下落
        @return false : 不可以下落
    **/
    /**
     * @param  {待检测的节点数组} nodeArr
     */
    CheckIsDown: function CheckIsDown(nodeArr) {
        if (nodeArr.length != 0) {
            //将坐标值转换为小数点两位小数
            this.remainTwoNumber(nodeArr);
            //如果#0块的属性angle为零的时候，只判断#1块下面是否为1，为1不下落，为地面不下落
            if (nodeArr[0].getComponent("Figure").angle === 0) {
                return this.checkIsBottom(nodeArr[1], 0);
            } else if (nodeArr[0].getComponent("Figure").angle === 1 || nodeArr[0].getComponent("Figure").angle === 3) {
                //横条的形状的时候会出现有一个下落的情况
                if (this.checkDown(nodeArr) && !(this.checkDown(nodeArr) instanceof cc.Node)) {
                    return true;
                } else if (!this.checkDown(nodeArr) && !(this.checkDown(nodeArr) instanceof cc.Node)) {
                    return false;
                } else if (this.checkDown(nodeArr) instanceof cc.Node) {
                    var targetNode = this.checkDown(nodeArr);
                    //找出这个下面背景方格状态为0的节点
                    var targetRow = this.findTheNodeDown(targetNode);
                    var col = this.getColumn(targetNode);
                    //单独下落这个节点
                    targetNode.getComponent("Figure").quickDown(targetRow, col, this.backGroundArr, this.map, true);
                    return false;
                }
            } else if (nodeArr[0].getComponent("Figure").angle === 2) {
                return this.checkIsBottom(nodeArr[0], 2);
            }
        }
    },

    /**
     * @param  {需要向下搜索背景方格的状态的初始节点} node
     */
    findTheNodeDown: function findTheNodeDown(node) {
        //获得当前节点的行和列
        var row = this.getRow(node);
        var col = this.getColumn(node);
        //向下寻找
        while (row < 11) {
            row++;
            if (this.map[row][col] === 1) {
                break;
            }
            if (row === 11) {
                break;
            }
        }
        //最底下的背景方格的状态不为1
        if (row === 11 && this.map[row][col] != 1) {
            return 11;
        } else {
            return row - 1;
        }
    },
    //判断横条的情况
    checkDown: function checkDown(nodeArr) {
        this.remainTwoNumber(nodeArr);
        var count1 = 0;
        var count0 = 0;
        var nodeDownIsZero = [];
        //如果是第11行就放回false
        if (this.getRow(nodeArr[0]) === 11) {
            return false;
        }
        for (var m = 0; m < nodeArr.length; m++) {
            var row = this.getRow(nodeArr[m]);
            var col = this.getColumn(nodeArr[m]);
            if (this.map[row + 1][col] === 1) {
                count1++;
            } else if (this.map[row + 1][col] === 0) {
                count0++;
                nodeDownIsZero.push(nodeArr[m]);
            }
        }
        if (count1 === 2) {
            //如果两个块的下面都为1的话不可以下落
            return false;
        } else if (count0 === 2) {
            //如果两个块的下面都为0的话是可以下落的
            return true;
        } else {
            if (nodeDownIsZero.length > 0 && nodeDownIsZero.length === 1) {
                return nodeDownIsZero[0];
            }
        }
    },
    // },
    //判断是否触底或者是下面还有方块
    /**
     * @param  {待检测的节点} node
     */
    checkIsBottom: function checkIsBottom(node, angle) {
        // if(angle === 0 || angle === 2){
        var row = this.getRow(node);
        var col = this.getColumn(node);
        if (row != 11) {
            //下一行背景方格的状态是否为1
            if (this.map[row + 1][col] === 1) {
                //将对应的背景方格的状态改为1
                return false;
            } else {
                return true;
            }
        } else {
            return false;
        }
    },
    /**
       检测是否可以向左移动
    **/
    CheckIsLeft: function CheckIsLeft() {
        //如果两个形状还没有完全落下来不能左移右移
        if (this.nodeArr[0].y > this.nodeHeight / 2) {
            return false;
        }
        this.remainTwoNumber(this.nodeArr);
        var colArr = [this.nodeArr[0].getComponent("Figure").col, this.nodeArr[1].getComponent("Figure").col];
        var rowArr = [];
        for (var i = 0; i < this.nodeArr.length; i++) {
            rowArr.push(this.getRow(this.nodeArr[i]));
        }
        //找到最小列
        var col = Math.min.apply(null, colArr);
        if (colArr.length > 0) {
            //同一列
            if (colArr[0] === colArr[colArr.length - 1]) {
                if (col === 0) {
                    return false;
                }
                //说明是同一列
                //找出x坐标最小的左边看看它的坐标地图状态值是多少
                if (this.map[rowArr[0]][col - 1] === 0 && this.map[rowArr[1]][col - 1] === 0) {
                    return true;
                } else {
                    return false;
                }
            } else {
                //同一行
                if (this.map[rowArr[0]][col - 1] === 0) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    },
    //检测是否可以向右移动
    CheckIsRight: function CheckIsRight() {
        //如果两个形状还没有完全落下来不能左移右移
        if (this.nodeArr[0].y > this.nodeHeight / 2) {
            return false;
        }
        var rowArr = [];
        var colArr = [this.nodeArr[0].getComponent("Figure").col, this.nodeArr[1].getComponent("Figure").col];
        this.remainTwoNumber(this.nodeArr);
        for (var i = 0; i < this.nodeArr.length; i++) {
            rowArr.push(this.getRow(this.nodeArr[i]));
        }
        //找到最大列
        var col = Math.max.apply(null, colArr);
        if (colArr.length > 0) {
            //同一列
            if (colArr[0] === colArr[colArr.length - 1]) {
                if (col === 5) {
                    return false;
                }
                //说明是同一列
                //找出x坐标最小的左边看看它的坐标地图状态值是多少
                if (this.map[rowArr[0]][col + 1] === 0 && this.map[rowArr[1]][col + 1] === 0) {
                    return true;
                } else {
                    return false;
                }
            } else {
                //同一行
                if (this.map[rowArr[0]][col + 1] === 0) {
                    //如果最大行右边的背景方格的状态是0的话就可以移动
                    return true;
                } else {
                    return false;
                }
            }
        }
    },
    //暂停游戏
    // pause : function(){
    //     console.log("游戏结束了吗草",this.gameOver);
    //     if(!this.gameOver){
    //         //暂停游戏
    //         console.log("点击了网络版的暂停");
    //         this.mask.active = true;
    //         this.pauseMenu.active = true;
    //     }
    // },
    //网络版游戏的惩罚机制
    /**
     * @param  {Array | 惩罚地图二维数组} punishArr
     */
    wasPunishedByRival: function wasPunishedByRival(punishArr) {
        this.isPunish = true;
        console.log("punishArr is " + punishArr.toString());
        if (punishArr instanceof Array) {
            console.log("punishArr's length is" + punishArr.length);
            //分别对需要涨的数据进行处理
            for (var i = 0; i < punishArr.length; i++) {
                //该数组中的json数据长度
                var jsonNumber = punishArr[i].length;
                if (punishArr[i][0] instanceof Object) {
                    //确定哪一列需要涨
                    var punishCol = punishArr[i][0].col;
                    //确定需要涨的类型
                    var punishType = punishArr[i][0].color;
                    //生成惩罚块并将惩罚块下落状态修改并发送到服务器
                    this.generatePunishBlock(punishCol, Number(punishType), jsonNumber);
                } else {
                    console.log("punishArr is not an Object of js ");
                }
            }
        }
    },
    //生成惩罚小方块
    /**
     * @param  {生成惩罚所在的列} col
     * @param  {生成惩罚那些块的类型} type
     * @param  {生成惩罚的个数} count
     */
    generatePunishBlock: function generatePunishBlock(col, type, count) {
        var generatePunishJson = {
            col: col,
            generateCount: count,
            punishType: type
            //生成惩罚方块
        };var punishBlockArr = this.initImage(this.node, generatePunishJson);
        //遍历惩罚方块数组分别下落惩罚方块
        for (var i = 0; i < punishBlockArr.length; i++) {
            //让生成的方块显示
            punishBlockArr[i].active = true;
            //下落惩罚方块是网络版的状况它会自己发送数据到服务器
            punishBlockArr[i].getComponent("Figure").afterRemoveDown(this.map, this.backGroundArr, true);
        }
    },
    //为俄罗斯方块或者噗哟噗哟计算分数
    /**
     * @param  {消行数} removeRows
     * @param  {显示分数的节点} node
     */
    showScoreForGame1: function showScoreForGame1(removeRows, node) {
        switch (removeRows) {
            case 1:
                node.getComponent(cc.Label).string = (parseInt(node.getComponent(cc.Label).string) + 40).toString();
                break;
            case 2:
                node.getComponent(cc.Label).string = (parseInt(node.getComponent(cc.Label).string) + 90).toString();
                break;
            case 3:
                node.getComponent(cc.Label).string = (parseInt(node.getComponent(cc.Label).string) + 150).toString();
                break;
            case 4:
                node.getComponent(cc.Label).string = (parseInt(node.getComponent(cc.Label).string) + 220).toString();
                break;
        }
    },
    //游戏结束在来一局
    overAgain: function overAgain() {
        if (cc.sys.isNative) {
            cc.director.resume();
        }
        console.log("游戏结束点击了再来一局");
        this.mask.active = false;
        // this.pauseMenu.active = false;
        cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg({ "tag1": 1, "type": "4", "score": "", "nMapRow": "", "nMapCol": "" });
        //匹配用户界面
        console.log("游戏进入匹配界面");
        //场景切换的时候资源释放了会将vs界面给回收那么
        // var runScene = cc.director.getScene();
        // var uid = runScene.uuid;
        // var assetsArr = cc.loader.getDependsRecursively(uid);
        // console.log("资源数组是：",assetsArr);
        // //释放资源数组
        // cc.loader.release(assetsArr);
        cc.director.loadScene("MatchUser");
        // cc.director.pause();
    },
    //游戏结束暂时退出
    overQuit: function overQuit() {
        if (cc.sys.isNative) {
            cc.director.resume();
        }
        console.log("暂时退出尼玛就那么难擦");
        //加载多人选择模式
        cc.director.loadScene("PersonsChoose");
        //资源释放了的话vs多人选择界面有可能会被回收那么加载vs图片的时候就会报GL错误
        // cc.director.pause();
    },
    //游戏结束分享功能
    overShare: function overShare() {
        if (CC_WECHATGAME) {
            console.log("首页share");
            cc.find("PebmanentNode").getComponent("UserInfo").shareFriends();
        } else if (cc.sys.isNative) {
            cc.director.resume();
            //原生平台分享
            cc.find("PebmanentNode").getComponent("UserInfo").nativeShare();
        }
    },
    //播放音乐方法
    playAudio: function playAudio(audioUrl) {
        cc.audioEngine.play(audioUrl, false, 1);
    }
});

cc._RF.pop();