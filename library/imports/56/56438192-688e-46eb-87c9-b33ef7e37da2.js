"use strict";
cc._RF.push(module, '56438GSaI5G64fJsz73432i', 'Game1Main');
// Scripts/Game1/Game1Main.js

"use strict";

/*
 * @Author: mikey.zhaopeng 
 * @Date: 2018-06-25 21:11:34 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-08-17 17:43:39
 */
// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
// window.Global = {
//     //声明全局Game1Main
//      game1Main:null,
//      //小方块的宽度
//      nWidth:70,
// };

cc.Class({
    extends: cc.Component,

    properties: {
        //获取canvas节点
        nodeCanvas: {
            default: null,
            type: cc.Node
        },
        //获取地板预制体元素
        groundPrefab: {
            default: null,
            type: cc.Prefab
        },
        //获取方块父节点
        boxParent: {
            default: null,
            type: cc.Node
        },
        //获取地板父节点
        groundParent: {
            default: null,
            type: cc.Node
        },

        //获取L形状方块预制体
        prefabL: {
            default: null,
            type: cc.Prefab
        },
        //获取正方形方块预制体
        prefabSquare: {
            default: null,
            type: cc.Prefab
        },
        //获取Z形状方块预制体
        prefabZ: {
            default: null,
            type: cc.Prefab
        }, //获取长条形状方块预制体
        prefabLong: {
            default: null,
            type: cc.Prefab
        },
        //获取T形状方块预制体
        prefabT: {
            default: null,
            type: cc.Prefab
        },
        //获取俄罗斯方块父节点
        blockParent: {
            default: null,
            type: cc.Node
        },
        //获取旋转按钮节点
        nodeRotateButton: {
            default: null,
            type: cc.Node
        },

        //获取下落按钮节点
        nodeDownButton: {
            default: null,
            type: cc.Node
        },
        //获取移动按钮节点
        nodeMove1: {
            default: null,
            type: cc.Node
        },
        //获取第二个俄罗斯方块位置节点
        next1Node: {
            default: null,
            type: cc.Node

        },
        //获取第三个俄罗斯方块位置节点
        next2Node: {
            default: null,
            type: cc.Node
        },
        //获取结束游戏背景节点
        overBackGround: {
            default: null,
            type: cc.Node
        },
        //获取分数节点
        nodeScore1: {
            default: null,
            type: cc.Node
        },
        //
        stopNode: {
            default: null,
            type: cc.Node
        },
        clickAudio: {
            url: cc.AudioClip,
            default: null
        },
        loseAudio: {
            url: cc.AudioClip,
            default: null
        },
        removeAudio: {
            url: cc.AudioClip,
            default: null
        },
        darkNotice: cc.Node,
        handNode: cc.Node,
        //网格上也可以滑动
        slideNode: cc.Node

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
    },
    // LIFE-CYCLE CALLBACKS:
    //根据消行层数显示自分数
    ShowScore: function ShowScore(nDissppearRow1, nodeScore) {
        switch (nDissppearRow1) {
            case 1:
                this.score = parseInt(nodeScore.getComponent(cc.Label).string) + 40;
                nodeScore.getComponent(cc.Label).string = (parseInt(nodeScore.getComponent(cc.Label).string) + 40).toString();
                break;
            case 2:
                this.score = parseInt(nodeScore.getComponent(cc.Label).string) + 90;
                nodeScore.getComponent(cc.Label).string = (parseInt(nodeScore.getComponent(cc.Label).string) + 90).toString();
                break;
            case 3:
                this.score = parseInt(nodeScore.getComponent(cc.Label).string) + 150;
                nodeScore.getComponent(cc.Label).string = (parseInt(nodeScore.getComponent(cc.Label).string) + 150).toString();
                break;
            case 4:
                this.score = parseInt(nodeScore.getComponent(cc.Label).string) + 220;
                nodeScore.getComponent(cc.Label).string = (parseInt(nodeScore.getComponent(cc.Label).string) + 220).toString();
                break;
        }
    },
    onLoad: function onLoad() {
        //定义自己的分数为0
        this.score = 0;
        this.nLine = 0;
        this.invalidRemoveTime = 0;
        this.gameSlide = true;
        cc.director.resume();
        var self = this;
        this.isOutSlide = true;
        //判断是否显示分数
        this.isShowScore = false;
        this.positionTouchX = 0;
        this.handNode.getComponent(cc.Animation).play();
        //初始化结束计时
        this.nTime = 0;
        this.handNode.on("touchstart", function () {
            this.darkNotice.active = false;
            this.handNode.active = false;
        }.bind(this));
        this.darkNotice.on("touchstart", function () {
            this.darkNotice.active = false;
            this.handNode.active = false;
        }.bind(this));
        //当手指落在滑动节点上时
        this.nodeMove1.on(cc.Node.EventType.TOUCH_START, function (event) {
            console.log("点击了滑动节点");
            // self.isOutSlide = false;
            // self.positionTouchX = event.getLocationX();
        }, this);
        //当手指在滑动节点上移动时
        this.nodeMove1.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            console.log("滑动了滑动节点");
            self.isOutSlide = false;
            self.positionTouchX = event.getLocation();
        }, this);
        //当手指离开滑动节点时
        this.nodeMove1.on(cc.Node.EventType.TOUCH_END, function (event) {
            self.isOutSlide = false;
            self.positionTouchX = event.getLocation();
        }, this);
        this.nodeMove1.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            self.isOutSlide = true;
            self.positionTouchX = event.getLocation();
        }, this);
        //滑动节点上方的空节点用来在网格上方滑动
        this.slideNode.on("touchstart", function (event) {
            cc.log("点击了gameSlide节点");
        }.bind(this));
        this.slideNode.on("touchmove", function (event) {
            console.log("touchmove is touched");
            self.gameSlide = false;
            self.slidePosition = event.getLocation();
        }.bind(this));
        this.slideNode.on("touchend", function (event) {
            self.gameSlide = false;
            self.slidePosition = event.getLocation();
        }.bind(this));
        this.slideNode.on("touchcancel", function (event) {
            self.gameSlide = true;
            self.slidePosition = event.getLocation();
        }.bind(this));
        if (cc.sys.isNative) {

            //判断手指是否离开滑动节点

            // this.gameSlide = true;
            //判断手指是否离开下落节点
            this.isOutDown = true;
            //显示用户信息
            cc.find("PebmanentNode").getComponent("UserInfo").LoadUser(cc.find("PebmanentNode").getComponent("UserInfo").pictureUser, cc.find("PebmanentNode").getComponent("UserInfo").nameUser, cc.find("UserName"), cc.find("UserPicture"));
            //  //旋转触屏
            //  this.nodeRotateButton.on(cc.Node.EventType.TOUCH_START, function (event) {
            //      self.rotateBlock();
            //   }, this);
            //下落触屏 
            //当手指落在下落节点上时
            this.nodeDownButton.on(cc.Node.EventType.TOUCH_START, function (event) {
                console.log("111111111111111111111111111111111111111111111111");
                self.isOutDown = false;
            }, this);
            //当手指离开下落节点上时
            this.nodeDownButton.on(cc.Node.EventType.TOUCH_END, function (event) {
                self.isOutDown = true;
            }, this);
            //左右滑动触屏
            // //当手指落在滑动节点上时
            // this.nodeMove.on(cc.Node.EventType.TOUCH_START, function (event) {
            //     console.log("点击了滑动节点");
            //     // self.isOutSlide = false;
            //     self.positionTouchX = event.getLocationX();
            // }, this);
            // //当手指在滑动节点上移动时
            // this.nodeMove.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            //     console.log("滑动了滑动节点");
            //     // self.isOutSlide = false;
            //     self.positionTouchX = event.getLocationX();
            // }, this);
            // //当手指离开滑动节点时
            // this.nodeMove.on(cc.Node.EventType.TOUCH_END, function (event) {
            //     self.isOutSlide = true;
            // }, this);
            // this.nodeMove.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            //     self.isOutSlide = true;
            // }, this);
            //判断是否点击旋转按钮
            this.isPressRotate = false;
            //当手指落在下落节点上时
            this.nodeRotateButton.on(cc.Node.EventType.TOUCH_START, function (event) {
                self.isPressRotate = false;
            }, this);
            //当手指离开下落节点上时
            this.nodeRotateButton.on(cc.Node.EventType.TOUCH_END, function (event) {
                self.isPressRotate = true;
            }, this);
        } else {
            if (CC_WECHATGAME) {
                //显示用户信息
                cc.find("PebmanentNode").getComponent("UserInfo").LoadUser(cc.find("PebmanentNode").getComponent("UserInfo").pictureUser, cc.find("PebmanentNode").getComponent("UserInfo").nameUser, cc.find("UserName"), cc.find("UserPicture"));
            }
            //获取出点的世界坐标
            this.positionTouchX = 0;
            var self = this;
            //判断手指是否离开滑动节点
            this.isOutSlide = true;
            //判断手指是否落在滑动节点
            this.isOutDown = true;
            // //当手指落在滑动节点上时
            // this.nodeMove.on(cc.Node.EventType.TOUCH_START, function (event) {

            //     self.isOutSlide = false;
            //     self.positionTouchX = event.getLocationX();
            // }, this);
            // //当手指在滑动节点上移动时
            // this.nodeMove.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            //   ;
            //     self.isOutSlide = false;
            //     self.positionTouchX = event.getLocationX();
            // }, this);
            // //当手指离开滑动节点时
            // this.nodeMove.on(cc.Node.EventType.TOUCH_END, function (event) {

            //     self.isOutSlide = true;
            // }, this);
            // this.nodeMove.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
            //     self.isOutSlide = true;
            // }, this);
            //当手指落在下落节点上时
            this.nodeDownButton.on(cc.Node.EventType.TOUCH_START, function (event) {
                this.playAudio(this.clickAudio);
                self.isOutDown = false;
            }, this);
            //当手指离开下落节点上时
            this.nodeDownButton.on(cc.Node.EventType.TOUCH_END, function (event) {
                self.isOutDown = true;
            }, this);
            //判断是否点击旋转按钮
            this.isPressRotate = false;
            //当手指落在下落节点上时
            this.nodeRotateButton.on(cc.Node.EventType.TOUCH_START, function (event) {
                self.isPressRotate = false;
            }, this);
            //当手指离开下落节点上时
            this.nodeRotateButton.on(cc.Node.EventType.TOUCH_END, function (event) {
                self.isPressRotate = true;
            }, this);
        }
        if (CC_WECHATGAME) {
            cc.find("PebmanentNode").getComponent("UserInfo").LoadUser(cc.find("PebmanentNode").getComponent("UserInfo").pictureUser, cc.find("PebmanentNode").getComponent("UserInfo").nameUser, cc.find("UserName"), cc.find("UserPicture"));
        }
        //初始化敌人消行总数
        this.disappearAll = 0;
        //判断是否第一次生成俄罗斯方块
        this.isFirst = false;
        // //显示用户信息
        // cc.find("PebmanentNode").getComponent("UserInfo").LoadUser(cc.find("PebmanentNode").getComponent("UserInfo").pictureUser,cc.find("PebmanentNode").getComponent("UserInfo").nameUser,cc.find("Canvas/UserName"),cc.find("UserPicture"),cc.find("UserPicture1"));
        Global.game1Main = this;
        //初始化背景子节点
        this.groundChild = [];
        for (var i = 0; i <= 9; i++) {
            this.groundChild[i] = [];
        }
        //  this.nRotateAngle1=0;
        //  this.nRotateAngle2=0;
        //初始化当前俄罗斯方块颜色
        this.stringColor = "";
        //初始化当前俄罗斯方块形状
        this.stringShape = "";
        //初始化当前俄罗斯方块角度
        this.stringRotate = "";
        // cc.log(this.nodeCanvas.getComponent("Game1Main").stringShape);
        //初始化旋转角度
        //  this.nRotateAngle=0; 
        this.nCreat = 0;
        //生成游戏背景
        this.GetGround();
        //随机生成俄罗斯方块
        this.GetBlock();
        this.boxParent1 = this.boxParent.getChildren();
        //声明数组，当俄罗斯方块固定后将俄罗斯方块的子块存入该数组   
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    },

    //显示用户信息
    /**
     */
    ShowUser: function ShowUser() {},
    start: function start() {},

    onKeyDown: function onKeyDown(event) {
        var self = this;
        switch (event.keyCode) {
            case cc.KEY.a:
                self.MoveLeft();
                break;
            case cc.KEY.d:
                self.MoveRight();
                break;
            case cc.KEY.s:
                self.DownQuick();
                break;
            case cc.KEY.l:
                self.RotateBlock();
                break;
        }
    },
    //俄罗斯方块向左移动
    /**
     * @param  {} nLine
     * @param  {} nLine1
     */
    MoveLeft: function MoveLeft(nLine, nLine1) {
        if (nLine == nLine1) {
            return;
        }
        //存取俄罗斯方块的行数
        var nArrayRow = [];
        //存取俄罗斯方块的列数
        var nArrayList = [];
        //获取节点子节点数组
        var blockChild = this.nodeBlock.getChildren();
        //将俄罗斯方块的行列存入数组中
        for (var i = 0; i <= 3; i++) {
            //获取此时组成俄罗斯方块元素的行列
            var nX = (blockChild[i].getPositionX() + this.nodeBlock.getPositionX() - cc.find("GroundParent").getPositionX()) / Global.nWidth + 1;
            var nY = (blockChild[i].getPositionY() + this.nodeBlock.getPositionY() - cc.find("GroundParent").getPositionY()) / Global.nWidth + 1;
            nArrayList.push(nX);
            nArrayRow.push(nY);
        } //从小到大排序行数
        function compare(value1, value2) {
            if (value1 < value2) {
                return -1;
            } else if (value1 > value2) {
                return 1;
            } else {
                return 0;
            }
        }
        // nArrayRow.sort(compare);
        // console.log("nArrayRow is ",nArrayRow);
        for (var j = 0; j <= 3; j++) {
            if (j <= 2) {
                for (var k = j + 1; k <= 3; k++) {
                    if (nArrayRow[k] < nArrayRow[j]) {
                        var nOldY = nArrayRow[j];
                        nArrayRow[j] = nArrayRow[k];
                        nArrayRow[k] = nOldY;
                        var nOldX = nArrayList[j];
                        nArrayList[j] = nArrayList[k];
                        nArrayList[k] = nOldX;
                    }
                }
            }
        }
        // cc.log(nArrayRow+"？？？？？？？？？？？？？？？？？？？？？");
        if (nArrayRow[0] <= 19 || nArrayRow[0] == 20 && this.nodeBlock.getComponent("OperateBlock").stringBoloekShape == "Long") {
            // cc.log(nArrayRow[0]+"////////////////////////////////////////////////////////");
            //从小到大排序列数
            for (var j = 0; j <= 3; j++) {
                if (j <= 2) {
                    for (var k = j + 1; k <= 3; k++) {
                        if (nArrayList[k] < nArrayList[j]) {
                            var nOldY = nArrayRow[j];
                            nArrayRow[j] = nArrayRow[k];
                            nArrayRow[k] = nOldY;
                            var nOldX = nArrayList[j];
                            nArrayList[j] = nArrayList[k];
                            nArrayList[k] = nOldX;
                        }
                    }
                }
            }
            if (nArrayList[0] == 1) {
                return;
            } else {
                //判断方块的前一列是否有方块
                var isHas = false;
                for (var i = 0; i <= 3; i++) {
                    // //将俄罗斯方块所在方格置为false
                    // this.groundChild[nArrayList[i] - 1][nArrayRow[i] - 1].getComponent("PrefabState").isBox = false;
                    //判断方块的前一列的方块属性是否为true
                    if (this.groundChild[nArrayList[i] - 2][nArrayRow[i] - 1].getComponent("PrefabState").isBox) {
                        isHas = true;
                    }
                    if (i == 3) {
                        if (isHas) {
                            // for (var j = 0; j <= 3; j++) {
                            //     //将俄罗斯方块所在方格置为false
                            //     this.groundChild[nArrayList[j] - 1][nArrayRow[j] - 1].getComponent("PrefabState").isBox = true;
                            // }
                            return;
                        } else {
                            for (var k = 0; k <= 3; k++) {
                                // //将前一列的方块所在方格置为true
                                // this.groundChild[nArrayList[k] - 2][nArrayRow[k] - 1].getComponent("PrefabState").isBox = true;
                                if (k == 3) {
                                    //俄罗斯方块向左移动
                                    this.nodeBlock.x -= Global.nWidth;
                                    if (this.nodeBlock.getComponent("OperateBlock").isCollision) {
                                        // //初始化 1s计时器
                                        // this.nodeBlock.getComponent("OperateBlock").fDownTime = 0;
                                        // this.nodeBlock.getComponent("OperateBlock").fCollisionTime = 0;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else {
            return;
        }
    },
    //俄罗斯方块向右移动
    MoveRight: function MoveRight(nLine, nLine1) {
        if (nLine == nLine1) {
            return;
        }
        //存取俄罗斯方块的行数
        var nArrayRow = [];
        //存取俄罗斯方块的列数
        var nArrayList = [];
        //获取节点子节点数组
        var blockChild = this.nodeBlock.getChildren();
        //将俄罗斯方块的行列存入数组中
        for (var i = 0; i <= 3; i++) {
            //获取此时组成俄罗斯方块元素的行列
            var nX = (blockChild[i].getPositionX() + this.nodeBlock.getPositionX() - cc.find("GroundParent").getPositionX()) / Global.nWidth + 1;
            var nY = (blockChild[i].getPositionY() + this.nodeBlock.getPositionY() - cc.find("GroundParent").getPositionY()) / Global.nWidth + 1;
            //    cc.log(nX);
            //    cc.log(nY);
            nArrayList.push(nX);
            nArrayRow.push(nY);
        }
        //从小到大排序行数
        for (var j = 0; j <= 3; j++) {
            if (j <= 2) {
                for (var k = j + 1; k <= 3; k++) {
                    if (nArrayRow[k] < nArrayRow[j]) {
                        var nOldY = nArrayRow[j];
                        nArrayRow[j] = nArrayRow[k];
                        nArrayRow[k] = nOldY;
                        var nOldX = nArrayList[j];
                        nArrayList[j] = nArrayList[k];
                        nArrayList[k] = nOldX;
                    }
                }
            }
        }
        if (nArrayRow[0] <= 19 || nArrayRow[0] == 20 && this.nodeBlock.getComponent("OperateBlock").stringBoloekShape == "Long") {
            //从小到大排序列数
            for (var j = 0; j <= 3; j++) {
                if (j <= 2) {
                    for (var k = j + 1; k <= 3; k++) {
                        if (nArrayList[k] < nArrayList[j]) {
                            var nOldY = nArrayRow[j];
                            nArrayRow[j] = nArrayRow[k];
                            nArrayRow[k] = nOldY;
                            var nOldX = nArrayList[j];
                            nArrayList[j] = nArrayList[k];
                            nArrayList[k] = nOldX;
                        }
                    }
                }
            }
            if (nArrayList[3] == 10) {
                return;
            } else {
                //判断方块的下一列是否有方块
                var isHas = false;
                for (var i = 3; i >= 0; i--) {
                    // //将俄罗斯方块所在方格置为false
                    // this.groundChild[nArrayList[i] - 1][nArrayRow[i] - 1].getComponent("PrefabState").isBox = false;
                    //判断方块的下一列的方块属性是否为true
                    if (this.groundChild[nArrayList[i]][nArrayRow[i] - 1].getComponent("PrefabState").isBox) {
                        isHas = true;
                    }
                    if (i == 0) {
                        if (isHas) {
                            for (var j = 0; j <= 3; j++) {
                                // //将俄罗斯方块所在方格置为true
                                // this.groundChild[nArrayList[j] - 1][nArrayRow[j] - 1].getComponent("PrefabState").isBox = true;
                            }
                            return;
                        } else {
                            for (var k = 0; k <= 3; k++) {
                                // //将下一列的方块所在方格置为true
                                // this.groundChild[nArrayList[k]][nArrayRow[k] - 1].getComponent("PrefabState").isBox = true;
                                if (k == 3) {
                                    //俄罗斯方块向右移动
                                    this.nodeBlock.x += Global.nWidth;
                                    if (this.nodeBlock.getComponent("OperateBlock").isCollision) {}
                                    // //初始化 1s计时器
                                    // this.nodeBlock.getComponent("OperateBlock").fDownTime = 0;
                                    // this.nodeBlock.getComponent("OperateBlock").fCollisionTime = 0;

                                    //   //初始化 1s计时器
                                    //   this.nodeBlock.getComponent("OperateBlock").fCollisionTime=0;
                                }
                            }
                        }
                    }
                }
            }
        } else {
            return;
        }
    },
    //生成背景
    GetGround: function GetGround() {
        for (var i = 0; i <= 9; i++) {
            for (var j = 0; j <= 19; j++) {
                var groundNode = cc.instantiate(this.groundPrefab);
                groundNode.parent = this.groundParent;
                groundNode.setPosition(cc.p(i * Global.nWidth, j * Global.nWidth));
                this.groundChild[i].push(groundNode);
            }
        }
    },
    //便遍历俄罗斯方块火苏组，并使它们生成时为隐藏
    TarvelFalse: function TarvelFalse() {
        var blockChild = this.nodeBlock.getChildren();
        for (var i = 0; i <= blockChild.length - 1; i++) {
            blockChild[i].active = false;
        }
    },
    //当俄罗斯方块落下后初始化信息
    OnLoadBlock: function OnLoadBlock(stringShape, nBlock, stringRotate, stringColor3) {
        cc.log(stringShape);
        cc.log(stringRotate);
        cc.log(nBlock);
        switch (stringShape) {
            //  this.shapeBlock=["T","L","Long","Z","Square"];
            case "Long":
                switch (nBlock) {
                    case 0:
                        this.nodeBlock.destroy();
                        //生成俄罗斯方块
                        this.nodeBlock = cc.instantiate(this.prefabLong);
                        this.TarvelFalse();
                        //获取此时方块的形状
                        this.nodeBlock.parent = this.blockParent;
                        //随机方块位置
                        this.nodeBlock.setPosition(this.setBlockPosition("Long", stringRotate));
                        cc.log(this.nodeBlock.getPosition());
                        this.nodeBlock.getComponent("OperateBlock").stringColor = stringColor3;
                        this.nodeBlock.getComponent("OperateBlock").stringBoloekShape = stringShape;
                        // this.nodeBlock.getComponent("OperateBlock").isStartDown = true;
                        this.nodeBlock.getComponent("OperateBlock").nRotateAngle = parseInt(stringRotate);
                        break;
                    case 1:
                        this.nodeBlock1.destroy();
                        this.nodeBlock1 = cc.instantiate(this.prefabLong);
                        //获取此时方块的形状
                        this.nodeBlock1.parent = this.blockParent;
                        //随机方块位置
                        this.nodeBlock1.setPosition(this.setBlock1Position("Long", this.next1Node, stringRotate));
                        this.nodeBlock1.getComponent("OperateBlock").stringColor = stringColor3;
                        this.nodeBlock1.getComponent("OperateBlock").stringBoloekShape = stringShape;
                        this.nodeBlock1.getComponent("OperateBlock").nRotateAngle = parseInt(stringRotate);
                        break;
                    case 2:
                        this.nodeBlock2.destroy();
                        this.nodeBlock2 = cc.instantiate(this.prefabLong);
                        //获取此时方块的形状
                        this.nodeBlock2.parent = this.blockParent;
                        //随机方块位置
                        this.nodeBlock2.setPosition(this.setBlock1Position("Long", this.next2Node, stringRotate));
                        this.nodeBlock2.getComponent("OperateBlock").stringColor = stringColor3;
                        this.nodeBlock2.getComponent("OperateBlock").stringBoloekShape = stringShape;
                        this.nodeBlock2.getComponent("OperateBlock").nRotateAngle = parseInt(stringRotate);
                        break;
                }
                break;
            case "Z":
                switch (nBlock) {
                    case 0:
                        this.nodeBlock.destroy();
                        //生成俄罗斯方块
                        this.nodeBlock = cc.instantiate(this.prefabZ);
                        this.TarvelFalse();
                        //获取此时方块的形状
                        this.nodeBlock.parent = this.blockParent;
                        //随机方块位置
                        this.nodeBlock.setPosition(this.setBlockPosition("Z", stringRotate));
                        cc.log(this.nodeBlock.getPosition());
                        this.nodeBlock.getComponent("OperateBlock").stringColor = stringColor3;
                        this.nodeBlock.getComponent("OperateBlock").stringBoloekShape = stringShape;
                        // this.nodeBlock.getComponent("OperateBlock").isStartDown = true;
                        this.nodeBlock.getComponent("OperateBlock").nRotateAngle = parseInt(stringRotate);
                        break;
                    case 1:
                        this.nodeBlock1.destroy();
                        this.nodeBlock1 = cc.instantiate(this.prefabZ);
                        //获取此时方块的形状
                        this.nodeBlock1.parent = this.blockParent;
                        this.nodeBlock1.getComponent("OperateBlock").stringColor = stringColor3;
                        //随机方块位置
                        this.nodeBlock1.setPosition(this.setBlock1Position("Z", this.next1Node, stringRotate));
                        this.nodeBlock1.getComponent("OperateBlock").stringBoloekShape = stringShape;
                        this.nodeBlock1.getComponent("OperateBlock").nRotateAngle = parseInt(stringRotate);
                        break;
                    case 2:
                        this.nodeBlock2.destroy();
                        this.nodeBlock2 = cc.instantiate(this.prefabZ);
                        //获取此时方块的形状
                        this.nodeBlock2.parent = this.blockParent;
                        //随机方块位置
                        this.nodeBlock2.setPosition(this.setBlock1Position("Z", this.next2Node, stringRotate));
                        this.nodeBlock2.getComponent("OperateBlock").stringColor = stringColor3;
                        this.nodeBlock2.getComponent("OperateBlock").stringBoloekShape = stringShape;
                        this.nodeBlock2.getComponent("OperateBlock").nRotateAngle = parseInt(stringRotate);
                        break;
                }
                break;
            case "Square":
                switch (nBlock) {
                    case 0:
                        this.nodeBlock.destroy();
                        //生成俄罗斯方块
                        this.nodeBlock = cc.instantiate(this.prefabSquare);
                        this.TarvelFalse();
                        //获取此时方块的形状
                        this.nodeBlock.parent = this.blockParent;
                        this.nodeBlock.getComponent("OperateBlock").stringColor = stringColor3;
                        //随机方块位置
                        this.nodeBlock.setPosition(this.setBlockPosition("Square", stringRotate));
                        cc.log(this.nodeBlock.getPosition());
                        this.nodeBlock.getComponent("OperateBlock").stringBoloekShape = stringShape;
                        // this.nodeBlock.getComponent("OperateBlock").isStartDown = true;
                        this.nodeBlock.getComponent("OperateBlock").nRotateAngle = 0;
                        break;
                    case 1:
                        this.nodeBlock1.destroy();
                        this.nodeBlock1 = cc.instantiate(this.prefabSquare);
                        //获取此时方块的形状
                        this.nodeBlock1.parent = this.blockParent;
                        this.nodeBlock1.getComponent("OperateBlock").stringColor = stringColor3;
                        this.nodeBlock1.setPosition(this.setBlock1Position("Square", this.next1Node, stringRotate));
                        this.nodeBlock1.getComponent("OperateBlock").stringBoloekShape = stringShape;
                        this.nodeBlock1.getComponent("OperateBlock").nRotateAngle = 0;
                    case 2:
                        this.nodeBlock2.destroy();
                        this.nodeBlock2 = cc.instantiate(this.prefabSquare);
                        //获取此时方块的形状
                        this.nodeBlock2.parent = this.blockParent;
                        //随机方块位置
                        this.nodeBlock2.setPosition(this.setBlock1Position("Square", this.next2Node, stringRotate));
                        this.nodeBlock2.getComponent("OperateBlock").stringColor = stringColor3;
                        this.nodeBlock2.getComponent("OperateBlock").stringBoloekShape = stringShape;
                        this.nodeBlock2.getComponent("OperateBlock").nRotateAngle = 0;
                        break;
                }
                break;
            case "T":
                switch (nBlock) {
                    case 0:
                        this.nodeBlock.destroy();
                        //生成俄罗斯方块
                        this.nodeBlock = cc.instantiate(this.prefabT);
                        this.TarvelFalse();
                        //获取此时方块的形状
                        this.nodeBlock.parent = this.blockParent;
                        this.nodeBlock.getComponent("OperateBlock").stringColor = stringColor3;
                        //随机方块位置
                        this.nodeBlock.setPosition(this.setBlockPosition("T", stringRotate));
                        cc.log(this.nodeBlock.getPosition());
                        this.nodeBlock.getComponent("OperateBlock").stringBoloekShape = stringShape;
                        // this.nodeBlock.getComponent("OperateBlock").isStartDown = true;
                        this.nodeBlock.getComponent("OperateBlock").nRotateAngle = parseInt(stringRotate);
                        break;
                    case 1:
                        this.nodeBlock1.destroy();
                        this.nodeBlock1 = cc.instantiate(this.prefabT);
                        //获取此时方块的形状
                        this.nodeBlock1.parent = this.blockParent;
                        this.nodeBlock1.getComponent("OperateBlock").stringColor = stringColor3;
                        this.nodeBlock1.setPosition(this.setBlock1Position("T", this.next1Node, stringRotate));
                        this.nodeBlock1.getComponent("OperateBlock").stringBoloekShape = stringShape;
                        this.nodeBlock1.getComponent("OperateBlock").nRotateAngle = parseInt(stringRotate);
                        break;
                    case 2:
                        this.nodeBlock2.destroy();
                        this.nodeBlock2 = cc.instantiate(this.prefabT);
                        //获取此时方块的形状
                        this.nodeBlock2.parent = this.blockParent;
                        //随机方块位置
                        this.nodeBlock2.setPosition(this.setBlock1Position("T", this.next2Node, stringRotate));
                        this.nodeBlock2.getComponent("OperateBlock").stringColor = stringColor3;
                        this.nodeBlock2.getComponent("OperateBlock").stringBoloekShape = stringShape;
                        this.nodeBlock2.getComponent("OperateBlock").nRotateAngle = parseInt(stringRotate);
                        break;
                }
                break;
            case "L":
                switch (nBlock) {
                    case 0:
                        this.nodeBlock.destroy();
                        //生成俄罗斯方块
                        this.nodeBlock = cc.instantiate(this.prefabL);
                        this.TarvelFalse();
                        //获取此时方块的形状
                        this.nodeBlock.parent = this.blockParent;
                        this.nodeBlock.getComponent("OperateBlock").stringColor = stringColor3;
                        //随机方块位置
                        this.nodeBlock.setPosition(this.setBlockPosition("L", stringRotate));
                        cc.log(this.nodeBlock.getPosition());
                        this.nodeBlock.getComponent("OperateBlock").stringBoloekShape = stringShape;
                        // this.nodeBlock.getComponent("OperateBlock").isStartDown = true;
                        this.nodeBlock.getComponent("OperateBlock").nRotateAngle = parseInt(stringRotate);
                        break;
                    case 1:
                        this.nodeBlock1.destroy();
                        this.nodeBlock1 = cc.instantiate(this.prefabL);
                        //获取此时方块的形状
                        this.nodeBlock1.parent = this.blockParent;
                        this.nodeBlock1.getComponent("OperateBlock").stringColor = stringColor3;
                        this.nodeBlock1.setPosition(this.setBlock1Position("L", this.next1Node, stringRotate));
                        this.nodeBlock1.getComponent("OperateBlock").stringBoloekShape = stringShape;
                        this.nodeBlock1.getComponent("OperateBlock").nRotateAngle = parseInt(stringRotate);
                        break;
                    case 2:
                        this.nodeBlock2.destroy();
                        this.nodeBlock2 = cc.instantiate(this.prefabL);
                        //获取此时方块的形状
                        this.nodeBlock2.parent = this.blockParent;
                        //随机方块位置
                        this.nodeBlock2.setPosition(this.setBlock1Position("L", this.next2Node, stringRotate));
                        this.nodeBlock2.getComponent("OperateBlock").stringColor = stringColor3;
                        this.nodeBlock2.getComponent("OperateBlock").stringBoloekShape = stringShape;
                        this.nodeBlock2.getComponent("OperateBlock").nRotateAngle = parseInt(stringRotate);
                        break;
                }
                break;
        }
    },
    //生成方块
    CopyBlock: function CopyBlock(prefabLBlock, stringShape1) {
        if (this.isFirst == false) {
            switch (this.nCreat) {
                case 0:
                    //生成俄罗斯方块
                    this.nodeBlock = cc.instantiate(prefabLBlock);
                    //获取此时方块的形状
                    this.nodeBlock.parent = this.blockParent;
                    this.TarvelFalse();
                    //随机方块位置
                    this.nodeBlock.setPosition(this.setBlockPosition(this.shapeBlock[this.nShape], this.rotateBlock[this.nRotate]));
                    this.nodeBlock.getComponent("OperateBlock").stringBoloekShape = stringShape1;
                    //  this.nodeBlock.getComponent("OperateBlock").stringColor=this.nc;
                    //  this.nodeBlock.getComponent("OperateBlock").isStartDown=true;
                    break;
                case 1:
                    //生成俄罗斯方块
                    this.nodeBlock1 = cc.instantiate(prefabLBlock);
                    // stringShape1 = "L";
                    //获取此时方块的形状
                    this.nodeBlock1.parent = this.blockParent;
                    this.nodeBlock1.setPosition(this.setBlock1Position(this.shapeBlock[this.nShape], this.next1Node, this.rotateBlock[this.nRotate]));
                    this.nodeBlock1.getComponent("OperateBlock").stringBoloekShape = stringShape1;
                    break;
                case 2:
                    this.nodeBlock2 = cc.instantiate(prefabLBlock);
                    //获取此时方块的形状
                    this.nodeBlock2.parent = this.blockParent;
                    this.nodeBlock2.setPosition(this.setBlock1Position(this.shapeBlock[this.nShape], this.next2Node, this.rotateBlock[this.nRotate]));
                    this.nodeBlock2.getComponent("OperateBlock").stringBoloekShape = stringShape1;
            }
        } else {
            cc.log(this.nodeBlock.getComponent("OperateBlock").nRotateAngle + "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
            this.OnLoadBlock(this.nodeBlock1.getComponent("OperateBlock").stringBoloekShape, 0, this.nodeBlock1.getComponent("OperateBlock").nRotateAngle.toString(), this.nodeBlock1.getComponent("OperateBlock").stringColor);
            cc.log(this.nodeBlock.getComponent("OperateBlock").nRotateAngle + "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb");
            this.OnLoadBlock(this.nodeBlock2.getComponent("OperateBlock").stringBoloekShape, 1, this.nodeBlock2.getComponent("OperateBlock").nRotateAngle.toString(), this.nodeBlock2.getComponent("OperateBlock").stringColor);
            var randomColor = "";
            switch (this.shapeBlock[this.nShape]) {
                case "Long":
                    randomColor = "blue";
                    break;
                case "Square":
                    randomColor = "green";
                    break;
                case "Z":
                    randomColor = "red";
                    break;
                case "T":
                    randomColor = "yellow";
                    break;
                case "L":
                    randomColor = "purple";
                    break;
            }
            this.OnLoadBlock(stringShape1, 2, this.rotateBlock[this.nRotate], randomColor);
        }
    },
    //根据第二个俄罗斯方块的类型设置位置
    setBlock1Position: function setBlock1Position(stringShape1, nodePosition3, stringRotate) {
        switch (stringShape1) {
            case "Square":
                //获取方块的世界坐标
                var v2WorldY = nodePosition3.getPositionY();
                var v1WorldX = nodePosition3.getPositionX() + Global.nWidth / 2;
                return cc.p(v1WorldX, v2WorldY);
                break;
            case "T":
                switch (stringRotate) {
                    case "0":
                        //获取方块的世界坐标
                        var v2WorldY = nodePosition3.getPositionY();
                        var v1WorldX = nodePosition3.getPositionX() + Global.nWidth / 2;
                        return cc.p(v1WorldX, v2WorldY);
                        break;
                    case "180":
                        //获取方块的世界坐标
                        var v2WorldY = nodePosition3.getPositionY();
                        var v1WorldX = nodePosition3.getPositionX() + Global.nWidth / 2;
                        return cc.p(v1WorldX, v2WorldY);
                        break;
                }
                break;
            case "L":
                switch (stringRotate) {
                    case "0":
                        //获取方块的世界坐标
                        var v2WorldY = nodePosition3.getPositionY();
                        var v1WorldX = nodePosition3.getPositionX();
                        return cc.p(v1WorldX, v2WorldY);
                        break;
                    case "180":
                        //获取方块的世界坐标    
                        var v2WorldY = nodePosition3.getPositionY();
                        var v1WorldX = nodePosition3.getPositionX() + Global.nWidth;
                        return cc.p(v1WorldX, v2WorldY);
                        break;
                }
                break;
            case "Long":
                switch (stringRotate) {
                    case "0":
                        //获取方块的世界坐标
                        var v2WorldY = nodePosition3.getPositionY();
                        var v1WorldX = nodePosition3.getPositionX();
                        cc.log("000000000000000000000000000000000000");
                        return cc.p(v1WorldX, v2WorldY);
                        break;
                    case "180":
                        //获取方块的世界坐标    
                        var v2WorldY = nodePosition3.getPositionY();
                        var v1WorldX = nodePosition3.getPositionX() + Global.nWidth;
                        cc.log("180180180180180180180180180180180180180180180180180");
                        return cc.p(v1WorldX, v2WorldY);
                        break;
                }
                //    return cc.p(v1WorldX,v2WorldY);
                break;
            case "Z":
                switch (stringRotate) {
                    case "0":
                        //获取方块的世界坐标
                        var v2WorldY = nodePosition3.getPositionY();
                        var v1WorldX = nodePosition3.getPositionX();
                        return cc.p(v1WorldX, v2WorldY);
                        break;
                    case "180":
                        //获取方块的世界坐标    
                        var v2WorldY = nodePosition3.getPositionY();
                        var v1WorldX = nodePosition3.getPositionX();
                        return cc.p(v1WorldX, v2WorldY);
                        break;
                }
                break;
        }
    },
    //根据俄罗斯方块类型设置位置
    setBlockPosition: function setBlockPosition(stringShape1, stringRotate) {
        switch (stringShape1) {
            case "Square":
                //获取方块的世界坐标
                var v2WorldY = this.groundParent.getPositionY() + 20 * Global.nWidth + Global.nWidth / 2;
                //    var nRandom=Global.nWidth*3+Math.floor(cc.random0To1()*6)*Global.nWidth;
                //    var v1WorldX=(nRandom+nRandom+Global.nWidth)/2;
                var v1WorldX = this.groundParent.getPositionX() + Global.nWidth / 2 + 4 * Global.nWidth;
                cc.log(v1WorldX);
                cc.log(v2WorldY);
                return cc.p(v1WorldX, v2WorldY);
                break;
            case "T":
                switch (stringRotate) {
                    case "0":
                        //获取方块的世界坐标              
                        var v2WorldY = this.groundParent.getPositionY() + 21 * Global.nWidth;
                        var v1WorldX = this.groundParent.getPositionX() + 5 * Global.nWidth;
                        cc.log(v1WorldX);
                        cc.log(v2WorldY);
                        return cc.p(v1WorldX, v2WorldY);
                        break;
                    case "180":
                        //获取方块的世界坐标    
                        var v2WorldY = this.groundParent.getPositionY() + 20 * Global.nWidth;
                        var v1WorldX = this.groundParent.getPositionX() + 5 * Global.nWidth;
                        cc.log(v1WorldX);
                        cc.log(v2WorldY);
                        return cc.p(v1WorldX, v2WorldY);
                        break;
                }
                break;
            case "L":
                switch (stringRotate) {
                    case "0":
                        //获取方块的世界坐标
                        var v2WorldY = this.groundParent.getPositionY() + 20 * Global.nWidth;
                        var v1WorldX = this.groundParent.getPositionX() + 4 * Global.nWidth;
                        cc.log(v1WorldX);
                        cc.log(v2WorldY);
                        return cc.p(v1WorldX, v2WorldY);
                        break;
                    case "180":
                        //获取方块的世界坐标    
                        var v2WorldY = this.groundParent.getPositionY() + 21 * Global.nWidth;
                        var v1WorldX = this.groundParent.getPositionX() + 6 * Global.nWidth;
                        cc.log(v1WorldX);
                        cc.log(v2WorldY);
                        return cc.p(v1WorldX, v2WorldY);
                        break;
                }
                break;
            case "Long":
                switch (stringRotate) {
                    case "0":
                        //获取方块的世界坐标
                        var v2WorldY = this.groundParent.getPositionY() + 20 * Global.nWidth;
                        var v1WorldX = this.groundParent.getPositionX() + 4 * Global.nWidth;
                        cc.log(v1WorldX);
                        cc.log(v2WorldY);
                        return cc.p(v1WorldX, v2WorldY);
                        break;
                    case "180":
                        //获取方块的世界坐标    
                        var v2WorldY = this.groundParent.getPositionY() + 21 * Global.nWidth;
                        var v1WorldX = this.groundParent.getPositionX() + 5 * Global.nWidth;
                        cc.log(v1WorldX);
                        cc.log(v2WorldY);
                        return cc.p(v1WorldX, v2WorldY);
                        break;
                }

                break;
            case "Z":
                switch (stringRotate) {
                    case "0":
                        //获取方块的世界坐标
                        var v2WorldY = this.groundParent.getPositionY() + 21 * Global.nWidth;
                        var v1WorldX = this.groundParent.getPositionX() + 4 * Global.nWidth;
                        cc.log(v1WorldX);
                        cc.log(v2WorldY);
                        return cc.p(v1WorldX, v2WorldY);
                        break;
                    case "180":
                        //获取方块的世界坐标    
                        var v2WorldY = this.groundParent.getPositionY() + 20 * Global.nWidth;
                        var v1WorldX = this.groundParent.getPositionX() + 4 * Global.nWidth;
                        cc.log(v1WorldX);
                        cc.log(v2WorldY);
                        return cc.p(v1WorldX, v2WorldY);
                        break;
                }
                break;
        }
    },
    //俄罗斯方块旋转
    RotateBlock: function RotateBlock() {
        this.isPressRotate = true;
        if (this.nodeBlock.getComponent("OperateBlock").isStationary == false) {
            if (this.nodeBlock.getComponent("OperateBlock").stringBoloekShape == "Square") {
                return;
            } else {
                this.TraverseRotate();
            }
            this.playAudio(this.clickAudio);
        }
        this.isPressRotate = false;
    },
    playAudio: function playAudio(audioSource) {
        cc.audioEngine.play(audioSource, false, 1);
    },
    //判断方块颜色
    IsColor: function IsColor(stringShape3, nShape3) {
        switch (stringShape3[nShape3]) {
            case "Long":
                this.ChangeColor("2");
                break;
            case "Square":
                this.ChangeColor("1");
                break;
            case "Z":
                this.ChangeColor("3");
                break;
            case "T":
                this.ChangeColor("4");
                break;
            case "L":
                this.ChangeColor("5");
                break;
        }
    },
    //初始化每个俄罗斯方块的颜色
    OnloadColor: function OnloadColor(stringColor1, nodeBlock3) {
        switch (stringColor1) {
            case "1":
                nodeBlock3.getComponent("OperateBlock").stringColor = "green";
                cc.log("1111111111111111111111" + nodeBlock3.getComponent("OperateBlock").stringColor);
                break;
            case "2":
                nodeBlock3.getComponent("OperateBlock").stringColor = "blue";
                cc.log("22222222222222222222" + nodeBlock3.getComponent("OperateBlock").stringColor);

                break;
            case "3":
                nodeBlock3.getComponent("OperateBlock").stringColor = "red";
                cc.log("3333333333333333333333" + nodeBlock3.getComponent("OperateBlock").stringColor);
                break;
            case "4":
                nodeBlock3.getComponent("OperateBlock").stringColor = "yellow";
                cc.log("3333333333333333333333" + nodeBlock3.getComponent("OperateBlock").stringColor);
                break;
            case "5":
                nodeBlock3.getComponent("OperateBlock").stringColor = "purple";
                cc.log("3333333333333333333333" + nodeBlock3.getComponent("OperateBlock").stringColor);
                break;
        }
    },
    //改变方块颜色
    ChangeColor: function ChangeColor(stringColor1) {
        if (this.isFirst == false) {
            switch (this.nCreat) {
                case 0:
                    var nodeBlockChild = this.nodeBlock.getChildren();
                    var self = this;
                    cc.loader.loadRes("picture/" + stringColor1, cc.SpriteFrame, function (err, txt) {
                        for (var i = 0; i <= 3; i++) {
                            nodeBlockChild[i].getComponent(cc.Sprite).spriteFrame = txt;
                            if (i == 3) {
                                //打开下落开关
                                self.nodeBlock.getComponent("OperateBlock").fDownTime = Global.nTimeInteval;
                            }
                        }
                    });
                    self.OnloadColor(stringColor1, self.nodeBlock);
                    break;
                case 1:
                    var nodeBlockChild1 = this.nodeBlock1.getChildren();
                    var self = this;
                    cc.loader.loadRes("picture/" + stringColor1, cc.SpriteFrame, function (err, txt) {
                        for (var i = 0; i <= 3; i++) {
                            nodeBlockChild1[i].getComponent(cc.Sprite).spriteFrame = txt;
                        }
                    });
                    self.OnloadColor(stringColor1, self.nodeBlock1);
                    break;
                case 2:
                    var nodeBlockChild2 = this.nodeBlock2.getChildren();
                    var self = this;
                    cc.loader.loadRes("picture/" + stringColor1, cc.SpriteFrame, function (err, txt) {
                        for (var i = 0; i <= 3; i++) {
                            nodeBlockChild2[i].getComponent(cc.Sprite).spriteFrame = txt;
                        }
                    });
                    self.OnloadColor(stringColor1, self.nodeBlock2);
                    break;
            }
        } else {
            var nodeBlockChild = this.nodeBlock.getChildren();
            // var self=this;
            var stringColor0 = "";
            switch (this.nodeBlock.getComponent("OperateBlock").stringColor) {
                case "red":
                    stringColor0 = "3";
                    break;
                case "blue":
                    stringColor0 = "2";
                    break;
                case "green":
                    stringColor0 = "1";
                    break;
                case "yellow":
                    stringColor0 = "4";
                    break;
                case "purple":
                    stringColor0 = "5";
                    break;

            }
            cc.loader.loadRes("picture/" + stringColor0, cc.SpriteFrame, function (err, txt) {
                for (var i = 0; i <= 3; i++) {
                    nodeBlockChild[i].getComponent(cc.Sprite).spriteFrame = txt;
                }
            });
            var nodeBlockChild1 = this.nodeBlock1.getChildren();
            var stringColor2 = "";
            cc.log(this.nodeBlock2.getComponent("OperateBlock").stringColor);
            switch (this.nodeBlock1.getComponent("OperateBlock").stringColor) {
                case "red":
                    stringColor2 = "3";
                    break;
                case "blue":
                    stringColor2 = "2";
                    break;
                case "green":
                    stringColor2 = "1";
                    break;
                case "yellow":
                    stringColor2 = "4";
                    break;
                case "purple":
                    stringColor2 = "5";
                    break;

            }
            cc.log(stringColor2);
            for (var i = 0; i <= nodeBlockChild1.length - 1; i++) {
                nodeBlockChild1[i].active = false;
            }
            cc.loader.loadRes("picture/" + stringColor2, cc.SpriteFrame, function (err, txt) {
                for (var i = 0; i <= 3; i++) {
                    nodeBlockChild1[i].getComponent(cc.Sprite).spriteFrame = txt;
                    if (i == 3) {
                        for (var j = 0; j <= nodeBlockChild1.length - 1; j++) {
                            nodeBlockChild1[j].active = true;
                        }
                    }
                }
            });
            var nodeBlockChild2 = this.nodeBlock2.getChildren();
            for (var i = 0; i <= nodeBlockChild2.length - 1; i++) {
                nodeBlockChild2[i].active = false;
            }
            cc.loader.loadRes("picture/" + stringColor1, cc.SpriteFrame, function (err, txt) {
                for (var i = 0; i <= 3; i++) {
                    nodeBlockChild2[i].getComponent(cc.Sprite).spriteFrame = txt;
                    if (i == 3) {
                        for (var j = 0; j <= nodeBlockChild2.length - 1; j++) {
                            nodeBlockChild2[j].active = true;
                        }
                    }
                }
            });
        }
        // var self = this;
        // var promise=new Promise(function(resolve,reject){
        //     cc.loader.loadRes("picture/"+stringColor1, cc.SpriteFrame, callback);
        // })
        // function callback(err, txt) {
        //     if(err){
        //         resolve();
        //     }
        //     for(var i=0;i<=3;i++)
        //     {
        //         nodeBlockChild[i].getComponent(cc.Sprite).spriteFrame =txt;
        //         if(i==3)
        //         {
        //              //打开下落开关
        //                this.nodeBlock.getComponent("OperateBlock").fDownTime=Global.nTimeInteval;
        //         }
        //     }
        // }
    },
    //判断方块形状
    IsShape: function IsShape(stringShape, nShape) {
        switch (stringShape[nShape]) {
            case "T":
                //生成方块
                this.CopyBlock(this.prefabT, "T");
                //判断方块颜色
                this.IsColor(this.shapeBlock, this.nShape);
                this.IsRotate(this.rotateBlock, this.nRotate, "T");
                //  this.nRotateAngle   
                break;
            case "L":
                this.CopyBlock(this.prefabL, "L");
                //判断方块颜色
                this.IsColor(this.shapeBlock, this.nShape);
                this.IsRotate(this.rotateBlock, this.nRotate, "L");
                break;
            case "Long":
                this.CopyBlock(this.prefabLong, "Long");
                //判断方块颜色
                this.IsColor(this.shapeBlock, this.nShape);

                this.IsRotate(this.rotateBlock, this.nRotate, "Long");
                break;
            case "Z":
                this.CopyBlock(this.prefabZ, "Z");
                //判断方块颜色
                this.IsColor(this.shapeBlock, this.nShape);
                this.IsRotate(this.rotateBlock, this.nRotate, "Z");
                break;
            case "Square":
                this.CopyBlock(this.prefabSquare, "Square");
                //判断方块颜色
                this.IsColor(this.shapeBlock, this.nShape);
                this.IsRotate(this.rotateBlock, this.nRotate, "Square");
                break;
        }
    },
    //出生时根据角度改变子块位置
    ChangeRotate: function ChangeRotate(nAngle) {
        if (this.isFirst == false) {
            switch (this.nCreat) {
                case 0:
                    //获取此方块的数组
                    var nodeBoxArray = this.nodeBlock.getChildren();
                    if (nAngle == 180) {
                        this.nodeBlock.getComponent("OperateBlock").nRotateAngle = 180;
                        for (var i = 0; i <= 3; i++) {
                            nodeBoxArray[i].setPosition(cc.p(nodeBoxArray[i].getPositionY(), -nodeBoxArray[i].getPositionX()));
                            if (i == 3) {
                                for (var j = 0; j <= 3; j++) {
                                    nodeBoxArray[j].setPosition(cc.p(nodeBoxArray[j].getPositionY(), -nodeBoxArray[j].getPositionX()));
                                }
                            }
                        }
                    } else {
                        this.nodeBlock.getComponent("OperateBlock").nRotateAngle = 0;
                    }
                    break;
                case 1:
                    //获取此方块的数组
                    var nodeBoxArray1 = this.nodeBlock1.getChildren();
                    if (nAngle == 180) {
                        cc.log("wwwwwwwwwwwwwwwwwwwwwwwwwwwww" + this.nodeBlock1.getComponent("OperateBlock").stringBoloekShape);
                        this.nodeBlock1.getComponent("OperateBlock").nRotateAngle = 180;
                        for (var i = 0; i <= 3; i++) {
                            cc.log("ddddddddddddddddddddddddddddddddddd" + this.nodeBlock1.getComponent("OperateBlock").stringBoloekShape);
                            nodeBoxArray1[i].setPosition(cc.p(nodeBoxArray1[i].getPositionY(), -nodeBoxArray1[i].getPositionX()));
                            if (i == 3) {
                                for (var j = 0; j <= 3; j++) {
                                    nodeBoxArray1[j].setPosition(cc.p(nodeBoxArray1[j].getPositionY(), -nodeBoxArray1[j].getPositionX()));
                                }
                            }
                        }
                    } else {
                        this.nodeBlock1.getComponent("OperateBlock").nRotateAngle = 0;
                    }
                    break;
                case 2:
                    var nodeBoxArray2 = this.nodeBlock2.getChildren();
                    if (nAngle == 180) {
                        this.nodeBlock2.getComponent("OperateBlock").nRotateAngle = 180;
                        for (var i = 0; i <= 3; i++) {
                            nodeBoxArray2[i].setPosition(cc.p(nodeBoxArray2[i].getPositionY(), -nodeBoxArray2[i].getPositionX()));
                            if (i == 3) {
                                for (var j = 0; j <= 3; j++) {
                                    nodeBoxArray2[j].setPosition(cc.p(nodeBoxArray2[j].getPositionY(), -nodeBoxArray2[j].getPositionX()));
                                }
                            }
                        }
                    } else {
                        this.nodeBlock2.getComponent("OperateBlock").nRotateAngle = 0;
                    }
                    break;
            }
            this.nCreat++;
            if (this.nCreat == 3) {
                this.nodeBlock.getComponent("OperateBlock").isStartDown = true;
                this.isFirst = true;
            }
        } else {
            cc.log("ddddddddddddddddddddddddddddddddddddd");
            cc.log(this.nodeBlock.getComponent("OperateBlock").nRotateAngle + "ccccccccccccccccccccccccccccccccccccc");
            var nodeBoxArray = this.nodeBlock.getChildren();
            if (this.nodeBlock.getComponent("OperateBlock").nRotateAngle == 180) {
                for (var i = 0; i <= 3; i++) {
                    nodeBoxArray[i].setPosition(cc.p(nodeBoxArray[i].getPositionY(), -nodeBoxArray[i].getPositionX()));
                    if (i == 3) {
                        for (var j = 0; j <= 3; j++) {
                            nodeBoxArray[j].setPosition(cc.p(nodeBoxArray[j].getPositionY(), -nodeBoxArray[j].getPositionX()));
                        }
                    }
                }
            }
            var nodeBoxArray1 = this.nodeBlock1.getChildren();
            if (this.nodeBlock1.getComponent("OperateBlock").nRotateAngle == 180) {
                //     cc.log("\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\");
                //    this.nodeBlock1.getComponent("OperateBlock").nRotateAngle=180;
                for (var i = 0; i <= 3; i++) {
                    nodeBoxArray1[i].setPosition(cc.p(nodeBoxArray1[i].getPositionY(), -nodeBoxArray1[i].getPositionX()));
                    if (i == 3) {
                        for (var j = 0; j <= 3; j++) {
                            nodeBoxArray1[j].setPosition(cc.p(nodeBoxArray1[j].getPositionY(), -nodeBoxArray1[j].getPositionX()));
                        }
                    }
                }
            }
            var nodeBoxArray2 = this.nodeBlock2.getChildren();
            if (nAngle == 180) {
                for (var i = 0; i <= 3; i++) {
                    nodeBoxArray2[i].setPosition(cc.p(nodeBoxArray2[i].getPositionY(), -nodeBoxArray2[i].getPositionX()));
                    if (i == 3) {
                        for (var j = 0; j <= 3; j++) {
                            nodeBoxArray2[j].setPosition(cc.p(nodeBoxArray2[j].getPositionY(), -nodeBoxArray2[j].getPositionX()));
                        }
                    }
                }
            }
            this.nodeBlock.getComponent("OperateBlock").isStartDown = true;
        }
    },
    //遍历俄罗斯方块并旋转
    TraverseRotate: function TraverseRotate() {
        //获取此方块的数组
        var nodeBoxArray = this.nodeBlock.getChildren();
        //判断俄罗斯方块旋转之后是否含有方块
        var isHasBox = false;
        //判断俄罗斯方块旋转之后是否超过墙
        var isOutWall = false;
        //判断俄罗斯方块旋转之后是否超过背景的上方或下方、
        var isOutGround = false;
        //存储俄罗斯方块未旋转前的行列
        var nRowY = [];
        var nLineX = [];
        //存入俄罗斯方块旋转后子元素的行和列
        var arrayX = [];
        var arrayY = [];
        //将俄罗斯方块的行数从小到大排列
        for (var j = 0; j <= 3; j++) {
            var nX1 = (nodeBoxArray[j].getPositionX() + this.nodeBlock.getPositionX() - cc.find("GroundParent").getPositionX()) / Global.nWidth + 1;
            var nY1 = (nodeBoxArray[j].getPositionY() + this.nodeBlock.getPositionY() - cc.find("GroundParent").getPositionY()) / Global.nWidth + 1;
            nLineX.push(nX1);
            nRowY.push(nY1);
            if (j == 3) {
                for (var k = 0; k <= 3; k++) {
                    if (k <= 2) {
                        for (var l = k + 1; l <= 3; l++) {
                            if (nRowY[l] < nRowY[k]) {
                                var oldX = nLineX[k];
                                nLineX[k] = nLineX[l];
                                nLineX[l] = oldX;
                                var oldY = nRowY[k];
                                nRowY[k] = nRowY[l];
                                nRowY[l] = oldY;
                            }
                        }
                    }
                }
            }
        }
        if (this.nodeBlock.getComponent("OperateBlock").stringBoloekShape == "Long") {
            if (nRowY[0] == 21) {
                return;
            }
        } else {
            if (nRowY[0] >= 19) {
                return;
            }
        }
        for (var i = 0; i <= 3; i++) {
            //判断旋转的字块是否为原点
            var isZero = false;
            //获取旋转后的坐标 
            var v2RotateX = nodeBoxArray[i].getPositionY();
            var v2RotateY = -nodeBoxArray[i].getPositionX();
            //当旋转后的坐标与旋转前的坐标相同时
            if (v2RotateX == nodeBoxArray[i].getPositionX() && v2RotateY == nodeBoxArray[i].getPositionY()) {
                //将旋转前的方块置为false
                var nX1 = (nodeBoxArray[i].getPositionX() + this.nodeBlock.getPositionX() - cc.find("GroundParent").getPositionX()) / Global.nWidth + 1;
                var nY1 = (nodeBoxArray[i].getPositionY() + this.nodeBlock.getPositionY() - cc.find("GroundParent").getPositionY()) / Global.nWidth + 1;
                if (nY1 - 1 >= 0 && nY1 - 1 <= 19) {
                    nLineX.push(nX1);
                    nRowY.push(nY1);
                    // this.groundChild[nX1 - 1][nY1 - 1].getComponent("PrefabState").isBox = false;
                }
                isZero = true;
            } else {
                //将旋转前的方块置为false
                var nX1 = (nodeBoxArray[i].getPositionX() + this.nodeBlock.getPositionX() - cc.find("GroundParent").getPositionX()) / Global.nWidth + 1;
                var nY1 = (nodeBoxArray[i].getPositionY() + this.nodeBlock.getPositionY() - cc.find("GroundParent").getPositionY()) / Global.nWidth + 1;
                if (nY1 - 1 >= 0 && nY1 - 1 <= 19) {
                    nLineX.push(nX1);
                    nRowY.push(nY1);
                    // this.groundChild[nX1 - 1][nY1 - 1].getComponent("PrefabState").isBox = false;
                }
            }
            // //旋转坐标
            // nodeBoxArray[i].setPosition(cc.p(nodeBoxArray[i].getPositionY(),-nodeBoxArray[i].getPositionX()));
            //获取旋转后组成俄罗斯方块元素的行列
            var nX = (v2RotateX + this.nodeBlock.getPositionX() - cc.find("GroundParent").getPositionX()) / Global.nWidth + 1;
            var nY = (v2RotateY + this.nodeBlock.getPositionY() - cc.find("GroundParent").getPositionY()) / Global.nWidth + 1;
            arrayX.push(nX);
            arrayY.push(nY);
            //当俄罗斯方块旋转后超过场景上方或下方时
            if (nY > 20 || nY < 1) {
                isOutGround = true;
            }
            //当超出墙壁时
            if (nX > 10 || nX < 1) {
                isOutWall = true;
            } else {
                if (isOutGround == false) {
                    if (this.groundChild[nX - 1][nY - 1].getComponent("PrefabState").isBox && isZero == false) {
                        isHasBox = true;
                    }
                }
            }
            if (i == 3) {
                if (isHasBox == false && isOutWall == false && isOutGround == false) {
                    //旋转俄罗斯方块
                    for (var i = 0; i <= 3; i++) {
                        //  var nX=(nodeBoxArray[i].getPositionX()+this.nodeBlock.getPositionX()-cc.find("GroundParent").getPositionX())/65+1;
                        //  var nY=(nodeBoxArray[i].getPositionY()+this.nodeBlock.getPositionY()-cc.find("GroundParent").getPositionY())/65+1; 
                        //  this.groundChild[nX-1][nY-1].getComponent("PrefabState").isBox=false;
                        nodeBoxArray[i].setPosition(cc.p(nodeBoxArray[i].getPositionY(), -nodeBoxArray[i].getPositionX()));
                        var nX1 = (nodeBoxArray[i].getPositionX() + this.nodeBlock.getPositionX() - cc.find("GroundParent").getPositionX()) / Global.nWidth + 1;
                        var nY1 = (nodeBoxArray[i].getPositionY() + this.nodeBlock.getPositionY() - cc.find("GroundParent").getPositionY()) / Global.nWidth + 1;
                        // this.groundChild[nX1 - 1][nY1 - 1].getComponent("PrefabState").isBox = true;
                    }
                    //初始化 1s计时器
                    this.nodeBlock.getComponent("OperateBlock").fCollisionTime = 0;
                    this.nodeBlock.getComponent("OperateBlock").nRotateAngle += 90;
                    if (this.nodeBlock.getComponent("OperateBlock").nRotateAngle == 360) {
                        this.nodeBlock.getComponent("OperateBlock").nRotateAngle = 0;
                    }
                }
                if (isHasBox) {}
                // //将置为false的方块还原属性
                // for (var i = 0; i <= nLineX.length - 1; i++) {
                //     this.groundChild[nLineX[i] - 1][nRowY[i] - 1].getComponent("PrefabState").isBox = true;
                // }

                //当旋转以后超过游戏场景上方或下方
                if (isOutGround) {
                    for (var j = 0; j <= 3; j++) {
                        if (j == 3) {
                            //将旋转后的行数从小到大排列
                            for (var k = 0; k <= 3; k++) {
                                if (k <= 2) {
                                    for (var l = k + 1; l <= 3; l++) {
                                        if (arrayY[l] < arrayY[k]) {
                                            var oldX = arrayX[k];
                                            arrayX[k] = arrayX[l];
                                            arrayX[l] = oldX;

                                            var oldY = arrayY[k];
                                            arrayY[k] = arrayY[l];
                                            arrayY[l] = oldY;
                                        }
                                    }
                                }
                                if (k == 3) {

                                    if (arrayY[3] > 20) {
                                        //向下移动的单位个数
                                        var nMove = arrayY[3] - 20;
                                        //存取移动后的行 ，列
                                        var nMoveX = [];
                                        var nMoveY = [];
                                        //存取移动过后的位置
                                        var arrayMoveX = [];
                                        var arrayMoveY = [];
                                        //判断旋转移动后是否有方块
                                        var isHasBox = false;
                                        for (var l = 0; l <= 3; l++) {
                                            //  //获取旋转前的行列
                                            //  var nX0=(nodeBoxArray[i].getPositionX()+this.nodeBlock.getPositionX()-cc.find("GroundParent").getPositionX())/65+1;
                                            //  var nY0=(nodeBoxArray[i].getPositionY()+this.nodeBlock.getPositionY()-cc.find("GroundParent").getPositionY())/65+1;
                                            //  this.groundChild[nX0-1][nY0-1].getComponent("PrefabState").isBox=false;
                                            //获取旋转后的坐标 
                                            var v2RotateX = nodeBoxArray[l].getPositionY();
                                            var v2RotateY = -nodeBoxArray[l].getPositionX();
                                            // //获取移动后的坐标
                                            var v2RotateY1 = v2RotateY - Global.nWidth * nMove;
                                            //获取移动后俄罗斯方块元素的行列
                                            var nX1 = (v2RotateX + this.nodeBlock.getPositionX() - cc.find("GroundParent").getPositionX()) / Global.nWidth + 1;

                                            var nY1 = (v2RotateY1 + this.nodeBlock.getPositionY() - cc.find("GroundParent").getPositionY()) / Global.nWidth + 1;

                                            if (this.groundChild[nX1 - 1][nY1 - 1].getComponent("PrefabState").isBox) {
                                                isHasBox = true;
                                            }
                                            //获取本地坐标
                                            var positionX = v2RotateX;
                                            var positionY = v2RotateY1;
                                            arrayMoveX.push(positionX);
                                            arrayMoveY.push(positionY);
                                            //  nodeBoxArray[i].setPosition(cc.p(positionX,positionY));
                                            nMoveX.push(nX1);
                                            nMoveY.push(nY1);
                                            if (l == 3) {
                                                if (isHasBox) {

                                                    // //还原未旋转移动前的box的true属性
                                                    // for (var j = 0; j <= 3; j++) {
                                                    //     this.groundChild[nLineX[j] - 1][nRowY[j] - 1].getComponent("PrefabState").isBox = true;
                                                    // }
                                                    return;
                                                } else {
                                                    //初始化 1s计时器
                                                    this.nodeBlock.getComponent("OperateBlock").fCollisionTime = 0;
                                                    this.nodeBlock.getComponent("OperateBlock").nRotateAngle += 90;
                                                    if (this.nodeBlock.getComponent("OperateBlock").nRotateAngle == 360) {
                                                        this.nodeBlock.getComponent("OperateBlock").nRotateAngle = 0;
                                                    }
                                                    for (var i = 0; i <= 3; i++) {
                                                        //获取旋转后的坐标 
                                                        var v2RotateX = nodeBoxArray[i].getPositionY();
                                                        var v2RotateY = -nodeBoxArray[i].getPositionX();
                                                        nodeBoxArray[i].setPosition(cc.p(v2RotateX, v2RotateY));
                                                        if (i == 3) {
                                                            this.nodeBlock.y -= Global.nWidth * nMove;
                                                        }
                                                        // //将旋转移动后的方块置为true
                                                        // this.groundChild[nMoveX[i] - 1][nMoveY[i] - 1].getComponent("PrefabState").isBox = true;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if (arrayY[0] < 1) {
                                        //向上移动的单位个数
                                        var nMove = 1 - arrayY[0];
                                        //存取移动后的行 ，列
                                        var nMoveX = [];
                                        var nMoveY = [];
                                        //存取移动过后的位置
                                        var arrayMoveX = [];
                                        var arrayMoveY = [];
                                        //判断旋转移动后是否有方块
                                        var isHasBox = false;
                                        for (var l = 0; l <= 3; l++) {
                                            //获取旋转后的坐标 
                                            var v2RotateX = nodeBoxArray[l].getPositionY();
                                            var v2RotateY = -nodeBoxArray[l].getPositionX();
                                            //获取移动后的坐标
                                            var v2RotateY1 = v2RotateY + Global.nWidth * nMove;
                                            //获取移动后俄罗斯方块元素的行列
                                            var nX1 = (v2RotateX + this.nodeBlock.getPositionX() - cc.find("GroundParent").getPositionX()) / Global.nWidth + 1;
                                            var nY1 = (v2RotateY1 + this.nodeBlock.getPositionY() - cc.find("GroundParent").getPositionY()) / Global.nWidth + 1;

                                            if (this.groundChild[nX1 - 1][nY1 - 1].getComponent("PrefabState").isBox) {
                                                isHasBox = true;
                                            }
                                            //获取本地坐标
                                            var positionX = v2RotateX;
                                            var positionY = v2RotateY1;
                                            arrayMoveX.push(positionX);
                                            arrayMoveY.push(positionY);
                                            //  nodeBoxArray[i].setPosition(cc.p(positionX,positionY));
                                            nMoveX.push(nX1);
                                            nMoveY.push(nY1);
                                            if (l == 3) {
                                                if (isHasBox) {
                                                    // //还原未旋转移动前的box的true属性
                                                    // for (var j = 0; j <= 3; j++) {
                                                    //     this.groundChild[nLineX[j] - 1][nRowY[j] - 1].getComponent("PrefabState").isBox = true;
                                                    // }
                                                    return;
                                                } else {
                                                    //初始化 1s计时器
                                                    this.nodeBlock.getComponent("OperateBlock").fCollisionTime = 0;
                                                    this.nodeBlock.getComponent("OperateBlock").nRotateAngle += 90;
                                                    if (this.nodeBlock.getComponent("OperateBlock").nRotateAngle == 360) {
                                                        this.nodeBlock.getComponent("OperateBlock").nRotateAngle = 0;
                                                    }
                                                    for (var i = 0; i <= 3; i++) {
                                                        //获取旋转后的坐标 
                                                        var v2RotateX = nodeBoxArray[i].getPositionY();
                                                        var v2RotateY = -nodeBoxArray[i].getPositionX();
                                                        nodeBoxArray[i].setPosition(cc.p(v2RotateX, v2RotateY));
                                                        if (i == 3) {
                                                            this.nodeBlock.y += Global.nWidth * nMove;
                                                        }
                                                        // //将旋转移动后的方块置为true
                                                        // this.groundChild[nMoveX[i] - 1][nMoveY[i] - 1].getComponent("PrefabState").isBox = true;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                //当旋转以后超过墙时
                if (isOutWall) {
                    for (var j = 0; j <= 3; j++) {
                        if (j == 3) {
                            //将旋转后的列数从小到大排列
                            for (var k = 0; k <= 3; k++) {
                                if (k <= 2) {
                                    for (var l = k + 1; l <= 3; l++) {
                                        if (arrayX[l] < arrayX[k]) {
                                            var oldX = arrayX[k];
                                            arrayX[k] = arrayX[l];
                                            arrayX[l] = oldX;
                                            var oldY = arrayY[k];
                                            arrayY[k] = arrayY[l];
                                            arrayY[l] = oldY;
                                        }
                                    }
                                }
                                if (k == 3) {
                                    cc.log(arrayX);
                                    if (arrayX[3] > 10) {
                                        cc.log("777777777777777777777777");
                                        //向左移动的单位个数
                                        var nMove = arrayX[3] - 10;
                                        //存取移动后的行 ，列
                                        var nMoveX = [];
                                        var nMoveY = [];
                                        //存取移动过后的位置
                                        var arrayMoveX = [];
                                        var arrayMoveY = [];
                                        //判断旋转移动后是否有方块
                                        var isHasBox = false;
                                        for (var l = 0; l <= 3; l++) {
                                            //  //获取旋转前的行列
                                            //  var nX0=(nodeBoxArray[i].getPositionX()+this.nodeBlock.getPositionX()-cc.find("GroundParent").getPositionX())/65+1;
                                            //  var nY0=(nodeBoxArray[i].getPositionY()+this.nodeBlock.getPositionY()-cc.find("GroundParent").getPositionY())/65+1;
                                            //  this.groundChild[nX0-1][nY0-1].getComponent("PrefabState").isBox=false;
                                            //获取旋转后的坐标 
                                            var v2RotateX = nodeBoxArray[l].getPositionY();
                                            var v2RotateY = -nodeBoxArray[l].getPositionX();
                                            //获取移动后的坐标
                                            var v2RotateX1 = v2RotateX - Global.nWidth * nMove;
                                            //获取移动后俄罗斯方块元素的行列
                                            var nX1 = (v2RotateX1 + this.nodeBlock.getPositionX() - cc.find("GroundParent").getPositionX()) / Global.nWidth + 1;

                                            var nY1 = (v2RotateY + this.nodeBlock.getPositionY() - cc.find("GroundParent").getPositionY()) / Global.nWidth + 1;
                                            if (this.groundChild[nX1 - 1][nY1 - 1].getComponent("PrefabState").isBox) {
                                                cc.log("666666666666");
                                                isHasBox = true;
                                            }
                                            //获取本地坐标
                                            var positionX = v2RotateX1;
                                            var positionY = v2RotateY;
                                            arrayMoveX.push(positionX);
                                            arrayMoveY.push(positionY);
                                            //  nodeBoxArray[i].setPosition(cc.p(positionX,positionY));
                                            nMoveX.push(nX1);
                                            nMoveY.push(nY1);
                                            if (l == 3) {
                                                if (isHasBox) {
                                                    // //还原未旋转移动前的box的true属性
                                                    // for (var j = 0; j <= 3; j++) {
                                                    //     this.groundChild[nLineX[j] - 1][nRowY[j] - 1].getComponent("PrefabState").isBox = true;
                                                    // }
                                                    return;
                                                } else {
                                                    cc.log("55555555555");
                                                    //初始化 1s计时器
                                                    this.nodeBlock.getComponent("OperateBlock").fCollisionTime = 0;
                                                    this.nodeBlock.getComponent("OperateBlock").nRotateAngle += 90;
                                                    if (this.nodeBlock.getComponent("OperateBlock").nRotateAngle == 360) {
                                                        this.nodeBlock.getComponent("OperateBlock").nRotateAngle = 0;
                                                    }
                                                    for (var i = 0; i <= 3; i++) {
                                                        //获取旋转后的坐标 
                                                        var v2RotateX = nodeBoxArray[i].getPositionY();
                                                        var v2RotateY = -nodeBoxArray[i].getPositionX();
                                                        nodeBoxArray[i].setPosition(cc.p(v2RotateX, v2RotateY));
                                                        if (i == 3) {
                                                            this.nodeBlock.x -= Global.nWidth * nMove;
                                                        }
                                                        // //将旋转移动后的方块置为true
                                                        // this.groundChild[nMoveX[i] - 1][nMoveY[i] - 1].getComponent("PrefabState").isBox = true;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    if (arrayX[0] < 1) {
                                        //向右移动的单位个数
                                        var nMove = 1 - arrayX[0];
                                        //存取移动后的行 ，列
                                        var nMoveX = [];
                                        var nMoveY = [];
                                        //存取移动过后的位置
                                        var arrayMoveX = [];
                                        var arrayMoveY = [];
                                        //判断旋转移动后是否有方块
                                        var isHasBox = false;
                                        for (var l = 0; l <= 3; l++) {
                                            //获取旋转后的坐标 
                                            var v2RotateX = nodeBoxArray[l].getPositionY();
                                            var v2RotateY = -nodeBoxArray[l].getPositionX();
                                            //获取移动后的坐标
                                            var v2RotateX1 = v2RotateX + Global.nWidth * nMove;

                                            //获取移动后俄罗斯方块元素的行列
                                            var nX1 = (v2RotateX1 + this.nodeBlock.getPositionX() - cc.find("GroundParent").getPositionX()) / Global.nWidth + 1;

                                            var nY1 = (v2RotateY + this.nodeBlock.getPositionY() - cc.find("GroundParent").getPositionY()) / Global.nWidth + 1;
                                            if (this.groundChild[nX1 - 1][nY1 - 1].getComponent("PrefabState").isBox) {
                                                isHasBox = true;
                                            }
                                            //获取本地坐标
                                            var positionX = v2RotateX1;
                                            var positionY = v2RotateY;
                                            arrayMoveX.push(positionX);
                                            arrayMoveY.push(positionY);
                                            //  nodeBoxArray[i].setPosition(cc.p(positionX,positionY));
                                            nMoveX.push(nX1);
                                            nMoveY.push(nY1);
                                            if (l == 3) {
                                                if (isHasBox) {
                                                    // //还原未旋转移动前的box的true属性
                                                    // for (var j = 0; j <= 3; j++) {
                                                    //     this.groundChild[nLineX[j] - 1][nRowY[j] - 1].getComponent("PrefabState").isBox = true;
                                                    // }
                                                    return;
                                                } else {
                                                    //初始化 1s计时器
                                                    this.nodeBlock.getComponent("OperateBlock").fCollisionTime = 0;
                                                    this.nodeBlock.getComponent("OperateBlock").nRotateAngle += 90;
                                                    if (this.nodeBlock.getComponent("OperateBlock").nRotateAngle == 360) {
                                                        this.nodeBlock.getComponent("OperateBlock").nRotateAngle = 0;
                                                    }
                                                    for (var i = 0; i <= 3; i++) {
                                                        //获取旋转后的坐标 
                                                        var v2RotateX = nodeBoxArray[i].getPositionY();
                                                        var v2RotateY = -nodeBoxArray[i].getPositionX();
                                                        nodeBoxArray[i].setPosition(cc.p(v2RotateX, v2RotateY));
                                                        if (i == 3) {
                                                            this.nodeBlock.x += Global.nWidth * nMove;
                                                        }
                                                        // //将旋转移动后的方块置为true
                                                        // this.groundChild[nMoveX[i] - 1][nMoveY[i] - 1].getComponent("PrefabState").isBox = true;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    // //初始化俄罗斯方块旋转角度
    // OnloadRotate:function(stringRotate,nRotate){
    // },
    //判断方块角度
    IsRotate: function IsRotate(stringRotate, nRotate, stringShape2) {
        if (stringShape2 != "Square") {
            switch (stringRotate[nRotate]) {
                case "0":
                    this.ChangeRotate(0);
                    break;
                case "180":
                    this.ChangeRotate(180);
                    break;
            }
        } else {
            //  this.nodeBlock.getComponent("OperateBlock").nRotateAngle=0;
            switch (this.nCreat) {
                case 0:
                    this.nodeBlock.getComponent("OperateBlock").nRotateAngle = 0;
                    break;
                case 1:
                    this.nodeBlock1.getComponent("OperateBlock").nRotateAngle = 0;
                    break;
                case 2:
                    this.nodeBlock2.getComponent("OperateBlock").nRotateAngle = 0;
                    break;
            }
            if (this.isFirst) {
                var nodeBoxArray = this.nodeBlock.getChildren();
                cc.log("ppppppppppppppppppppppppppppppppppppppp" + this.nodeBlock.getComponent("OperateBlock").nRotateAngle);
                if (this.nodeBlock.getComponent("OperateBlock").nRotateAngle == 180) {
                    cc.log("qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq" + this.nodeBlock.getComponent("OperateBlock").nRotateAngle);
                    for (var i = 0; i <= 3; i++) {
                        nodeBoxArray[i].setPosition(cc.p(nodeBoxArray[i].getPositionY(), -nodeBoxArray[i].getPositionX()));
                        if (i == 3) {
                            for (var j = 0; j <= 3; j++) {
                                nodeBoxArray[j].setPosition(cc.p(nodeBoxArray[j].getPositionY(), -nodeBoxArray[j].getPositionX()));
                            }
                        }
                    }
                }
                var nodeBoxArray1 = this.nodeBlock1.getChildren();
                if (this.nodeBlock1.getComponent("OperateBlock").nRotateAngle == 180) {
                    //     cc.log("\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\");
                    //    this.nodeBlock1.getComponent("OperateBlock").nRotateAngle=180;
                    for (var i = 0; i <= 3; i++) {
                        nodeBoxArray1[i].setPosition(cc.p(nodeBoxArray1[i].getPositionY(), -nodeBoxArray1[i].getPositionX()));
                        if (i == 3) {
                            for (var j = 0; j <= 3; j++) {
                                nodeBoxArray1[j].setPosition(cc.p(nodeBoxArray1[j].getPositionY(), -nodeBoxArray1[j].getPositionX()));
                            }
                        }
                    }
                }
                var nodeBoxArray2 = this.nodeBlock2.getChildren();
                if (parseInt(stringRotate[nRotate]) == 180) {
                    for (var i = 0; i <= 3; i++) {
                        nodeBoxArray2[i].setPosition(cc.p(nodeBoxArray2[i].getPositionY(), -nodeBoxArray2[i].getPositionX()));
                        if (i == 3) {
                            for (var j = 0; j <= 3; j++) {
                                nodeBoxArray2[j].setPosition(cc.p(nodeBoxArray2[j].getPositionY(), -nodeBoxArray2[j].getPositionX()));
                            }
                        }
                    }
                }
                this.nodeBlock.getComponent("OperateBlock").isStartDown = true;
            }
            this.nCreat++;
            if (this.nCreat == 3) {
                this.nodeBlock.getComponent("OperateBlock").isStartDown = true;
                this.isFirst = true;
            }
        }
    },
    //随机生成俄罗斯方块
    GetBlock: function GetBlock() {
        //声明颜色数组
        this.colorBlock = ["blue", "green", "red"];
        //声明形状数组
        this.shapeBlock = ["T", "L", "Long", "Z", "Square"];
        //声明角度数组
        this.rotateBlock = ["0", "180"];
        this.nColor = Math.floor(cc.random0To1() * 3);
        this.nShape = Math.floor(cc.random0To1() * 5);
        this.nRotate = Math.floor(cc.random0To1() * 2);
        //初始化声称俄罗斯方块的个数
        if (this.isFirst == false) {
            //根据俄罗斯方块形状生成
            this.IsShape(this.shapeBlock, this.nShape);
            this.nRotate = Math.floor(cc.random0To1() * 2);
            this.nColor = Math.floor(cc.random0To1() * 3);
            this.nShape = Math.floor(cc.random0To1() * 5);
            // this.nShape = 1;
            // this.nRotate = 1;
            //根据俄罗斯方块形状生成下一个
            this.IsShape(this.shapeBlock, this.nShape);
            this.nRotate = Math.floor(cc.random0To1() * 2);
            this.nColor = Math.floor(cc.random0To1() * 3);
            this.nShape = Math.floor(cc.random0To1() * 5);
            //根据俄罗斯方块形状生成
            this.IsShape(this.shapeBlock, this.nShape);
        } else {
            //根据俄罗斯方块形状生成
            this.IsShape(this.shapeBlock, this.nShape);
        }
    },
    //获取子块在地板父体下的坐标
    GetBoxNode: function GetBoxNode(childBox) {
        //获取子块在地板附体下的行列
        var nX = (childBox.getPositionX() + this.nodeBlock.getPositionX() - this.groundParent.getPositionX()) / Global.nWidth + 1;
        var nY = (childBox.getPositionY() + this.nodeBlock.getPositionY() - this.groundParent.getPositionY()) / Global.nWidth + 1;
        cc.log(nX);
        cc.log(nY);
        var x = this.groundChild[nX - 1][nY - 1].getPositionX();
        var y = this.groundChild[nX - 1][nY - 1].getPositionY();
        return cc.p(x, y);
    },
    //遍历全局字块数组并消除整行方块isBox都为true的节点
    TraversalNodeBox: function TraversalNodeBox(nPositionY) {
        // var boxParent1=this.boxParent.getChildren();
        var nLength = this.boxParent1.length;
        //存储被销毁的俄罗斯方块数组的下标
        var nDestroy = [];
        cc.log(nPositionY + "nPositionY");
        for (var j = 0; j <= nLength - 1; j++) {
            cc.log(this.boxParent1[j].getPositionY());
        }
        //    cc.log(boxParent1[0].getPositionY());
        //    cc.log(nPositionY);
        for (var i = 0; i <= nLength - 1; i++) {
            // var boxParent1=this.boxParent.getChildren();
            if (this.boxParent1[i].getPositionY() == nPositionY) {
                //销毁该俄罗斯方块自方块
                this.boxParent1[i].destroy();
            }
        }
    },
    //快速下落
    DownQuick: function DownQuick() {
        if (this.nodeBlock.getComponent("OperateBlock").isCollision == false) {

            this.nodeBlock.getComponent("OperateBlock").fDownTime = Global.nTimeInteval;
        } else {
            this.nodeBlock.getComponent("OperateBlock").bCollisionOne = true;
        }
    },
    //遍历全局字块数组并将最高消层数以上的方块下落
    BoxDown: function BoxDown(nMaxDisappea, nDisappearAll) {
        for (var i = nMaxDisappea + 1; i <= 19; i++) {
            for (var j = 0; j <= 9; j++) {
                if (this.groundChild[j][i].getComponent("PrefabState").isBox) {
                    for (var l = 0; l <= this.boxParent1.length - 1; l++) {
                        if (this.boxParent1[l].getPositionY() == this.groundChild[j][i].getPositionY() && this.boxParent1[l].getPositionX() == this.groundChild[j][i].getPositionX()) {
                            this.boxParent1[l].setPosition(cc.p(this.groundChild[j][i].getPositionX(), this.groundChild[j][i].getPositionY() - Global.nWidth * nDisappearAll));
                        }
                    }
                    this.groundChild[j][i].getComponent("PrefabState").isBox = false;
                    this.groundChild[j][i - nDisappearAll].getComponent("PrefabState").isBox = true;
                }
            }
        }
    },
    //遍历游戏场景的字块中的isBox属性是否为true,并消除代码
    DisappearBox: function DisappearBox() {
        //初始化消行行数
        var nDisappear = [];

        for (var i = 0; i <= 19; i++) {
            for (var j = 0; j <= 9; j++) {
                if (j == 0) {
                    //判断i行有多少个true
                    this.nTrue = 0;
                }
                if (this.groundChild[j][i].getComponent("PrefabState").isBox) {
                    this.nTrue++;
                }
                if (j == 9) {
                    for (var a = 0; a <= 9; a++) {
                        cc.log(this.groundChild[a][i].getComponent("PrefabState").isBox);
                    }
                    if (this.nTrue == 10) {
                        cc.log("ppppppppppppppppppppppppppppppppppppp");
                        this.playAudio(this.removeAudio);
                        //遍历全局字块数组并消除整行方块isBox都为true的节点
                        this.TraversalNodeBox(this.groundChild[j][i].getPositionY());
                        //将消除的方块的isBox重置false
                        for (var k = 0; k <= 9; k++) {
                            this.groundChild[k][i].getComponent("PrefabState").isBox = false;
                        }
                        nDisappear.push(i);
                    }
                    if (i == 19 && nDisappear.length != 0) {
                        //当消行层总数为1行是
                        if (nDisappear.length == 1) {
                            this.BoxDown(nDisappear[0], nDisappear.length);
                        } else {
                            //从小到达排序行数
                            for (var k = 0; k <= nDisappear.length - 1; k++) {
                                for (var l = k + 1; l <= nDisappear.length - 1; l++) {
                                    if (k <= 2) {
                                        if (nDisappear[l] < nDisappear[k]) {
                                            var nMin = nDisappear[k];
                                            nDisappear[k] = nDisappear[l];
                                            nDisappear[l] = nMin;
                                        }
                                    }
                                }
                            }
                            this.BoxDown(nDisappear[nDisappear.length - 1], nDisappear.length);
                        }
                        this.ShowScore(nDisappear.length, this.nodeScore1);
                        cc.log(nDisappear.length + "DisappearBox");
                        this.disappearAll += nDisappear.length;
                    }
                }
            }
        }
    },
    //获取俄罗斯方块的列数
    GetBlockLine: function GetBlockLine() {
        var nLine = (this.nodeBlock.getPositionX() - this.groundParent.getPositionX()) / Global.nWidth + 1;
        return nLine;
    },
    getTouchLine: function getTouchLine(buttonNode, worldPosition) {
        console.log("进入我的方法了");
        //将触点的x坐标转化为本地坐标系
        var localX = buttonNode.convertToNodeSpaceAR(cc.v2(worldPosition.x, worldPosition.y)).x;
        cc.log("local is " + localX);
        if (localX > 0) {
            var n1 = Math.floor(localX / (buttonNode.width / 10));
            if (n1 >= 0 && n1 < 1) {
                this.nCol = 6;
            } else if (n1 >= 1 && n1 < 2) {
                this.nCol = 7;
            } else if (n1 >= 2 && n1 < 3) {
                this.nCol = 8;
            } else if (n1 >= 3 && n1 < 4) {
                this.nCol = 9;
            } else if (n1 >= 4 && n1 < 5) {
                this.nCol = 10;
            }
        } else if (localX < 0) {
            var n2 = Math.floor(-localX / (buttonNode.width / 10));
            if (n2 >= 0 && n2 < 1) {
                this.nCol = 5;
            } else if (n2 >= 1 && n2 < 2) {
                this.nCol = 4;
            } else if (n2 >= 2 && n2 < 3) {
                this.nCol = 3;
            } else if (n2 >= 3 && n2 < 4) {
                this.nCol = 2;
            } else if (n2 >= 4 && n2 < 5) {
                this.nCol = 1;
            }
        }
        if (this.nCol >= 10) {
            this.nCol = 10;
        }
        if (this.nCol <= 1) {
            this.nCol = 1;
        }
        return this.nCol;
    },
    //返回触摸点对应的俄罗斯方块的列数
    GetTouchLine: function GetTouchLine(worldPosition) {
        //将触摸点的横坐标转化为本地坐标
        var nodePosition = worldPosition - (this.nodeMove1.getPositionX() + this.nodeCanvas.getPositionX());
        if (nodePosition > 0) {
            var nWidth1 = Math.floor(nodePosition / (this.nodeMove1.width / 20));
            if (nWidth1 == 0 || nWidth1 == 1) {
                this.nLine = 6;
            } else if (nWidth1 == 2 || nWidth1 == 3) {
                this.nLine = 7;
            } else if (nWidth1 == 4 || nWidth1 == 5) {
                this.nLine = 8;
            } else if (nWidth1 == 6 || nWidth1 == 7) {
                this.nLine = 9;
            } else {
                this.nLine = 10;
            }

            return this.nLine;
        }
        if (nodePosition < 0) {
            var nWidth1 = Math.floor(-nodePosition / (this.nodeMove1.width / 20));

            if (nWidth1 == 0 || nWidth1 == 1) {
                this.nLine = 5;
            } else if (nWidth1 == 2 || nWidth1 == 3) {
                this.nLine = 4;
            } else if (nWidth1 == 4 || nWidth1 == 5) {
                this.nLine = 3;
            } else if (nWidth1 == 6 || nWidth1 == 7) {
                this.nLine = 2;
            } else {
                this.nLine = 1;
            }
            return this.nLine;
        }
    },
    shareButton: function shareButton() {
        if (CC_WECHATGAME) {
            console.log("首页share");
            cc.find("PebmanentNode").getComponent("UserInfo").shareFriends();
        } else if (cc.sys.isNative) {
            //原生平台分享
            cc.find("PebmanentNode").getComponent("UserInfo").nativeShare();
        }
    },
    update: function update(dt) {
        this.invalidRemoveTime += dt;
        //告诉服务器不要断开连接
        if (this.invalidRemoveTime >= 60) {
            console.log("发送给服务器消息防止自己不被踢出");
            var url = 'https://m5.ykplay.com/KeepLink';
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
                    var response = xhr.responseText;
                    console.log(response);
                }
            };
            xhr.open("GET", url, true);
            xhr.send();
            //发送长连接请求
            if (cc.sys.isNative || CC_WECHATGAME) {
                var sendData = {
                    tag1: 0,
                    score: "",
                    type: ""
                    // var dataString = JSON.stringify(sendData);
                    // console.log("dataString is ",dataString);
                };cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg(sendData);
            }
            this.invalidRemoveTime = 0;
        }
        if (this.nodeBlock.getComponent("OperateBlock").isGameOver) {
            cc.log("=======================================================");
            cc.find("New Sprite(Splash)").opacity = 120;
            this.overBackGround.active = true;
            if (this.isShowScore == false) {
                //显示结束fenshu
                cc.find("New Node/New Labela").getComponent(cc.Label).string += cc.find("UserScore").getComponent(cc.Label).string;
                this.isShowScore = true;
            }
            this.stopNode.getComponent(cc.Button).interactable = false;
            this.nTime += dt;
            if (this.nTime >= 4) {
                cc.director.loadScene("OneChoose");
            }
            if (cc.sys.localStorage.getItem('maxScoreTetris') === undefined) {
                //设置值
                cc.sys.localStorage.setItem('maxScoreTetris', this.score);
            } else {
                if (this.score > cc.sys.localStorage.getItem('maxScoreTetris')) {
                    console.log("即将保存到微信托管平台。。。");
                    //设置值
                    cc.sys.localStorage.setItem('maxScoreTetris', this.score);
                    //将最高分数保存起来
                    cc.find("PebmanentNode").getComponent("UserInfo").tetrisTopScore = this.score.toString();
                    // let username = cc.find("PebmanentNode").getComponent("UserInfo").nameUser;
                    //将最高分上传到微信托管平台
                    cc.find("PebmanentNode").getComponent("UserInfo").postMessage("SaveScore", "tetrisRankScore", this.score.toString());
                }
                console.log("俄罗斯方块的最高分是: ", cc.sys.localStorage.getItem('maxScoreTetris'));
            }
        }
        if (this.isOutSlide == false) {
            cc.log("isOutSlide");
            cc.find(" Canvas/SlideAcross/43").opacity = 120;
        } else {
            cc.find(" Canvas/SlideAcross/43").opacity = 0;
        }
        if (this.isOutDown == false) {
            cc.find(" Canvas/QuickDown/44").opacity = 120;
        } else {
            cc.find(" Canvas/QuickDown/44").opacity = 0;
        }
        if (this.isPressRotate) {
            this.RotateBlock();
            cc.find(" Canvas/RotateNode/44").opacity = 120;
        } else {
            cc.find(" Canvas/RotateNode/44").opacity = 0;
        }

        if (cc.sys.isNative) {
            if ((this.isOutSlide == false || this.gameSlide == false) && this.nodeBlock.getComponent("OperateBlock").isGameOver == false) {
                console.log("44444444444444444444444444444444444444");
                //当触摸点的列大于俄罗斯方块的列数
                if (!this.isOutSlide) {
                    if (this.getTouchLine(this.nodeMove1, this.positionTouchX) > this.GetBlockLine()) {
                        //执行向右移动代码
                        this.MoveRight(this.getTouchLine(this.nodeMove1, this.positionTouchX), this.GetBlockLine());
                        this.isOutSlide = true;
                    }
                    if (this.getTouchLine(this.nodeMove1, this.positionTouchX) < this.GetBlockLine()) {
                        //执行向左移动代码
                        this.MoveLeft(this.getTouchLine(this.nodeMove1, this.positionTouchX), this.GetBlockLine());
                        this.isOutSlide = true;
                    }
                } else if (!this.gameSlide) {
                    if (this.getTouchLine(this.slideNode, this.slidePosition) > this.GetBlockLine()) {
                        //执行向右移动代码
                        this.MoveRight(this.getTouchLine(this.slideNode, this.slidePosition), this.GetBlockLine());
                        this.gameSlide = true;
                    }
                    if (this.getTouchLine(this.slideNode, this.slidePosition) < this.GetBlockLine()) {
                        //执行向左移动代码
                        this.MoveLeft(this.getTouchLine(this.slideNode, this.slidePosition), this.GetBlockLine());
                        this.gameSlide = true;
                    }
                }
            }
            //快速下落
            if (this.isOutDown == false && this.nodeBlock.getComponent("OperateBlock").isGameOver == false) {
                this.DownQuick();
            }
        } else {
            if ((this.isOutSlide == false || this.gameSlide == false) && this.nodeBlock.getComponent("OperateBlock").isGameOver == false) {
                //当触摸点的列大于俄罗斯方块的列数
                if (!this.isOutSlide) {
                    if (this.getTouchLine(this.nodeMove1, this.positionTouchX) > this.GetBlockLine()) {
                        //执行向右移动代码
                        this.MoveRight(this.getTouchLine(this.nodeMove1, this.positionTouchX), this.GetBlockLine());
                        this.isOutSlide = true;
                    }
                    if (this.getTouchLine(this.nodeMove1, this.positionTouchX) < this.GetBlockLine()) {
                        //执行向左移动代码
                        this.MoveLeft(this.getTouchLine(this.nodeMove1, this.positionTouchX), this.GetBlockLine());
                        this.isOutSlide = true;
                    }
                } else if (!this.gameSlide) {
                    if (this.getTouchLine(this.slideNode, this.slidePosition) > this.GetBlockLine()) {
                        //执行向右移动代码
                        this.MoveRight(this.getTouchLine(this.slideNode, this.slidePosition), this.GetBlockLine());
                        this.gameSlide = true;
                    }
                    if (this.getTouchLine(this.slideNode, this.slidePosition) < this.GetBlockLine()) {
                        //执行向左移动代码
                        this.MoveLeft(this.getTouchLine(this.slideNode, this.slidePosition), this.GetBlockLine());
                        this.gameSlide = true;
                    }
                }
            }
            //快速下落
            if (this.isOutDown == false && this.nodeBlock.getComponent("OperateBlock").isGameOver == false) {
                this.DownQuick();
            }
        }
        if (this.nodeBlock.getComponent("OperateBlock").isStationary && this.nodeBlock.getComponent("OperateBlock").isGameOver == false) {
            // this.boxParent1=this.boxParent.getChildren();
            //获取此方块的数组
            var nodeBoxArray = this.nodeBlock.getChildren();
            for (var i = 0; i <= 3; i++) {
                nodeBoxArray[0].setPosition(this.GetBoxNode(nodeBoxArray[0]));
                nodeBoxArray[0].parent = this.boxParent;
                if (i == 3) {
                    this.nodeBlock.getComponent("OperateBlock").isChangeParent = true;
                }
            }
        }
        if (this.nodeBlock.getComponent("OperateBlock").isChangeParent && this.nodeBlock.getComponent("OperateBlock").isGameOver == false) {
            //消除以后落下俄罗斯方块
            this.DisappearBox();
            var nodeBoxArray1 = this.boxParent.getChildren();
            //生成新的俄罗斯方块
            this.GetBlock();
            this.isOutDown = true;
            this.isPressRotate = false;
            this.isOutSlide = true;
            if (this.disappearAll >= 10) {
                cc.log("sss1111111111111111111111111111111111111");
                cc.log(Global.nTimeInteval + "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
                if (Global.nTimeInteval == 0.3) {

                    Global.nTimeInteval = 0.3;
                    rerurn;
                }
                Global.nTimeInteval -= 0.2;
                Global.nTimeInteval = Number(Global.nTimeInteval.toFixed(1));
                this.disappearAll = 0;
            }
            this.nodeBlock.getComponent("OperateBlock").isStationary = false;
            this.nodeBlock.getComponent("OperateBlock").isChangeParent = false;
        }
    }
});

cc._RF.pop();