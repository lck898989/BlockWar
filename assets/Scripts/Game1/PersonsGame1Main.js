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
        nodeCanvas: {
            default: null,
            type: cc.Node
        },
        //生成敌人背景的预制体
        prefabEnemy: {
            default: null,
            type: cc.Prefab
        },
        //敌人预制体数组
        prefabEnemy1:{
            default:[],
            type:[cc.Prefab]
        },
        
        username : cc.Label,
        //敌人父体节点
        nodeEnemyParent: {
            default: null,
            type: cc.Node
        },
        //生成自己背景的预制体
        prefabUser: {
            default: null,
            type: cc.Prefab,
        },
        nodeUserParent: {
            default: null,
            type: cc.Node
        },
        //获取自己背景框节点
        groundUser: {
            default: null,
            type: cc.Node
        },
        //获取敌人背景框节点
        groundEnemy: {
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
        next1Node: {
            default: null,
            type: cc.Node
        },
        blockParent: {
            default: null,
            type: cc.Node
        }
        ,
        nodeDownButton: {
            default: null,
            type: cc.Node
        },
        nodeMove: {
            default: null,
            type: cc.Node
        },
        boxParent: {
            default: null,
            type: cc.Node
        },
        punishPrefab: {
            default: null,
            type: cc.Prefab
        },
        //结束场景
        overBackGround:{
            default:null,
            type:cc.Node
        },
        //点击事件音效
        clickAudio : {
            url : cc.AudioClip,
            default: null,
        },
        //失败音效
        loseAudio : {
            url : cc.AudioClip,
            default  : null,
        },
        //消除音效
        removeAudio : {
            url : cc.AudioClip,
            default : null,
        },
        //暂停界面
        pauseMenu : cc.Node,
        pauseRestart : cc.Node,
        pauseReturn : cc.Node,
        pauseGiveIn : cc.Node,
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
        darkNode      : cc.Node,
        operationNode : cc.Node,
    },
    pauseFunction : function(){
        //显示暂停菜单
        this.pauseMenu.active = true;
    },
    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        var self = this;
        this.darkNode.on("touchstart",function(){
            this.darkNode.active = false;
            this.operationNode.active = false;
        }.bind(this));
        this.operationNode.on("touchstart",function(){
            this.darkNode.active =false;
            this.operationNode.active = false;
        }.bind(this));
        this.pauseMenu.active = false;
        this.nLine = 0;
        //发送给服务器消息要初始化地图
        cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg({ "tag1": 10, "type": "", "score": cc.find("PebmanentNode").getComponent("UserInfo").nUserScore, "nMapRow": "", "nMapCol": "", "loading1": 1 });
        // // Global.CreatBackGround(this.groundChild,12,6,this.groundPrefab,this.nodeUserParent,Global.nWidthPuYo);
        //显示自己的名字
        this.username.string = cc.find("PebmanentNode").getComponent("UserInfo").nameUser;
        //初始化自己背景父节点的位置
        Global.SetBackground(this.groundUser, this.nodeUserParent, Global.nWidth, Global.nSide);
        //初始化敌人背景父节点的位置
        Global.SetBackground(this.groundEnemy, this.nodeEnemyParent, Global.nServerWidth, Global.nSide);
        //初始h背景子节点
        this.groundChild = [];
        //显示自己的游戏背景
        Global.CreatBackGround(this.groundChild, 20, 10, this.prefabUser, this.nodeUserParent, Global.nWidth);
        //初始化d敌人背景子节点
        this.enemyGroundChild = [];
        this.arrayChangeNode = [];
        //判断敌人是否消行
        this.isDisppearEnemy = false;
        //判断是否旋转状态
        this.isRotateState = false;
        //判断是否左右移动状态
        this.isMoveState = false;
        //判断敌人是否消除
        this.isDisppearState = false;
        this.girdSize = 50;
        this.isOver=false;
        //判断是否惩罚
        this.isPunish = false;
        //判断玩家是否胜利
        this.isWin=false;
        if (cc.sys.isNative) {
            var self = this;
            //判断手指是否离开滑动节点
            //获取出点的世界坐标
            this.positionTouchX = 0;
            this.isOutSlide = true;
            //判断手指是否离开下落节点
            this.isOutDown = true;
                 //显示用户信息
              cc.find("PebmanentNode").getComponent("UserInfo").LoadUser(cc.find("PebmanentNode").getComponent("UserInfo").pictureUser,cc.find("PebmanentNode").getComponent("UserInfo").nameUser,cc.find("UserName"),cc.find("UserPicture"));
            //  //旋转触屏
            //  this.nodeRotateButton.on(cc.Node.EventType.TOUCH_START, function (event) {

            //      self.rotateBlock();
            //   }, this);
            //下落触屏 
            //当手指落在下落节点上时
            this.nodeDownButton.on(cc.Node.EventType.TOUCH_START, function (event) {
                self.isOutDown = false;
            }, this);
            //当手指离开下落节点上时
            this.nodeDownButton.on(cc.Node.EventType.TOUCH_END, function (event) {
                self.isOutDown = true;
            }, this);
            //左右滑动触屏
            //当手指落在滑动节点上时
            this.nodeMove.on(cc.Node.EventType.TOUCH_START, function (event) {
                self.isOutSlide = false;
                self.positionTouchX = event.getLocationX();

            }, this);
            //当手指在滑动节点上移动时
            this.nodeMove.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
                self.isOutSlide = false;
                self.positionTouchX = event.getLocationX();
            }, this);
            //当手指离开滑动节点时
            this.nodeMove.on(cc.Node.EventType.TOUCH_END, function (event) {
                self.isOutSlide = true;
            }, this);
        }
        else {
            //获取出点的世界坐标
            this.positionTouchX = 0;
            //判断手指是否离开滑动节点
            this.isOutSlide = true;
            //判断手指是否落在滑动节点
            this.isOutDown = true;
            //当手指落在滑动节点上时
            this.nodeMove.on(cc.Node.EventType.TOUCH_START, function (event) {
               

            }, this);
            //当手指在滑动节点上移动时
            this.nodeMove.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
                self.isOutSlide = false;
                self.positionTouchX = event.getLocationX();
            }, this);
            //当手指离开滑动节点时
            this.nodeMove.on(cc.Node.EventType.TOUCH_END, function (event) {
                self.isOutSlide = false;
                self.positionTouchX = event.getLocationX();
            }, this);
            this.nodeMove.on(cc.Node.EventType.TOUCH_CANCEL, function (event) {
                self.isOutSlide = false;
                self.positionTouchX = event.getLocationX();
            }, this);
            //当手指落在下落节点上时
            this.nodeDownButton.on(cc.Node.EventType.TOUCH_START, function (event) {
                self.isOutDown = false;
            }, this);
            //当手指离开下落节点上时
            this.nodeDownButton.on(cc.Node.EventType.TOUCH_END, function (event) {
                self.isOutDown = true;
            }, this);
        }
        //判断是否第一次生成俄罗斯方块
        this.isFirst = false;
        // //显示用户信息
        // cc.find("PebmanentNode").getComponent("UserInfo").LoadUser(cc.find("PebmanentNode").getComponent("UserInfo").pictureUser,cc.find("PebmanentNode").getComponent("UserInfo").nameUser,cc.find("Canvas/UserName"),cc.find("UserPicture"),cc.find("UserPicture1"));
        Global.game1Main = this;
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
        //判断是否发送服务
        this.isSend=false;
        //  //随机生成俄罗斯方块
        //  this.GetBlock(); 
        this.boxParent1 = this.boxParent.getChildren();
        //初始化比赛结果
        this.lose=false;
        //  //显示敌人的游戏场景
        //  Global.CreatBackGround( this.enemyGroundChild2,20,10,this.prefabEnemy,this.nodeEnemyParent,Global.nServerWidth);
        //给服务器发送游戏 场景信息
        //重新开始界面
        this.pauseGiveIn.on("touchstart",function(){
            // this.pauseMenu.active = false;
            self.pauseMenu.active = false;
            // //向服务器发送投降消息
            // self.gameBye();
            var jsonData = {
                tag1            : 5,
                score           : "",
                type            : "1",
                state1          : "",
                changeMapList1  : [],
                removeMapList1  : 0,
                nMapRow         : "",
                nMapCol         : "",
                loading1        : "",
            }
            cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg(jsonData);
            //显示失败
            this.playAudio(this.loseAudio);
            //自己失败显示失败
            cc.find("NodeOverLose").active = true;
            //显示分数
            cc.find("NodeOverLose/Score").getComponent(cc.Label).string = this.score.toString();
            //回到多人选择界面
            cc.director.loadScene("PersonsChoose");
        }.bind(this));
        this.pauseRestart.on('touchstart',function(){
            cc.director.resume();
            self.pauseMenu.active = false;
            //发送消息给服务器
            var jsonData = {
                tag1            : 5,
                score           : "",
                type            : "1",
                state1          : "",
                changeMapList1  : [],
                removeMapList1  : 0,
                nMapRow         : "",
                nMapCol         : "",
                loading1        : "",
            }
            cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg(jsonData);
            //加载多人选择界面
            cc.director.loadScene("PersonsChoose");
        }.bind(this));
        //返回按钮
        this.pauseReturn.on("touchstart",function(){
            cc.director.resume();
            self.pauseMenu.active = false;
            //发送消息给服务器
            var jsonData = {
                tag1            : 5,
                score           : "",
                type            : "1",
                state1          : "",
                changeMapList1  : [],
                removeMapList1  : 0,
                nMapRow         : "",
                nMapCol         : "",
                loading1        : "",
            }
            cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg(jsonData);
            //加载多人选择界面
            cc.director.loadScene("PersonsChoose");
        }.bind(this));
    },
    //随机生成俄罗斯方块
    GetBlock: function () {
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
            //根据俄罗斯方块形状生成
            this.IsShape(this.shapeBlock, this.nShape);
        }
        else {
            //根据俄罗斯方块形状生成
            this.IsShape(this.shapeBlock, this.nShape);
        }
    },
/**
 * modified by lck 2018/7/12
 * start
 */
    //初始化敌人地图针对游戏2和游戏4
    initRivalMap : function(up,lr,back,row,col){
        //找到对手游戏
        var gameNode = cc.find("EnemyBox");
        //初始化y坐标(从下往上生成网格)
        var y = gameNode.height/2 - this.girdSize/2 - up;
        //初始化x坐标
        var x = -gameNode.width/2 + this.girdSize/2 + lr;
        console.log("--->>>>x is " + x);
        console.log("--->>>>row is " + row);
        console.log("--->>>>col is " + col);
        this.enemyGroundChild = [];
        this.map = [];
        //12行6列的网格
        for(let i = 0;i < row;i++){
            //设置它的y坐标
            var tempY = y - i * this.girdSize - 1;
            tempY = Number(tempY.toFixed(2));
            console.log("--->>>>tempY is " + tempY);
            this.enemyGroundChild[i] = [];
            this.map[i] = [];
            for(let j = 0; j < col;j++){
                var outArr = this.enemyGroundChild[i];
                var mapData = this.map[i];
                var tempX = x + j * this.girdSize + 1;
                tempX = Number(tempX.toFixed(2));
                console.log("--->>>>tempX is " + tempX);
                //y坐标不变，x坐标要变
                var tempPrefab = this.setPrefabPosition(back,tempX,tempY,gameNode);
                if(arguments.length === 6){
                    tempPrefab.getComponent(arguments[5]).isFilled = 0;
                    // tempPrefab.isFilled = 0;
                    // console.log("tempPrefab.isFilled is " + tempPrefab.isFilled);
                    tempPrefab.getComponent(arguments[5]).type = -1;
                    tempPrefab.getComponent(arguments[5]).innerNode = null;
                }else if(arguments.length === 5){
                    // var node = new Shape(tempPrefab,-1);
                    tempPrefab.getComponent("Back").isFilled = 0;
                    // tempPrefab.isFilled = 0;
                    // console.log("tempPrefab.isFilled is " + tempPrefab.isFilled);
                    tempPrefab.getComponent("Back").type = -1;
                    tempPrefab.getComponent("Back").innerNode = null;
                }
                // var shape = new Shape(tempPrefab,-1);
                outArr[j]=tempPrefab;
                mapData[j] = 0;
            }
        }
        console.log("enemyGroundChild is " +this.enemyGroundChild);
    },
     /**
    @param prefab:将要生成预制节点的预制体
    @param x     :将要生成预制节点的x坐标
    @param y     :将要生成预制节点的y坐标
    @param parentNode : 生成的预制节点的父节点
     */
    setPrefabPosition : function(prefab,x,y,parentNode){
        var prefab = this.createPrefab(prefab);
        prefab.setPosition(x,y);
        parentNode.addChild(prefab);
        return prefab;
    },
    //创建一个预制体节点
    createPrefab : function(prefab){
        var prefabNode = cc.instantiate(prefab);
        return prefabNode;
    },
/**
 * modified by lck 2018/7/12
 * end
 */
    //遍历全局字块数组并消除整行方块isBox都为true的节点
    TraversalNodeBox: function (nPositionY) {
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
    //俄罗斯方块旋转
    RotateBlock: function () {
        if (this.nodeBlock.getComponent("OperateBlock").isStationary == false) {
            this.playAudio(this.clickAudio);
            if (this.nodeBlock.getComponent("OperateBlock").stringBoloekShape == "Square") {
                return;
            }
            else {
                this.TraverseRotate();
            }
        }
    },
    //返回触摸点对应的俄罗斯方块的列数
    GetTouchLine: function (worldPosition) {
        //将触摸点的横坐标转化为本地坐标
        var nodePosition = worldPosition - (this.nodeMove.getPositionX() + this.nodeCanvas.getPositionX());
        cc.log(nodePosition);
        if (nodePosition > 0) {
            var nWidth1 = Math.floor(nodePosition / (this.nodeMove.width / 20));
            if (nWidth1 == 0 || nWidth1 == 1) {
                this.nLine = 6;
            }
            else if (nWidth1 == 2 || nWidth1 == 3) {
                this.nLine = 7;
            }
            else if (nWidth1 == 4 || nWidth1 == 5) {
                this.nLine = 8;
            }
            else if (nWidth1 == 6 || nWidth1 == 7) {
                this.nLine = 9;
            }
            else {
                this.nLine = 10;
            }
            cc.log(this.nLine);
            return this.nLine;
        }
        if (nodePosition < 0) {
            var nWidth1 = Math.floor((-nodePosition) / (this.nodeMove.width / 20));
            if (nWidth1 == 0 || nWidth1 == 1) {
                this.nLine = 5;
            }
            else if (nWidth1 == 2 || nWidth1 == 3) {
                this.nLine = 4;
            }
            else if (nWidth1 == 4 || nWidth1 == 5) {
                this.nLine = 3;
            }
            else if (nWidth1 == 6 || nWidth1 == 7) {
                this.nLine = 2;
            }
            else {
                this.nLine = 1;
            }
            cc.log(this.nLine);
            return this.nLine;
        }
    },
    TraverseRotate: function () {
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
        }
        else {
            if (nRowY[0] >= 19) {
                return;
            }
        }
        this.arrayChangeNode = [];
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
                nLineX.push(nX1);
                nRowY.push(nY1);
                this.arrayChangeNode.push({ "row": nY1 - 1, "col": nX1 - 1, "color": "white" });
                // this.groundChild[nX1 - 1][nY1 - 1].getComponent("PrefabState").isBox = false;
                isZero = true;
            }
            else {
                //将旋转前的方块置为false
                var nX1 = (nodeBoxArray[i].getPositionX() + this.nodeBlock.getPositionX() - cc.find("GroundParent").getPositionX()) / Global.nWidth + 1;
                var nY1 = (nodeBoxArray[i].getPositionY() + this.nodeBlock.getPositionY() - cc.find("GroundParent").getPositionY()) / Global.nWidth + 1;
                nLineX.push(nX1);
                nRowY.push(nY1);
                this.arrayChangeNode.push({ "row": nY1 - 1, "col": nX1 - 1, "color": "white" });
                // this.groundChild[nX1 - 1][nY1 - 1].getComponent("PrefabState").isBox = false;
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
            }
            else {
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
                        this.arrayChangeNode.push({ "row": nY1 - 1, "col": nX1 - 1, "color": this.nodeBlock.getComponent("OperateBlock").stringColor });
                        // this.groundChild[nX1 - 1][nY1 - 1].getComponent("PrefabState").isBox = true;
                        // this.groundChild[nX1 - 1][nY1 - 1].getComponent("PrefabState").stringColor = this.nodeBlock.getComponent("OperateBlock").stringColor;
                    }
                    this.isRotateState = true;
                    //初始化 1s计时器
                    this.nodeBlock.getComponent("OperateBlock").fCollisionTime = 0;
                    this.nodeBlock.getComponent("OperateBlock").nRotateAngle += 90;
                    if (this.nodeBlock.getComponent("OperateBlock").nRotateAngle == 360) {
                        this.nodeBlock.getComponent("OperateBlock").nRotateAngle = 0;
                    }
                }
                if (isHasBox) {
                    //将置为false的方块还原属性
                    for (var i = 0; i <= 3; i++) {
                        this.arrayChangeNode.push({ "row": nRowY[i] - 1, "col": nLineX[i] - 1, "color": this.nodeBlock.getComponent("OperateBlock").stringColor });
                        // this.groundChild[nLineX[i] - 1][nRowY[i] - 1].getComponent("PrefabState").isBox = true;
                        // this.groundChild[nLineX[i] - 1][nRowY[i] - 1].getComponent("PrefabState").stringColor = this.nodeBlock.getComponent("OperateBlock").stringColor;
                    }
                }
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

                                                    //还原未旋转移动前的box的true属性
                                                    for (var j = 0; j <= 3; j++) {
                                                        this.arrayChangeNode.push({ "row": nRowY[j] - 1, "col": nLineX[j] - 1, "color": this.nodeBlock.getComponent("OperateBlock").stringColor });
                                                        // this.groundChild[nLineX[j] - 1][nRowY[j] - 1].getComponent("PrefabState").isBox = true;
                                                        // this.groundChild[nLineX[j] - 1][nRowY[j] - 1].getComponent("PrefabState").stringColor = this.nodeBlock.getComponent("OperateBlock").stringColor;
                                                    }
                                                    return;
                                                }
                                                else {
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
                                                        this.arrayChangeNode.push({ "row": nMoveY[i] - 1, "col": nMoveX[i] - 1, "color": this.nodeBlock.getComponent("OperateBlock").stringColor });
                                                        //将旋转移动后的方块置为true
                                                        // this.groundChild[nMoveX[i] - 1][nMoveY[i] - 1].getComponent("PrefabState").isBox = true;
                                                        // this.groundChild[nMoveX[i] - 1][nMoveY[i] - 1].getComponent("PrefabState").stringColor = this.nodeBlock.getComponent("OperateBlock").stringColor;
                                                        this.isRotateState = true;
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
                                                    //还原未旋转移动前的box的true属性
                                                    for (var j = 0; j <= 3; j++) {
                                                        this.arrayChangeNode.push({ "row": nRowY[j] - 1, "col": nLineX[j] - 1, "color": this.nodeBlock.getComponent("OperateBlock").stringColor });
                                                        // this.groundChild[nLineX[j] - 1][nRowY[j] - 1].getComponent("PrefabState").isBox = true;
                                                        // this.groundChild[nLineX[j] - 1][nRowY[j] - 1].getComponent("PrefabState").stringColor = this.nodeBlock.getComponent("OperateBlock").stringColor;
                                                    }
                                                    return;
                                                }
                                                else {
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
                                                        this.arrayChangeNode.push({ "row": nMoveY[i] - 1, "col": nMoveX[i] - 1, "color": this.nodeBlock.getComponent("OperateBlock").stringColor });
                                                        //将旋转移动后的方块置为true
                                                        // this.groundChild[nMoveX[i] - 1][nMoveY[i] - 1].getComponent("PrefabState").isBox = true;
                                                        // this.groundChild[nMoveX[i] - 1][nMoveY[i] - 1].getComponent("PrefabState").stringColor = this.nodeBlock.getComponent("OperateBlock").stringColor;
                                                        this.isRotateState = true;
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
                                                    //还原未旋转移动前的box的true属性
                                                    for (var j = 0; j <= 3; j++) {
                                                        this.arrayChangeNode.push({ "row": nRowY[j] - 1, "col": nLineX[j] - 1, "color": this.nodeBlock.getComponent("OperateBlock").stringColor });
                                                        // this.groundChild[nLineX[j] - 1][nRowY[j] - 1].getComponent("PrefabState").isBox = true;
                                                        // this.groundChild[nLineX[j] - 1][nRowY[j] - 1].getComponent("PrefabState").stringColor = this.nodeBlock.getComponent("OperateBlock").stringColor;
                                                    }
                                                    return;
                                                }
                                                else {
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
                                                        this.arrayChangeNode.push({ "row": nMoveY[i] - 1, "col": nMoveX[i] - 1, "color": this.nodeBlock.getComponent("OperateBlock").stringColor });
                                                        //将旋转移动后的方块置为true
                                                        // this.groundChild[nMoveX[i] - 1][nMoveY[i] - 1].getComponent("PrefabState").isBox = true;
                                                        // this.groundChild[nMoveX[i] - 1][nMoveY[i] - 1].getComponent("PrefabState").stringColor = this.nodeBlock.getComponent("OperateBlock").stringColor;
                                                        this.isRotateState = true;
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
                                                    //还原未旋转移动前的box的true属性
                                                    for (var j = 0; j <= 3; j++) {
                                                        this.arrayChangeNode.push({ "row": nRowY[j] - 1, "col": nLineX[j] - 1, "color": this.nodeBlock.getComponent("OperateBlock").stringColor });
                                                        // this.groundChild[nLineX[j] - 1][nRowY[j] - 1].getComponent("PrefabState").isBox = true;
                                                        // this.groundChild[nLineX[j] - 1][nRowY[j] - 1].getComponent("PrefabState").stringColor = this.nodeBlock.getComponent("OperateBlock").stringColor;
                                                    }
                                                    return;
                                                }
                                                else {
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
                                                        this.arrayChangeNode.push({ "row": nMoveY[i] - 1, "col": nMoveX[i] - 1, "color": this.nodeBlock.getComponent("OperateBlock").stringColor });
                                                        // //将旋转移动后的方块置为true
                                                        // this.groundChild[nMoveX[i] - 1][nMoveY[i] - 1].getComponent("PrefabState").isBox = true;
                                                        // this.groundChild[nMoveX[i] - 1][nMoveY[i] - 1].getComponent("PrefabState").stringColor = this.nodeBlock.getComponent("OperateBlock").stringColor;
                                                        this.isRotateState = true;
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
    //根据俄罗斯方块类型设置位置
    setBlockPosition: function (stringShape1, stringRotate) {
        switch (stringShape1) {
            case "Square":
                //获取方块的世界坐标
                var v2WorldY = this.nodeUserParent.getPositionY() + 20 * Global.nWidth + Global.nWidth / 2;
                //    var nRandom=Global.nWidth*3+Math.floor(cc.random0To1()*6)*Global.nWidth;
                //    var v1WorldX=(nRandom+nRandom+Global.nWidth)/2;
                var v1WorldX = this.nodeUserParent.getPositionX() + Global.nWidth / 2 + 4 * Global.nWidth;
                cc.log(v1WorldX);
                cc.log(v2WorldY);
                return cc.p(v1WorldX, v2WorldY);
                break;
            case "T":
                switch (stringRotate) {
                    case "0":
                        //获取方块的世界坐标              
                        var v2WorldY = this.nodeUserParent.getPositionY() + 21 * Global.nWidth;
                        var v1WorldX = this.nodeUserParent.getPositionX() + 5 * Global.nWidth;
                        cc.log(v1WorldX);
                        cc.log(v2WorldY);
                        return cc.p(v1WorldX, v2WorldY);
                        break;
                    case "180":
                        //获取方块的世界坐标    
                        var v2WorldY = this.nodeUserParent.getPositionY() + 20 * Global.nWidth;
                        var v1WorldX = this.nodeUserParent.getPositionX() + 5 * Global.nWidth;
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
                        var v2WorldY = this.nodeUserParent.getPositionY() + 20 * Global.nWidth;
                        var v1WorldX = this.nodeUserParent.getPositionX() + 4 * Global.nWidth;
                        cc.log(v1WorldX);
                        cc.log(v2WorldY);
                        return cc.p(v1WorldX, v2WorldY);
                        break;
                    case "180":
                        //获取方块的世界坐标    
                        var v2WorldY = this.nodeUserParent.getPositionY() + 21 * Global.nWidth;
                        var v1WorldX = this.nodeUserParent.getPositionX() + 6 * Global.nWidth;
                        cc.log(v1WorldX);
                        cc.log(v2WorldY);
                        return cc.p(v1WorldX, v2WorldY);
                        break;
                }
                break;
            case "Long":
                switch (stringRotate) {
                    case "0":
                        var v2WorldY = this.nodeUserParent.getPositionY() + 20 * Global.nWidth;
                        var v1WorldX = this.nodeUserParent.getPositionX() + 4 * Global.nWidth;
                        cc.log(v1WorldX);
                        cc.log(v2WorldY);
                        return cc.p(v1WorldX, v2WorldY);
                        break;
                    case "180":
                        var v2WorldY = this.nodeUserParent.getPositionY() + 20 * Global.nWidth;
                        var v1WorldX = this.nodeUserParent.getPositionX() + 5 * Global.nWidth;
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
                        var v2WorldY = this.nodeUserParent.getPositionY() + 21 * Global.nWidth;
                        var v1WorldX = this.nodeUserParent.getPositionX() + 4 * Global.nWidth;
                        cc.log(v1WorldX);
                        cc.log(v2WorldY);
                        return cc.p(v1WorldX, v2WorldY);
                        break;
                    case "180":
                        //获取方块的世界坐标    
                        var v2WorldY = this.nodeUserParent.getPositionY() + 20 * Global.nWidth;
                        var v1WorldX = this.nodeUserParent.getPositionX() + 4 * Global.nWidth;
                        cc.log(v1WorldX);
                        cc.log(v2WorldY);
                        return cc.p(v1WorldX, v2WorldY);
                        break;
                }
                break;
        }
    },
    //当俄罗斯方块落下后初始化信息
    OnLoadBlock: function (stringShape, nBlock, stringRotate, stringColor3) {
        switch (stringShape) {
            //  this.shapeBlock=["T","L","Long","Z","Square"];
            case "Long":
                switch (nBlock) {
                    case 0:
                        this.nodeBlock.destroy();
                        //生成俄罗斯方块
                        this.nodeBlock = cc.instantiate(this.prefabLong);
                        //获取此时方块的形状
                        this.nodeBlock.parent = this.blockParent;
                        this.TarvelFalse();
                        //随机方块位置
                        this.nodeBlock.setPosition(this.setBlockPosition("Long", stringRotate));
                        cc.log(this.nodeBlock.getPosition());
                        this.nodeBlock.getComponent("OperateBlock").stringColor = stringColor3;
                        this.nodeBlock.getComponent("OperateBlock").stringBoloekShape = stringShape;
                        this.nodeBlock.getComponent("OperateBlock").nRotateAngle = parseInt(stringRotate);
                        // this.nodeBlock.getComponent("OperateBlock").isStartDown = true;
                        break;
                    case 1:

                        this.nodeBlock1.destroy();
                        this.nodeBlock1 = cc.instantiate(this.prefabLong);
                        //获取此时方块的形状
                        this.nodeBlock1.parent = this.blockParent;
                        //随机方块位置
                        this.nodeBlock1.setPosition(this.setBlock1Position("Long", this.next1Node, stringRotate));
                        this.nodeBlock1.getComponent("OperateBlock").stringColor = stringColor3;
                        this.nodeBlock1.getComponent("OperateBlock").nRotateAngle = parseInt(stringRotate);
                        this.nodeBlock1.getComponent("OperateBlock").stringBoloekShape = stringShape;
                        break;
                }
                break;
            case "Z":
                switch (nBlock) {
                    case 0:
                        this.nodeBlock.destroy();
                        //生成俄罗斯方块
                        this.nodeBlock = cc.instantiate(this.prefabZ);
                        //获取此时方块的形状
                        this.nodeBlock.parent = this.blockParent;
                        this.TarvelFalse();
                        //随机方块位置
                        this.nodeBlock.setPosition(this.setBlockPosition("Z", stringRotate));
                        cc.log(this.nodeBlock.getPosition());
                        this.nodeBlock.getComponent("OperateBlock").stringColor = stringColor3;
                        this.nodeBlock.getComponent("OperateBlock").stringBoloekShape = stringShape;
                        this.nodeBlock.getComponent("OperateBlock").nRotateAngle = parseInt(stringRotate);
                        // this.nodeBlock.getComponent("OperateBlock").isStartDown = true;
                        break;
                    case 1:
                        this.nodeBlock1.destroy();
                        this.nodeBlock1 = cc.instantiate(this.prefabZ);
                        //获取此时方块的形状
                        this.nodeBlock1.parent = this.blockParent;
                        this.nodeBlock1.getComponent("OperateBlock").stringColor = stringColor3;
                        this.nodeBlock1.getComponent("OperateBlock").nRotateAngle = parseInt(stringRotate);
                        //随机方块位置
                        this.nodeBlock1.setPosition(this.setBlock1Position("Z", this.next1Node, stringRotate));
                        this.nodeBlock1.getComponent("OperateBlock").nRotateAngle = parseInt(stringRotate);
                        this.nodeBlock1.getComponent("OperateBlock").stringBoloekShape = stringShape;
                        break;

                }
                break;
            case "Square":
                switch (nBlock) {
                    case 0:
                        this.nodeBlock.destroy();
                        //生成俄罗斯方块
                        this.nodeBlock = cc.instantiate(this.prefabSquare);
                        //获取此时方块的形状
                        this.nodeBlock.parent = this.blockParent;
                        this.nodeBlock.getComponent("OperateBlock").stringColor = stringColor3;
                        this.TarvelFalse();
                        //随机方块位置
                        this.nodeBlock.setPosition(this.setBlockPosition("Square", stringRotate));
                        cc.log(this.nodeBlock.getPosition());
                        this.nodeBlock.getComponent("OperateBlock").stringBoloekShape = stringShape;
                        this.nodeBlock.getComponent("OperateBlock").nRotateAngle = 0;
                        // this.nodeBlock.getComponent("OperateBlock").isStartDown = true;
                        break;
                    case 1:
                        this.nodeBlock1.destroy();
                        this.nodeBlock1 = cc.instantiate(this.prefabSquare);
                        //获取此时方块的形状
                        this.nodeBlock1.parent = this.blockParent;
                        this.nodeBlock1.getComponent("OperateBlock").stringColor = stringColor3;
                        this.nodeBlock1.setPosition(this.setBlock1Position("Square", this.next1Node, stringRotate));
                        this.nodeBlock1.getComponent("OperateBlock").nRotateAngle = 0;
                        this.nodeBlock1.getComponent("OperateBlock").stringBoloekShape = stringShape;
                        break;
                }
                break;
            case "T":
                switch (nBlock) {
                    case 0:
                        this.nodeBlock.destroy();
                        //生成俄罗斯方块
                        this.nodeBlock = cc.instantiate(this.prefabT);
                        //获取此时方块的形状
                        this.nodeBlock.parent = this.blockParent;
                        this.nodeBlock.getComponent("OperateBlock").stringColor = stringColor3;
                        this.TarvelFalse();
                        //随机方块位置
                        this.nodeBlock.setPosition(this.setBlockPosition("T", stringRotate));
                        cc.log(this.nodeBlock.getPosition());
                        this.nodeBlock.getComponent("OperateBlock").nRotateAngle = parseInt(stringRotate);
                        this.nodeBlock.getComponent("OperateBlock").stringBoloekShape = stringShape;
                        // this.nodeBlock.getComponent("OperateBlock").isStartDown = true;
                        break;
                    case 1:
                        this.nodeBlock1.destroy();
                        this.nodeBlock1 = cc.instantiate(this.prefabT);
                        //获取此时方块的形状
                        this.nodeBlock1.parent = this.blockParent;
                        this.nodeBlock1.getComponent("OperateBlock").stringColor = stringColor3;
                        this.nodeBlock1.setPosition(this.setBlock1Position("T", this.next1Node, stringRotate));
                        this.nodeBlock1.getComponent("OperateBlock").nRotateAngle = parseInt(stringRotate);
                        this.nodeBlock1.getComponent("OperateBlock").stringBoloekShape = stringShape;
                        break;
                }
                break;
            case "L":
                switch (nBlock) {
                    case 0:
                        this.nodeBlock.destroy();
                        //生成俄罗斯方块
                        this.nodeBlock = cc.instantiate(this.prefabL);
                        //获取此时方块的形状
                        this.nodeBlock.parent = this.blockParent;
                        this.nodeBlock.getComponent("OperateBlock").stringColor = stringColor3;
                        this.TarvelFalse();
                        //随机方块位置
                        this.nodeBlock.setPosition(this.setBlockPosition("L", stringRotate));
                        cc.log(this.nodeBlock.getPosition());
                        this.nodeBlock.getComponent("OperateBlock").nRotateAngle = parseInt(stringRotate);
                        this.nodeBlock.getComponent("OperateBlock").stringBoloekShape = stringShape;
                        // this.nodeBlock.getComponent("OperateBlock").isStartDown = true;
                        break;
                    case 1:
                        this.nodeBlock1.destroy();
                        this.nodeBlock1 = cc.instantiate(this.prefabL);
                        //获取此时方块的形状
                        this.nodeBlock1.parent = this.blockParent;
                        this.nodeBlock1.getComponent("OperateBlock").stringColor = stringColor3;
                        this.nodeBlock1.setPosition(this.setBlock1Position("L", this.next1Node, stringRotate));
                        this.nodeBlock1.getComponent("OperateBlock").nRotateAngle = parseInt(stringRotate);
                        this.nodeBlock1.getComponent("OperateBlock").stringBoloekShape = stringShape;
                        break;
                }
                break;
        }

    },
    //根据第二个俄罗斯方块的类型设置位置
    setBlock1Position: function (stringShape1, nodePosition3, stringRotate) {
        switch (stringShape1) {
            case "Square":
                //获取方块的世界坐标
                var v2WorldY = nodePosition3.getPositionY();
                var v1WorldX = nodePosition3.getPositionX();
                return cc.p(v1WorldX, v2WorldY);
                break;
            case "T":
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
            case "L":
                switch (stringRotate) {
                    case "0":

                        //获取方块的世界坐标
                        var v2WorldY = nodePosition3.getPositionY();
                        var v1WorldX = nodePosition3.getPositionX() - Global.nWidth;
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
                        var v1WorldX = nodePosition3.getPositionX() - Global.nWidth;
                        return cc.p(v1WorldX, v2WorldY);
                        break;
                    case "180":
                        //获取方块的世界坐标    
                        var v2WorldY = nodePosition3.getPositionY();
                        var v1WorldX = nodePosition3.getPositionX();
                        return cc.p(v1WorldX, v2WorldY);
                        break;
                }
                return cc.p(v1WorldX, v2WorldY);
                break;
            case "Z":
                switch (stringRotate) {
                    case "0":

                        //获取方块的世界坐标
                        var v2WorldY = nodePosition3.getPositionY();
                        var v1WorldX = nodePosition3.getPositionX() - Global.nWidth;
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
    //便遍历俄罗斯方块火苏组，并使它们生成时为隐藏
    TarvelFalse: function () {
        var blockChild = this.nodeBlock.getChildren();
        for (var i = 0; i <= blockChild.length - 1; i++) {
            blockChild[i].active = false;
        }
    },
    //初始化每个俄罗斯方块的颜色
    OnloadColor: function (stringColor1, nodeBlock3) {
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
        }
    },
    //生成方块
    CopyBlock: function (prefabLBlock, stringShape1) {
        cc.log("bbbbbbbbbbbbbbbbbbbbbbbbbbb");
        if (this.isFirst == false) {
            switch (this.nCreat) {
                case 0:
                    //生成俄罗斯方块
                    this.nodeBlock = cc.instantiate(prefabLBlock);
                    this.TarvelFalse();
                    //获取此时方块的形状
                    this.nodeBlock.parent = this.blockParent;
                    //随机方块位置
                    this.nodeBlock.setPosition(this.setBlockPosition(this.shapeBlock[this.nShape], this.rotateBlock[this.nRotate]));
                    cc.log(this.nodeBlock.getPosition());
                    this.nodeBlock.getComponent("OperateBlock").stringBoloekShape = stringShape1;
                    // this.nodeBlock.getComponent("OperateBlock").isStartDown = true;
                    break;
                case 1:
                    //生成俄罗斯方块
                    this.nodeBlock1 = cc.instantiate(prefabLBlock);
                    //获取此时方块的形状
                    this.nodeBlock1.parent = this.blockParent;
                    cc.log("bbbbbbbbbbbbbbbbbbbbbbbbbbb");
                    this.nodeBlock1.setPosition(this.setBlock1Position(this.shapeBlock[this.nShape], this.next1Node, this.rotateBlock[this.nRotate]));
                    this.nodeBlock1.getComponent("OperateBlock").stringBoloekShape = stringShape1;
                    break;
            }
        }
        else {
            this.OnLoadBlock(this.nodeBlock1.getComponent("OperateBlock").stringBoloekShape, 0, this.nodeBlock1.getComponent("OperateBlock").nRotateAngle.toString(), this.nodeBlock1.getComponent("OperateBlock").stringColor);
            this.OnLoadBlock(stringShape1, 1, this.rotateBlock[this.nRotate], this.colorBlock[this.nColor]);
        }
    },
    //改变方块颜色
    ChangeColor: function (stringColor1) {
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

            }
        }
        else {
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
            }
            cc.loader.loadRes("picture/" + stringColor0, cc.SpriteFrame, function (err, txt) {
                for (var i = 0; i <= 3; i++) {
                    nodeBlockChild[i].getComponent(cc.Sprite).spriteFrame = txt;
                }
            });
            var nodeBlockChild1 = this.nodeBlock1.getChildren();
            // var stringColor2 = "";
            // // cc.log(this.nodeBlock2.getComponent("OperateBlock").stringColor);
            // switch (this.nodeBlock1.getComponent("OperateBlock").stringColor) {
            //     case "red":
            //         stringColor2 = "3";
            //         break;
            //     case "blue":
            //         stringColor2 = "2";
            //         break;
            //     case "green":
            //         stringColor2 = "1";
            //         break;
            // }
            // cc.log(stringColor2);
            for (var i = 0; i <= nodeBlockChild1.length - 1; i++) {
                nodeBlockChild1[i].active = false;
            }
            cc.loader.loadRes("picture/" + stringColor1, cc.SpriteFrame, function (err, txt) {
                for (var i = 0; i <= 3; i++) {
                    nodeBlockChild1[i].getComponent(cc.Sprite).spriteFrame = txt;
                    if (i == 3) {
                        for (var j = 0; j <= nodeBlockChild1.length - 1; j++){
                            nodeBlockChild1[j].active = true;
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
    //判断方块角度
    IsRotate: function (stringRotate, nRotate, stringShape2) {
        if (stringShape2 != "Square") {
            switch (stringRotate[nRotate]) {
                case "0":
                    this.ChangeRotate(0);
                    break;
                case "180":
                    this.ChangeRotate(180);
                    break;
            }
        }
        else {
            switch (this.nCreat) {
                case 0:
                    this.nodeBlock.getComponent("OperateBlock").nRotateAngle = 0;
                    break;
                case 1:
                    this.nodeBlock1.getComponent("OperateBlock").nRotateAngle = 0;
                    break;
            }
            if (this.isFirst) {
                var nodeBoxArray = this.nodeBlock.getChildren();
                cc.log("ppppppppppppppppppppppppppppppppppppppp"+this.nodeBlock.getComponent("OperateBlock").nRotateAngle);
                if (this.nodeBlock.getComponent("OperateBlock").nRotateAngle == 180) {
                    cc.log("qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq"+this.nodeBlock.getComponent("OperateBlock").nRotateAngle);
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
                if (parseInt(stringRotate[nRotate]) == 180) {
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
                this.nodeBlock.getComponent("OperateBlock").isStartDown = true;
            }
            this.nCreat++;
            if (this.nCreat == 2) {
                this.nodeBlock.getComponent("OperateBlock").isStartDown = true;
                this.isFirst = true;
            }
        }
    },
    //出生时根据角度改变子块位置
    ChangeRotate: function (nAngle) {
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
                    }
                    else {
                        this.nodeBlock.getComponent("OperateBlock").nRotateAngle = 0;
                    }
                    break;
                case 1:
                    //获取此方块的数组
                    var nodeBoxArray1 = this.nodeBlock1.getChildren();
                    if (nAngle == 180) {
                        this.nodeBlock1.getComponent("OperateBlock").nRotateAngle = 180;
                        for (var i = 0; i <= 3; i++) {
                            nodeBoxArray1[i].setPosition(cc.p(nodeBoxArray1[i].getPositionY(), -nodeBoxArray1[i].getPositionX()));
                            if (i == 3) {
                                for (var j = 0; j <= 3; j++) {
                                    nodeBoxArray1[j].setPosition(cc.p(nodeBoxArray1[j].getPositionY(), -nodeBoxArray1[j].getPositionX()));
                                }
                            }
                        }
                    }
                    else {
                        this.nodeBlock1.getComponent("OperateBlock").nRotateAngle = 0;
                    }
                    break;
            }
            this.nCreat++;
            if (this.nCreat == 2) {
                cc.log(this.nodeBlock.getComponent("OperateBlock").stringColor);
                cc.log(this.nodeBlock1.getComponent("OperateBlock").stringColor);
                this.nodeBlock.getComponent("OperateBlock").isStartDown = true;
                this.isFirst = true;
            }
        }
        else {
            var nodeBoxArray = this.nodeBlock.getChildren();
            if (this.nodeBlock.getComponent("OperateBlock").nRotateAngle == 180) {
                // this.nodeBlock.getComponent("OperateBlock").nRotateAngle = 180;
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
            if (nAngle == 180) {
                // this.nodeBlock1.getComponent("OperateBlock").nRotateAngle = 180;
                for (var i = 0; i <= 3; i++) {
                    nodeBoxArray1[i].setPosition(cc.p(nodeBoxArray1[i].getPositionY(), -nodeBoxArray1[i].getPositionX()));
                    if (i == 3) {
                        for (var j = 0; j <= 3; j++) {
                            nodeBoxArray1[j].setPosition(cc.p(nodeBoxArray1[j].getPositionY(), -nodeBoxArray1[j].getPositionX()));
                        }
                    }
                }
            }     
            this.nodeBlock.getComponent("OperateBlock").isStartDown = true;
        }
    },
    //判断方块形状
    IsShape: function (stringShape, nShape) {
        switch (stringShape[nShape]) {
            case "T":
                //生成方块
                this.CopyBlock(this.prefabT, "T");
                //判断方块颜色
                this.IsColor(this.colorBlock, this.nColor);
                this.IsRotate(this.rotateBlock, this.nRotate, "T");
                //  this.nRotateAngle   
                break;
            case "L":
                this.CopyBlock(this.prefabL, "L");
                //判断方块颜色
                this.IsColor(this.colorBlock, this.nColor);
                this.IsRotate(this.rotateBlock, this.nRotate, "L");
                break;
            case "Long":
                this.CopyBlock(this.prefabLong, "Long");
                //判断方块颜色
                this.IsColor(this.colorBlock, this.nColor);
                this.IsRotate(this.rotateBlock, this.nRotate, "Long");
                break;
            case "Z":
                this.CopyBlock(this.prefabZ, "Z");
                //判断方块颜色
                this.IsColor(this.colorBlock, this.nColor);
                this.IsRotate(this.rotateBlock, this.nRotate, "Z");
                break;
            case "Square":
                this.CopyBlock(this.prefabSquare, "Square");
                //判断方块颜色
                this.IsColor(this.colorBlock, this.nColor);
                this.IsRotate(this.rotateBlock, this.nRotate, "Square");
                break;
        }
    },
    //判断方块颜色
    IsColor: function (stringColor, nColor) {
        switch (stringColor[nColor]) {
            case "blue":
                this.ChangeColor("2");
                break;
            case "green":
                this.ChangeColor("1");
                break;
            case "red":
                this.ChangeColor("3");
                break;
        }
    },
    start() {

    },
    //返回触摸点对应的俄罗斯方块的列数
    GetTouchLine: function (worldPosition) {
        //将触摸点的横坐标转化为本地坐标
        var nodePosition = worldPosition - (this.nodeMove.getPositionX() + this.nodeCanvas.getPositionX());
        if (nodePosition > 0) {
            var nWidth1 = Math.floor(nodePosition / (this.nodeMove.width / 20));
            //初始化列数
            var nLine = 0;
            if (nWidth1 == 0 || nWidth1 == 1) {
                nLine = 6;
            }
            else if (nWidth1 == 2 || nWidth1 == 3) {
                nLine = 7;

            }
            else if (nWidth1 == 4 || nWidth1 == 5) {
                nLine = 8;

            }
            else if (nWidth1 == 6 || nWidth1 == 7) {
                nLine = 9;
            }
            else {
                nLine = 10;
            }
            cc.log(nLine);
            return nLine;
        }
        if (nodePosition < 0) {
            var nWidth1 = Math.floor((-nodePosition) / (this.nodeMove.width / 20));
            //初始化列数
            var nLine = 0;
            if (nWidth1 == 0 || nWidth1 == 1) {
                nLine = 5;

            }
            else if (nWidth1 == 2 || nWidth1 == 3) {
                nLine = 4;

            }
            else if (nWidth1 == 4 || nWidth1 == 5) {
                nLine = 3;

            }
            else if (nWidth1 == 6 || nWidth1 == 7) {
                nLine = 2;

            }
            else {
                nLine = 1;
            }
            cc.log(nLine);
            return nLine;
        }
    },
    //获取俄罗斯方块的列数
    GetBlockLine: function () {
        var nLine = (this.nodeBlock.getPositionX() - this.nodeUserParent.getPositionX()) / Global.nWidth + 1;
        return nLine;
    },
    //物体下落后将状态发送到服务器
    SendMsgDown: function () {
        //获取节点子节点数组
        var blockChild = this.nodeBlock.getChildren();
        //  //判断俄罗斯方块是否结束地面
        //  var isCollisionGround=false;
        //判断俄罗斯方块中是否含有22行
        //初始化俄罗斯方块数组列
        var nXArray = [];
        //初始化俄罗斯方块数组行
        var nYArray = [];
        for (var i = 0; i <= 3; i++) {
            var nX = (blockChild[i].getPositionX() + this.node.getPositionX() - cc.find("GroundParent").getPositionX()) / Global.nWidth + 1;
            var nY = (blockChild[i].getPositionY() + this.node.getPositionY() - cc.find("GroundParent").getPositionY()) / Global.nWidth + 1;
            if (nY = 20) {
                nXArray.push(nX);
                nYArray.push(nY);
            }
            if (nY <= 19) {
                nXArray.push(nX);
                nYArray.push(nY);
            }
        }
    },
    playAudio : function(audioSource){
        cc.audioEngine.play(audioSource,false,1);
    },
    //快速下落
    DownQuick: function () {
        if (this.nodeBlock.getComponent("OperateBlock").isCollision == false) {
            this.playAudio(this.clickAudio);
            this.nodeBlock.getComponent("OperateBlock").fDownTime = Global.nTimeInteval;
        }
    },
    //获取子块在地板父体下的坐标
    GetBoxNode: function (childBox) {
        //获取子块在地板附体下的行列
        var nX = (childBox.getPositionX() + this.nodeBlock.getPositionX() - this.nodeUserParent.getPositionX()) / Global.nWidth + 1;
        var nY = (childBox.getPositionY() + this.nodeBlock.getPositionY() - this.nodeUserParent.getPositionY()) / Global.nWidth + 1;
        cc.log(nX);
        cc.log(nY);
        var x = this.groundChild[nX - 1][nY - 1].getPositionX();
        var y = this.groundChild[nX - 1][nY - 1].getPositionY();
        return cc.p(x, y);
    },
    //根据服务器给的惩罚行数向上移动俄罗斯方块
    PunishUp: function (nDisappearAll) {
        this.arrayChangeNode = [];
        console.log("in punishUp nDisappearAll is ",nDisappearAll);
        for (var i = 19; i >= 0; i--) {
            inner:
            for (var j = 0; j <= 9; j++) {
                console.log("in punishUp 第"+i+"行,第"+ j + "列的坐标为(" + this.groundChild[j][i].x,this.groundChild[j][i].y + ")");
                console.log("in punishUp " + this.groundChild[j][i].getComponent("PrefabState").isBox);
                if (this.groundChild[j][i].getComponent("PrefabState").isBox) {
                    if (i + nDisappearAll >= 20) {
                        Console.log(nDisappearAll+"GetBoxNode");
                        Console.log(i+"GetBoxNode");
                        this.isOver=true;
                        continue inner;
                    }
                    for (var l = 0; l <= this.boxParent1.length - 1; l++) {
                        if (this.boxParent1[l].getPositionY() == this.groundChild[j][i].getPositionY() && this.boxParent1[l].getPositionX() == this.groundChild[j][i].getPositionX()) {
                            this.boxParent1[l].setPosition(cc.p(this.groundChild[j][i].getPositionX(), this.groundChild[j][i].getPositionY() + Global.nWidth * nDisappearAll));
                        } 
                    }
                    this.arrayChangeNode.push({ "row": i, "col": j, "color": "white" });
                    this.groundChild[j][i].getComponent("PrefabState").isBox = false;
                    this.arrayChangeNode.push({ "row": i + nDisappearAll, "col": j, "color": this.groundChild[j][i].getComponent("PrefabState").stringColor });
                    // if((i+nDisappearAll) != 20){
                    //这里该值为undefined
                    console.log("in punishUp 当前惩罚行列节点值 ",this.groundChild[j][i + nDisappearAll]);
                    if(this.groundChild[j][i + nDisappearAll] != undefined){
                        this.groundChild[j][i + nDisappearAll].getComponent("PrefabState").isBox = true;
                        this.groundChild[j][i + nDisappearAll].getComponent("PrefabState").stringColor = this.groundChild[j][i].getComponent("PrefabState").stringColor;
                    }    
                    if(i==0&&j==9)
                    {
                        if(this.isOver)
                        {
                            console.log("ccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc");
                            this.nodeBlock.getComponent("OperateBlock").isGameOver=true;
                        }
                    }
                    // } 
                    // this.isMoveState=true;
                    // this.isDisppearState=true;
                }
                // if(i==19&&j==9)
                // {
                //     this.DisappearBox();
                // }
            }
        }

    },
    //遍历全局字块数组并将最高消层数以上的方块下落
    BoxDown: function (nMaxDisappea, nDisappearAll) {
        //存取消行行行列
        this.nDissppearRow = [{ "row": nDisappearAll, "col": "" }];
        for (var i = nMaxDisappea + 1; i <= 19; i++) {
            for (var j = 0; j <= 9; j++) {
                if (this.groundChild[j][i].getComponent("PrefabState").isBox) {
                    for (var l = 0; l <= this.boxParent1.length - 1; l++) {
                        if (this.boxParent1[l].getPositionY() == this.groundChild[j][i].getPositionY() && this.boxParent1[l].getPositionX() == this.groundChild[j][i].getPositionX()) {
                            this.boxParent1[l].setPosition(cc.p(this.groundChild[j][i].getPositionX(), this.groundChild[j][i].getPositionY() - Global.nWidth * nDisappearAll));
                        }
                    }
                    this.arrayChangeNode.push({ "row": i, "col": j, "color": "white" });
                    this.groundChild[j][i].getComponent("PrefabState").isBox = false;
                    this.arrayChangeNode.push({ "row": i - nDisappearAll, "col": j, "color": this.groundChild[j][i].getComponent("PrefabState").stringColor });
                    this.groundChild[j][i - nDisappearAll].getComponent("PrefabState").isBox = true;
                    this.groundChild[j][i - nDisappearAll].getComponent("PrefabState").stringColor = this.groundChild[j][i].getComponent("PrefabState").stringColor;
                }
                // if(i==19&&j==9)
                // {
                //     this.DisappearBox();
                // }
            }
        }
        //显示分数
        this.ShowScore(nDisappearAll, cc.find("UserScore"));
        cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg({ "tag1": 11, "type": "1", "score": cc.find("PebmanentNode").getComponent("UserInfo").nUserScore, "nDisappear1": nDisappearAll });
        //发送服务器请求
        // this.isMoveState=true;
        this.isDisppearState = true;
    },
    //根据消行层数显示自分数
    ShowScore: function (nDissppearRow1, nodeScore) {
        switch (nDissppearRow1) {
            case 1:
                nodeScore.getComponent(cc.Label).string = (parseInt(nodeScore.getComponent(cc.Label).string) + 40).toString();
                break;
            case 2:
                nodeScore.getComponent(cc.Label).string = (parseInt(nodeScore.getComponent(cc.Label).string) + 90).toString();
                break;
            case 3:
                nodeScore.getComponent(cc.Label).string = (parseInt(nodeScore.getComponent(cc.Label).string) + 150).toString();
                break;
            case 4:
                nodeScore.getComponent(cc.Label).string = (parseInt(nodeScore.getComponent(cc.Label).string) + 220).toString();
                break;
        }
    },
    //俄罗斯方块向右移动
    MoveRight: function (nLine, nLine1) {
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
        if (nArrayRow[0] <= 19 || (nArrayRow[0] == 20 && this.nodeBlock.getComponent("OperateBlock").stringBoloekShape == "Long")) {
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
            }
            else {
                this.arrayChangeNode = [];
                //判断方块的下一列是否有方块
                var isHas = false;
                for (var i = 3; i >= 0; i--) {
                    cc.log(nArrayList[i] - 1);
                    cc.log(nArrayRow[i] - 1);
                    this.arrayChangeNode.push({ "row": nArrayRow[i] - 1, "col": nArrayList[i] - 1, "color": "white" });
                    // //将俄罗斯方块所在方格置为false
                    // this.groundChild[nArrayList[i] - 1][nArrayRow[i] - 1].getComponent("PrefabState").isBox = false;
                    //判断方块的下一列的方块属性是否为true
                    if (this.groundChild[nArrayList[i]][nArrayRow[i] - 1].getComponent("PrefabState").isBox) {
                        isHas = true;
                    }
                    if (i == 0) {
                        if (isHas) {
                            // for (var j = 0; j <= 3; j++) {

                            //     //将俄罗斯方块所在方格置为true
                            //     this.groundChild[nArrayList[j] - 1][nArrayRow[j] - 1].getComponent("PrefabState").isBox = true;
                            // }
                            return;
                        }
                        else {
                            for (var k = 0; k <= 3; k++) {
                                this.arrayChangeNode.push({ "row": nArrayRow[k] - 1, "col": nArrayList[k], "color": this.nodeBlock.getComponent("OperateBlock").stringColor });
                                // //将下一列的方块所在方格置为true
                                // this.groundChild[nArrayList[k]][nArrayRow[k] - 1].getComponent("PrefabState").isBox = true;
                                if (k == 3) {
                                    //俄罗斯方块向右移动
                                    this.nodeBlock.x += Global.nWidth;
                                    this.isMoveState = true;
                                    if (this.nodeBlock.getComponent("OperateBlock").isCollision) {
                                        //初始化 1s计时器
                                        this.nodeBlock.getComponent("OperateBlock").fDownTime = 0;
                                        this.nodeBlock.getComponent("OperateBlock").fCollisionTime = 0;
                                    }
                                    //   //初始化 1s计时器
                                    //   this.nodeBlock.getComponent("OperateBlock").fCollisionTime=0;
                                }
                            }
                        }
                    }
                }
            }
        }
        else {
            return;

        }
    },
    //俄罗斯方块向左移动
    MoveLeft: function (nLine, nLine1) {
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
        }       //从小到大排序行数
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
        if (nArrayRow[0] <= 19 || (nArrayRow[0] == 20 && this.nodeBlock.getComponent("OperateBlock").stringBoloekShape == "Long")) {
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
            }
            else {
                this.arrayChangeNode = [];
                //判断方块的前一列是否有方块
                var isHas = false;
                for (var i = 0; i <= 3; i++) {
                    this.arrayChangeNode.push({ "row": nArrayRow[i] - 1, "col": nArrayList[i] - 1, "color": "white" });
                    // //将俄罗斯方块所在方格置为false
                    // this.groundChild[nArrayList[i] - 1][nArrayRow[i] - 1].getComponent("PrefabState").isBox = false;
                    //判断方块的前一列的方块属性是否为true
                    if (this.groundChild[nArrayList[i] - 2][nArrayRow[i] - 1].getComponent("PrefabState").isBox) {
                        isHas = true;
                    }
                    if (i == 3) {
                        if (isHas) {
                            // for (var j = 0; j <= 3; j++) {
                            //     this.arrayChangeNode.push({ "row": nArrayRow[j] - 1, "col": nArrayList[j] - 1, "color": this.nodeBlock.getComponent("OperateBlock").stringColor });
                            //     //将俄罗斯方块所在方格置为false
                            //     this.groundChild[nArrayList[j] - 1][nArrayRow[j] - 1].getComponent("PrefabState").isBox = true;
                            // }
                            return;
                        }
                        else {
                            for (var k = 0; k <= 3; k++) {
                                this.arrayChangeNode.push({ "row": nArrayRow[k] - 1, "col": nArrayList[k] - 2, "color": this.nodeBlock.getComponent("OperateBlock").stringColor });
                                // //将前一列的方块所在方格置为true
                                // this.groundChild[nArrayList[k] - 2][nArrayRow[k] - 1].getComponent("PrefabState").isBox = true;
                                if (k == 3) {
                                    this.isMoveState = true;
                                    //俄罗斯方块向左移动
                                    this.nodeBlock.x -= Global.nWidth;
                                    if (this.nodeBlock.getComponent("OperateBlock").isCollision) {
                                        //初始化 1s计时器
                                        this.nodeBlock.getComponent("OperateBlock").fDownTime = 0;
                                        this.nodeBlock.getComponent("OperateBlock").fCollisionTime = 0;
                                    }
                                }
                            }
                        }
                    }
                }
            }

        }
        else {
            return;
        }
    },
    //遍历游戏场景的字块中的isBox属性是否为true,并消除代码
    DisappearBox: function () {
        this.playAudio(this.removeAudio);
        this.arrayChangeNode = [];
        this.nDissppearRow = [{ "row": 0, "col": "" }];
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
                        //遍历全局字块数组并消除整行方块isBox都为true的节点
                        this.TraversalNodeBox(this.groundChild[j][i].getPositionY());
                        //将消除的方块的isBox重置false
                        for (var k = 0; k <= 9; k++) {
                            this.arrayChangeNode.push({ "row": i, "col": k, "color": "white" });
                            this.groundChild[k][i].getComponent("PrefabState").isBox = false;
                        }
                        nDisappear.push(i);
                    }
                    if (i == 19 && nDisappear.length != 0) {
                        //当消行层总数为1行是
                        if (nDisappear.length == 1) {
                            this.BoxDown(nDisappear[0], nDisappear.length);
                        }
                        else {
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
                    }
                }
            }
        }
        //当敌人消行是
        if (this.isDisppearEnemy) {
            console.log("=======================this.isDisppearEnemy");
            //判断此时方块落下时是否消行
            cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg({ "tag1": 12, "type": "1", "score": cc.find("PebmanentNode").getComponent("UserInfo").nUserScore, "nMapRow": "", "nMapCol": "", "changeMapList1": this.arrayChangeNode, "removeRow": nDisappear.length });
            if (this.nDissppearRow != 0) {
                cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg({ "tag1": 9, "type": "1", "score": cc.find("PebmanentNode").getComponent("UserInfo").nUserScore, "nMapRow": "", "nMapCol": "", "changeMapList1": this.arrayChangeNode, "state1": 1 });
            }
            this.isDisppearEnemy = false;
        }
    },
    update(dt) {
        if(this.isWin)
        {
            this.nodeBlock.getComponent("OperateBlock").isGameOver=true;
            //显示广告
            cc.find("PebmanentNode").getComponent("UserInfo").showAdvice();
            this.playAudio(this.loseAudio);
            return;
        }
        if (this.nodeBlock.getComponent("OperateBlock").isGameOver&&this.isSend==false) {
            this.lose=true;
            cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg({ "tag1": 13, "type": "1", "score": cc.find("PebmanentNode").getComponent("UserInfo").nUserScore, "nMapRow": "", "nMapCol": "", "result":-1 });
            cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg({ "tag1": 4, "type": "1", "score": cc.find("PebmanentNode").getComponent("UserInfo").nUserScore, "nMapRow": "", "nMapCol": "", "result_score":cc.find("UserScore").getComponent(cc.Label).string});
            cc.log("=======================================================");
            cc.find("New Sprite(Splash)").opacity = 120;
            this.overBackGround.active = true;
            this.isSend=true;
            return;
        }
        if (this.isMoveState) {
            cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg({ "tag1": 9, "type": "1", "score": cc.find("PebmanentNode").getComponent("UserInfo").nUserScore, "nMapRow": "", "nMapCol": "", "changeMapList1": this.arrayChangeNode });
            this.isMoveState = false;
        }
        if (this.nodeBlock.getComponent("OperateBlock").isDownState) {
            cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg({ "tag1": 9, "type": "1", "score": cc.find("PebmanentNode").getComponent("UserInfo").nUserScore, "nMapRow": "", "nMapCol": "", "changeMapList1": this.nodeBlock.getComponent("OperateBlock").arrayChangeNode });
            this.nodeBlock.getComponent("OperateBlock").isDownState = false;
        }
        if (this.isRotateState) {
            cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg({ "tag1": 9, "type": "1", "score": cc.find("PebmanentNode").getComponent("UserInfo").nUserScore, "nMapRow": "", "nMapCol": "", "changeMapList1": this.arrayChangeNode });
            this.isRotateState = false;
        }
        if (this.isDisppearState && this.isDisppearEnemy == false) {
            for(var i=0;i<=this.arrayChangeNode.length-1;i++)
            {
                console.log(JSON.stringify(this.arrayChangeNode[i])+"isDisppearState11111111111111111111111111");
            }
           
            cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg({ "tag1": 9, "type": "1", "score": cc.find("PebmanentNode").getComponent("UserInfo").nUserScore, "nMapRow": "", "nMapCol": "", "changeMapList1": this.arrayChangeNode, "state1": 1 });
            cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg({ "tag1": 6, "type": "1", "score": cc.find("PebmanentNode").getComponent("UserInfo").nUserScore, "nMapRow": "", "nMapCol": "", "changeMapList1": this.arrayChangeNode, "removeMapList1": this.nDissppearRow });
            this.isDisppearState = false;
        }
        if (this.isPunish) {
            cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg({ "tag1": 9, "type": "1", "score": cc.find("PebmanentNode").getComponent("UserInfo").nUserScore, "nMapRow": "", "nMapCol": "", "changeMapList1": this.arrayChangeNode });
            this.isPunish = false;
        }
        if (cc.sys.isNative) {
            if (this.isOutSlide == false) {
                //当触摸点的列大于俄罗斯方块的列数
                if (this.GetTouchLine(this.positionTouchX) > this.GetBlockLine()) {
                    //执行向右移动代码
                    this.MoveRight(this.GetTouchLine(this.positionTouchX), this.GetBlockLine());
                    this.isOutSlide = true;
                }
                if (this.GetTouchLine(this.positionTouchX) < this.GetBlockLine()) {
                    //执行向左移动代码
                    this.MoveLeft(this.GetTouchLine(this.positionTouchX), this.GetBlockLine());
                    this.isOutSlide = true;
                }
            }
            //快速下落
            if (this.isOutDown == false) {
                this.DownQuick();
            }
        }
        else {
            if (this.isOutSlide == false) {
                //当触摸点的列大于俄罗斯方块的列数
                if (this.GetTouchLine(this.positionTouchX) > this.GetBlockLine()) {
                    //执行向右移动代码
                    this.MoveRight(this.GetTouchLine(this.positionTouchX), this.GetBlockLine());
                    this.isOutSlide = true;

                }
                if (this.GetTouchLine(this.positionTouchX) < this.GetBlockLine()) {
                    //执行向左移动代码
                    this.MoveLeft(this.GetTouchLine(this.positionTouchX), this.GetBlockLine());
                    this.isOutSlide = true;
                }
            }
            //快速下落
            if (this.isOutDown == false) {
                this.DownQuick();
            }
        }
        if (this.nodeBlock.getComponent("OperateBlock").isStationary) {
            // this.boxParent1=this.boxParent.getChildren();
            //获取此方块的数组
            var nodeBoxArray = this.nodeBlock.getChildren();
            for (var i = 0; i <= 3; i++) {
                nodeBoxArray[0].setPosition(this.GetBoxNode(nodeBoxArray[0]));
                cc.log(nodeBoxArray[0].getPosition());
                nodeBoxArray[0].parent = this.boxParent;
                if (i == 3) {
                    this.nodeBlock.getComponent("OperateBlock").isChangeParent = true;
                }
            }
        }
        if (this.nodeBlock.getComponent("OperateBlock").isChangeParent) {
            //消除以后落下俄罗斯方块
            this.DisappearBox();
            var nodeBoxArray1 = this.boxParent.getChildren();
            // this.nodeBlock.getComponent("OperateBlock").isStationary=false;
            // this.nodeBlock.getComponent("OperateBlock").isChangeParent=false;
            cc.log(this.nodeBlock.getChildren());
            //生成新的俄罗斯方块
            this.GetBlock();
            this.isOutDown = true;
            this.isOutSlide = true;
            this.nodeBlock.getComponent("OperateBlock").isStationary = false;
            this.nodeBlock.getComponent("OperateBlock").isChangeParent = false;
        }
    },
    share : function(){
        if(CC_WECHATGAME){
            console.log("首页share");
            cc.find("PebmanentNode").getComponent("UserInfo").shareFriends();
        }else if(cc.sys.isNative){
            //原生平台分享
            cc.find("PebmanentNode").getComponent("UserInfo").nativeShare();
        }
    }
    // },
});
