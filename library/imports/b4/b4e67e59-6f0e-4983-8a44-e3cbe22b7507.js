"use strict";
cc._RF.push(module, 'b4e675Zbw5Jg4pE48viK3UH', 'PuyoDown');
// Scripts/Game2/PuyoDown.js

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
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        //初始化旋转后的实际x坐标
        this.nPositionX = 0;
        //初始化旋转后的实际y坐标
        this.nPositionY = 0;
        //初始化碰撞开关
        this.isCollision = false;
        //获取 此噗呦块的形状
        this.stringBoloekShape = "";
        this.nRotateAngle = 0;
        //初始化结束游戏开关
        this.isGameOver = false;
        this.isStationary = false;
        //初始化颜色数量
        this.nColor = 0;
        //获取此噗呦块的字数组
        this.puyouChild = this.node.getChildren();
        //初始化数组的行]
        this.nRow = [];
        //初始化数组的列
        this.nLine = [];
        this.isChangeParent = false;
        //初始化噗呦块碰撞后的帧数
        this.nCollisionBack = 0;
        // Global.SortArray(this.puyouChild.length, this.nRow, this.nLine);
        //控制噗呦块的下落速度
        this.nDownSpeed = 24;
    },

    BlockDown: function BlockDown() {
        //判断噗呦方块是否移动过一次
        var isMove = true;
        //获取节点子节点数组
        var blockChild = this.node.getChildren();
        //  //判断噗呦方块是否结束地面
        //  var isCollisionGround=false;
        //判断噗呦方块中是否含有22行
        for (var i = 0; i <= blockChild.length - 1; i++) {
            var nY = (blockChild[i].getPositionY() + this.node.getPositionY() - cc.find("GroundParent").getPositionY()) / Global.nWidthPuYo + 1;
            cc.log(nY + "=======================================================================");
            if (nY == 14) {
                isMove = false;
            }
        }
        if (isMove == false) {
            //初始化噗呦方块中第21行方块的数组下表
            var nBoxArray = [];
            //初始化噗呦方块中第21行方块的数组列
            var nXArray = [];
            //初始化噗呦方块中第21行方块的数组行
            var nYArray = [];
            //遍历噗呦方块并并判断第21行的下面是否为true
            for (var i = 0; i <= blockChild.length - 1; i++) {
                this.CountPosition(blockChild[i]);
                //获取此时组成噗呦方块元素的行列
                var nX = (this.nPositionX + this.node.getPositionX() - cc.find("GroundParent").getPositionX()) / Global.nWidthPuYo + 1;
                var nY = (this.nPositionY + this.node.getPositionY() - cc.find("GroundParent").getPositionY()) / Global.nWidthPuYo + 1;
                if (nY == 13) {
                    if (Global.game1Main.userGroundChild[nX - 1][nY - 2].getComponent("BoxState").isBox) {
                        this.isGameOver = true;
                    }
                    //    else
                    //    {
                    //        nBoxArray.push(i);
                    //        nXArray.push(nX);
                    //        nYArray.push(nY);
                    //    }
                }
                // if(i==3&&this.isGameOver==false)
                // {
                // //初始化变化方块数组
                // this.arrayChangeNode=[];
                // // this.node.y -=Global.nWidthPuYo;
                // if(nBoxArray.length>=2)
                // {
                //    for(var j=0;j<=nBoxArray.length-1;j++)
                //    {
                //       Global.game1Main.userGroundChild[nXArray[j]-1][nYArray[j]-2].getComponent("BoxState").stringColor=this.stringColor;
                //       Global.game1Main.userGroundChild[nXArray[j]-1][nYArray[j]-2].getComponent("BoxState").isBox=true;    
                //       this.arrayChangeNode.push({"row":nYArray[j]-2,"col":nXArray[j]-1,"color":this.stringColor}); 
                //    }
                // }
                // if(nBoxArray.length==1)
                // {
                //     cc.log(nXArray[0]-1);
                //     cc.log(nYArray[0]-2);
                //     cc.log(Global.game1Main.userGroundChild[nXArray[0]-1][nYArray[0]-2].getComponent("BoxState").stringColor);
                //     Global.game1Main.userGroundChild[nXArray[0]-1][nYArray[0]-2].getComponent("BoxState").stringColor=this.stringColor;
                //     Global.game1Main.userGroundChild[nXArray[0]-1][nYArray[0]-2].getComponent("BoxState").isBox=true;  
                //     this.arrayChangeNode.push({"row":nYArray[0]-2,"col":nXArray[0]-1,"color":this.stringColor}); 
                // }
                // this.node.y -=Global.nWidth;
                // this.isDownState=true;
                // }     
            }
        } else {
            //存取噗呦块的行数
            var nArrayRow = [];
            //存取噗呦方块的列数
            var nArrayList = [];
            //存取噗呦方块的下标
            this.arratSubScript = [];
            this.arrayX = [];
            this.arrayY = [];
            //将噗呦方块的行列存入数组中
            for (var i = 0; i <= blockChild.length - 1; i++) {
                this.CountPosition(blockChild[i]);
                //获取此时组成噗呦方块元素的行列
                var nX = (this.nPositionX + this.node.getPositionX() - cc.find("GroundParent").getPositionX()) / Global.nWidthPuYo + 1;
                var nY = (this.nPositionY + this.node.getPositionY() - cc.find("GroundParent").getPositionY()) / Global.nWidthPuYo + 1;
                nArrayList.push(nX);
                nArrayRow.push(nY);
                this.arratSubScript.push(i);
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
                            var nSubScript = this.arratSubScript[j];
                            this.arratSubScript[j] = this.arratSubScript[k];
                            this.arratSubScript[k] = nSubScript;
                        }
                    }
                }
            }
            if (this.isGameOver == false) {
                if (nArrayRow[0] == 1) {
                    for (var i = 0; i <= nArrayRow.length - 1; i++) {
                        this.arrayX.push(nArrayList[i]);
                        this.arrayY.push(nArrayRow[i]);
                    }
                    //    this.fCollisionTime=0;
                    this.isCollision = true;
                    return;
                } else {
                    this.isOver = false;
                    //存取该块的行列数组
                    // var blockChild=this.node.getChildren();
                    for (var i = 0; i <= blockChild.length - 1; i++) {
                        this.CountPosition(blockChild[i]);
                        //获取此时组成噗呦方块元素的行列
                        var nX = (this.nPositionX + this.node.getPositionX() - cc.find("GroundParent").getPositionX()) / Global.nWidthPuYo + 1;
                        var nY = (this.nPositionY + this.node.getPositionY() - cc.find("GroundParent").getPositionY()) / Global.nWidthPuYo + 1;
                        if (i == 0) {
                            this.nBox = 0;
                            // this.isDown = false;
                        }
                        this.GetShape(this.stringBoloekShape, i, nX, nY, this.nRotateAngle);
                        if (i == blockChild.length - 1) {
                            for (var i = 0; i <= nArrayRow.length - 1; i++) {
                                this.arrayX.push(nArrayList[i]);
                                this.arrayY.push(nArrayRow[i]);
                            }
                        }
                        // if (i == blockChild.length-1) {
                        //     this.fDownTime = 0;
                        // }
                    }
                }
            }
        }
    },
    AddBoxNumber: function AddBoxNumber(a, b) {
        cc.log(a);
        // cc.log(b);
        // cc.log( this.node.getPositionY());
        if (Global.game1Main.userGroundChild[a - 1][b - 2].getComponent("BoxState").isBox == false) {
            this.nBox++;
        } else {
            if (b == 13) {
                // cc.log(this.nRotateAngle);
                // cc.log(this.stringBoloekShape);
                // cc.log("0-------------------------------------");
                this.isGameOver = true;
            }
        }
    },
    //下落物体并将物体的false置为true
    DownBlock: function DownBlock() {
        // if (this.isDown == false) {
        //     //存取噗呦方块的行数
        //     var nArrayRow = [];
        //     //存取噗呦方块的列数
        //     var nArrayList = [];
        //     //获取节点子节点数组
        //     var blockChild = this.node.getChildren();
        //     this.arrayChangeNode = [];
        //     for (var i = 0; i <= blockChild.length - 1; i++) {
        //         //获取此时组成噗呦方块元素的行列
        //         var nX = (blockChild[i].getPositionX() + this.node.getPositionX() - cc.find("GroundParent").getPositionX()) / Global.nWidthPuYo + 1;
        //         var nY = (blockChild[i].getPositionY() + this.node.getPositionY() - cc.find("GroundParent").getPositionY()) / Global.nWidthPuYo + 1;
        //         if (nY <= 12) {
        //             Global.game1Main.userGroundChild[nX - 1][nY - 1].getComponent("BoxState").isBox = true;
        //             Global.game1Main.userGroundChild[nX - 1][nY - 1].getComponent("BoxState").stringColor = blockChild[i].getComponent("InitPrefabState").stringColor;
        //         }
        //     }
        // }
        // this.isDown = true;
    },
    GetShape: function GetShape(stringBlock, nArray, nx, ny, nRotate1) {
        // //判断下落快中是否有行数大于20行的
        // if (ny > 20) {
        //     this.isOver = true;
        // }
        switch (stringBlock) {
            case "L":
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
                    }

                    if (this.nBox == 2) {
                        this.DownBlock();
                    } else {
                        if (nArray == 2) {

                            if (this.isOver) {
                                //  this.isGameOver=true;
                            }
                            this.isCollision = true;
                        }
                    }
                } else if (nRotate1 == 90) {
                    switch (nArray) {
                        case 1:
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
                        if (nArray == 2) {
                            if (this.isOver) {
                                // this.isGameOver=true;
                            }
                            this.isCollision = true;
                        }
                    }
                } else if (nRotate1 == 180) {
                    switch (nArray) {
                        case 1:
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
                        if (nArray == 2) {
                            if (this.isOver) {
                                // this.isGameOver=true;
                            }
                            this.isCollision = true;
                        }
                    }
                } else {
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
                        if (nArray == 2) {
                            if (this.isOver) {
                                // this.isGameOver=true;
                            }
                            this.isCollision = true;
                        }
                    }
                }
                break;
            case "Long":
                if (nRotate1 == 0 || nRotate1 == 360) {
                    if (nArray == 0) {

                        this.AddBoxNumber(nx, ny);
                    }
                    if (this.nBox == 1) {
                        this.DownBlock();
                    } else {
                        if (nArray == 1) {
                            if (this.isOver) {
                                // this.isGameOver=true;
                            }
                            this.isCollision = true;
                        }
                    }
                } else if (nRotate1 == 90) {

                    // if (nArray == 0) {
                    //     this.AddBoxNumber(nx, ny);
                    // }
                    switch (nArray) {
                        case 0:

                            this.AddBoxNumber(nx, ny);
                            break;
                        case 1:

                            this.AddBoxNumber(nx, ny);
                            break;
                    }

                    if (this.nBox == 2) {
                        this.DownBlock();
                    } else {
                        if (nArray == 1) {
                            if (this.isOver) {
                                // this.isGameOver=true;
                            }
                            this.isCollision = true;
                        }
                    }
                } else if (nRotate1 == 180) {
                    if (nArray == 1) {
                        this.AddBoxNumber(nx, ny);
                        cc.log(this.nBox + "this.nBox ");
                    }
                    if (this.nBox == 1) {
                        this.DownBlock();
                    } else {
                        if (nArray == 1) {
                            if (this.isOver) {
                                // this.isGameOver=true;
                            }
                            this.isCollision = true;
                        }
                    }
                } else {
                    cc.log("===============");
                    switch (nArray) {
                        case 0:
                            cc.log("00000000000000");
                            this.AddBoxNumber(nx, ny);
                            break;
                        case 1:
                            cc.log("1111111111111111");
                            this.AddBoxNumber(nx, ny);
                            break;
                    }
                    if (this.nBox == 2) {
                        this.DownBlock();
                    } else {
                        if (nArray == 1) {
                            if (this.isOver) {
                                // this.isGameOver=true;
                            }
                            this.isCollision = true;
                        }
                    }
                }
                break;
            case "Square":
                cc.log("Square");
                if (this.nColor == 1) {
                    switch (nArray) {
                        case 0:
                            cc.log(this.nBox + "Square");
                            cc.log(nArray);
                            this.AddBoxNumber(nx, ny);
                            break;
                        case 1:
                            cc.log(this.nBox + "Square");
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
                        }
                    }
                } else {
                    if (nRotate1 == 0 || nRotate1 == 360) {
                        switch (nArray) {
                            case 0:
                                this.AddBoxNumber(nx, ny);
                                break;
                            case 1:
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
                            }
                        }
                    } else if (nRotate1 == 90) {
                        switch (nArray) {
                            case 1:
                                this.AddBoxNumber(nx, ny);
                                break;
                            case 3:
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
                            }
                        }
                    } else if (nRotate1 == 180) {
                        switch (nArray) {
                            case 2:
                                this.AddBoxNumber(nx, ny);
                                break;
                            case 3:
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
                            }
                        }
                    } else {
                        switch (nArray) {
                            case 0:
                                this.AddBoxNumber(nx, ny);
                                break;
                            case 2:
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
                            }
                        }
                    }
                }
                break;
        }
    },
    start: function start() {},

    //判断噗呦块是否满足下落判定条件
    IsDown: function IsDown() {
        for (var i = 0; i <= this.puyouChild.length - 1; i++) {
            this.CountPosition(this.puyouChild[i]);
            if ((this.nPositionY + this.node.getPositionY() - cc.find("GroundParent").getPositionY()) % Global.nWidthPuYo == 0) {
                this.isDown = true;
            }
        }
    },
    CountPosition: function CountPosition(nodePuyo) {
        if (this.stringBoloekShape == "Long" && this.nColor == 2) {
            this.nPositionX = nodePuyo.getPositionX();
            this.nPositionY = nodePuyo.getPositionY();
        } else {
            switch (this.nRotateAngle) {
                case 0:
                    //赋值实际坐标
                    this.nPositionX = nodePuyo.getPositionX();
                    this.nPositionY = nodePuyo.getPositionY();
                    break;
                case 90:
                    this.nPositionX = nodePuyo.getPositionY();
                    this.nPositionY = -nodePuyo.getPositionX();
                    break;
                case 180:
                    this.nPositionX = -nodePuyo.getPositionX();
                    this.nPositionY = -nodePuyo.getPositionY();
                    break;
                case 270:
                    this.nPositionX = -nodePuyo.getPositionY();
                    this.nPositionY = nodePuyo.getPositionX();
                    break;
            }
        }
    },
    update: function update(dt) {
        if (this.isCollision == false && this.isGameOver == false) {
            //判断是否满足下落判定条件
            this.isDown = false;
            this.IsDown();
            if (this.isDown) {
                if (Global.game1Main.isRotate == false) {
                    this.BlockDown();
                    if (this.isCollision == false && this.isGameOver == false) {
                        this.node.y -= Global.nWidthPuYo / this.nDownSpeed;
                    }
                }
            } else {
                this.node.y -= Global.nWidthPuYo / this.nDownSpeed;
            }
        }
        if (this.isCollision) {
            cc.log("ssssssssssss");
            this.nCollisionBack++;
            if (this.nCollisionBack == 15) {
                for (var i = 0; i <= this.arrayX.length - 1; i++) {
                    cc.log(this.arrayX[i]);
                    cc.log(this.arrayY[i]);
                    Global.game1Main.userGroundChild[this.arrayX[i] - 1][this.arrayY[i] - 1].getComponent("BoxState").isBox = true;
                    Global.game1Main.userGroundChild[this.arrayX[i] - 1][this.arrayY[i] - 1].getComponent("BoxState").stringColor = this.puyouChild[this.arratSubScript[i]].getComponent("InitPrefabState").stringColor;
                    if (i == this.arrayX.length - 1) {
                        //打开噗呦块固定开关
                        this.isStationary = true;
                    }
                }
            }
        }
        // if (this.isStationary) {
        // }
    }
});

cc._RF.pop();