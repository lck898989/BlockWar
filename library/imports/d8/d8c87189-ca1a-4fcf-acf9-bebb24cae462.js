"use strict";
cc._RF.push(module, 'd8c87GJyhpPz6z5vrskyuRi', 'Game2Main');
// Scripts/Game2/Game2Main.js

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
        groundPrefab: {
            default: null,
            type: cc.Prefab
        },
        groundParent: {
            default: null,
            type: cc.Node
        },
        //获取下落噗呦块的父节点
        downBoxParent: {
            default: null,
            type: cc.Node
        },
        //获取 竖条预制体
        prefabLong: {
            default: null,
            type: cc.Prefab

        },
        //获取颜色不一样田型预制体
        prefabSquare: {
            default: null,
            type: cc.Prefab

        },
        //获取l型预制体
        prefabL: {
            default: null,
            type: cc.Prefab

        },
        //获取颜色一样田预制体
        prefabSquare1: {
            default: null,
            type: cc.Prefab
        },
        //获取背景狂节点
        nodeBackgroundBox: {
            default: null,
            type: cc.Node
        },
        //获取噗呦小块父节点
        boxParent: {
            default: null,
            type: cc.Node
        },
        prefab1: {
            default: null,
            type: cc.Prefab
        },
        prefab22: {
            default: null,
            type: cc.Prefab
        },
        prefab2: {
            default: null,
            type: cc.Prefab
        },
        prefab3: {
            default: null,
            type: cc.Prefab
        },
        prefab4: {
            default: null,
            type: cc.Prefab
        },
        nodeDownButton: {
            default: null,
            type: cc.Node
        },
        //初始化方块压缩变形移动的时间
        fChangeShape: 0,
        //初始化变形缩放大小
        fScaleChange: 0.5,
        //可下落噗呦块下落时间
        fActionDown: 0
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
        Global.game1Main = this;
        Global.SetBackground(this.nodeBackgroundBox, this.groundParent, Global.nWidthPuYo, 12);
        this.boxParent.setPosition(this.groundParent.getPositionX(), this.groundParent.getPositionY());
        //初始化背景子节点
        this.userGroundChild = [];
        //显示自己的游戏背景
        Global.CreatBackGround(this.userGroundChild, 12, 6, this.groundPrefab, this.groundParent, Global.nWidthPuYo);
        //   cc.log(this.userGroundChild);
        this.GetBlock();
        //初始化long型噗呦块的旋转次数
        this.nRotateLong = 0;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        //判断噗呦块是否正在旋转
        this.isRotate = false;
        //存取使用贝塞尔曲线选装后的坐标
        this.positionRotateX = 0;
        this.positionRotateY = 0;
        //初始化实际坐标
        this.nPositionX = 0;
        this.nPositionY = 0;
        //判断形变动作是否完成开关
        this.isActionShape = false;
        //  //判断固定后可向下移动的噗呦块是否完成下落动作
        this.isActionDown = false;
        //初始化形变次数
        this.nChangeShape = 0;
        //判断手指是否离开下落节点
        this.isOutDown = true;
        var self = this;
        //当手指落在下落节点上时
        this.nodeDownButton.on(cc.Node.EventType.TOUCH_START, function (event) {
            self.nodeBlock.getComponent("PuyoDown").nDownSpeed = 4;
        }, this);
        //当手指离开下落节点上时
        this.nodeDownButton.on(cc.Node.EventType.TOUCH_END, function (event) {
            self.nodeBlock.getComponent("PuyoDown").nDownSpeed = 24;
        }, this);
        //   //初始化下落数组
        //   this.arrayDown=[];
        //  for(var i=0;i<=11;i++)
        //  {
        //      for(var j=0;j<=5;j++)
        //      {
        //          cc.log( this.userGroundChild[j][i].getPosition());
        //      }
        //  }
    },

    //执行贝塞尔动作后初始化动作位置
    RotateLoadPosition: function RotateLoadPosition() {
        var child = this.nodeBlock.getChildren();
        child[1].setPosition(this.positionRotateX, this.positionRotateY);
        // cc.log();
    },
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
                self.RotatePuYo();
                break;
        }
    },

    //旋转噗呦块
    RotatePuYo: function RotatePuYo() {
        cc.log(this.nodeBlock.getComponent("PuyoDown").stringBoloekShape + "9999999999999999999999");
        switch (this.nodeBlock.getComponent("PuyoDown").stringBoloekShape) {
            case "Long":
                if (this.nodeBlock.getComponent("PuyoDown").nColor == 1) {
                    this.RotateActioin();
                } else {
                    this.RotateLongShape();
                }
                break;
            case "L":
                this.RotateActioin();
                break;
            case "Square":
                if (this.nodeBlock.getComponent("PuyoDown").nColor == 1) {
                    this.ChangePuyoColor();
                } else {
                    this.RotateActioin();
                }
                break;
        }
    },
    //快速下落
    DownQuick: function DownQuick() {
        this.nodeBlock.getComponent("PuyoDown").isDown = true;
    },
    LoadPosition: function LoadPosition(target, jsonMsg) {
        jsonMsg.node.setPosition(jsonMsg.positionX, jsonMsg.positionY);
    },
    //初始化旋转开关
    OnloadRotate: function OnloadRotate() {
        this.isRotate = false;
    },
    //根据噗呦块在父体中的坐标转化成背景的本地坐标
    ChangeNodePositionY: function ChangeNodePositionY(positionY) {
        var nodePositionGroundY = positionY + this.nodeBlock.getPositionY() - cc.find("GroundParent").getPositionY();
        return nodePositionGroundY;
    },
    ChangeNodePositionX: function ChangeNodePositionX(positionX) {
        var nodePositionGroundX = positionX + this.nodeBlock.getPositionY() - cc.find("GroundParent").getPositionX();
        return nodePositionGroundX;
    },
    //执行旋转动作后初始化噗呦块角度
    LodaRotation: function LodaRotation(nAngle) {
        this.nodeBlock.rotation = nAngle;
    },
    //改变四个颜色一样的噗呦快的颜色
    ChangePuyoColor: function ChangePuyoColor() {
        var nodeBlockChild = this.nodeBlock.getChildren();
        switch (nodeBlockChild[0].getComponent("InitPrefabState").stringColor) {
            case "red":
                for (var i = 0; i <= 3; i++) {
                    nodeBlockChild[i].getComponent(cc.Animation).play("ChangeGreen");
                    nodeBlockChild[i].getComponent("InitPrefabState").stringColor = "green";
                }
                break;
            case "blue":
                for (var i = 0; i <= 3; i++) {
                    nodeBlockChild[i].getComponent(cc.Animation).play("ChangeRed");
                    nodeBlockChild[i].getComponent("InitPrefabState").stringColor = "red";
                }
                break;
            case "green":
                for (var i = 0; i <= 3; i++) {
                    nodeBlockChild[i].getComponent(cc.Animation).play("ChangeBlue");
                    nodeBlockChild[i].getComponent("InitPrefabState").stringColor = "blue";
                }
                break;
        }
    },
    //根据旋转动作旋转
    RotateActioin: function RotateActioin() {
        if (this.isRotate == false) {
            this.isRotate = true;
            this.nodeBlock.getComponent("PuyoDown").nRotateAngle += 90;
            if (this.nodeBlock.getComponent("PuyoDown").nRotateAngle == 360) {
                this.nodeBlock.getComponent("PuyoDown").nRotateAngle = 0;
            }
            //初始化旋转动作
            var actionRotate = cc.rotateTo(0.05, this.nodeBlock.getComponent("PuyoDown").nRotateAngle);
            //初始化旋转开关动作
            var callRotate = cc.callFunc(this.OnloadRotate, this);
            //执行旋转动作
            this.nodeBlock.runAction(cc.sequence(actionRotate, callRotate));
        }
    },
    //根据诶塞尔旋转噗呦块
    RotateLong: function RotateLong() {
        var child = this.nodeBlock.getChildren();
        var bezier = [cc.p(child[1].getPositionX(), child[1].getPositionY()), cc.p(Global.nWidthPuYo * Math.cos(Math.PI / 4 - Math.PI / 2 * this.nRotateLong), Global.nWidthPuYo * Math.sin(Math.PI / 4 - Math.PI / 2 * this.nRotateLong)), cc.p(child[1].getPositionY(), -child[1].getPositionX())];
        this.nRotateLong++;
        var bezierAction = cc.bezierTo(0.06, bezier);
        var loadPositionAction = cc.callFunc(this.RotateLoadPosition, this);
        //初始化旋转开关动作
        var callRotate = cc.callFunc(this.OnloadRotate, this);
        child[1].runAction(cc.sequence(bezierAction, loadPositionAction, callRotate));
        this.nodeBlock.getComponent("PuyoDown").nRotateAngle += 90;
        if (this.nodeBlock.getComponent("PuyoDown").nRotateAngle == 360) {
            this.nodeBlock.getComponent("PuyoDown").nRotateAngle = 0;
        }
    },
    //根据贝塞尔曲线旋转long型
    RotateLongShape: function RotateLongShape() {
        if (this.isRotate == false) {
            this.isRotate = true;
            var child = this.nodeBlock.getChildren();
            //计算旋转后噗呦块的行数
            // child[1].setPosition(Number(child[1].getPositionX().toFixed(0)),Number(child[1].getPositionY().toFixed(0)));

            this.positionRotateX = child[1].getPositionY();
            this.positionRotateY = -child[1].getPositionX();
            //根据坐标计算出行列
            var nLine = (this.positionRotateX + this.nodeBlock.getPositionX() - cc.find("GroundParent").getPositionX()) / Global.nWidthPuYo + 1;
            var nRow = (this.positionRotateY + this.nodeBlock.getPositionY() - cc.find("GroundParent").getPositionY()) / Global.nWidthPuYo + 1;
            if (nLine > 6) {
                cc.log("RotateLongShape");
                var actionMoveLeft = cc.moveBy(0.06, cc.p(-Global.nWidthPuYo, child[1].getPositionY()));
                //初始化位置i
                var loadPosition1 = cc.callFunc(this.LoadPosition, this, { "node": child[1], "positionX": child[1].getPositionX() - Global.nWidthPuYo, "positionY": child[1].getPositionY() });
                var loadPosition0 = cc.callFunc(this.LoadPosition, this, { "node": child[0], "positionX": child[0].getPositionX() - Global.nWidthPuYo, "positionY": child[0].getPositionY() });
                var actionRotate1 = cc.callFunc(this.RotateLong, this);
                child[1].runAction(cc.spawn(cc.sequence(actionMoveLeft, loadPosition1), actionRotate1));
                child[0].runAction(cc.sequence(actionMoveLeft, loadPosition0));
            }
            if (nLine < 0) {
                var actionMoveLeft = cc.moveBy(0.06, cc.p(Global.nWidthPuYo, this.nodeBlock.getPositionY()));
                //初始化位置i
                var loadPosition1 = cc.callFunc(this.LoadPosition, this, { "node": this.nodeBlock, "positionX": this.nodeBlock.getPositionX() + Global.nWidthPuYo, "positionY": this.nodeBlock.getPositionY() });
                this.nodeBlock.runAction(cc.sequence(actionMoveLeft, loadPosition1));
            }
            this.RotateLong();
        }
    },
    //遍历待下落数组,并判断是否可销毁
    IsDestroy: function IsDestroy() {
        var arrayBox = this.boxParent.getChildren();
        //初始化销毁数组
        this.arrayDestroy = [];

        for (var i = 0; i <= this.arrayPositionX.length - 1; i++) {
            //初始化待销毁数组
            this.arrayDestroyWait = [];
            for (var j = 0; j <= arrayBox.length - 1; j++) {
                if (arrayBox[j].getPositionX() == this.arrayPositionX[i] && arrayBox[j].getPositionY() == this.arrayPositionY[i]) {
                    this.DestroyNode(this.CountRow(this.arrayPositionY[i]), this.CountLine(this.arrayPositionX[i]), j);
                    break;
                }
            }
            if (i == this.arrayPositionX.length - 1) {
                if (this.arrayDestroy.length != 0) {
                    cc.log(this.arrayDestroy.length + "IsDestroy");
                    for (var j = 0; j <= this.arrayDestroy.length - 1; j++) {
                        cc.log(this.arrayDestroy[j].getPositionX() + "IsDestroy");
                        cc.log(this.arrayDestroy[j].getPositionY() + "IsDestroy");
                        this.userGroundChild[this.CountLine(this.arrayDestroy[j].getPositionX())][this.CountRow(this.arrayDestroy[j].getPositionY())].getComponent("BoxState").stringColor = "";
                        this.userGroundChild[this.CountLine(this.arrayDestroy[j].getPositionX())][this.CountRow(this.arrayDestroy[j].getPositionY())].getComponent("BoxState").isBox = false;
                        this.arrayDestroy[j].setPosition(-1000, -1000);
                        this.arrayDestroy[j].destroy();
                    }
                }
            }
        }
    },
    //把铺有块加入待消数组
    //根据普邮快的行列向上，下，左，右遍历，并销毁节点
    DestroyNode: function DestroyNode(nRow, nLine, nSign) {
        //存取此普邮块的颜色
        var stringColor = this.userGroundChild[nLine][nRow].getComponent("BoxState").stringColor;
        var arrayBox = this.boxParent.getChildren();
        var isFind = false;
        //向上遍历
        for (var i = nRow + 1; i <= 11; i++) {
            if (isFind) {
                break;
            }
            if (stringColor == this.userGroundChild[nLine][i].getComponent("BoxState").stringColor) {
                if (this.arrayDestroyWait.length == 0) {
                    this.arrayDestroyWait.push(arrayBox[nSign]);
                    for (var j = 0; j <= arrayBox.length - 1; j++) {
                        if (arrayBox[j].getPositionX() == this.userGroundChild[nLine][i].getPositionX() && arrayBox[j].getPositionY() == this.userGroundChild[nLine][i].getPositionY()) {
                            // cc.log(j+"DestroyNode");
                            this.arrayDestroyWait.push(arrayBox[j]);
                            this.DestroyNode(i, nLine, j);
                            isFind = true;
                            break;
                            // continue signdown;
                            // return;
                        }
                    }
                } else {
                    //判断待消数列中是否含有此铺有块
                    var isHas = false;
                    for (var j = 0; j <= this.arrayDestroyWait.length - 1; j++) {
                        if (this.arrayDestroyWait[j].getPositionX() == this.userGroundChild[nLine][i].getPositionX() && this.arrayDestroyWait[j].getPositionY() == this.userGroundChild[nLine][i].getPositionY()) {
                            isHas = true;
                        }
                    }
                    if (isHas) {
                        break;
                    } else {
                        for (var j = 0; j <= arrayBox.length - 1; j++) {
                            if (arrayBox[j].getPositionX() == this.userGroundChild[nLine][i].getPositionX() && arrayBox[j].getPositionY() == this.userGroundChild[nLine][i].getPositionY()) {
                                this.arrayDestroyWait.push(arrayBox[j]);
                                this.DestroyNode(i, nLine, j);
                                isFind = true;
                                break;
                                // return;
                            }
                        }
                    }
                }
            } else {
                break;
            }
        }
        var isFind = false;
        //向下遍历
        for (var i = nRow - 1; i >= 0; i--) {
            if (isFind) {
                break;
            }
            if (stringColor == this.userGroundChild[nLine][i].getComponent("BoxState").stringColor) {
                if (this.arrayDestroyWait.length == 0) {
                    this.arrayDestroyWait.push(arrayBox[nSign]);
                    for (var j = 0; j <= arrayBox.length - 1; j++) {
                        if (arrayBox[j].getPositionX() == this.userGroundChild[nLine][i].getPositionX() && arrayBox[j].getPositionY() == this.userGroundChild[nLine][i].getPositionY()) {
                            this.arrayDestroyWait.push(arrayBox[j]);
                            this.DestroyNode(i, nLine, j);
                            isFind = true;
                            break;
                            // return;
                        }
                    }
                } else {
                    //判断待消数列中是否含有此铺有块
                    var isHas = false;
                    for (var j = 0; j <= this.arrayDestroyWait.length - 1; j++) {
                        if (this.arrayDestroyWait[j].getPositionX() == this.userGroundChild[nLine][i].getPositionX() && this.arrayDestroyWait[j].getPositionY() == this.userGroundChild[nLine][i].getPositionY()) {
                            isHas = true;
                        }
                    }
                    if (isHas) {
                        break;
                    } else {
                        for (var j = 0; j <= arrayBox.length - 1; j++) {
                            if (arrayBox[j].getPositionX() == this.userGroundChild[nLine][i].getPositionX() && arrayBox[j].getPositionY() == this.userGroundChild[nLine][i].getPositionY()) {
                                this.arrayDestroyWait.push(arrayBox[j]);
                                this.DestroyNode(i, nLine, j);
                                isFind = true;
                                break;
                                // return;
                            }
                        }
                    }
                }
            } else {
                break;
            }
        }
        var isFind = false;
        //向左遍历 
        for (var i = nLine - 1; i >= 0; i--) {
            if (isFind) {
                break;
            }
            if (stringColor == this.userGroundChild[i][nRow].getComponent("BoxState").stringColor) {
                if (this.arrayDestroyWait.length == 0) {
                    this.arrayDestroyWait.push(arrayBox[nSign]);
                    for (var j = 0; j <= arrayBox.length - 1; j++) {
                        if (arrayBox[j].getPositionX() == this.userGroundChild[i][nRow].getPositionX() && arrayBox[j].getPositionY() == this.userGroundChild[i][nRow].getPositionY()) {
                            this.arrayDestroyWait.push(arrayBox[j]);
                            this.DestroyNode(nRow, i, j);
                            isFind = true;
                            break;
                            // return;
                        }
                    }
                } else {
                    //判断待消数列中是否含有此铺有块
                    var isHas = false;
                    for (var j = 0; j <= this.arrayDestroyWait.length - 1; j++) {
                        if (this.arrayDestroyWait[j].getPositionX() == this.userGroundChild[i][nRow].getPositionX() && this.arrayDestroyWait[j].getPositionY() == this.userGroundChild[i][nRow].getPositionY()) {
                            isHas = true;
                        }
                    }
                    if (isHas) {
                        break;
                    } else {
                        for (var j = 0; j <= arrayBox.length - 1; j++) {
                            if (arrayBox[j].getPositionX() == this.userGroundChild[i][nRow].getPositionX() && arrayBox[j].getPositionY() == this.userGroundChild[i][nRow].getPositionY()) {
                                this.arrayDestroyWait.push(arrayBox[j]);
                                this.DestroyNode(nRow, i, j);
                                isFind = true;
                                break;
                                // return;
                            }
                        }
                    }
                }
            } else {
                break;
            }
        }
        //向右遍历
        for (var i = nLine + 1; i <= 5; i++) {
            if (stringColor == this.userGroundChild[i][nRow].getComponent("BoxState").stringColor) {
                if (this.arrayDestroyWait.length == 0) {
                    this.arrayDestroyWait.push(arrayBox[nSign]);
                    for (var j = 0; j <= arrayBox.length - 1; j++) {
                        if (arrayBox[j].getPositionX() == this.userGroundChild[i][nRow].getPositionX() && arrayBox[j].getPositionY() == this.userGroundChild[i][nRow].getPositionY()) {
                            this.arrayDestroyWait.push(arrayBox[j]);
                            this.DestroyNode(nRow, i, j);
                            return;
                        }
                    }
                } else {
                    //判断待消数列中是否含有此铺有块
                    var isHas = false;
                    for (var j = 0; j <= this.arrayDestroyWait.length - 1; j++) {
                        if (this.arrayDestroyWait[j].getPositionX() == this.userGroundChild[i][nRow].getPositionX() && this.arrayDestroyWait[j].getPositionY() == this.userGroundChild[i][nRow].getPositionY()) {
                            isHas = true;
                        }
                    }
                    if (isHas) {
                        break;
                    } else {
                        for (var j = 0; j <= arrayBox.length - 1; j++) {
                            if (arrayBox[j].getPositionX() == this.userGroundChild[i][nRow].getPositionX() && arrayBox[j].getPositionY() == this.userGroundChild[i][nRow].getPositionY()) {
                                this.arrayDestroyWait.push(arrayBox[j]);
                                this.DestroyNode(nRow, i, j);
                                return;
                            }
                        }
                    }
                }
            } else {
                break;
            }
        }
        cc.log("DestroyNode" + this.arrayDestroyWait.length);
        if (this.arrayDestroyWait.length >= 4) {
            if (this.arrayDestroy.length != 0) {
                for (var j = 0; j <= this.arrayDestroy.length - 1; j++) {
                    var isHas = false;
                    for (var i = 0; i <= this.arrayDestroyWait.length - 1; i++) {
                        if (this.arrayDestroy[j].getPositionX() == this.arrayDestroyWait[i].getPositionX() && this.arrayDestroy[j].getPositionY() == this.arrayDestroyWait[i].getPositionY()) {
                            isHas = true;
                        }
                        if (i == this.arrayDestroyWait.length - 1 && isHas == false) {
                            this.arrayDestroy.push(this.arrayDestroyWait[i]);
                        }
                        // cc.log(this.arrayDestroy[i].getPositionX()+"DestroyNode");
                    }
                }
            } else {
                for (var i = 0; i <= this.arrayDestroyWait.length - 1; i++) {
                    this.arrayDestroy.push(this.arrayDestroyWait[i]);
                    // cc.log(this.arrayDestroy[i].getPositionX()+"DestroyNode");
                }
            }
        }
    },
    // //打开下落动作执行完成开关
    // StartActionDown:function(){
    //     this.isActionDown=true;
    // },
    //执行压缩变形移动动作
    ActionChangeShape: function ActionChangeShape(arrayChangeShape, fScale) {
        cc.log(arrayChangeShape.length + "arrayChangeShape");
        //初始化压缩形变动作
        var actionChangeShape = cc.scaleTo(this.fChangeShape, 1, fScale);
        //初始化恢复形变
        var actionResumeShape = cc.scaleTo(this.fChangeShape, 1, 1);
        //初始化存取噗呦块横坐标数组
        var arrayX = [];
        //初始化存取噗呦块纵坐标数组
        var arrayY = [];
        for (var i = 0; i <= arrayChangeShape.length - 1; i++) {
            arrayX.push(arrayChangeShape[i].getPositionX());
            arrayY.push(arrayChangeShape[i].getPositionY());
        }
        //遍历数组存取初始位置
        for (var i = 0; i <= arrayChangeShape.length - 1; i++) {
            //初始化该块向下移动的距离
            var nDownDistance = (1 + 2 * (arrayChangeShape.length - (i + 1))) * Global.nWidthPuYo * (1 - fScale) / 2;
            //初始化向下移动动作
            var actionMoveDown = cc.moveBy(this.fChangeShape, cc.p(0, -nDownDistance));
            //初始化向上移动动作
            var actionMoveUp = cc.moveBy(this.fChangeShape, cc.p(0, nDownDistance));
            //完成动作后初始化位置
            // var onloadPosition = cc.callFunc(this.LoadPosition(arrayChangeShape[i], arrayX[i], arrayY[i]));
            var onloadPosition = cc.callFunc(this.LoadPosition, this, { "node": arrayChangeShape[i], "positionX": arrayX[i], "positionY": arrayY[i] });
            if (i == arrayChangeShape.length - 1) {
                var actionStartShape = cc.callFunc(this.StartActionShape, this);
                //执行动作
                arrayChangeShape[i].runAction(cc.sequence(cc.spawn(actionChangeShape, actionMoveDown), cc.spawn(actionResumeShape, actionMoveUp), onloadPosition, actionStartShape));
            } else {
                // var actionStartShape = cc.callFunc(this.StartActionShape, this);
                //执行动作
                arrayChangeShape[i].runAction(cc.sequence(cc.spawn(actionChangeShape, actionMoveDown), cc.spawn(actionResumeShape, actionMoveUp), onloadPosition));
            }
            //   arrayChangeShape[i].runAction(cc.sequence(cc.spawn(actionChangeShape, actionMoveDown), onloadPosition));
        }
    },
    //打开形变动作完成开管
    StartActionShape: function StartActionShape() {
        this.nChangeShape++;
    },
    //从该噗呦块向下遍历并移动压缩变形
    ChangeShape: function ChangeShape(target, msgJson) {
        cc.log("ChangeShape" + msgJson.nRow);
        var boxParent1 = this.boxParent.getChildren();
        //初始化待变形数组
        this.arrayChangeShape = [];
        for (var i = msgJson.nRow; i >= 0; i--) {
            if (this.userGroundChild[msgJson.nLine][i].getComponent("BoxState").isBox) {
                for (var l = 0; l <= boxParent1.length - 1; l++) {
                    if (boxParent1[l].getPositionY() == this.userGroundChild[msgJson.nLine][i].getPositionY() && boxParent1[l].getPositionX() == this.userGroundChild[msgJson.nLine][i].getPositionX()) {
                        this.arrayChangeShape.push(boxParent1[l]);
                    }
                }
            }
            if (i == 0) {
                this.ActionChangeShape(this.arrayChangeShape, this.fScaleChange);
            }
        }
    },
    //打开下落动完成开关
    StartActionDown: function StartActionDown() {
        this.isActionDown = true;
    },
    //消除噗呦块后，上边的噗呦块下落
    DestroyDown: function DestroyDown(nRow, nLine) {
        cc.log(nRow + "BoxDown");
        var boxParent1 = this.boxParent.getChildren();
        //存取该噗呦块的行
        var nRow1 = nRow;
        for (var i = nRow - 1; i >= 0; i--) {
            if (this.userGroundChild[nLine][i].getComponent("BoxState").isBox) {
                //初始化下落动作
                var actionDown = cc.moveTo(this.fActionDown, cc.p(this.userGroundChild[nLine][i + 1].getPositionX(), this.userGroundChild[nLine][i + 1].getPositionY()));
                //执行变换图片动画，下落到最低点移动压缩变形
                //从方块数组中找到噗呦块
                for (var l = 0; l <= boxParent1.length - 1; l++) {
                    //执行变换图片动画，并移动压缩变形sssssssssssssss
                    if (boxParent1[l].getPositionY() == this.userGroundChild[nLine][nRow1].getPositionY() && boxParent1[l].getPositionX() == this.userGroundChild[nLine][nRow1].getPositionX()) {
                        boxParent1[l].rotation = 0;
                        // //播放变换噗呦小块动画
                        // boxParent1[l].getComponent(cc.Animation).play("1");
                        //初始位置回调
                        // var loadPosition = cc.callFunc(this.LoadPosition(boxParent1[l], this.userGroundChild[nLine][i + 1], this.userGroundChild[nLine][i + 1].getPositionY()));
                        var loadPosition = cc.callFunc(this.LoadPosition, this, { "node": boxParent1[l], "positionX": this.userGroundChild[nLine][i + 1].getPositionX(), "positionY": this.userGroundChild[nLine][i + 1].getPositionY() });
                        //下落变形回调函数
                        var changeShape1 = cc.callFunc(this.changeShape, this, { "nRow": i + 1, "nLine": nLine });
                        var isChangeShape = false;
                        for (var p = 0; p <= this.arrayChange.length - 1; p++) {
                            if (this.arrayDown[this.arrayChange[p]].getPositionX() == boxParent1[l].getPositionX() && this.arrayDown[this.arrayChange[p]].getPositionY() == boxParent1[l].getPositionY()) {
                                isChangeShape = true;
                            }
                        }
                        this.userGroundChild[nLine][nRow1].getComponent("BoxState").isBox = false;
                        this.userGroundChild[nLine][i + 1].getComponent("BoxState").isBox = true;
                        this.userGroundChild[nLine][i + 1].getComponent("BoxState").stringColor = boxParent1[l].getComponent("InitPrefabState").stringColor;
                        this.userGroundChild[nLine][nRow1].getComponent("BoxState").stringColor = "";
                        if (isChangeShape) {
                            var startChange = cc.callFunc(this.StartActionDown, this);
                            boxParent1[l].runAction(cc.sequence(actionDown, loadPosition, startChange));
                            //存取下落后待压缩噗呦块的行,列
                            this.nRow2 = i + 1;
                            this.nLine2 = nLine;
                        } else {
                            boxParent1[l].runAction(cc.sequence(actionDown, loadPosition));
                        }
                    }
                }
                break;
            }
            if (i == 0 && this.userGroundChild[nLine][0].getComponent("BoxState").isBox == false) {
                //初始化下落动作
                var actionDown = cc.moveTo(this.fActionDown, cc.p(this.userGroundChild[nLine][0].getPositionX(), this.userGroundChild[nLine][0].getPositionY()));
                //执行变换图片动画，下落到最低点移动压缩变形
                //从方块数组中找到噗呦块
                for (var l = 0; l <= boxParent1.length - 1; l++) {
                    //执行变换图片动画，并移动压缩变形sssssssssssssss
                    if (boxParent1[l].getPositionY() == this.userGroundChild[nLine][nRow1].getPositionY() && boxParent1[l].getPositionX() == this.userGroundChild[nLine][nRow1].getPositionX()) {
                        boxParent1[l].rotation = 0;
                        // //播放变换噗呦小块动画
                        // boxParent1[l].getComponent(cc.Animation).play("1");
                        //初始位置回调
                        // var loadPosition = cc.callFunc(this.LoadPosition(boxParent1[l], this.userGroundChild[nLine][i + 1], this.userGroundChild[nLine][i + 1].getPositionY()));
                        var loadPosition = cc.callFunc(this.LoadPosition, this, { "node": boxParent1[l], "positionX": this.userGroundChild[nLine][0].getPositionX(), "positionY": this.userGroundChild[nLine][0].getPositionY() });
                        //下落变形回调函数
                        var changeShape1 = cc.callFunc(this.changeShape, this, { "nRow": 0, "nLine": nLine });
                        var isChangeShape = false;
                        for (var p = 0; p <= this.arrayChange.length - 1; p++) {
                            if (this.arrayDown[this.arrayChange[p]].getPositionX() == boxParent1[l].getPositionX() && this.arrayDown[this.arrayChange[p]].getPositionY() == boxParent1[l].getPositionY()) {
                                isChangeShape = true;
                            }
                        }
                        this.userGroundChild[nLine][nRow1].getComponent("BoxState").isBox = false;
                        this.userGroundChild[nLine][0].getComponent("BoxState").isBox = true;
                        this.userGroundChild[nLine][0].getComponent("BoxState").stringColor = boxParent1[l].getComponent("InitPrefabState").stringColor;
                        this.userGroundChild[nLine][nRow1].getComponent("BoxState").stringColor = "";
                        // boxParent1[l].runAction(cc.sequence(actionDown, loadPosition));
                        if (isChangeShape) {
                            var startChange = cc.callFunc(this.StartActionDown, this);
                            boxParent1[l].runAction(cc.sequence(actionDown, loadPosition, startChange));
                            //存取下落后待压缩噗呦块的行,列
                            this.nRow2 = 0;
                            this.nLine2 = nLine;
                        } else {
                            boxParent1[l].runAction(cc.sequence(actionDown, loadPosition));
                        }
                    }
                }
            }
        }
    },
    //从该方块向下便利并下落
    BoxDown: function BoxDown(nRow, nLine) {
        cc.log(nRow + "BoxDown");
        var boxParent1 = this.boxParent.getChildren();
        //存取该噗呦块的行
        var nRow1 = nRow;
        if (nRow == 0) {
            //从方块数组中找到噗呦块
            for (var l = 0; l <= boxParent1.length - 1; l++) {
                //执行变换图片动画，并移动压缩变形
                if (boxParent1[l].getPositionY() == this.userGroundChild[nLine][0].getPositionY() && boxParent1[l].getPositionX() == this.userGroundChild[nLine][0].getPositionX()) {
                    this.userGroundChild[nLine][0].getComponent("BoxState").isBox = true;
                    this.userGroundChild[nLine][0].getComponent("BoxState").stringColor = boxParent1[l].getComponent("InitPrefabState").stringColor;
                    //初始化噗呦块角度
                    boxParent1[l].rotation = 0;
                    // //播放变换噗呦小块动画
                    // boxParent1[l].getComponent(cc.Animation).play("1");
                    var isChangeShape = false; //是否变形判断
                    for (var p = 0; p <= this.arrayChange.length - 1; p++) {
                        if (this.arrayDown[this.arrayChange[p]].getPositionX() == boxParent1[l].getPositionX() && this.arrayDown[this.arrayChange[p]].getPositionY() == boxParent1[l].getPositionY()) {
                            isChangeShape = true;
                        }
                    }
                    if (isChangeShape) {
                        //执行压缩变形
                        this.ChangeShape(this, { "nRow": 0, "nLine": nLine });
                    }
                }
            }
        } else {
            for (var i = nRow - 1; i >= 0; i--) {
                if (this.userGroundChild[nLine][i].getComponent("BoxState").isBox) {
                    if (nRow1 - i <= 1) {
                        //从方块数组中找到噗呦块
                        for (var l = 0; l <= boxParent1.length - 1; l++) {
                            //执行变换图片动画，并移动压缩变形
                            if (boxParent1[l].getPositionY() == this.userGroundChild[nLine][nRow1].getPositionY() && boxParent1[l].getPositionX() == this.userGroundChild[nLine][nRow1].getPositionX()) {
                                this.userGroundChild[nLine][nRow1].getComponent("BoxState").isBox = true;
                                this.userGroundChild[nLine][nRow1].getComponent("BoxState").stringColor = boxParent1[l].getComponent("InitPrefabState").stringColor;
                                boxParent1[l].rotation = 0;
                                // //播放变换噗呦小块动画
                                // boxParent1[l].getComponent(cc.Animation).play("1");
                                var isChangeShape = false;
                                for (var p = 0; p <= this.arrayChange.length - 1; p++) {
                                    if (this.arrayDown[this.arrayChange[p]].getPositionX() == boxParent1[l].getPositionX() && this.arrayDown[this.arrayChange[p]].getPositionY() == boxParent1[l].getPositionY()) {
                                        isChangeShape = true;
                                    }
                                }
                                if (isChangeShape) {
                                    cc.log("===================1111111111111111111111111111");
                                    //执行压缩变形
                                    this.ChangeShape(this, { "nRow": nRow1, "nLine": nLine });
                                }
                            }
                        }
                    } else {
                        cc.log("////////////////////////");
                        //初始化下落动作
                        var actionDown = cc.moveTo(this.fActionDown, cc.p(this.userGroundChild[nLine][i + 1].getPositionX(), this.userGroundChild[nLine][i + 1].getPositionY()));
                        //执行变换图片动画，下落到最低点移动压缩变形
                        //从方块数组中找到噗呦块
                        for (var l = 0; l <= boxParent1.length - 1; l++) {
                            //执行变换图片动画，并移动压缩变形sssssssssssssss
                            if (boxParent1[l].getPositionY() == this.userGroundChild[nLine][nRow1].getPositionY() && boxParent1[l].getPositionX() == this.userGroundChild[nLine][nRow1].getPositionX()) {
                                boxParent1[l].rotation = 0;
                                // //播放变换噗呦小块动画
                                // boxParent1[l].getComponent(cc.Animation).play("1");
                                //初始位置回调
                                // var loadPosition = cc.callFunc(this.LoadPosition(boxParent1[l], this.userGroundChild[nLine][i + 1], this.userGroundChild[nLine][i + 1].getPositionY()));
                                var loadPosition = cc.callFunc(this.LoadPosition, this, { "node": boxParent1[l], "positionX": this.userGroundChild[nLine][i + 1].getPositionX(), "positionY": this.userGroundChild[nLine][i + 1].getPositionY() });
                                //下落变形回调函数
                                var changeShape1 = cc.callFunc(this.changeShape, this, { "nRow": i + 1, "nLine": nLine });
                                var isChangeShape = false;
                                for (var p = 0; p <= this.arrayChange.length - 1; p++) {
                                    if (this.arrayDown[this.arrayChange[p]].getPositionX() == boxParent1[l].getPositionX() && this.arrayDown[this.arrayChange[p]].getPositionY() == boxParent1[l].getPositionY()) {
                                        isChangeShape = true;
                                    }
                                }
                                this.userGroundChild[nLine][nRow1].getComponent("BoxState").isBox = false;
                                this.userGroundChild[nLine][i + 1].getComponent("BoxState").isBox = true;
                                this.userGroundChild[nLine][i + 1].getComponent("BoxState").stringColor = boxParent1[l].getComponent("InitPrefabState").stringColor;
                                this.userGroundChild[nLine][nRow1].getComponent("BoxState").stringColor = "";
                                if (isChangeShape) {
                                    var startChange = cc.callFunc(this.StartActionDown, this);
                                    boxParent1[l].runAction(cc.sequence(actionDown, loadPosition, startChange));
                                    //存取下落后待压缩噗呦块的行,列
                                    this.nRow2 = i + 1;
                                    this.nLine2 = nLine;
                                } else {
                                    boxParent1[l].runAction(cc.sequence(actionDown, loadPosition));
                                }
                            }
                        }
                    }
                    break;
                }
                if (i == 0 && this.userGroundChild[nLine][0].getComponent("BoxState").isBox == false) {
                    //初始化下落动作
                    var actionDown = cc.moveTo(this.fActionDown, cc.p(this.userGroundChild[nLine][0].getPositionX(), this.userGroundChild[nLine][0].getPositionY()));
                    //执行变换图片动画，下落到最低点移动压缩变形
                    //从方块数组中找到噗呦块
                    for (var l = 0; l <= boxParent1.length - 1; l++) {
                        //执行变换图片动画，并移动压缩变形sssssssssssssss
                        if (boxParent1[l].getPositionY() == this.userGroundChild[nLine][nRow1].getPositionY() && boxParent1[l].getPositionX() == this.userGroundChild[nLine][nRow1].getPositionX()) {
                            boxParent1[l].rotation = 0;
                            // //播放变换噗呦小块动画
                            // boxParent1[l].getComponent(cc.Animation).play("1");
                            //初始位置回调
                            // var loadPosition = cc.callFunc(this.LoadPosition(boxParent1[l], this.userGroundChild[nLine][i + 1], this.userGroundChild[nLine][i + 1].getPositionY()));
                            var loadPosition = cc.callFunc(this.LoadPosition, this, { "node": boxParent1[l], "positionX": this.userGroundChild[nLine][0].getPositionX(), "positionY": this.userGroundChild[nLine][0].getPositionY() });
                            //下落变形回调函数
                            var changeShape1 = cc.callFunc(this.changeShape, this, { "nRow": 0, "nLine": nLine });
                            var isChangeShape = false;
                            for (var p = 0; p <= this.arrayChange.length - 1; p++) {
                                if (this.arrayDown[this.arrayChange[p]].getPositionX() == boxParent1[l].getPositionX() && this.arrayDown[this.arrayChange[p]].getPositionY() == boxParent1[l].getPositionY()) {
                                    isChangeShape = true;
                                }
                            }
                            this.userGroundChild[nLine][nRow1].getComponent("BoxState").isBox = false;
                            this.userGroundChild[nLine][0].getComponent("BoxState").isBox = true;
                            this.userGroundChild[nLine][0].getComponent("BoxState").stringColor = boxParent1[l].getComponent("InitPrefabState").stringColor;
                            this.userGroundChild[nLine][nRow1].getComponent("BoxState").stringColor = "";
                            // boxParent1[l].runAction(cc.sequence(actionDown, loadPosition));
                            if (isChangeShape) {
                                var startChange = cc.callFunc(this.StartActionDown, this);
                                boxParent1[l].runAction(cc.sequence(actionDown, loadPosition, startChange));
                                //存取下落后待压缩噗呦块的行,列
                                this.nRow2 = 0;
                                this.nLine2 = nLine;
                            } else {
                                boxParent1[l].runAction(cc.sequence(actionDown, loadPosition));
                            }
                        }
                    }
                }
            }
        }
    },
    //根据行列遍历背景方格的颜色,并消除
    DisappearBox: function DisappearBox() {},
    //根据下落噗呦行列判断可消除噗呦块的行列
    GetDisappearBox: function GetDisappearBox() {},
    //随机生成噗呦噗呦方块
    GetBlock: function GetBlock() {
        //根据随机数随机设置方块的颜色数量
        var nRandomNum = Math.floor(cc.random0To1() * 2);
        this.nColor = 0;
        this.stringColor = "";
        this.stringColor1 = "";

        if (nRandomNum == 1) {
            //颜色数量
            this.nColor1 = 1;
            //随机颜色
            var stringRandom = Math.floor(cc.random0To1() * 3);
            switch (stringRandom) {
                //随机颜色为红色
                case 0:
                    this.stringColor = "red";
                    break;
                //随机颜色为蓝色
                case 1:
                    this.stringColor = "blue";
                    break;
                //随机颜色为绿色
                case 2:
                    this.stringColor = "green";
                    break;
            }
        } else {
            this.nColor1 = 2;
            //随机颜色
            var stringRandom = Math.floor(cc.random0To1() * 3);
            cc.log(stringRandom);
            switch (stringRandom) {
                case 0:
                    this.stringColor = "blue";
                    this.stringColor1 = "green";
                    break;
                case 1:
                    this.stringColor = "red";
                    this.stringColor1 = "green";
                    break;
                case 2:
                    this.stringColor = "red";
                    this.stringColor1 = "blue";
                    break;
            }
        }
        //声明颜色数组s
        //   this.colorBlock=["blue","green","red"];
        //声明形状数组
        this.shapeBlock = ["L", "Long", "Square"];
        this.nColor = Math.floor(cc.random0To1() * 3);
        this.nShape = Math.floor(cc.random0To1() * 3);
        this.nRotate = Math.floor(cc.random0To1() * 2);

        //根据浦友浦友形状生成
        this.IsShape(this.shapeBlock, this.nShape);
    },
    //根据噗呦方块类型设置位置
    setBlockPosition: function setBlockPosition(stringShape1) {
        switch (stringShape1) {
            case "Square":
                var v2WorldY = this.groundParent.getPositionY() + 12 * Global.nWidthPuYo + Global.nWidthPuYo / 2;
                var v1WorldX = this.groundParent.getPositionX() + 2 * Global.nWidthPuYo + Global.nWidthPuYo / 2;
                return cc.p(v1WorldX, v2WorldY);
                break;
            case "L":
                var v2WorldY = this.groundParent.getPositionY() + 12 * Global.nWidthPuYo;
                var v1WorldX = this.groundParent.getPositionX() + 2 * Global.nWidthPuYo;
                return cc.p(v1WorldX, v2WorldY);
                break;
            case "Long":
                var v2WorldY = this.groundParent.getPositionY() + 12 * Global.nWidthPuYo;
                var v1WorldX = this.groundParent.getPositionX() + 2 * Global.nWidthPuYo;
                return cc.p(v1WorldX, v2WorldY);
                break;
        }
    },
    //判断方块形状
    IsShape: function IsShape(stringShape, nShape) {
        switch (stringShape[nShape]) {
            case "L":
                //生成方块
                this.CopyBlock(this.prefabL, "L");
                var nodeBlockChild = this.nodeBlock.getChildren();
                cc.log(this.nodeBlock.getPosition());
                var self = this;
                // var self = this;
                if (this.nColor1 == 1) {
                    self.nodeBlock.getComponent("PuyoDown").nColor = 1;
                    // nodeBlockChild[0].rotation=90;
                    cc.loader.loadRes("Game2/" + self.stringColor, cc.SpriteFrame, function (err, txt) {
                        nodeBlockChild[0].getComponent(cc.Sprite).spriteFrame = txt;
                        nodeBlockChild[0].getComponent("InitPrefabState").stringColor = self.stringColor;
                    });
                    var nRandom = Math.floor(cc.random0To1() * 2);
                    if (nRandom == 0) {
                        cc.loader.loadRes("Game2/" + self.stringColor, cc.SpriteFrame, function (err, txt) {
                            nodeBlockChild[1].getComponent(cc.Sprite).spriteFrame = txt;
                            nodeBlockChild[1].getComponent("InitPrefabState").stringColor = self.stringColor;
                        });
                        cc.loader.loadRes("Game2/" + self.stringColor, cc.SpriteFrame, function (err, txt) {
                            nodeBlockChild[2].getComponent(cc.Sprite).spriteFrame = txt;
                            nodeBlockChild[2].getComponent("InitPrefabState").stringColor = self.stringColor;
                        });
                    } else {
                        cc.loader.loadRes("Game2/" + self.stringColor, cc.SpriteFrame, function (err, txt) {
                            nodeBlockChild[1].getComponent(cc.Sprite).spriteFrame = txt;
                            nodeBlockChild[1].getComponent("InitPrefabState").stringColor = self.stringColor;
                        });
                        cc.loader.loadRes("Game2/" + self.stringColor, cc.SpriteFrame, function (err, txt) {
                            nodeBlockChild[2].getComponent(cc.Sprite).spriteFrame = txt;
                            nodeBlockChild[2].getComponent("InitPrefabState").stringColor = self.stringColor;
                        });
                    }
                } else {
                    self.nodeBlock.getComponent("PuyoDown").nColor = 2;
                    cc.loader.loadRes("Game2/" + self.stringColor, cc.SpriteFrame, function (err, txt) {
                        nodeBlockChild[0].getComponent(cc.Sprite).spriteFrame = txt;
                        nodeBlockChild[0].getComponent("InitPrefabState").stringColor = self.stringColor;
                    });
                    var nRandom = Math.floor(cc.random0To1() * 2);
                    if (nRandom == 0) {
                        cc.loader.loadRes("Game2/" + self.stringColor, cc.SpriteFrame, function (err, txt) {
                            nodeBlockChild[1].getComponent(cc.Sprite).spriteFrame = txt;
                            nodeBlockChild[1].getComponent("InitPrefabState").stringColor = self.stringColor;
                        });
                        cc.loader.loadRes("Game2/" + self.stringColor1, cc.SpriteFrame, function (err, txt) {
                            nodeBlockChild[2].getComponent(cc.Sprite).spriteFrame = txt;
                            nodeBlockChild[2].getComponent("InitPrefabState").stringColor = self.stringColor1;
                        });
                    } else {
                        nodeBlockChild[0].rotation = 90;
                        cc.loader.loadRes("Game2/" + self.stringColor1, cc.SpriteFrame, function (err, txt) {
                            nodeBlockChild[1].getComponent(cc.Sprite).spriteFrame = txt;
                            nodeBlockChild[1].getComponent("InitPrefabState").stringColor = self.stringColor1;
                        });
                        cc.loader.loadRes("Game2/" + self.stringColor, cc.SpriteFrame, function (err, txt) {
                            nodeBlockChild[2].getComponent(cc.Sprite).spriteFrame = txt;
                            nodeBlockChild[2].getComponent("InitPrefabState").stringColor = self.stringColor;
                        });
                    }
                }
                //  //判断方块颜色
                //  this.IsColor(this.colorBlock,this.nColor);
                //  this.IsRotate(this.rotateBlock,this.nRotate,"T");     
                //  this.nRotateAngle   
                break;
            case "Long":
                this.CopyBlock(this.prefabLong, "Long");
                var self = this;
                var nodeBlockChild = this.nodeBlock.getChildren();
                cc.log(this.nodeBlock.getPosition());
                if (this.nColor1 == 1) {
                    self.nodeBlock.getComponent("PuyoDown").nColor = 1;
                    cc.loader.loadRes("Game2/" + self.stringColor, cc.SpriteFrame, function (err, txt) {
                        nodeBlockChild[0].getComponent(cc.Sprite).spriteFrame = txt;
                        nodeBlockChild[0].getComponent("InitPrefabState").stringColor = self.stringColor;
                    });
                    cc.loader.loadRes("Game2/" + self.stringColor, cc.SpriteFrame, function (err, txt) {
                        nodeBlockChild[1].getComponent(cc.Sprite).spriteFrame = txt;
                        nodeBlockChild[1].getComponent("InitPrefabState").stringColor = self.stringColor;
                    });
                } else {
                    self.nodeBlock.getComponent("PuyoDown").nColor = 2;
                    cc.loader.loadRes("Game2/" + self.stringColor, cc.SpriteFrame, function (err, txt) {
                        nodeBlockChild[0].getComponent(cc.Sprite).spriteFrame = txt;
                        nodeBlockChild[0].getComponent("InitPrefabState").stringColor = self.stringColor;
                    });
                    cc.log("Long" + this.stringColor1);
                    cc.loader.loadRes("Game2/" + self.stringColor1, cc.SpriteFrame, function (err, txt) {
                        nodeBlockChild[1].getComponent(cc.Sprite).spriteFrame = txt;
                        cc.log("Long" + nodeBlockChild[1].getComponent(cc.Sprite).spriteFrame);
                        nodeBlockChild[1].getComponent("InitPrefabState").stringColor = self.stringColor1;
                    });
                }
                //  this.CopyBlock(this.prefabLong,"Long");
                //  //判断方块颜色
                //  this.IsColor(this.colorBlock,this.nColor);   
                //  this.IsRotate(this.rotateBlock,this.nRotate,"Long");     
                break;
            case "Square":
                var self = this;
                if (this.nColor1 == 1) {
                    this.CopyBlock(this.prefabSquare1, "Square");
                    var nodeBlockChild = this.nodeBlock.getChildren();
                    switch (this.stringColor) {
                        case "red":
                            for (var i = 0; i <= 3; i++) {
                                nodeBlockChild[i].getComponent(cc.Animation).play("ChangeRed");
                                nodeBlockChild[i].getComponent("InitPrefabState").stringColor = "red";
                            }
                            this.nodeBlock.getComponent("PuyoDown").nColor = 1;
                            break;
                        case "green":
                            for (var i = 0; i <= 3; i++) {
                                nodeBlockChild[i].getComponent(cc.Animation).play("ChangeGreen");
                                nodeBlockChild[i].getComponent("InitPrefabState").stringColor = "green";
                            }
                            this.nodeBlock.getComponent("PuyoDown").nColor = 1;
                            break;
                        case "blue":
                            for (var i = 0; i <= 3; i++) {
                                nodeBlockChild[i].getComponent("InitPrefabState").stringColor = "blue";
                            }
                            this.nodeBlock.getComponent("PuyoDown").nColor = 1;
                            break;
                    }
                    cc.log(this.nodeBlock.getPosition());
                    // cc.log(self.stringColor);
                    // cc.log(self.nodeBlock);
                    // cc.loader.loadRes("Game2/1" + self.stringColor, cc.SpriteFrame, function (err, txt) {
                    //     self.nodeBlock.getComponent(cc.Sprite).spriteFrame = txt;
                    //     self.nodeBlock.getComponent("InitPrefabState").stringColor = self.stringColor;
                    //     self.nodeBlock.getComponent("PuyoDown").nColor = 1;
                    // });
                } else {
                    this.CopyBlock(this.prefabSquare, "Square");
                    cc.log(this.nodeBlock.getPosition());
                    var nodeBlockChild = this.nodeBlock.getChildren();
                    var nRandom = Math.floor(cc.random0To1() * 2);
                    if (nRandom == 0) {
                        switch (this.stringColor) {
                            case "red":
                                nodeBlockChild[0].getComponent("InitPrefabState").stringColor = "red";
                                nodeBlockChild[2].getComponent("InitPrefabState").stringColor = "red";
                                break;
                            case "green":
                                nodeBlockChild[0].getComponent("InitPrefabState").stringColor = "green";
                                nodeBlockChild[2].getComponent("InitPrefabState").stringColor = "green";
                                nodeBlockChild[0].getComponent(cc.Animation).play("ChangeGreen1");
                                nodeBlockChild[2].getComponent(cc.Animation).play("ChangeGreen1");
                                break;
                            case "blue":
                                nodeBlockChild[0].getComponent("InitPrefabState").stringColor = "blue";
                                nodeBlockChild[2].getComponent("InitPrefabState").stringColor = "blue";
                                nodeBlockChild[0].getComponent(cc.Animation).play("ChangeBlue1");
                                nodeBlockChild[2].getComponent(cc.Animation).play("ChangeBlue1");
                                break;
                        }
                        switch (this.stringColor1) {
                            case "red":
                                nodeBlockChild[1].getComponent("InitPrefabState").stringColor = "red";
                                nodeBlockChild[3].getComponent("InitPrefabState").stringColor = "red";
                                nodeBlockChild[1].getComponent(cc.Animation).play("ChangeRed1");
                                nodeBlockChild[3].getComponent(cc.Animation).play("ChangeRed1");
                                break;
                            case "green":
                                nodeBlockChild[1].getComponent("InitPrefabState").stringColor = "green";
                                nodeBlockChild[3].getComponent("InitPrefabState").stringColor = "green";
                                nodeBlockChild[1].getComponent(cc.Animation).play("ChangeGreen1");
                                nodeBlockChild[3].getComponent(cc.Animation).play("ChangeGreen1");
                                break;
                            case "blue":
                                nodeBlockChild[1].getComponent("InitPrefabState").stringColor = "blue";
                                nodeBlockChild[3].getComponent("InitPrefabState").stringColor = "blue";
                                // nodeBlockChild[1].getComponent(cc.Animation).play("ChangeBlue1");
                                // nodeBlockChild[3].getComponent(cc.Animation).play("ChangeBlue1");
                                break;
                        }
                        this.nodeBlock.getComponent("PuyoDown").nColor = 2;
                    } else {
                        switch (this.stringColor1) {
                            case "red":
                                nodeBlockChild[0].getComponent("InitPrefabState").stringColor = "red";
                                nodeBlockChild[2].getComponent("InitPrefabState").stringColor = "red";
                                break;
                            case "green":
                                nodeBlockChild[0].getComponent("InitPrefabState").stringColor = "green";
                                nodeBlockChild[2].getComponent("InitPrefabState").stringColor = "green";
                                nodeBlockChild[0].getComponent(cc.Animation).play("ChangeGreen1");
                                nodeBlockChild[2].getComponent(cc.Animation).play("ChangeGreen1");
                                break;
                            case "blue":
                                nodeBlockChild[0].getComponent("InitPrefabState").stringColor = "blue";
                                nodeBlockChild[2].getComponent("InitPrefabState").stringColor = "blue";
                                nodeBlockChild[0].getComponent(cc.Animation).play("ChangeBlue1");
                                nodeBlockChild[2].getComponent(cc.Animation).play("ChangeBlue1");
                                break;
                        }
                        switch (this.stringColor) {
                            case "red":
                                nodeBlockChild[1].getComponent("InitPrefabState").stringColor = "red";
                                nodeBlockChild[3].getComponent("InitPrefabState").stringColor = "red";
                                nodeBlockChild[1].getComponent(cc.Animation).play("ChangeRed1");
                                nodeBlockChild[3].getComponent(cc.Animation).play("ChangeRed1");
                                break;
                            case "green":
                                nodeBlockChild[1].getComponent("InitPrefabState").stringColor = "green";
                                nodeBlockChild[3].getComponent("InitPrefabState").stringColor = "green";
                                nodeBlockChild[1].getComponent(cc.Animation).play("ChangeGreen1");
                                nodeBlockChild[3].getComponent(cc.Animation).play("ChangeGreen1");
                                break;
                            case "blue":
                                nodeBlockChild[1].getComponent("InitPrefabState").stringColor = "blue";
                                nodeBlockChild[3].getComponent("InitPrefabState").stringColor = "blue";
                                // nodeBlockChild[1].getComponent(cc.Animation).play("ChangeBlue1");
                                // nodeBlockChild[3].getComponent(cc.Animation).play("ChangeBlue1");
                                break;
                        }
                        this.nodeBlock.getComponent("PuyoDown").nColor = 2;
                    }
                    // if (nRandom == 0) {

                    //     // cc.loader.loadRes("Game2/1" + self.stringColor, cc.SpriteFrame, function (err, txt) {
                    //     //     nodeBlockChild[0].getComponent(cc.Sprite).spriteFrame = txt;
                    //     //     nodeBlockChild[0].getComponent("InitPrefabState").stringColor = self.stringColor;
                    //     //     nodeBlockChild[0].getComponent("InitPrefabState").nColor = 2;
                    //     // });
                    //     // cc.loader.loadRes("Game2/1" + self.stringColor1, cc.SpriteFrame, function (err, txt) {
                    //     //     nodeBlockChild[1].getComponent(cc.Sprite).spriteFrame = txt;
                    //     //     nodeBlockChild[1].getComponent("InitPrefabState").stringColor = self.stringColor1;

                    //     // });
                    //     // this.nodeBlock.getComponent("PuyoDown").nColor = 2;
                    // }
                    // else {
                    //     switch (this.stringColor1) {
                    //         case "red":
                    //             nodeBlockChild[0].getComponent("InitPrefabState").stringColor = "red";
                    //             nodeBlockChild[2].getComponent("InitPrefabState").stringColor = "red";   
                    //             break;
                    //         case "green":
                    //             nodeBlockChild[0].getComponent("InitPrefabState").stringColor = "green";
                    //             nodeBlockChild[2].getComponent("InitPrefabState").stringColor = "green";
                    //             nodeBlockChild[0].getComponent(cc.Animation).play("ChangeGreen1");
                    //             nodeBlockChild[2].getComponent(cc.Animation).play("ChangeGreen1");      
                    //             break;
                    //         case "blue":
                    //             nodeBlockChild[0].getComponent("InitPrefabState").stringColor = "blue";
                    //             nodeBlockChild[2].getComponent("InitPrefabState").stringColor = "blue";
                    //             nodeBlockChild[0].getComponent(cc.Animation).play("ChangeBlue1");
                    //             nodeBlockChild[2].getComponent(cc.Animation).play("ChangeBlue1");
                    //             break;
                    //     }
                    //     switch (this.stringColor) {
                    //         case "red":
                    //             nodeBlockChild[1].getComponent("InitPrefabState").stringColor = "red";
                    //             nodeBlockChild[3].getComponent("InitPrefabState").stringColor = "red";
                    //             nodeBlockChild[1].getComponent(cc.Animation).play("ChangeRed1");
                    //             nodeBlockChild[3].getComponent(cc.Animation).play("ChangeRed1");    
                    //             break;
                    //         case "green":
                    //             nodeBlockChild[1].getComponent("InitPrefabState").stringColor = "green";
                    //             nodeBlockChild[3].getComponent("InitPrefabState").stringColor = "green";
                    //             nodeBlockChild[1].getComponent(cc.Animation).play("ChangeGreen1");
                    //             nodeBlockChild[3].getComponent(cc.Animation).play("ChangeGreen1");  
                    //             break;
                    //         case "blue":
                    //             nodeBlockChild[1].getComponent("InitPrefabState").stringColor = "blue";
                    //             nodeBlockChild[3].getComponent("InitPrefabState").stringColor = "blue";
                    //             // nodeBlockChild[1].getComponent(cc.Animation).play("ChangeBlue1");
                    //             // nodeBlockChild[3].getComponent(cc.Animation).play("ChangeBlue1");
                    //             break;
                    //     }
                    //     this.nodeBlock.getComponent("PuyoDown").nColor = 2;
                    // }
                }
                break;
        }
    },
    //遍历噗呦方块并随机赋值位置
    CreatPosition: function CreatPosition() {
        //存取方块的 固定行列数组
        this.nodeBlock.setPosition(this.setBlockPosition(this.shapeBlock[this.nShape]));
    },
    //生成方块
    CopyBlock: function CopyBlock(prefabLBlock, stringShape1) {
        //生成噗呦方块
        this.nodeBlock = cc.instantiate(prefabLBlock);
        //设置方块的父体
        this.nodeBlock.parent = this.downBoxParent;
        //获取此时方块的形状
        this.nodeBlock.getComponent("PuyoDown").stringBoloekShape = stringShape1;
        //存取方块的 固定行列数组
        this.nodeBlock.setPosition(this.setBlockPosition(this.shapeBlock[this.nShape]));
        // this.nodeBlock.setPosition(0,0);
    },
    //获取子块在地板父体下的坐标
    GetBoxNode: function GetBoxNode(childBox) {
        if (this.nodeBlock.getComponent("PuyoDown").stringBoloekShape == "Long" && this.nodeBlock.getComponent("PuyoDown").nColor == 2) {
            this.nPositionX = childBox.getPositionX();
            this.nPositionY = childBox.getPositionY();
        } else {
            switch (this.nodeBlock.getComponent("PuyoDown").nRotateAngle) {
                case 0:
                    //赋值实际坐标
                    this.nPositionX = childBox.getPositionX();
                    this.nPositionY = childBox.getPositionY();
                    break;
                case 90:
                    this.nPositionX = childBox.getPositionY();
                    this.nPositionY = -childBox.getPositionX();
                    break;
                case 180:
                    this.nPositionX = -childBox.getPositionX();
                    this.nPositionY = -childBox.getPositionY();
                    break;
                case 270:
                    this.nPositionX = -childBox.getPositionY();
                    this.nPositionY = childBox.getPositionX();
                    break;
            }
        }
        //获取子块在地板附体下的行列
        var nX = (this.nPositionX + this.nodeBlock.getPositionX() - this.groundParent.getPositionX()) / Global.nWidthPuYo + 1;
        var nY = (this.nPositionY + this.nodeBlock.getPositionY() - this.groundParent.getPositionY()) / Global.nWidthPuYo + 1;
        cc.log(nX);
        cc.log(nY);
        var x = this.userGroundChild[nX - 1][nY - 1].getPositionX();
        var y = this.userGroundChild[nX - 1][nY - 1].getPositionY();
        return cc.p(x, y);
    },
    start: function start() {},

    //遍历带下落数组并判断可执行压缩噗呦块的下标
    GetShapeSign: function GetShapeSign(array) {
        //初始化可压缩噗呦块数组
        this.arrayChange = [];
        var arrayLine = [];
        for (var i = 0; i <= array.length - 1; i++) {
            inner: for (var j = 0; j <= array.length - 1; j++) {
                if (array[i].getPositionX() == array[j].getPositionX() && array[i].getPositionY() == array[j].getPositionY()) {
                    continue inner;
                } else {
                    if (array[i].getPositionX() == array[j].getPositionX()) {
                        if (array[i].getPositionY() > array[j].getPositionY()) {
                            if (this.arrayChange.includes(i)) {
                                continue inner;
                            } else {
                                arrayLine.push(array[i].getPositionX());
                                this.arrayChange.push(i);
                            }
                        }
                    } else {
                        if (this.arrayChange.includes(i)) {
                            continue inner;
                        } else {
                            //判断此噗呦块是否是一列中最高的
                            var isTall = false;
                            for (var k = 0; k <= array.length - 1; k++) {
                                if (array[i].getPositionY() < array[k].getPositionY()) {
                                    if (array[i].getPositionX() == array[k].getPositionX()) {
                                        isTall = true;
                                    }
                                }
                                if (k == array.length - 1 && isTall == false) {
                                    this.arrayChange.push(i);
                                }
                            }
                            // if (array[i].getPositionY() > array[j].getPositionY()) {
                            //     if (this.arrayChange.includes(i)) {
                            //         continue inner;

                            //     }
                            //     else {
                            //         if (arrayLine.includes(array[i].getPositionX())) {
                            //             continue inner;
                            //         }
                            //         else {
                            //             arrayLine.push(array[i].getPositionX());
                            //             this.arrayChange.push(i);
                            //         }
                            //     }
                            // }
                            // else {
                            //     if (this.arrayChange.includes(j)) {
                            //         continue inner;
                            //     }
                            //     else {
                            //         if (arrayLine.includes(array[j].getPositionX())) {
                            //             continue inner;
                            //         }
                            //         else {
                            //             arrayLine.push(array[j].getPositionX());
                            //             this.arrayChange.push(j);
                            //         }
                            //     }
                            // }
                        }
                        //                   
                        // if (arrayLine.includes(array[i].getPositionX())) {
                        //     continue inner;
                        // }
                        // else {
                        //     arrayLine.push(array[i].getPositionX());
                        //     this.arrayChange.push(i);
                        // }
                    }
                }
            }
        }
    },
    //根据坐标计算噗呦块的行数
    CountRow: function CountRow(fPositinoY) {
        var nRow = fPositinoY / Global.nWidthPuYo;
        return nRow;
    },
    //根据坐标计算噗呦块的列数
    CountLine: function CountLine(fPositinoX) {
        var nLine = fPositinoX / Global.nWidthPuYo;
        return nLine;
    },
    //根据不同的方向确定要改变的形状
    SureShape: function SureShape(nArratLength, row, line, arraySign) {
        cc.log();
        var arrayBox = this.boxParent.getChildren();
        switch (nArratLength) {
            case 0:
                for (var i = 0; i <= this.arrayDown.length - 1 - 1; i++) {
                    if (this.arrayDown[i].getPositionX() == arrayBox[arraySign].getPositionX() && this.arrayDown[i].getPositionY() == arrayBox[arraySign].getPositionY()) {
                        //判断此噗呦块是否是本次下落数组中的噗呦块
                        this.arrayPositionX.push(arrayBox[arraySign].getPositionX());
                        this.arrayPositionY.push(arrayBox[arraySign].getPositionY());
                    }
                }
                break;
            case 1:
                switch (this.stringConnectDirection) {
                    case "1":
                        for (var i = 0; i <= this.arrayDown.length - 1; i++) {
                            if (this.arrayDown[i].getPositionX() == arrayBox[arraySign].getPositionX() && this.arrayDown[i].getPositionY() == arrayBox[arraySign].getPositionY()) {
                                //判断此噗呦块是否是本次下落数组中的噗呦块
                                this.arrayPositionX.push(arrayBox[arraySign].getPositionX());
                                this.arrayPositionY.push(arrayBox[arraySign].getPositionY());
                            }
                        }
                        arrayBox[arraySign].destroy();
                        arrayBox[arraySign].setPosition(-1000, -1000);
                        //生成新噗呦块
                        var nodePuyo = cc.instantiate(this.prefab1);
                        var nodeChild = nodePuyo.getChildren();
                        nodePuyo.parent = this.boxParent;
                        nodePuyo.setPosition(this.userGroundChild[line][row].getPositionX(), this.userGroundChild[line][row].getPositionY());

                        switch (this.userGroundChild[line][row].getComponent("BoxState").stringColor) {
                            case "blue":
                                nodeChild[0].rotation = 180;
                                break;
                            case "red":
                                nodeChild[0].getComponent(cc.Animation).play("Change2B_1Red");
                                nodeChild[0].rotation = 180;
                                break;
                            case "green":
                                nodeChild[0].getComponent(cc.Animation).play("Change2B_1Green");
                                nodeChild[0].rotation = 180;
                                break;
                        }
                        break;
                    case "2":
                        for (var i = 0; i <= this.arrayDown.length - 1; i++) {
                            if (this.arrayDown[i].getPositionX() == arrayBox[arraySign].getPositionX() && this.arrayDown[i].getPositionY() == arrayBox[arraySign].getPositionY()) {
                                //判断此噗呦块是否是本次下落数组中的噗呦块
                                this.arrayPositionX.push(arrayBox[arraySign].getPositionX());
                                this.arrayPositionY.push(arrayBox[arraySign].getPositionY());
                            }
                        }
                        arrayBox[arraySign].destroy();
                        arrayBox[arraySign].setPosition(-1000, -1000);
                        //生成新噗呦块
                        var nodePuyo = cc.instantiate(this.prefab1);
                        var nodeChild = nodePuyo.getChildren();
                        nodePuyo.parent = this.boxParent;
                        nodePuyo.setPosition(this.userGroundChild[line][row].getPositionX(), this.userGroundChild[line][row].getPositionY());

                        switch (this.userGroundChild[line][row].getComponent("BoxState").stringColor) {
                            case "blue":
                                break;
                            case "red":
                                nodeChild[0].getComponent(cc.Animation).play("Change2B_1Red");
                                break;
                            case "green":
                                nodeChild[0].getComponent(cc.Animation).play("Change2B_1Green");
                                break;
                        }
                        break;
                    case "3":
                        for (var i = 0; i <= this.arrayDown.length - 1; i++) {
                            if (this.arrayDown[i].getPositionX() == arrayBox[arraySign].getPositionX() && this.arrayDown[i].getPositionY() == arrayBox[arraySign].getPositionY()) {
                                //判断此噗呦块是否是本次下落数组中的噗呦块
                                this.arrayPositionX.push(arrayBox[arraySign].getPositionX());
                                this.arrayPositionY.push(arrayBox[arraySign].getPositionY());
                            }
                        }
                        arrayBox[arraySign].destroy();
                        arrayBox[arraySign].setPosition(-1000, -1000);
                        //生成新噗呦块
                        var nodePuyo = cc.instantiate(this.prefab1);
                        var nodeChild = nodePuyo.getChildren();
                        nodePuyo.parent = this.boxParent;
                        nodePuyo.setPosition(this.userGroundChild[line][row].getPositionX(), this.userGroundChild[line][row].getPositionY());

                        switch (this.userGroundChild[line][row].getComponent("BoxState").stringColor) {
                            case "blue":
                                nodeChild[0].rotation = 90;
                                break;
                            case "red":
                                nodeChild[0].getComponent(cc.Animation).play("Change2B_1Red");
                                nodeChild[0].rotation = 90;
                                break;
                            case "green":
                                nodeChild[0].getComponent(cc.Animation).play("Change2B_1Green");
                                nodeChild[0].rotation = 90;
                                break;
                        }
                        break;
                    case "4":
                        for (var i = 0; i <= this.arrayDown.length - 1; i++) {
                            if (this.arrayDown[i].getPositionX() == arrayBox[arraySign].getPositionX() && this.arrayDown[i].getPositionY() == arrayBox[arraySign].getPositionY()) {
                                //判断此噗呦块是否是本次下落数组中的噗呦块
                                this.arrayPositionX.push(arrayBox[arraySign].getPositionX());
                                this.arrayPositionY.push(arrayBox[arraySign].getPositionY());
                            }
                        }
                        arrayBox[arraySign].destroy();
                        arrayBox[arraySign].setPosition(-1000, -1000);
                        //生成新噗呦块
                        var nodePuyo = cc.instantiate(this.prefab1);
                        var nodeChild = nodePuyo.getChildren();
                        nodePuyo.parent = this.boxParent;
                        nodePuyo.setPosition(this.userGroundChild[line][row].getPositionX(), this.userGroundChild[line][row].getPositionY());

                        switch (this.userGroundChild[line][row].getComponent("BoxState").stringColor) {
                            case "blue":
                                nodeChild[0].rotation = 270;
                                break;
                            case "red":
                                nodeChild[0].getComponent(cc.Animation).play("Change2B_1Red");
                                nodeChild[0].rotation = 270;
                                break;
                            case "green":
                                nodeChild[0].getComponent(cc.Animation).play("Change2B_1Green");
                                nodeChild[0].rotation = 270;
                                break;
                        }
                        break;
                }
                break;
            case 2:
                switch (this.stringConnectDirection) {
                    case "12":
                        for (var i = 0; i <= this.arrayDown.length - 1; i++) {
                            if (this.arrayDown[i].getPositionX() == arrayBox[arraySign].getPositionX() && this.arrayDown[i].getPositionY() == arrayBox[arraySign].getPositionY()) {
                                //判断此噗呦块是否是本次下落数组中的噗呦块
                                this.arrayPositionX.push(arrayBox[arraySign].getPositionX());
                                this.arrayPositionY.push(arrayBox[arraySign].getPositionY());
                            }
                        }
                        arrayBox[arraySign].destroy();
                        arrayBox[arraySign].setPosition(-1000, -1000);
                        //生成新噗呦块
                        var nodePuyo = cc.instantiate(this.prefab22);
                        var nodeChild = nodePuyo.getChildren();
                        nodePuyo.parent = this.boxParent;
                        nodePuyo.setPosition(this.userGroundChild[line][row].getPositionX(), this.userGroundChild[line][row].getPositionY());

                        switch (this.userGroundChild[line][row].getComponent("BoxState").stringColor) {
                            case "blue":
                                break;
                            case "red":
                                nodeChild[0].getComponent(cc.Animation).play("Change2B_22Red");
                                break;
                            case "green":
                                nodeChild[0].getComponent(cc.Animation).play("Change2B_22Green");
                                break;
                        }
                        break;
                    case "13":
                        for (var i = 0; i <= this.arrayDown.length - 1; i++) {
                            if (this.arrayDown[i].getPositionX() == arrayBox[arraySign].getPositionX() && this.arrayDown[i].getPositionY() == arrayBox[arraySign].getPositionY()) {
                                //判断此噗呦块是否是本次下落数组中的噗呦块
                                this.arrayPositionX.push(arrayBox[arraySign].getPositionX());
                                this.arrayPositionY.push(arrayBox[arraySign].getPositionY());
                            }
                        }
                        arrayBox[arraySign].destroy();
                        arrayBox[arraySign].setPosition(-1000, -1000);
                        //生成新噗呦块
                        var nodePuyo = cc.instantiate(this.prefab2);
                        var nodeChild = nodePuyo.getChildren();
                        nodePuyo.parent = this.boxParent;
                        nodePuyo.setPosition(this.userGroundChild[line][row].getPositionX(), this.userGroundChild[line][row].getPositionY());

                        switch (this.userGroundChild[line][row].getComponent("BoxState").stringColor) {
                            case "blue":
                                nodeChild[0].rotation = 270;
                                break;
                            case "red":
                                nodeChild[0].getComponent(cc.Animation).play("Change2B_2Red");
                                nodeChild[0].rotation = 270;
                                break;
                            case "green":
                                nodeChild[0].getComponent(cc.Animation).play("Change2B_2Green");
                                nodeChild[0].rotation = 270;
                                break;
                        }

                        break;
                    case "14":
                        for (var i = 0; i <= this.arrayDown.length - 1; i++) {
                            if (this.arrayDown[i].getPositionX() == arrayBox[arraySign].getPositionX() && this.arrayDown[i].getPositionY() == arrayBox[arraySign].getPositionY()) {
                                //判断此噗呦块是否是本次下落数组中的噗呦块
                                this.arrayPositionX.push(arrayBox[arraySign].getPositionX());
                                this.arrayPositionY.push(arrayBox[arraySign].getPositionY());
                            }
                        }
                        arrayBox[arraySign].destroy();
                        arrayBox[arraySign].setPosition(-1000, -1000);
                        //生成新噗呦块
                        var nodePuyo = cc.instantiate(this.prefab2);
                        var nodeChild = nodePuyo.getChildren();
                        nodePuyo.parent = this.boxParent;
                        nodePuyo.setPosition(this.userGroundChild[line][row].getPositionX(), this.userGroundChild[line][row].getPositionY());

                        switch (this.userGroundChild[line][row].getComponent("BoxState").stringColor) {
                            case "blue":
                                break;
                            case "red":
                                nodeChild[0].getComponent(cc.Animation).play("Change2B_2Red");
                                break;
                            case "green":
                                nodeChild[0].getComponent(cc.Animation).play("Change2B_2Green");
                                break;
                        }

                        break;
                    case "23":
                        for (var i = 0; i <= this.arrayDown.length - 1; i++) {
                            if (this.arrayDown[i].getPositionX() == arrayBox[arraySign].getPositionX() && this.arrayDown[i].getPositionY() == arrayBox[arraySign].getPositionY()) {
                                //判断此噗呦块是否是本次下落数组中的噗呦块
                                this.arrayPositionX.push(arrayBox[arraySign].getPositionX());
                                this.arrayPositionY.push(arrayBox[arraySign].getPositionY());
                            }
                        }
                        arrayBox[arraySign].destroy();
                        arrayBox[arraySign].setPosition(-1000, -1000);
                        //生成新噗呦块
                        var nodePuyo = cc.instantiate(this.prefab2);
                        var nodeChild = nodePuyo.getChildren();
                        nodePuyo.parent = this.boxParent;
                        nodePuyo.setPosition(this.userGroundChild[line][row].getPositionX(), this.userGroundChild[line][row].getPositionY());

                        switch (this.userGroundChild[line][row].getComponent("BoxState").stringColor) {
                            case "blue":
                                nodeChild[0].rotation = 180;
                                break;
                            case "red":
                                nodeChild[0].getComponent(cc.Animation).play("Change2B_2Red");
                                nodeChild[0].rotation = 180;
                                break;
                            case "green":
                                nodeChild[0].getComponent(cc.Animation).play("Change2B_2Green");
                                nodeChild[0].rotation = 180;
                                break;
                        }

                        break;
                    case "24":
                        for (var i = 0; i <= this.arrayDown.length - 1; i++) {
                            if (this.arrayDown[i].getPositionX() == arrayBox[arraySign].getPositionX() && this.arrayDown[i].getPositionY() == arrayBox[arraySign].getPositionY()) {
                                //判断此噗呦块是否是本次下落数组中的噗呦块
                                this.arrayPositionX.push(arrayBox[arraySign].getPositionX());
                                this.arrayPositionY.push(arrayBox[arraySign].getPositionY());
                            }
                        }
                        arrayBox[arraySign].destroy();
                        arrayBox[arraySign].setPosition(-1000, -1000);
                        //生成新噗呦块
                        var nodePuyo = cc.instantiate(this.prefab2);
                        var nodeChild = nodePuyo.getChildren();
                        nodePuyo.parent = this.boxParent;
                        nodePuyo.setPosition(this.userGroundChild[line][row].getPositionX(), this.userGroundChild[line][row].getPositionY());

                        switch (this.userGroundChild[line][row].getComponent("BoxState").stringColor) {
                            case "blue":
                                nodeChild[0].rotation = 90;
                                break;
                            case "red":
                                nodeChild[0].getComponent(cc.Animation).play("Change2B_2Red");
                                nodeChild[0].rotation = 90;
                                break;
                            case "green":
                                nodeChild[0].getComponent(cc.Animation).play("Change2B_2Green");
                                nodeChild[0].rotation = 90;
                                break;
                        }
                        break;
                    case "34":
                        for (var i = 0; i <= this.arrayDown.length - 1; i++) {
                            if (this.arrayDown[i].getPositionX() == arrayBox[arraySign].getPositionX() && this.arrayDown[i].getPositionY() == arrayBox[arraySign].getPositionY()) {
                                //判断此噗呦块是否是本次下落数组中的噗呦块
                                this.arrayPositionX.push(arrayBox[arraySign].getPositionX());
                                this.arrayPositionY.push(arrayBox[arraySign].getPositionY());
                            }
                        }
                        arrayBox[arraySign].destroy();
                        arrayBox[arraySign].setPosition(-1000, -1000);
                        //生成新噗呦块
                        var nodePuyo = cc.instantiate(this.prefab22);
                        var nodeChild = nodePuyo.getChildren();
                        nodePuyo.parent = this.boxParent;
                        nodePuyo.setPosition(this.userGroundChild[line][row].getPositionX(), this.userGroundChild[line][row].getPositionY());

                        switch (this.userGroundChild[line][row].getComponent("BoxState").stringColor) {
                            case "blue":
                                nodeChild[0].rotation = 90;
                                break;
                            case "red":
                                nodeChild[0].getComponent(cc.Animation).play("Change2B_22Red");
                                nodeChild[0].rotation = 90;
                                break;
                            case "green":
                                nodeChild[0].getComponent(cc.Animation).play("Change2B_22Green");
                                nodeChild[0].rotation = 90;
                                break;
                        }
                        break;
                }
                break;
            case 3:
                switch (this.stringConnectDirection) {
                    case "123":
                        for (var i = 0; i <= this.arrayDown.length - 1; i++) {
                            if (this.arrayDown[i].getPositionX() == arrayBox[arraySign].getPositionX() && this.arrayDown[i].getPositionY() == arrayBox[arraySign].getPositionY()) {
                                //判断此噗呦块是否是本次下落数组中的噗呦块
                                this.arrayPositionX.push(arrayBox[arraySign].getPositionX());
                                this.arrayPositionY.push(arrayBox[arraySign].getPositionY());
                            }
                        }
                        arrayBox[arraySign].destroy();
                        arrayBox[arraySign].setPosition(-1000, -1000);
                        //生成新噗呦块
                        var nodePuyo = cc.instantiate(this.prefab3);
                        var nodeChild = nodePuyo.getChildren();
                        nodePuyo.parent = this.boxParent;
                        nodePuyo.setPosition(this.userGroundChild[line][row].getPositionX(), this.userGroundChild[line][row].getPositionY());

                        switch (this.userGroundChild[line][row].getComponent("BoxState").stringColor) {
                            case "blue":
                                nodeChild[0].rotation = 180;
                                break;
                            case "red":
                                nodeChild[0].getComponent(cc.Animation).play("Change2B_3Red");
                                nodeChild[0].rotation = 180;
                                break;
                            case "green":
                                nodeChild[0].getComponent(cc.Animation).play("Change2B_3Green");
                                nodeChild[0].rotation = 180;
                                break;
                        }
                        break;
                    case "124":
                        for (var i = 0; i <= this.arrayDown.length - 1; i++) {
                            if (this.arrayDown[i].getPositionX() == arrayBox[arraySign].getPositionX() && this.arrayDown[i].getPositionY() == arrayBox[arraySign].getPositionY()) {
                                //判断此噗呦块是否是本次下落数组中的噗呦块
                                this.arrayPositionX.push(arrayBox[arraySign].getPositionX());
                                this.arrayPositionY.push(arrayBox[arraySign].getPositionY());
                            }
                        }
                        arrayBox[arraySign].destroy();
                        arrayBox[arraySign].setPosition(-1000, -1000);
                        //生成新噗呦块
                        var nodePuyo = cc.instantiate(this.prefab3);
                        var nodeChild = nodePuyo.getChildren();
                        nodePuyo.parent = this.boxParent;
                        nodePuyo.setPosition(this.userGroundChild[line][row].getPositionX(), this.userGroundChild[line][row].getPositionY());

                        switch (this.userGroundChild[line][row].getComponent("BoxState").stringColor) {
                            case "blue":
                                break;
                            case "red":
                                nodeChild[0].getComponent(cc.Animation).play("Change2B_3Red");
                                break;
                            case "green":
                                nodeChild[0].getComponent(cc.Animation).play("Change2B_3Green");
                                break;
                        }

                        break;
                    case "134":
                        for (var i = 0; i <= this.arrayDown.length - 1; i++) {
                            if (this.arrayDown[i].getPositionX() == arrayBox[arraySign].getPositionX() && this.arrayDown[i].getPositionY() == arrayBox[arraySign].getPositionY()) {
                                //判断此噗呦块是否是本次下落数组中的噗呦块
                                this.arrayPositionX.push(arrayBox[arraySign].getPositionX());
                                this.arrayPositionY.push(arrayBox[arraySign].getPositionY());
                            }
                        }
                        arrayBox[arraySign].destroy();
                        arrayBox[arraySign].setPosition(-1000, -1000);
                        //生成新噗呦块
                        var nodePuyo = cc.instantiate(this.prefab3);
                        var nodeChild = nodePuyo.getChildren();
                        nodePuyo.parent = this.boxParent;
                        nodePuyo.setPosition(this.userGroundChild[line][row].getPositionX(), this.userGroundChild[line][row].getPositionY());
                        switch (this.userGroundChild[line][row].getComponent("BoxState").stringColor) {
                            case "blue":
                                nodeChild[0].rotation = 270;
                                break;
                            case "red":
                                nodeChild[0].getComponent(cc.Animation).play("Change2B_3Red");
                                nodeChild[0].rotation = 270;
                                break;
                            case "green":
                                nodeChild[0].getComponent(cc.Animation).play("Change2B_3Green");
                                nodeChild[0].rotation = 270;
                                break;
                        }

                        break;
                    case "234":
                        for (var i = 0; i <= this.arrayDown.length - 1; i++) {
                            if (this.arrayDown[i].getPositionX() == arrayBox[arraySign].getPositionX() && this.arrayDown[i].getPositionY() == arrayBox[arraySign].getPositionY()) {
                                //判断此噗呦块是否是本次下落数组中的噗呦块
                                this.arrayPositionX.push(arrayBox[arraySign].getPositionX());
                                this.arrayPositionY.push(arrayBox[arraySign].getPositionY());
                            }
                        }
                        arrayBox[arraySign].destroy();
                        arrayBox[arraySign].setPosition(-1000, -1000);
                        //生成新噗呦块
                        var nodePuyo = cc.instantiate(this.prefab3);
                        var nodeChild = nodePuyo.getChildren();
                        nodePuyo.parent = this.boxParent;
                        nodePuyo.setPosition(this.userGroundChild[line][row].getPositionX(), this.userGroundChild[line][row].getPositionY());
                        switch (this.userGroundChild[line][row].getComponent("BoxState").stringColor) {
                            case "blue":
                                nodeChild[0].rotation = 90;
                                break;
                            case "red":
                                nodeChild[0].getComponent(cc.Animation).play("Change2B_3Red");
                                nodeChild[0].rotation = 90;
                                break;
                            case "green":
                                nodeChild[0].getComponent(cc.Animation).play("Change2B_3Green");
                                nodeChild[0].rotation = 90;
                                break;
                        }
                        break;
                }
                break;
            case 4:
                for (var i = 0; i <= this.arrayDown.length - 1; i++) {
                    if (this.arrayDown[i].getPositionX() == arrayBox[arraySign].getPositionX() && this.arrayDown[i].getPositionY() == arrayBox[arraySign].getPositionY()) {
                        //判断此噗呦块是否是本次下落数组中的噗呦块
                        this.arrayPositionX.push(arrayBox[arraySign].getPositionX());
                        this.arrayPositionY.push(arrayBox[arraySign].getPositionY());
                    }
                }
                arrayBox[arraySign].destroy();
                arrayBox[arraySign].setPosition(-1000, -1000);
                //生成新噗呦块
                var nodePuyo = cc.instantiate(this.prefab4);
                var nodeChild = nodePuyo.getChildren();
                nodePuyo.parent = this.boxParent;
                nodePuyo.setPosition(this.userGroundChild[line][row].getPositionX(), this.userGroundChild[line][row].getPositionY());
                switch (this.userGroundChild[line][row].getComponent("BoxState").stringColor) {
                    case "blue":
                        break;
                    case "red":
                        nodeChild[0].getComponent(cc.Animation).play("Change2B_4Red");
                        break;
                    case "green":
                        nodeChild[0].getComponent(cc.Animation).play("Change2B_4Green");
                        break;
                }
                break;
        }
    },

    MoveLeft: function MoveLeft() {

        // if (nLine == nLine1) {
        //     return;
        // }
        //存取俄罗斯方块的行数
        var nArrayRow = [];
        //存取俄罗斯方块的列数
        var nArrayList = [];
        //获取节点子节点数组
        var blockChild = this.nodeBlock.getChildren();

        //将俄罗斯方块的行列存入数组中
        for (var i = 0; i <= blockChild.length - 1; i++) {
            //计算噗呦块的实际坐标
            this.nodeBlock.getComponent("PuyoDown").CountPosition(blockChild[i]);
            //存储噗呦块的实际坐标.
            var positionX = this.nodeBlock.getComponent("PuyoDown").nPositionX;
            var positionY = this.nodeBlock.getComponent("PuyoDown").nPositionY;
            //获取此时组成俄罗斯方块元素的行列
            var nX = (positionX + this.nodeBlock.getPositionX() - cc.find("GroundParent").getPositionX()) / Global.nWidthPuYo + 1;
            var nY = (positionY + this.nodeBlock.getPositionY() - cc.find("GroundParent").getPositionY()) / Global.nWidthPuYo + 1;
            nArrayList.push(nX);
            nArrayRow.push(Math.floor(nY));
        }
        //从小到大排序行数
        for (var j = 0; j <= blockChild.length - 1; j++) {
            if (j <= blockChild.length - 2) {
                for (var k = j + 1; k <= blockChild.length - 1; k++) {
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
        if (nArrayRow[0] == 12) {
            //从小到大排序列数
            for (var j = 0; j <= blockChild.length - 1; j++) {
                if (j <= blockChild.length - 2) {
                    for (var k = j + 1; k <= blockChild.length - 1; k++) {
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
            }
            //判断方块的前一列是否有方块
            var isHas = false;
            for (var i = 0; i <= blockChild.length - 1; i++) {
                if (nArrayRow[i] == 12) {
                    //判断方块的前一列的方块属性是否为true
                    if (this.userGroundChild[nArrayList[i] - 2][nArrayRow[i] - 1].getComponent("BoxState").isBox) {
                        isHas = true;
                    }
                }
                if (i == blockChild.length - 1) {
                    if (isHas) {
                        return;
                    } else {
                        for (var k = 0; k <= blockChild.length - 1; k++) {
                            if (k == blockChild.length - 1) {
                                //俄罗斯方块向左移动
                                this.nodeBlock.x -= Global.nWidthPuYo;
                                if (this.nodeBlock.getComponent("PuyoDown").isCollision) {
                                    // //初始化 1s计时器
                                    // this.nodeBlock.getComponent("OperateBlock").fDownTime = 0;
                                    // this.nodeBlock.getComponent("OperateBlock").fCollisionTime = 0;
                                }
                            }
                        }
                    }
                }
            }
        } else {
            //从小到大排序列数
            for (var j = 0; j <= blockChild.length - 1; j++) {
                if (j <= blockChild.length - 2) {
                    for (var k = j + 1; k <= blockChild.length - 1; k++) {
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
            cc.log(nArrayList + "MoveLeft");
            if (nArrayList[0] == 1) {

                return;
            } else {
                //判断方块的前一列是否有方块
                var isHas = false;
                for (var i = 0; i <= blockChild.length - 1; i++) {
                    //判断方块的前一列的方块属性是否为true
                    if (this.userGroundChild[nArrayList[i] - 2][nArrayRow[i] - 1].getComponent("BoxState").isBox) {
                        isHas = true;
                    }
                    if (i == blockChild.length - 1) {
                        if (isHas) {
                            return;
                        } else {
                            for (var k = 0; k <= blockChild.length - 1; k++) {

                                if (k == blockChild.length - 1) {
                                    //俄罗斯方块向左移动
                                    this.nodeBlock.x -= Global.nWidthPuYo;
                                    if (this.nodeBlock.getComponent("PuyoDown").isCollision) {
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
        }
    },
    //俄罗斯方块向右移动
    MoveRight: function MoveRight() {
        // if (nLine == nLine1) {
        //     return;
        // }
        //存取俄罗斯方块的行数
        var nArrayRow = [];
        //存取俄罗斯方块的列数
        var nArrayList = [];
        //获取节点子节点数组
        var blockChild = this.nodeBlock.getChildren();
        //将俄罗斯方块的行列存入数组中
        for (var i = 0; i <= blockChild.length - 1; i++) {
            //计算噗呦块的实际坐标
            this.nodeBlock.getComponent("PuyoDown").CountPosition(blockChild[i]);
            //存储噗呦块的实际坐标.
            var positionX = this.nodeBlock.getComponent("PuyoDown").nPositionX;
            var positionY = this.nodeBlock.getComponent("PuyoDown").nPositionY;
            //获取此时组成俄罗斯方块元素的行列
            var nX = (positionX + this.nodeBlock.getPositionX() - cc.find("GroundParent").getPositionX()) / Global.nWidthPuYo + 1;
            var nY = (positionY + this.nodeBlock.getPositionY() - cc.find("GroundParent").getPositionY()) / Global.nWidthPuYo + 1;
            //    cc.log(nX);
            //    cc.log(nY);
            nArrayList.push(nX);
            nArrayRow.push(Math.floor(nY));
        }
        //从小到大排序行数
        for (var j = 0; j <= blockChild.length - 1; j++) {
            if (j <= blockChild.length - 2) {
                for (var k = j + 1; k <= blockChild.length - 1; k++) {
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
        if (nArrayRow[0] == 12) {
            //从小到大排序列数
            for (var j = 0; j <= blockChild.length - 1; j++) {
                if (j <= blockChild.length - 2) {
                    for (var k = j + 1; k <= blockChild.length - 1; k++) {
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
            if (nArrayList[blockChild.length - 1] == 6) {
                return;
            } else {
                //判断方块的下一列是否有方块
                var isHas = false;
                for (var i = blockChild.length - 1; i >= 0; i--) {
                    if (nArrayRow[i] == 12) {
                        //判断方块的前一列的方块属性是否为true
                        if (this.userGroundChild[nArrayList[i] - 2][nArrayRow[i] - 1].getComponent("BoxState").isBox) {
                            isHas = true;
                        }
                    }
                    if (i == 0) {
                        if (isHas) {
                            return;
                        } else {
                            for (var k = 0; k <= blockChild.length - 1; k++) {
                                if (k == blockChild.length - 1) {
                                    //俄罗斯方块向右移动
                                    this.nodeBlock.x += Global.nWidthPuYo;
                                    if (this.nodeBlock.getComponent("PuyoDown").isCollision) {}
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
            //从小到大排序列数
            for (var j = 0; j <= blockChild.length - 1; j++) {
                if (j <= blockChild.length - 2) {
                    for (var k = j + 1; k <= blockChild.length - 1; k++) {
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
            if (nArrayList[blockChild.length - 1] == 6) {
                return;
            } else {
                //判断方块的下一列是否有方块
                var isHas = false;
                for (var i = blockChild.length - 1; i >= 0; i--) {

                    //判断方块的下一列的方块属性是否为true
                    if (this.userGroundChild[nArrayList[i]][nArrayRow[i] - 1].getComponent("BoxState").isBox) {
                        isHas = true;
                    }
                    if (i == 0) {
                        if (isHas) {
                            return;
                        } else {
                            for (var k = 0; k <= blockChild.length - 1; k++) {
                                if (k == blockChild.length - 1) {
                                    //俄罗斯方块向右移动
                                    this.nodeBlock.x += Global.nWidthPuYo;
                                    if (this.nodeBlock.getComponent("PuyoDown").isCollision) {}
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
        }
    },
    //压缩变形判断噗呦块是否可以可以相连
    IsConnect: function IsConnect() {
        var arrayBox = this.boxParent.getChildren();
        cc.log(arrayBox.length + "isconnect");
        var nTravel = arrayBox.length - 1;
        //存取下落块的横，纵坐标
        this.arrayPositionX = [];
        this.arrayPositionY = [];
        for (var i = 0; i <= nTravel; i++) {
            cc.log("77777777777777777777777777777777777777777777777777777777777");
            // cc.log(arrayBox[i].getPositionY()+"isconnect");
            this.stringConnectDirection = "";
            //初始化此时噗呦块的行数
            var nRow3 = this.CountRow(arrayBox[i].getPositionY());
            var nLine3 = this.CountLine(arrayBox[i].getPositionX());
            // cc.log("isconnect"+this.CountRow(arrayBox[i].getPositionY()));
            if (nRow3 > 0 && nLine3 > 0 && this.CountLine(arrayBox[i].getPositionX()) < 5) {
                //默认方向想上为1，向下为2，向左为3，向右为4
                //判断噗呦块的上方是否颜色相同
                if (this.userGroundChild[nLine3][nRow3].getComponent("BoxState").stringColor == this.userGroundChild[nLine3][nRow3 + 1].getComponent("BoxState").stringColor) {
                    this.stringConnectDirection += "1";
                }
                //判断噗呦块的下方是否颜色相同
                if (this.userGroundChild[nLine3][nRow3].getComponent("BoxState").stringColor == this.userGroundChild[nLine3][nRow3 - 1].getComponent("BoxState").stringColor) {
                    this.stringConnectDirection += "2";
                }
                //判断噗呦块的左方是否颜色相同
                if (this.userGroundChild[nLine3][nRow3].getComponent("BoxState").stringColor == this.userGroundChild[nLine3 - 1][nRow3].getComponent("BoxState").stringColor) {
                    this.stringConnectDirection += "3";
                }
                //判断噗呦块的右方是否颜色相同
                if (this.userGroundChild[nLine3][nRow3].getComponent("BoxState").stringColor == this.userGroundChild[nLine3 + 1][nRow3].getComponent("BoxState").stringColor) {
                    this.stringConnectDirection += "4";
                }
            } else {
                if (nRow3 == 0 && nLine3 == 0 || nRow3 == 0 && nLine3 == 5 || nRow3 == 11 && nLine3 == 0 || nRow3 == 11 && nLine3 == 5) {
                    if (nRow3 == 0 && nLine3 == 0) {
                        //默认方向想上为1，向下为2，向左为3，向右为4
                        //判断噗呦块的上方是否颜色相同
                        if (this.userGroundChild[nLine3][nRow3].getComponent("BoxState").stringColor == this.userGroundChild[nLine3][nRow3 + 1].getComponent("BoxState").stringColor) {
                            this.stringConnectDirection += "1";
                        }
                        //判断噗呦块的右方是否颜色相同
                        if (this.userGroundChild[nLine3][nRow3].getComponent("BoxState").stringColor == this.userGroundChild[nLine3 + 1][nRow3].getComponent("BoxState").stringColor) {
                            this.stringConnectDirection += "4";
                        }
                    }
                    if (nRow3 == 0 && nLine3 == 5) {
                        //默认方向想上为1，向下为2，向左为3，向右为4
                        //判断噗呦块的上方是否颜色相同
                        if (this.userGroundChild[nLine3][nRow3].getComponent("BoxState").stringColor == this.userGroundChild[nLine3][nRow3 + 1].getComponent("BoxState").stringColor) {
                            this.stringConnectDirection += "1";
                        }
                        //判断噗呦块的左方是否颜色相同
                        if (this.userGroundChild[nLine3][nRow3].getComponent("BoxState").stringColor == this.userGroundChild[nLine3 - 1][nRow3].getComponent("BoxState").stringColor) {
                            this.stringConnectDirection += "3";
                        }
                    }
                    if (nRow3 == 11 && nLine3 == 0) {
                        //默认方向想上为1，向下为2，向左为3，向右为4
                        //判断噗呦块的下方是否颜色相同
                        if (this.userGroundChild[nLine3][nRow3].getComponent("BoxState").stringColor == this.userGroundChild[nLine3][nRow3 - 1].getComponent("BoxState").stringColor) {
                            this.stringConnectDirection += "2";
                        }
                        //判断噗呦块的右方是否颜色相同
                        if (this.userGroundChild[nLine3][nRow3].getComponent("BoxState").stringColor == this.userGroundChild[nLine3 + 1][nRow3].getComponent("BoxState").stringColor) {
                            this.stringConnectDirection += "4";
                        }
                    }
                    if (nRow3 == 11 && nLine3 == 5) {
                        //判断噗呦块的下方是否颜色相同
                        if (this.userGroundChild[nLine3][nRow3].getComponent("BoxState").stringColor == this.userGroundChild[nLine3][nRow3 - 1].getComponent("BoxState").stringColor) {
                            this.stringConnectDirection += "2";
                        }
                        //判断噗呦块的左方是否颜色相同
                        if (this.userGroundChild[nLine3][nRow3].getComponent("BoxState").stringColor == this.userGroundChild[nLine3 - 1][nRow3].getComponent("BoxState").stringColor) {
                            this.stringConnectDirection += "3";
                        }
                    }
                } else {
                    if (nRow3 == 0) {
                        //默认方向想上为1，向下为2，向左为3，向右为4
                        //判断噗呦块的上方是否颜色相同
                        if (this.userGroundChild[nLine3][nRow3].getComponent("BoxState").stringColor == this.userGroundChild[nLine3][nRow3 + 1].getComponent("BoxState").stringColor) {
                            this.stringConnectDirection += "1";
                        }
                        //判断噗呦块的左方是否颜色相同
                        if (this.userGroundChild[nLine3][nRow3].getComponent("BoxState").stringColor == this.userGroundChild[nLine3 - 1][nRow3].getComponent("BoxState").stringColor) {
                            this.stringConnectDirection += "3";
                        }
                        //判断噗呦块的右方是否颜色相同
                        if (this.userGroundChild[nLine3][nRow3].getComponent("BoxState").stringColor == this.userGroundChild[nLine3 + 1][nRow3].getComponent("BoxState").stringColor) {
                            this.stringConnectDirection += "4";
                        }
                    }
                    if (nLine3 == 0) {
                        //默认方向想上为1，向下为2，向左为3，向右为4
                        //判断噗呦块的上方是否颜色相同
                        if (this.userGroundChild[nLine3][nRow3].getComponent("BoxState").stringColor == this.userGroundChild[nLine3][nRow3 + 1].getComponent("BoxState").stringColor) {
                            this.stringConnectDirection += "1";
                        }
                        //判断噗呦块的下方是否颜色相同
                        if (this.userGroundChild[nLine3][nRow3].getComponent("BoxState").stringColor == this.userGroundChild[nLine3][nRow3 - 1].getComponent("BoxState").stringColor) {
                            this.stringConnectDirection += "2";
                        }
                        //判断噗呦块的右方是否颜色相同
                        if (this.userGroundChild[nLine3][nRow3].getComponent("BoxState").stringColor == this.userGroundChild[nLine3 + 1][nRow3].getComponent("BoxState").stringColor) {
                            this.stringConnectDirection += "4";
                        }
                    }
                    if (nLine3 == 5) {
                        //默认方向想上为1，向下为2，向左为3，向右为4
                        //判断噗呦块的上方是否颜色相同
                        if (this.userGroundChild[nLine3][nRow3].getComponent("BoxState").stringColor == this.userGroundChild[nLine3][nRow3 + 1].getComponent("BoxState").stringColor) {
                            this.stringConnectDirection += "1";
                        }
                        //判断噗呦块的下方是否颜色相同
                        if (this.userGroundChild[nLine3][nRow3].getComponent("BoxState").stringColor == this.userGroundChild[nLine3][nRow3 - 1].getComponent("BoxState").stringColor) {
                            this.stringConnectDirection += "2";
                        }
                        //判断噗呦块的左方是否颜色相同
                        if (this.userGroundChild[nLine3][nRow3].getComponent("BoxState").stringColor == this.userGroundChild[nLine3 - 1][nRow3].getComponent("BoxState").stringColor) {
                            this.stringConnectDirection += "3";
                        }
                    }
                }
            }
            this.SureShape(this.stringConnectDirection.length, nRow3, nLine3, i);
        }
    },
    update: function update(dt) {
        if (this.nodeBlock.getComponent("PuyoDown").isStationary && this.nodeBlock.getComponent("PuyoDown").isGameOver == false) {
            //初始化待下落数组
            this.arrayDown = [];
            // this.boxParent1=this.boxParent.getChildren();
            //获取此方块的数组
            var nodeBoxArray = this.nodeBlock.getChildren();
            var arrayLength = nodeBoxArray.length;
            for (var i = 0; i <= arrayLength - 1; i++) {
                this.arrayDown.push(nodeBoxArray[0]);
                nodeBoxArray[0].setPosition(this.GetBoxNode(nodeBoxArray[0]));
                nodeBoxArray[0].parent = this.boxParent;
                if (i == arrayLength - 1) {
                    this.GetShapeSign(this.arrayDown);
                    cc.log(this.arrayChange + "??????????????");
                    this.nodeBlock.getComponent("PuyoDown").isChangeParent = true;
                }
            }
        }
        if (this.nodeBlock.getComponent("PuyoDown").isChangeParent && this.nodeBlock.getComponent("PuyoDown").isGameOver == false) {
            // // cc.log("bbb");
            // for(var i=0;i<=  this.arrayDown.length-1;i++)
            // {
            //     // cc.log(this.nodeBlock.getComponent("PuyoDown").arrayX[i]-1);
            //     // cc.log(this.nodeBlock.getComponent("PuyoDown").arrayY[i]-1);
            //     // cc.log("222222222222222222222222222");
            //     this.userGroundChild[this.nodeBlock.getComponent("PuyoDown").arrayX[i]-1][this.nodeBlock.getComponent("PuyoDown").arrayY[i]-1].getComponent("BoxState").isBox = true;
            //     this.userGroundChild[this.nodeBlock.getComponent("PuyoDown").arrayX[i]-1][this.nodeBlock.getComponent("PuyoDown").arrayY[i]-1].getComponent("BoxState").stringColor =  this.arrayDown[i].stringColor;
            // }`
            for (var i = 0; i <= this.nodeBlock.getComponent("PuyoDown").arrayX.length - 1; i++) {
                this.BoxDown(this.nodeBlock.getComponent("PuyoDown").arrayY[i] - 1, this.nodeBlock.getComponent("PuyoDown").arrayX[i] - 1);
            }
            // this.GetBlock();
            this.nodeBlock.getComponent("PuyoDown").isChangeParent = false;
            this.nodeBlock.getComponent("PuyoDown").isStationary = false;
            // //生成新的俄罗斯方块
            // this.GetBlock();
            // this.nodeBlock.getComponent("PuyoDown").isChangeParent = false;
        }
        if (this.isActionDown) {
            //压缩变形
            this.ChangeShape(this, { "nRow": this.nRow2, "nLine": this.nLine2 });
            this.isActionDown = false;
        }
        if (this.arrayChange != null) {
            // cc.log(this.nChangeShape + "~~~~~~~~~~~~~~~~~~~~~~~");
            if (this.nChangeShape == this.arrayChange.length) {
                for (var i = 0; i <= 11; i++) {
                    for (var j = 0; j <= 5; j++) {
                        cc.log(this.userGroundChild[j][i].getComponent("BoxState").stringColor + "9999999999999999999");
                    }
                }
                for (var i = 0; i <= this.arrayDown.length - 1; i++) {
                    var row = this.CountRow(this.arrayDown[i].getPositionY());
                    var line = this.CountLine(this.arrayDown[i].getPositionX());
                    // cc.log(this.arrayDown.length + "888888888888888888888888888888888888888888");
                    // cc.log(this.userGroundChild[line][row].getComponent("BoxState").stringColor + "888888888888888888888888888888888888888888");
                }
                this.IsConnect();
                this.IsDestroy();
                this.GetBlock();
                //初始化形变次数
                this.nChangeShape = 0;
                this.nRotateLong = 0;
                // this.isActionShape = false;
                // this.nodeBlock.getComponent("PuyoDown").isChangeParent = false;
                // this.nodeBlock.getComponent("PuyoDown").isStationary = false;
            }
        }
    }
});

cc._RF.pop();