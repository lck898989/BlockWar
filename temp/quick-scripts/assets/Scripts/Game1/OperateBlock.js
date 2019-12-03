(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/Game1/OperateBlock.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd9678+GzQxDbbf9lwOIwtx5', 'OperateBlock', __filename);
// Scripts/Game1/OperateBlock.js

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

        // //获取地板附体
        // getGroundParent:{
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
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        //判断玩家是否碰撞过一次
        this.bCollisionOne = false;

        //初始化俄罗斯方块的颜色
        this.stringColor = "";
        //初始化俄罗斯方块是否可以下落
        this.isStartDown = false;
        //初始化俄罗斯方块的形状
        this.stringBoloekShape = "";
        //初始化俄罗斯方块的旋转角度
        this.nRotateAngle = 0;
        //初始化旋转次数
        // this.nRotate=0;
        //初始化物体下落计时器
        this.fDownTime = 0;
        //判断下落方块是否固定
        this.isStationary = false;
        //初始化物体触底，触碰方块计时器
        this.fCollisionTime = 0;
        //判断物体是否和底部或 方块触碰
        this.isCollision = false;
        //判断俄罗斯方块最低点物体的下面是否有方块或者触碰底部
        this.isHasBox = false;
        //判断是否改变父体结束
        this.isChangeParent = false;
        // //判断俄罗斯方块是否有一个方块进入游戏场景
        // this.isJoin=false;
        //初始化方块下面为false的方块个数
        this.nBox = 0;
        //初始化游戏结束
        this.isGameOver = false;
        //判断在四次for循环中是否下落过一次
        this.isDown = false;
        //判断俄罗斯方块是否显示完全
        this.isShow = false;
        //  cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        //判断俄罗斯方块是否下落改变状态
        this.isDownState = false;
        //初始化俄罗斯方块第一次碰撞后的帧数
        this.nUpdate = 0;
    },
    start: function start() {},

    //计算方块下面为false的方块的个数
    AddBoxNumber: function AddBoxNumber(a, b) {
        if (Global.game1Main.groundChild[a - 1][b - 2].getComponent("PrefabState").isBox == false) {
            this.nBox++;
        } else {
            if (b - 2 == 19) {
                cc.log("0-------------------------------------");
                this.isGameOver = true;
                return;
            }
        }
    },
    onKeyUp: function onKeyUp(event) {
        switch (event.keyCode) {
            case cc.KEY.a:
                console.log('release a key');
                break;
            case cc.KEY.d:
                break;
            case cc.KEY.s:
                break;
        }
    },
    //下落物体并将物体的false置为true
    DownBlock: function DownBlock() {
        if (this.isDown == false) {
            //存取俄罗斯方块的行数
            var nArrayRow = [];
            //存取俄罗斯方块的列数
            var nArrayList = [];
            //获取节点子节点数组
            var blockChild = this.node.getChildren();
            this.arrayChangeNode = [];
            for (var i = 0; i <= 3; i++) {
                //获取此时组成俄罗斯方块元素的行列
                var nX = (blockChild[i].getPositionX() + this.node.getPositionX() - cc.find("GroundParent").getPositionX()) / Global.nWidth + 1;
                var nY = (blockChild[i].getPositionY() + this.node.getPositionY() - cc.find("GroundParent").getPositionY()) / Global.nWidth + 1;
                nArrayList.push(nX);
                nArrayRow.push(nY);
                //   this.blockChild[i].y -=65;
                //获取下落后的行列
                if (i == 3) {
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
                    for (var l = 0; l <= 3; l++) {
                        if (nArrayRow[l] == 21) {
                            this.arrayChangeNode.push({ "row": nArrayRow[l] - 2, "col": nArrayList[l] - 1, "color": this.stringColor });
                            // Global.game1Main.groundChild[nArrayList[l] - 1][nArrayRow[l] - 2].getComponent("PrefabState").isBox = true;
                            // Global.game1Main.groundChild[nArrayList[l] - 1][nArrayRow[l] - 2].getComponent("PrefabState").stringColor = this.stringColor;
                        } else {
                            if (nArrayRow[0] == 1) {
                                this.arrayChangeNode.push({ "row": nArrayRow[l] - 1, "col": nArrayList[l] - 1, "color": "white" });
                                // Global.game1Main.groundChild[nArrayList[l] - 1][nArrayRow[l] - 1].getComponent("PrefabState").isBox = false;
                                this.arrayChangeNode.push({ "row": nArrayRow[l] - 2, "col": nArrayList[l] - 1, "color": this.stringColor });
                                // Global.game1Main.groundChild[nArrayList[l] - 1][nArrayRow[l] - 1].getComponent("PrefabState").isBox = true;
                                Global.game1Main.groundChild[nArrayList[l] - 1][nArrayRow[l] - 1].getComponent("PrefabState").stringColor = this.stringColor;
                                this.isCollision = true;

                                cc.log("ssssssssssssssssssssssssssssssssssssssssssssss");
                            } else {
                                this.arrayChangeNode.push({ "row": nArrayRow[l] - 1, "col": nArrayList[l] - 1, "color": "white" });
                                // Global.game1Main.groundChild[nArrayList[l] - 1][nArrayRow[l] - 1].getComponent("PrefabState").isBox = false;
                                this.arrayChangeNode.push({ "row": nArrayRow[l] - 2, "col": nArrayList[l] - 1, "color": this.stringColor });
                                // Global.game1Main.groundChild[nArrayList[l] - 1][nArrayRow[l] - 2].getComponent("PrefabState").isBox = true;
                                // Global.game1Main.groundChild[nArrayList[l] - 1][nArrayRow[l] - 2].getComponent("PrefabState").stringColor = this.stringColor;
                            }
                        }
                    }
                    this.node.y -= Global.nWidth;
                    this.isDownState = true;
                }
            }
        }
        this.isDown = true;
    },
    //遍历数组并将方格的属性置为true
    TravelOnloda: function TravelOnloda() {
        var blockChild = this.node.getChildren();
        //  //判断俄罗斯方块是否结束地面
        //  var isCollisionGround=false;
        for (var i = 0; i <= 3; i++) {
            var nY = (blockChild[i].getPositionY() + this.node.getPositionY() - cc.find("GroundParent").getPositionY()) / Global.nWidth + 1;
            var nX = (blockChild[i].getPositionX() + this.node.getPositionX() - cc.find("GroundParent").getPositionX()) / Global.nWidth + 1;
            Global.game1Main.groundChild[nX - 1][nY - 1].getComponent("PrefabState").isBox = true;
            Global.game1Main.groundChild[nX - 1][nY - 1].getComponent("PrefabState").stringColor = this.stringColor;
        }
    },
    //根据形状判断俄罗斯方块下落时是否可以下落
    GetShape: function GetShape(stringBlock, nArray, nx, ny, nRotate1) {
        //判断下落快中是否有行数大于20行的
        if (ny > 20) {
            this.isOver = true;
        }
        switch (stringBlock) {
            case "L":
                if (nRotate1 == 0 || nRotate1 == 360) {
                    switch (nArray) {
                        case 0:
                            cc.log(nArray);
                            this.AddBoxNumber(nx, ny);
                            break;
                        case 1:
                            cc.log(nArray);
                            this.AddBoxNumber(nx, ny);
                            break;
                        case 2:
                            cc.log(nArray);
                            this.AddBoxNumber(nx, ny);
                            break;
                    }

                    if (this.nBox == 3) {
                        this.DownBlock();
                    } else {
                        if (nArray == 3) {
                            if (this.isOver) {
                                //  this.isGameOver=true;
                            }

                            this.isCollision = true;
                            //初始化触碰1秒计时
                            this.fCollisionTime = 0;
                        }
                    }
                } else if (nRotate1 == 90) {
                    switch (nArray) {
                        case 0:
                            cc.log(nArray);
                            this.AddBoxNumber(nx, ny);
                            break;
                        case 3:
                            cc.log(nArray);
                            this.AddBoxNumber(nx, ny);
                            break;
                    }

                    if (this.nBox == 2) {
                        this.DownBlock();
                    } else {
                        if (nArray == 3) {
                            if (this.isOver) {
                                // this.isGameOver=true;
                            }

                            this.isCollision = true;
                            //初始化触碰1秒计时
                            this.fCollisionTime = 0;
                        }
                    }
                } else if (nRotate1 == 180) {
                    switch (nArray) {
                        case 0:
                            cc.log(nArray);
                            this.AddBoxNumber(nx, ny);
                            break;
                        case 1:
                            cc.log(nArray);
                            this.AddBoxNumber(nx, ny);
                            break;
                        case 3:
                            cc.log(nArray);
                            this.AddBoxNumber(nx, ny);
                            break;
                    }

                    if (this.nBox == 3) {
                        this.DownBlock();
                    } else {
                        if (nArray == 3) {
                            if (this.isOver) {
                                // this.isGameOver=true;
                            }

                            this.isCollision = true;
                            //初始化触碰1秒计时
                            this.fCollisionTime = 0;
                        }
                    }
                } else {
                    switch (nArray) {
                        case 2:
                            cc.log(nArray);
                            this.AddBoxNumber(nx, ny);
                            break;
                        case 3:
                            cc.log(nArray);
                            this.AddBoxNumber(nx, ny);
                            break;
                    }

                    if (this.nBox == 2) {
                        this.DownBlock();
                    } else {
                        if (nArray == 3) {
                            if (this.isOver) {
                                // this.isGameOver=true;
                            }

                            this.isCollision = true;
                            //初始化触碰1秒计时
                            this.fCollisionTime = 0;
                        }
                    }
                }
                break;
            case "Long":
                if (nRotate1 == 0 || nRotate1 == 360) {
                    switch (nArray) {
                        case 0:
                            cc.log(nArray);
                            this.AddBoxNumber(nx, ny);
                            break;
                        case 1:
                            cc.log(nArray);
                            this.AddBoxNumber(nx, ny);
                            break;
                        case 2:
                            cc.log(nArray);
                            this.AddBoxNumber(nx, ny);
                            break;"";
                        case 3:
                            cc.log(nArray);
                            this.AddBoxNumber(nx, ny);
                            break;
                    }
                    if (this.nBox == 4) {
                        this.DownBlock();
                    } else {
                        if (nArray == 3) {
                            if (this.isOver) {
                                // this.isGameOver=true;
                            }

                            this.isCollision = true;
                            //初始化触碰1秒计时
                            this.fCollisionTime = 0;
                        }
                    }
                } else if (nRotate1 == 90) {
                    if (nArray == 3) {
                        cc.log(nArray);
                        this.AddBoxNumber(nx, ny);
                    }
                    if (this.nBox == 1) {
                        this.DownBlock();
                    } else {
                        if (nArray == 3) {
                            if (this.isOver) {
                                // this.isGameOver=true;
                            }

                            this.isCollision = true;
                            //初始化触碰1秒计时
                            this.fCollisionTime = 0;
                        }
                    }
                } else if (nRotate1 == 180) {
                    switch (nArray) {
                        case 0:
                            cc.log(nArray);
                            this.AddBoxNumber(nx, ny);
                            break;
                        case 1:
                            cc.log(nArray);
                            this.AddBoxNumber(nx, ny);
                            break;
                        case 2:
                            cc.log(nArray);
                            this.AddBoxNumber(nx, ny);
                            break;
                        case 3:
                            cc.log(nArray);
                            this.AddBoxNumber(nx, ny);
                            break;
                    }
                    if (this.nBox == 4) {
                        this.DownBlock();
                    } else {
                        if (nArray == 3) {
                            if (this.isOver) {
                                // this.isGameOver=true;
                            }

                            this.isCollision = true;
                            //初始化触碰1秒计时
                            this.fCollisionTime = 0;
                        }
                    }
                } else {
                    if (nArray == 0) {
                        cc.log(nArray);
                        this.AddBoxNumber(nx, ny);
                    }
                    if (this.nBox == 1) {
                        this.DownBlock();
                    } else {
                        if (nArray == 3) {
                            if (this.isOver) {
                                // this.isGameOver=true;
                            }

                            this.isCollision = true;
                            //初始化触碰1秒计时
                            this.fCollisionTime = 0;
                        }
                    }
                }
                break;
            case "Square":
                switch (nArray) {
                    case 0:
                        cc.log(nArray);
                        this.AddBoxNumber(nx, ny);
                        break;
                    case 1:
                        cc.log(nArray);
                        this.AddBoxNumber(nx, ny);
                        break;
                }
                if (this.nBox == 2) {
                    this.DownBlock();
                } else {
                    if (nArray == 3) {
                        if (this.isOver) {
                            // this.isGameOver=true;
                        }

                        this.isCollision = true;
                        //初始化触碰1秒计时
                        this.fCollisionTime = 0;
                    }
                }
                break;
            case "T":
                if (nRotate1 == 0 || nRotate1 == 360) {
                    switch (nArray) {
                        case 0:
                            cc.log(nArray);
                            this.AddBoxNumber(nx, ny);
                            break;
                        case 2:
                            cc.log(nArray);
                            this.AddBoxNumber(nx, ny);
                            break;
                        case 3:
                            cc.log(nArray);
                            this.AddBoxNumber(nx, ny);
                            break;

                    }

                    if (this.nBox == 3) {
                        this.DownBlock();
                    } else {
                        if (nArray == 3) {
                            if (this.isOver) {
                                // this.isGameOver=true;
                            }

                            this.isCollision = true;
                            //初始化触碰1秒计时
                            this.fCollisionTime = 0;
                        }
                    }
                } else if (nRotate1 == 90) {
                    switch (nArray) {
                        case 2:
                            cc.log(nArray);
                            this.AddBoxNumber(nx, ny);
                            break;
                        case 3:
                            cc.log(nArray);
                            this.AddBoxNumber(nx, ny);
                            break;
                    }

                    if (this.nBox == 2) {

                        this.DownBlock();
                    } else {
                        if (nArray == 3) {
                            if (this.isOver) {
                                // this.isGameOver=true;
                            }

                            this.isCollision = true;
                            //初始化触碰1秒计时
                            this.fCollisionTime = 0;
                        }
                    }
                } else if (nRotate1 == 180) {
                    switch (nArray) {
                        case 0:
                            cc.log(nArray);
                            this.AddBoxNumber(nx, ny);
                            break;
                        case 1:
                            cc.log(nArray);
                            this.AddBoxNumber(nx, ny);
                            break;
                        case 3:
                            cc.log(nArray);
                            this.AddBoxNumber(nx, ny);
                            break;
                    }

                    if (this.nBox == 3) {
                        this.DownBlock();
                    } else {
                        if (nArray == 3) {
                            if (this.isOver) {
                                // this.isGameOver=true;
                            }

                            this.isCollision = true;
                            //初始化触碰1秒计时
                            this.fCollisionTime = 0;
                        }
                    }
                } else {
                    switch (nArray) {
                        case 0:
                            cc.log(nArray);
                            this.AddBoxNumber(nx, ny);
                            break;
                        case 2:
                            cc.log(nArray);
                            this.AddBoxNumber(nx, ny);
                            break;
                    }

                    if (this.nBox == 2) {
                        this.DownBlock();
                    } else {
                        if (nArray == 3) {
                            if (this.isOver) {
                                // this.isGameOver=true;
                            }

                            this.isCollision = true;
                            //初始化触碰1秒计时
                            this.fCollisionTime = 0;
                        }
                    }
                }
                break;
            case "Z":
                if (nRotate1 == 0 || nRotate1 == 360) {
                    switch (nArray) {
                        case 0:
                            cc.log(nArray);
                            this.AddBoxNumber(nx, ny);
                            break;
                        case 2:
                            cc.log(nArray);
                            this.AddBoxNumber(nx, ny);
                            break;
                        case 3:
                            cc.log(nArray);
                            this.AddBoxNumber(nx, ny);
                            break;
                    }
                    if (this.nBox == 3) {
                        this.DownBlock();
                    } else {
                        if (nArray == 3) {
                            if (this.isOver) {
                                // this.isGameOver=true;
                            }

                            this.isCollision = true;
                            //初始化触碰1秒计时
                            this.fCollisionTime = 0;
                        }
                    }
                } else if (nRotate1 == 90) {
                    switch (nArray) {
                        case 1:
                            cc.log(nArray);
                            this.AddBoxNumber(nx, ny);
                            break;
                        case 3:
                            cc.log(nArray);
                            this.AddBoxNumber(nx, ny);
                            break;
                    }
                    if (this.nBox == 2) {
                        this.DownBlock();
                    } else {

                        if (nArray == 3) {
                            if (this.isOver) {
                                // this.isGameOver=true;
                            }

                            this.isCollision = true;
                            //初始化触碰1秒计时
                            this.fCollisionTime = 0;
                        }
                    }
                } else if (nRotate1 == 180) {
                    switch (nArray) {
                        case 0:
                            cc.log(nArray);
                            this.AddBoxNumber(nx, ny);
                            break;
                        case 1:
                            cc.log(nArray);
                            this.AddBoxNumber(nx, ny);
                            break;
                        case 3:
                            cc.log(nArray);
                            this.AddBoxNumber(nx, ny);
                            break;
                    }
                    if (this.nBox == 3) {
                        this.DownBlock();
                    } else {
                        if (nArray == 3) {
                            if (this.isOver) {
                                // this.isGameOver=true;
                            }

                            this.isCollision = true;
                            //初始化触碰1秒计时
                            this.fCollisionTime = 0;
                        }
                    }
                } else {
                    switch (nArray) {
                        case 0:
                            cc.log(nArray);
                            this.AddBoxNumber(nx, ny);
                            break;
                        case 2:
                            cc.log(nArray);
                            this.AddBoxNumber(nx, ny);
                            break;
                    }
                    if (this.nBox == 2) {
                        this.DownBlock();
                    } else {
                        if (nArray == 3) {
                            if (this.isOver) {
                                // this.isGameOver=true;
                            }

                            this.isCollision = true;
                            //初始化触碰1秒计时
                            this.fCollisionTime = 0;
                        }
                    }
                }
                break;
        }
    },
    //俄罗斯方块下落
    BlockDown: function BlockDown() {
        //判断俄罗斯方块是否移动过一次
        var isMove = true;
        //获取节点子节点数组
        var blockChild = this.node.getChildren();
        //  //判断俄罗斯方块是否结束地面
        //  var isCollisionGround=false;
        //判断俄罗斯方块中是否含有22行
        for (var i = 0; i <= 3; i++) {
            var nY = (blockChild[i].getPositionY() + this.node.getPositionY() - cc.find("GroundParent").getPositionY()) / Global.nWidth + 1;
            if (nY == 22) {
                isMove = false;
            }
        }
        if (isMove == false) {
            //初始化俄罗斯方块中第21行方块的数组下表
            var nBoxArray = [];
            //初始化俄罗斯方块中第21行方块的数组列
            var nXArray = [];
            //初始化俄罗斯方块中第21行方块的数组行
            var nYArray = [];
            //遍历俄罗斯方块并并判断第21行的下面是否为true
            for (var i = 0; i <= 3; i++) {
                //获取此时组成俄罗斯方块元素的行列
                var nX = (blockChild[i].getPositionX() + this.node.getPositionX() - cc.find("GroundParent").getPositionX()) / Global.nWidth + 1;
                var nY = (blockChild[i].getPositionY() + this.node.getPositionY() - cc.find("GroundParent").getPositionY()) / Global.nWidth + 1;
                cc.log(nX);
                cc.log(nY);
                if (nY == 21) {

                    if (Global.game1Main.groundChild[nX - 1][nY - 2].getComponent("PrefabState").isBox) {
                        cc.log("BlockDown" + nY);
                        cc.log();
                        this.isGameOver = true;
                        return;
                    } else {
                        nBoxArray.push(i);
                        nXArray.push(nX);
                        nYArray.push(nY);
                    }
                }
                if (i == 3 && this.isGameOver == false) {
                    //初始化变化方块数组
                    this.arrayChangeNode = [];
                    this.node.y -= Global.nWidth;
                    if (nBoxArray.length >= 2) {
                        for (var j = 0; j <= nBoxArray.length - 1; j++) {
                            // Global.game1Main.groundChild[nXArray[j] - 1][nYArray[j] - 2].getComponent("PrefabState").stringColor = this.stringColor;
                            // Global.game1Main.groundChild[nXArray[j] - 1][nYArray[j] - 2].getComponent("PrefabState").isBox = true;
                            this.arrayChangeNode.push({ "row": nYArray[j] - 2, "col": nXArray[j] - 1, "color": this.stringColor });
                        }
                    }
                    if (nBoxArray.length == 1) {
                        cc.log(nXArray[0] - 1);
                        cc.log(nYArray[0] - 2);
                        cc.log(Global.game1Main.groundChild[nXArray[0] - 1][nYArray[0] - 2].getComponent("PrefabState").stringColor);
                        // Global.game1Main.groundChild[nXArray[0] - 1][nYArray[0] - 2].getComponent("PrefabState").isBox = true;
                        this.arrayChangeNode.push({ "row": nYArray[0] - 2, "col": nXArray[0] - 1, "color": this.stringColor });
                    }
                    //初始化计时器
                    this.fDownTime = 0;
                    this.isDownState = true;
                }
            }
        } else {

            //     //获取此时组成俄罗斯方块元素的行列
            //    var nX=(blockChild[i].getPositionX()+this.node.getPositionX()-cc.find("GroundParent").getPositionX())/65+1;
            //    var nY=(blockChild[i].getPositionY()+this.node.getPositionY()-cc.find("GroundParent").getPositionY())/65+1; 
            //存取俄罗斯方块的行数
            var nArrayRow = [];
            //存取俄罗斯方块的列数
            var nArrayList = [];
            //将俄罗斯方块的行列存入数组中
            for (var i = 0; i <= 3; i++) {
                //获取此时组成俄罗斯方块元素的行列
                var nX = (blockChild[i].getPositionX() + this.node.getPositionX() - cc.find("GroundParent").getPositionX()) / Global.nWidth + 1;
                var nY = (blockChild[i].getPositionY() + this.node.getPositionY() - cc.find("GroundParent").getPositionY()) / Global.nWidth + 1;
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
            //    if(Global.game1Main.groundChild[nArrayList[0]-1][nArrayRow[0]-2].getComponent("PrefabState").isBox&&nArrayRow[3]>20)
            //    {
            //        this.isGameOver=true;
            //    }
            if (this.isGameOver == false) {
                if (nArrayRow[0] == 1) {
                    cc.log("==========================================================================");

                    //    this.fCollisionTime=0;
                    this.isCollision = true;
                    return;
                } else {
                    this.isOver = false;
                    for (var i = 0; i <= 3; i++) {
                        if (this.isGameOver) {
                            return;
                        }
                        //获取此时组成俄罗斯方块元素的行列
                        var nX = (blockChild[i].getPositionX() + this.node.getPositionX() - cc.find("GroundParent").getPositionX()) / Global.nWidth + 1;
                        var nY = (blockChild[i].getPositionY() + this.node.getPositionY() - cc.find("GroundParent").getPositionY()) / Global.nWidth + 1;
                        if (i == 0) {
                            this.nBox = 0;
                            this.isDown = false;
                        }
                        this.GetShape(this.stringBoloekShape, i, nX, nY, this.nRotateAngle);
                        if (i == 3) {
                            this.fDownTime = 0;
                        }
                    }
                }
            }
        }
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
    update: function update(dt) {
        if (this.isShow == false && this.isStartDown && this.isGameOver == false) {
            //获取节点子节点数组
            var blockChild = this.node.getChildren();
            var isActive = false;
            for (var i = 0; i <= 3; i++) {
                var nY = (blockChild[i].getPositionY() + this.node.getPositionY() - cc.find("GroundParent").getPositionY()) / Global.nWidth + 1;
                if (nY == 22 || nY == 21) {
                    isActive = true;
                    blockChild[i].active = false;
                } else {
                    blockChild[i].active = true;
                }
                if (i == 3 && isActive == false) {
                    this.isShow = true;
                }
            }
        }
        if (this.isStartDown && this.isGameOver == false) {
            //物体下落,开始计时
            this.fDownTime += dt;
            if (this.fDownTime >= Global.nTimeInteval && this.isStationary == false) {
                //  cc.log(this.stringBoloekShape);
                //  cc.log(this.nRotateAngle);
                this.BlockDown();
            }
            if (this.isCollision && this.isGameOver == false) {
                var blockChild = this.node.getChildren();
                //判断俄罗斯方块中是否有大于20行的
                for (var i = 0; i <= 3; i++) {
                    var nY = (blockChild[i].getPositionY() + this.node.getPositionY() - cc.find("GroundParent").getPositionY()) / Global.nWidth + 1;
                    if (nY > 20) {
                        this.isGameOver = true;
                        return;
                    }
                }
                this.TravelOnloda();
                this.isStationary = true;
                this.isCollision = false;
            }
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
        //# sourceMappingURL=OperateBlock.js.map
        