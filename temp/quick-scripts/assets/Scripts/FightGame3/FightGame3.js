(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/FightGame3/FightGame3.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd19dcO63WpNpLMpsY7eI29m', 'FightGame3', __filename);
// Scripts/FightGame3/FightGame3.js

"use strict";

var Game3 = require("../game3/game");
cc.Class({
    extends: cc.Component,

    properties: {
        //预制体数组
        prefabArr: {
            default: [],
            type: [cc.Prefab]
        },
        girdSize: 20,
        backPrefab: {
            default: null,
            type: cc.Prefab
        },
        scoreLabel: {
            default: null,
            type: cc.Node
        },
        //下一个形状显示区域节点
        nextShape: {
            default: null,
            type: cc.Node
        },
        //联网版的时候是对手信息
        rivalInfoNode: {
            default: null,
            type: cc.Node
        },
        //下落按钮
        downButton: {
            default: null,
            type: cc.Node
        },
        // //单机版的时候是下下个方格状态
        // next2 : {
        //     default : null,
        //     type    : cc.Node,
        // },
        //gameover标签
        // gameBye : {
        //     default : null,
        //     type    : cc.Node,
        // },
        //滑动按钮
        slideButton: {
            default: null,
            type: cc.Node
        },
        rotateButton: {
            default: null,
            type: cc.Node
        },
        //遮罩
        mask: {
            default: null,
            type: cc.Node
        },
        //结束菜单
        pauseMenu: {
            default: null,
            type: cc.Node
        },
        //游戏结束菜单
        overMenu: {
            default: null,
            type: cc.Node
        },
        overAnimation: {
            default: null,
            type: cc.Node
        },
        //左移右移节点
        // leftAndRight : {
        //     default : null,
        //     type    : cc.Node,
        // },
        gameSlide: cc.Node,
        nickName: cc.Node,
        rivalName: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        this.normalSpeed = 0.7, this.quickSpeed = 0.07, this.up = 15;
        this.lr = 13;
        cc.log("当前游戏是否是处于暂停状态" + cc.director.isPaused());
        if (cc.director.isPaused()) {
            cc.director.resume();
        }
        this.overAnimation.active = false;
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
        //消除之后待下落数组的集合
        this.nodeWidth = this.node.width;
        this.nodeHeight = this.node.height;
        cc.log("this.nodeWidth is " + this.nodeWidth + "this.nodeHeight is " + this.nodeHeight);
        //定义消除次数
        this.eliminateCount = 0;
        //定义得分
        this.score = 0;
        //背景二位数组
        this.backGroundArr = null;
        //形状集合二维数组,将每次生成的形状添加到二维数组里面
        // this.shapeArr = [];
        this.time = 0;
        //创建背景网格
        this.initMap(this.up, this.lr, this.backPrefab, 12, 6);
        //存放每次生成的预制体数组即是活动的条
        this.nodeArr = this.createShape(this.node);
        // //生成下一个形状
        this.createNext();
        cc.log("this.nodeArr is " + this.nodeArr);
        // this.columnLocation();
        //创建下一个旋转体
        this.gameOver = false;
        // this.nextShape = new Shape(this.nextShape,0,0);
        // this.gameBye.active = false;
        //当前条是否还可以改变状态
        this.canChangeStatu = true;
        //状态机的状态
        this.iState = 0;
        //定义一个状态标志
        /**
         * cover = 0 封面
         * paly = 2; 游戏
         * remove = 3;消除
         * over = 4;结束游戏
         * Menu 菜单
         */
        this.xltime = this.normalSpeed;
        this.cishu = 0;
        Array.prototype.contain = function (shape) {
            if (shape != undefined) {
                for (var i = 0; i < this.length; i++) {
                    if (this[i].x === shape.x && this[i].y === shape.y && this[i].getComponent("Stone").type === shape.getComponent("Stone").type) {
                        return true;
                    }
                }
            }
            return false;
        };
        //下落按钮监听
        this.downButton.on("touchstart", function () {
            this.downButton.children[0].opacity = 120;
            this.xltime = this.quickSpeed;
        }.bind(this));
        this.downButton.on("touchend", function () {
            this.downButton.children[0].opacity = 0;
            this.xltime = this.normalSpeed;
        }.bind(this));
        //注册监听事件
        this.registerKeyBoard();
        // var rotateAction = cc.rotateBy(3,360).easing(cc.easeCubicActionOut());
        // var rf = cc.repeatForever(rotateAction);
        // this.rotateButton.runAction(rf);
        //游戏开始不显示遮罩
        this.mask.active = false;
        //开始时候暂停菜单不显示
        this.pauseMenu.active = false;
        //消除的次数
        this.removeTime = 0;

        //游戏结束菜单不显示
        this.overMenu.active = false;
        //游戏结束计时
        this.overCost = 0;
        //滑动按钮时间间隔，到达那个事件间隔计算第二次触摸所对应的列数
        this.index = 0;
        if (cc.sys.isNative) {
            this.nickName.getComponent(cc.Label).string = cc.find("PebmanentNode").getComponent("UserInfo").nameUser;
            //发送数据到服务器
            cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg({ "tag1": 10, "type": "", "score": cc.find("PebmanentNode").getComponent("UserInfo").nUserScore, "nMapRow": "", "nMapCol": "", "loading1": 1 });
        }
        //触屏的当前列
        this.nCol = 0;
        this.rightDirection = false;
        this.leftDirection = false;
        this.slideStart = 0;
        //对手是否触底
        this.rivalTouchBarry = false;
        //调用消除方法的次数
        this.invokeRemoveTime = 0;
        //是不是向服务器发送向左移动的信息
        this.sendLeft = false;
        //是不是向服务器发送向右移动的信息
        this.sendRight = false;
        //是不是向服务器发送向下移动的信息
        this.sendDown = false;
        //是不是向服务器发送旋转的信息
        this.sendRotate = false;
    },

    registerKeyBoard: function registerKeyBoard() {
        Game3.prototype.registerKeyBoard.call(this);
    },
    onKeyDown: function onKeyDown() {
        Game3.prototype.onKeyDown.call(this);
    },
    onKeyUp: function onKeyUp() {
        Game3.prototype.onKeyUp.call(this);
    },
    //获得触点坐标位置
    getTouchLine: function getTouchLine(buttonNode, worldPosition) {
        return Game3.prototype.getTouchLine.call(this, buttonNode, worldPosition);
    },
    //获得节点数组中最大的列
    getNodeArrMaxCol: function getNodeArrMaxCol() {
        return Game3.prototype.getNodeArrMaxCol.call(this);
    },
    //获得节点数组中最小的列
    getNodeArrMinCol: function getNodeArrMinCol() {
        return Game3.prototype.getNodeArrMinCol.call(this);
    },
    //this.up,this.lr,this.backPrefab,12,6
    initMap: function initMap(up, lr, backPrefab, row, col) {
        Game3.prototype.initMap.call(this, up, lr, backPrefab, row, col);
    },
    //生成预制体
    createShape: function createShape(node) {
        return Game3.prototype.createShape.call(this, node);
    },
    createNext: function createNext() {
        this.nextBlock = this.createShape(this.node);
        //显示下一个形状
        this.showNextShape(this.nextBlock, this.nextShape);
    },
    showNextShape: function showNextShape(nextBlock, nextNode) {
        var trimSizeJson = {
            width: 100,
            height: 100
        };
        Game3.prototype.showNextShape.call(this, nextBlock, nextNode, trimSizeJson);
    },
    generateNext: function generateNext(parentNode) {
        return this.createShape(parentNode);
    },
    /**
    @param prefab:将要生成预制节点的预制体
    @param x     :将要生成预制节点的x坐标
    @param y     :将要生成预制节点的y坐标
    @param parentNode : 生成的预制节点的父节点
    @param trimSizeJson : 对预制体进行裁减的时候的json对象
    */
    setPrefabPosition: function setPrefabPosition(prefab, x, y, parentNode, trimSizeJson) {
        return Game3.prototype.setPrefabPosition.call(this, prefab, x, y, parentNode, trimSizeJson);
    },
    createPrefab: function createPrefab(prefab) {
        var prefabNode = cc.instantiate(prefab);
        return prefabNode;
    },
    createRandom: function createRandom(min, max) {
        return Game3.prototype.createRandom.call(this, min, max);
    },
    start: function start() {},
    update: function update(dt) {
        if (this.onSlide || this.onGameSlide) {
            this.index += dt;
            // cc.log("this.slidePosition is " + this.slidePosition.x);
            // if(this.index === dt){
            //     this.column1 = this.getTouchLine(this.slidePosition);
            // }
            // if(this.index >= 0.3){
            //     this.column2 = this.getTouchLine(this.slidePosition);
            //     this.index = 0;
            // }
            if (this.onSlide) {
                var column = this.getTouchLine(this.slideButton, this.slidePosition);
                //当用的是滑屏的时候将空节点的滑动状态改为false
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
        //如果游戏结束了就不在进行下落
        if (!this.gameOver) {
            this.time += dt;
            if (this.cishu === 0 && this.xltime < this.normalSpeed) {
                //如果重新生成一个形状的话就将下落的速度改为this.normalSpeed
                this.xltime = this.normalSpeed;
            }
            if (this.time > this.xltime) {
                if (this.cishu < 3) {
                    if (this.cishu === 0) {
                        if (this.map[0][this.nodeArr[2].getComponent("Stone").col] != 1) {
                            this.nodeArr[2].active = true;
                            var sendJsonData = {
                                row: 0,
                                col: this.nodeArr[2].getComponent("Stone").col,
                                color: this.nodeArr[2].getComponent("Stone").type.toString()
                            };
                            console.log("this.jsonMsgToServer is " + this.jsonMsgToServer);
                            this.jsonMsgToServer.changeMapList1.push(sendJsonData);
                            console.log("sendJsonData is ", sendJsonData);
                            //发送数据到服务器
                            if (cc.sys.os === cc.sys.OS_ANDROID) {
                                cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg(this.jsonMsgToServer);
                            }
                            this.jsonMsgToServer.changeMapList1 = [];
                        } else this.gameOver = true;
                    } else if (this.cishu === 1) {
                        if (this.map[1][this.nodeArr[1].getComponent("Stone").col] != 1) {
                            this.nodeArr[2].y = this.backGroundArr[1][this.nodeArr[1].getComponent("Stone").col].y;
                            this.nodeArr[2].getComponent("Stone").row = 1;
                            this.nodeArr[1].active = true;
                            this.nodeArr[1].y = this.backGroundArr[0][this.nodeArr[0].getComponent("Stone").col].y;
                            this.nodeArr[1].getComponent("Stone").row = 0;

                            var sendJsonData1 = {
                                row: 1,
                                col: this.nodeArr[2].getComponent("Stone").col,
                                color: this.nodeArr[2].getComponent("Stone").type.toString()
                            };
                            var sendJsonData0 = {
                                row: 0,
                                col: this.nodeArr[1].getComponent("Stone").col,
                                color: this.nodeArr[1].getComponent("Stone").type.toString()
                            };
                            this.jsonMsgToServer.changeMapList1.push(sendJsonData1);
                            this.jsonMsgToServer.changeMapList1.push(sendJsonData0);
                            console.log(sendJsonData1);
                            console.log(sendJsonData0);
                            if (cc.sys.os === cc.sys.OS_ANDROID) {
                                cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg(this.jsonMsgToServer);
                            }
                            this.jsonMsgToServer.changeMapList1 = [];
                        } else {
                            this.gameOver = true;
                        }
                    } else if (this.cishu === 2) {
                        if (this.map[2][this.nodeArr[1].getComponent("Stone").col] != 1) {
                            this.nodeArr[2].y = this.backGroundArr[2][this.nodeArr[1].getComponent("Stone").col].y;
                            this.nodeArr[2].getComponent("Stone").row = 2;

                            this.nodeArr[1].y = this.backGroundArr[1][this.nodeArr[0].getComponent("Stone").col].y;
                            this.nodeArr[1].getComponent("Stone").row = 1;

                            this.nodeArr[0].active = true;
                            this.nodeArr[0].getComponent("Stone").row = 0;
                            var sendJsonData2 = {
                                row: 2,
                                col: this.nodeArr[2].getComponent("Stone").col,
                                color: this.nodeArr[2].getComponent("Stone").type.toString()
                            };
                            var _sendJsonData = {
                                row: 1,
                                col: this.nodeArr[1].getComponent("Stone").col,
                                color: this.nodeArr[1].getComponent("Stone").type.toString()
                            };
                            var _sendJsonData2 = {
                                row: 0,
                                col: this.nodeArr[0].getComponent("Stone").col,
                                color: this.nodeArr[0].getComponent("Stone").type.toString()
                            };
                            this.jsonMsgToServer.changeMapList1.push(sendJsonData2);
                            this.jsonMsgToServer.changeMapList1.push(_sendJsonData);
                            this.jsonMsgToServer.changeMapList1.push(_sendJsonData2);
                            console.log(sendJsonData2);
                            console.log(_sendJsonData);
                            console.log(_sendJsonData2);
                            if (cc.sys.os === cc.sys.OS_ANDROID) {
                                cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg(this.jsonMsgToServer);
                            }
                            this.jsonMsgToServer.changeMapList1 = [];
                        } else {
                            this.gameOver = true;
                        }
                    }
                    this.cishu++;
                } else {
                    // this.cishu = 0;
                    this.updatePrefatY(this.nodeArr, true);
                }
                this.time = 0;
            }
            //左移动的时候将数据发送到服务器
            if (this.sendDown) {
                if (cc.sys.os === cc.sys.OS_ANDROID) {
                    cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg(this.jsonMsgToServer);
                    console.log("=================下落发送数据到服务器完毕==================");
                    //发送完该数据后将该数组置空
                    this.jsonMsgToServer.changeMapList1 = [];
                    //发送完毕关闭该开关
                    this.sendDown = false;
                }
            }
            //发送向左移动的数据
            if (this.sendLeft) {
                if (cc.sys.os === cc.sys.OS_ANDROID) {
                    console.log("================发送数据开始================");
                    cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg(this.jsonMsgToServer);
                    console.log("================发送数据结束================");
                    this.jsonMsgToServer.changeMapList1 = [];
                    this.sendLeft = false;
                }
            }
            //发送向右移动的数据
            if (this.sendRight) {
                if (cc.sys.os === cc.sys.OS_ANDROID) {
                    cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg(this.jsonMsgToServer);
                    console.log("================发送数据结束================");
                    this.jsonMsgToServer.changeMapList1 = [];
                    this.sendRight = false;
                }
            }
            //发送旋转的相关数据
            if (this.sendRotate) {
                if (cc.sys.os === cc.sys.OS_ANDROID) {
                    console.log("=============发送数据到服务器==============");
                    this.sendDataToServer(this.jsonMsgToServer);
                    this.jsonMsgToServer.changeMapList1 = [];
                    this.sendRotate = false;
                }
            }
        } else {
            this.overMenu.active = true;
            //显示分数
            this.overMenu.getChildByName("scoreValue").getComponent(cc.Label).string = this.score;
            this.overCost += dt;
            // //暂停游戏
            // cc.director.pause();
            if (this.overCost >= 4) {
                //恢复游戏主逻辑
                cc.director.resume();
                cc.director.loadScene("OneChoose");
                this.overCost = 0;
            }
        }
    },

    //网络版的加测下落
    updatePrefatY: function updatePrefatY(nodeArr, isNetWork) {
        Game3.prototype.updatePrefatY.call(this, nodeArr, isNetWork);
    },
    //检查节点是否可以消除
    checkNodeArr: function checkNodeArr(nodeArr, isNetWork) {
        return Game3.prototype.checkNodeArr.call(this, nodeArr, isNetWork);
    },
    //检查一个节点数组是否可以进行消除
    canRemove: function canRemove(nodeArr, waitQueue) {
        return Game3.prototype.canRemove.call(this, nodeArr, waitQueue);
    },
    //添加待消节点到待消节点到待消队列里面
    addWillDeleteArr: function addWillDeleteArr(node, willDeleteArr) {
        Game3.prototype.addWillDeleteArr.call(this, node, willDeleteArr);
    },
    //四个方向寻找看看是否和自己的类型相同
    directorFind: function directorFind(typeArr, row, col, i, type, node) {
        Game3.prototype.directorFind.call(this, typeArr, row, col, i, type, node);
    },
    //看看周围的加点是否和自己的类型相同
    isCommonType: function isCommonType(leftRow, leftCol, type) {
        return Game3.prototype.isCommonType.call(this, leftRow, leftCol, type);
    },
    //消除方法
    remove: function remove(waitQueue, removeTime, isNetWork) {
        return Game3.prototype.remove.call(this, waitQueue, removeTime, isNetWork);
    },
    //从节点树种删除待消节点
    deleteNodeFromParent: function deleteNodeFromParent(waitQueue, waitDownArr) {
        Game3.prototype.deleteNodeFromParent.call(this, waitQueue, waitDownArr);
    },
    //向上查找待消节点上的所有节点
    upFindNodes: function upFindNodes(row, col) {
        return Game3.prototype.upFindNodes.call(this, row, col);
    },
    addScore: function addScore(waitQueueLength) {
        Game3.prototype.addScore.call(this, waitQueueLength);
    },
    //检查是否可以下落
    CheckIsDown: function CheckIsDown(nodeArr) {
        return Game3.prototype.CheckIsDown.call(this, nodeArr);
    },
    //=================下落,左移右移代码部分开始==================
    down: function down(nodeArr, isNetWork) {
        //可以向服务器发送下降信息
        this.sendDown = true;
        Game3.prototype.down.call(this, nodeArr, isNetWork);
    },
    //左移方法
    moveLeft: function moveLeft() {
        Game3.prototype.moveLeft.call(this, true);
    },
    //检查是否能够向左移动
    CheckIsLeft: function CheckIsLeft() {
        return Game3.prototype.CheckIsLeft.call(this);
    },
    //左移方法
    leftMove: function leftMove(node, isNetWork) {
        this.sendLeft = true;
        Game3.prototype.leftMove.call(this, node, isNetWork);
    },
    //右移方法
    moveRight: function moveRight() {
        Game3.prototype.moveRight.call(this);
    },
    //检查是否可以向右移动
    CheckIsRight: function CheckIsRight() {
        return Game3.prototype.CheckIsRight.call(this);
    },
    //右移操作
    rightMove: function rightMove(node, isNetWork) {
        this.sendRight = true;
        Game3.prototype.rightMove.call(this, node, isNetWork);
    },
    //旋转操作
    rotate: function rotate() {
        this.sendRotate = true;
        Game3.prototype.rotate.call(this, true);
    },
    //====================下落，左移右移,旋转代码部分结束=========================
    //更新地图信息
    updateMap: function updateMap(nodeArr) {
        Game3.prototype.updateMap.call(this, nodeArr);
    },
    onDestroy: function onDestroy() {
        Game3.prototype.onDestroy.call(this);
    },

    //暂停游戏方法
    pause: function pause() {
        Game3.prototype.pause.call(this);
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
        //# sourceMappingURL=FightGame3.js.map
        