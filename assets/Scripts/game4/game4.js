/*
 * @Author: mikey.zhaopeng 
 * @Date: 2018-06-19 19:29:08 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-08-20 10:39:46
 */
var comm = require("../game3/Common");
var game3 = require("../game3/game");
var statuMachine = require("./StatuMachine");
cc.Class({
    extends: cc.Component,

    properties: {
        imagePrefabArr : {
            default : [],
            type    : [cc.Prefab],
        },
        girdSize    : 120,
        back        : cc.Prefab,
        nextShape : {
            default : null,
            type    : cc.Node,
        },
        next2 : {
            default : null,
            type    : cc.Node,
        },
        downButton : {
            default : null,
            type    : cc.Node,
        },
        slideButton : {
            default : null,
            type    : cc.Node,
        },
        rotateButton : {
            default  : null,
            type     : cc.Node,
        },
        //遮罩层
        mask : {
            default : null,
            type    : cc.Node,
        },
        //暂停菜单
        pauseMenu : {
            default : null,
            type    : cc.Node,
        },
        pauseBack      : cc.Node,
        pauseContinue  : cc.Node,
        pauseRestart   : cc.Node,
        //昵称label
        nickName : {
            default : null,
            type    : cc.Node,
        },
        //分数label
        scoreLabel : {
            default : null,
            type    : cc.Node,
        },
        //游戏结束菜单
        overMenu  : {
            default : null,
            type    : cc.Node,
        },
        //用户头像
        icon     :{
            default : null,
            type    : cc.Node,
        },
        gameOverAnimation : cc.Node,
        gameSlide : cc.Node,
        //点击按钮的声音
        clickAudio : {
            url  : cc.AudioClip,
            default : null,
        },
        //失败音效
        loseAudio : {
            url  : cc.AudioClip,
            default : null,
        },
        //消除音效
        removeAudio : {
            url  : cc.AudioClip,
            default : null,
        },
        //快速下落音效
        downAudio : {
            url  : cc.AudioClip,
            default : null,
        },
        darkNode : cc.Node,
        handNode : cc.Node,
        noticePrefab : cc.Prefab,

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.showNoticeHelp = true;
        //初始化提示预制体
        this.noticeBtn = this.setPrefabPosition(this.noticePrefab,0,0,this.node.parent.getChildByName("darkNotice"));
        console.log("this.noticeBtn is ",this.noticeBtn);
        this.noticeBtn.getChildByName("wodNotice").getChildByName("dynamicWords").getComponent(cc.Label).string = "随着消除次数的增加，方块的小落速度\n"
        + "随之增加,要掌控住方块的速度哦！";
        this.noticeBtn.on("touchstart",function(){
            this.darkNode.active = false;
            this.handNode.active = false;
            this.noticeBtn.active = false;
            this.showNoticeHelp = false;
        }.bind(this))
        this.darkNode.on("touchstart",function(){
            this.darkNode.active = false;
            this.handNode.active = false;
            this.noticeBtn.active = false;
            this.showNoticeHelp = false;
        }.bind(this));
        this.handNode.on("touchstart",function(){
            this.darkNode.active = false;
            this.handNode.active = false;
            this.noticeBtn.active = false;
            this.showNoticeHelp = false;
        }.bind(this));
        if(cc.director.isPaused()){
            cc.director.resume();
        }
        if(cc.sys.isNative){
            // var userInfoScript = cc.find("PebmanentNode").getComponent("UserInfo");
            // this.nickName.getComponent(cc.Label).string = userInfoScript.nameUser;
            // userInfoScript.LoadUserPicture(userInfoScript.pictureUser,this.icon);
        }
        if(CC_WECHATGAME){
            var userInfoScript = cc.find("PebmanentNode").getComponent("UserInfo");
            this.nickName.getComponent(cc.Label).string = userInfoScript.nameUser;
            userInfoScript.LoadUserPicture(userInfoScript.pictureUser,this.icon);
        }
        this.totalRemoveTime = 0;
        this.totalTime = 0;
        this.normalSpeed = 0.8,
        this.quickSpeed  = 0.07,
         this.nodeHeight = this.node.height;
         this.nodeWidth = this.node.width;
         this.initMap();
         //创建一个空节点用来盛放生成的预制体
         this.nodeArr = this.initImage(this.node,this.createRandomX(this.createRandom(0,6)),this.nodeHeight/2 - this.girdSize/2);
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
         this.downButton.on("touchstart",function(){
            this.playAudio(this.downAudio);
            this.xltime = this.quickSpeed;
            this.downButton.children[0].opacity = 120;
            this.playAudio(this.clickAudio);
         }.bind(this));
         //下落按钮离开时候
         this.downButton.on("touchend",function(){
            this.xltime = this.normalSpeed;
            this.downButton.children[0].opacity = 0;
         }.bind(this));
         this.gameOver = false;
         this.status = 0;
         Array.prototype.contain = function(node){
            if(node != undefined){
                for(var i = 0;i<this.length;i++){
                    if(this[i].x === node.x && this[i].y === node.y && this[i].getComponent("Figure").type === node.getComponent("Figure").type){
                        return true;
                    }
                }
                return false;
            }
            return false;
        };
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
        //暂停菜单不显示
        this.pauseMenu.active = false;
        //不显示游戏结束菜单
        this.overMenu.active = false;

        //游戏结束计时
        this.overCost = 0;
        //当前的行号
        this.nCol = 0;
        this.gameOverAnimation.active = false;
        this.pauseBack.on("touchstart",function(){
            console.log("暂停页面的退出");
            cc.director.resume();
            cc.director.loadScene("OneChoose");
            // cc.director.resume();
            // this.mask.active = false;
            // this.pauseMenu.active = false;
            
        }.bind(this));
        this.pauseContinue.on("touchstart",function(){
            console.log("暂停页面的继续");
            cc.director.resume();
            this.mask.active = false;
            this.pauseMenu.active = false;
        }.bind(this));
        this.pauseRestart.on("touchstart",function(){
            console.log("暂停页面的重新开始");
            cc.director.resume();
            this.mask.active = false;
            this.pauseMenu.active = false;
            cc.director.loadScene("Game4");
        }.bind(this));
        // this.pauseMenu.getChildByName("continue").on("touchstart",function(){
        //     cc.director.resume();
        //     this.mask.active = false;
        //     this.pauseMenu.active = false;
        // }.bind(this));
        // this.pauseMenu.getChildByName("back").on("touchstart",function(){
        //    this.mask.active = false;
        //    this.pauseMenu.active = false;
        //    cc.director.loadScene("OneChoose");
        // }.bind(this));
        // this.pauseMenu.getChildByName("restart").on("touchstart",function(){
        //     cc.director.resume();
        //     this.mask.active = false;
        //     this.pauseMenu.active = false;
        //     cc.director.loadScene("Game4");
        // }.bind(this));
        this.screenAdapt();
        //单机的网络版超时时间防止自己被踢出
        this.invalidRemoveTime = 0;
    },
    registerKeyBoard : function(){
        //是否在滑动节点上
        this.onSlide = false;
        this.onGameSlide = false;
        var self = this;
        //注册键盘监听
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,this.onKeyUp,this);
        //滑动按钮监听
        this.slideButton.on("touchstart",function(event){
            // this.onSlide = true;
            //获得当前点击的全局坐标
            this.slideButton.children[0].opacity = 120;
            // self.slidePosition = event.getLocation();
            cc.log("self.slidePositionX is " + self.slidePositionX);
        }.bind(this));
        //在滑动节点上移动的时候
        this.slideButton.on("touchmove",function(event){
            this.onSlide = true;
            //获得当前点击的全局坐标
            this.slideButton.children[0].opacity = 120;
            self.slidePosition = event.getLocation();
            cc.log("slidePositionX is " + self.slidePositionX);
        }.bind(this));
        this.slideButton.on("touchcancel",function(event){
            //获得当前点击的全局坐标
            this.slideButton.children[0].opacity = 0;
            self.slidePosition = event.getLocation();
            this.onSlide = false;
        }.bind(this));
        //在滑动节点上离开的时候
        this.slideButton.on("touchend",function(event){
             //获得当前点击的全局坐标
            this.slideButton.children[0].opacity = 0;
            self.slidePosition = event.getLocation();
            this.onSlide = true;
        }.bind(this));

         // 滑动节点上方的空节点
         this.gameSlide.on("touchstart",function(event){
            cc.log("点击了gameSlide节点");
        }.bind(this));
        this.gameSlide.on("touchmove",function(event){
            this.onGameSlide = true;
            self.gameSlidePosition = event.getLocation();
        }.bind(this));
        this.gameSlide.on("touchend",function(event){
            this.onGameSlide = true;
            self.gameSlidePosition = event.getLocation();
        }.bind(this));
        this.gameSlide.on("touchcancel",function(event){
            this.onGameSlide = false;
            self.gameSlidePosition = event.getLocation();
        }.bind(this));
        function time(){
            return new Promise(function(resolve,reject){
                setTimeout(function(){
                    console.log("aaaaaaaaaaa")
                    resolve("aaa");
                },3000)
            })
        }
        (function(){
            time();
            console.log("$$$$$$$$$$$$$$$$$$$$$$$$$");
        })();
    },
    //返回触点对应的列数
    getTouchLine : function(touchNode,worldPosition){
         //将触点的x坐标转化为本地坐标系
         var localX = touchNode.convertToNodeSpaceAR(cc.v2(worldPosition.x,worldPosition.y)).x;
         cc.log("local is " + localX);
         if(localX > 0){
              var n1 = Math.floor(localX/(touchNode.width/6));
              if(n1 >= 0 && n1 < 1){
                  this.nCol = 3;
              }else if(n1 >= 1 && n1 < 2){
                  this.nCol = 4;
              }else if(n1 >= 2 && n1 < 3){
                  this.nCol = 5;
              }
         }else if(localX < 0){
             var n2 = Math.floor(-localX/(touchNode.width/6));
             if(n2 >= 0 && n2 < 1){
                this.nCol = 2;
            }else if(n2 >= 1 && n2 < 2){
                this.nCol = 1;
            }else if(n2 >= 2 && n2 < 3){
                this.nCol = 0;
            }
         }
         return this.nCol;
    },
    onKeyDown : function(event){
        switch(event.keyCode){
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
    onKeyUp   : function(event){
        switch(event.keyCode){
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
    onDestroy () {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },
    start () {

    },
    createRandomX : function(randomNumber){
        return this.backGroundArr[0][randomNumber];
    },
    //产生随机数
    createRandom : function(min,max){
         return Math.floor(Math.random()*(max - min) + min);
    },
    //初始化游戏场景主背景12行6列的网格
    initMap : function(){
        //初始化y坐标
        var y = this.nodeHeight/2 - this.girdSize/2 - 12;
        //初始化x坐标
        var x = -this.nodeWidth/2 + this.girdSize/2 + 10;
        cc.log("x is " + x);
        this.backGroundArr = [];
        this.map = [];
        //12行6列的网格
        for(var i = 0;i < comm.MAP_ROW; i++){
            //设置它的y坐标
            var tempY =y - i * this.girdSize - 1;
            tempY = Number(tempY.toFixed(2));
            cc.log("tempY is " + tempY);
            this.backGroundArr[i] = [];
            this.map[i] = [];
            for(var j = 0; j < comm.MAP_COL;j++){
                var outArr = this.backGroundArr[i];
                var mapData = this.map[i];
                var tempX = x + j * this.girdSize + 1;
                tempX = Number(tempX.toFixed(2));
                cc.log("tempX is " + tempX);
                //y坐标不变，x坐标要变
                var tempPrefab = this.setPrefabPosition(this.back,tempX,tempY,this.node);
                // var node = new Shape(tempPrefab,-1);
                tempPrefab.getComponent("Back").isFilled = 0;
                // tempPrefab.isFilled = 0;
                // cc.log("tempPrefab.isFilled is " + tempPrefab.isFilled);
                tempPrefab.getComponent("Back").type = -1;
                tempPrefab.getComponent("Back").innerNode = null;
                // var shape = new Shape(tempPrefab,-1);
                outArr[j]=tempPrefab;
                mapData[j] = 0;
            }
        }
        cc.log("backGroundArr is " +this.backGroundArr);
    },
    //生成形状在这个节点数组中加入父节点
    initImage : function(parentNode){
        this.times = 0;
        //动态生成一个新的节点将生成的预制体节点加入到该父节点上
        // var newNode = new cc.Node();
        // parentNode.addChild(newNode);
        //用来存放预制体的数组
        //定义从哪一列开始下落
        var randomCol = game3.prototype.createRandom(2,4);
        var prefabArrTemp = [];
        this.cishu  = 0;
        //是否生成成功并且全部显示完毕
        this.isCreateOver = false;
        //从上往下生成
        // var y = this.nodeHeight/2 + this.girdSize/2+1*this.girdSize;
        for(var i = 0;i < 2;i++){
            // var offSet = i * this.prefabHeight;
            // cc.log("offSet is " + offSet);
            // //产生0-8的随机数
            var index = this.controlRandom();
            // //将对应的颜色索引存放到该数组中
            // // this.boxColorArr.push(this.prefabArr[index].color);
            // cc.log("index is " + index);
            // //将对应的预制体取出来转化为节点然后显示
            var prefabNode = game3.prototype.createPrefab(this.imagePrefabArr[index]);
            // cc.log("x is " + x + " and y is "+ y - offSet);
            //设置预制节点的位置
            // prefabNode.setPosition(this.backGroundArr[0][randomCol].x,this.backGroundArr[0][randomCol].y);
            prefabNode.x = this.backGroundArr[0][randomCol].x;
            prefabNode.y = this.backGroundArr[0][randomCol].y;
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
    controlRandom : function(){
        var id;
        var rnd = Math.random();
        if(rnd < 0.2){
            id = 0;
        }else if(rnd < 0.4){
            id = 1;
        }else if(rnd < 0.6){
            id = 2;
        }else if(rnd < 0.8){
            id = 3;
        }else if(rnd < 0.85){
            id = 4;
        }else if(rnd < 0.9){
            id = 5;
        }else if(rnd < 0.95){
            id = 6;
        }else if(rnd < 1){
            id = 7;
        }
        return id;
    },
    //生成下一个形状
    createNext : function(){
        if(this.next2Block === undefined){
            this.nextBlock = this.generateNext(this.node);
            //显示下一个形状
            this.showNextShape(this.nextBlock,this.nextShape);
        }else{
            this.nextBlock = this.next2Block;
            this.showNextShape(this.nextBlock,this.nextShape);
        }
        //生成下下个形状
        this.next2Block = this.generateNext(this.node);
        //显示下下个形状
        this.showNextShape(this.next2Block,this.next2);
    },
    //生成下一个形状
    generateNext : function(parentNode){
        return this.initImage(parentNode);
    },
    //显示下一个形状
    showNextShape : function(nextBlock,parentNode){
        //显示下一个形状之前删除这个节点的所有子节点
        if(parentNode.childrenCount > 0){
            for(let k = 0;k<parentNode.childrenCount;k++){
                //销毁该子节点,如果销毁节点成功的话就显示下一个形状
                parentNode.children[k].destroy();
            }
        }
        //依次生成预制节点组成的节点数组
        for(let i = 0;i<2;i++){
            var type = nextBlock[i].getComponent("Figure").type;
            // var spriteFrame = nextBlock[i].getComponent("cc.Sprite").spriteFrame;
            this.setPrefabPosition(this.imagePrefabArr[type],0,100-i*this.girdSize,parentNode);
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
    setPrefabPosition : function(prefab,x,y,parentNode){
        var prefab = this.createPrefab(prefab);
        // prefab.setPosition(x,y);
        prefab.x = x;
        prefab.y = y;
        parentNode.addChild(prefab);
        return prefab;
    },
    //创建一个预制体节点
    createPrefab : function(prefab){
        var prefabNode = cc.instantiate(prefab);
        return prefabNode;
    },
    //查看当前的棍处于哪一列
    getColumn : function(node){
        //竖行的条
        var indexGrid = this.chooseColumnByLocation(node.x);
        //放回列号
        return indexGrid;
    },
    //根据坐标选择位于哪个列
    chooseColumnByLocation : function(x){
        switch(x){
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
    getRow : function(node){
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
    chooseRawByLocation : function(y){
        switch(y){
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
    getNodeArrMaxCol : function(){
        var maxCol;
        var colArr = [];
        for(let i = 0;i<this.nodeArr.length;i++){
            colArr.push(this.nodeArr[i].getComponent("Figure").col);
        }
        maxCol = Math.max.apply(Math,colArr);
        //返回最大列
        return maxCol;
    },
    getNodeArrMinCol : function(){
        var minCol;
        var colArr = [];
        for(let i = 0;i<this.nodeArr.length;i++){
            colArr.push(this.nodeArr[i].getComponent("Figure").col);
        }
        minCol = Math.min.apply(Math,colArr);
        //返回最小列
        return minCol;

    },
    shareButton : function(){
        if(CC_WECHATGAME){
            console.log("首页share");
            cc.find("PebmanentNode").getComponent("UserInfo").shareFriends();
        }else if(cc.sys.isNative){
            //原生平台分享
            // cc.find("PebmanentNode").getComponent("UserInfo").nativeShare();
        }
    },
    update (dt) {
        if(!this.showNoticeHelp){
            if(this.onSlide || this.onGameSlide){
                if(this.onSlide){
                    var column = this.getTouchLine(this.slideButton,this.slidePosition);
                    this.onSlide = false;
                }else{
                    var column = this.getTouchLine(this.gameSlide,this.gameSlidePosition);
                    this.onGameSlide = false;
                }
                //如果当前列比节点数组中最大列还大的话就右移
                if(column > this.getNodeArrMaxCol()){
                    //右移
                    this.moveRight();
                }else if(column < this.getNodeArrMinCol()){
                    //左移
                    this.moveLeft();
                }
            }
            switch(this.status){
                case statuMachine.STATE_BEGIN:
                 cc.log("开始游戏");
                 break;
                case statuMachine.STATE_PLAY:
                 cc.log("游戏中");  
            }
            //如果游戏结束了就不在进行下落
            if(!this.gameOver){
                this.invalidRemoveTime += dt;
                //告诉服务器不要断开连接
                if(this.invalidRemoveTime >= 60){
                    console.log("发送给服务器消息防止自己不被踢出");
                    var url = 'https://m5.ykplay.com/KeepLink';
                    var xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
                            var response = xhr.responseText;
                            console.log(response);
                        }
                    };
                    xhr.open("GET", url, true);
                    xhr.send();
                    //发送长连接请求
                    if(cc.sys.isNative || (CC_WECHATGAME)){
                        var sendData = {
                            tag1 : 0,
                            score : "",
                            type : ""
                        }
                        // var dataString = JSON.stringify(sendData);
                        // console.log("dataString is ",dataString);
                        // cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg(sendData);
                    }
                    this.invalidRemoveTime = 0;
                }
                this.san += dt;
                this.time += dt;
                if(this.cishu === 0 && this.xltime < this.normalSpeed){
                    this.xltime = this.normalSpeed;
                }
                if(this.totalTime === 3){
                    if(this.totalRemoveTime < 12){
                        //提升下落速度
                        this.normalSpeed -= 0.2;
                    }
                    this.totalTime = 0;
                }
                if(this.time > this.xltime){
                    if(this.cishu < 2){
                        //这种情况不让它旋转
                        if(this.cishu === 0){
                            if(this.map[0][this.nodeArr[1].getComponent("Figure").col] === 1){
                                this.gameOver = true;
                            }else{
                                this.nodeArr[1].active = true;
                            }
                        }else if(this.cishu === 1){
                            if(this.map[1][this.nodeArr[1].getComponent("Figure").col] != 1){
                                this.nodeArr[1].y = this.backGroundArr[1][this.nodeArr[1].getComponent("Figure").col].y;
                                this.nodeArr[1].getComponent("Figure").row = 1;
                                this.nodeArr[0].active = true;
                                this.nodeArr[0].y = this.backGroundArr[0][this.nodeArr[0].getComponent("Figure").col].y;
                                this.nodeArr[0].getComponent("Figure").row = 0;
                            }else{
                                this.gameOver = true;
                            }
                        }
                        this.cishu++;
                        //表示节点数组已经生成完毕可以进行旋转操作
                        if(this.cishu === 2){
                            this.isCreateOver = true;
                        }
                    }else{
                        
                        this.updatePrefatY(this.nodeArr);
                    }
                    this.time = 0;
                    
                }
            }else {
                //其他下降，旋转按钮，左右移动按钮处于不可激活状态
                this.downButton.interactable = false;
                this.rotateButton.interactable = false;
                // this.slideButton.interactable = false;
                this.gameOverAnimation.active = true;
                var animation = this.gameOverAnimation.getComponent(cc.Animation);
                this.playAudio(this.loseAudio);
                animation.play("Over_light"); 
                this.overMenu.active = true;
                //显示分数
                this.overMenu.getChildByName("scoreValue").getComponent(cc.Label).string = this.score;
                //显示等级
                this.overCost += dt;
                if(cc.sys.localStorage.getItem('maxScoreFigure') === undefined){
                    //设置值
                    cc.sys.localStorage.setItem('maxScoreFigure',this.score);
                }else{
                    if(this.score > cc.sys.localStorage.getItem('maxScoreFigure')){
                        console.log("即将保存到微信平台。。。");
                        //设置值
                        cc.sys.localStorage.setItem('maxScoreFigure',this.score);
                        //将最高分数保存起来
                        cc.find("PebmanentNode").getComponent("UserInfo").figureTopScore = this.score.toString();
                        // let username = cc.find("PebmanentNode").getComponent("UserInfo").nameUser;
                        //将最高分上传到微信托管平台
                        cc.find("PebmanentNode").getComponent("UserInfo").postMessage("SaveScore","figureRankScore",this.score.toString());
                    }
                    console.log("宝石方块的最高分是: ",cc.sys.localStorage.getItem('maxScoreFigure'));
                }
                if(this.overCost > 4){
                    cc.director.loadScene("OneChoose");
                    this.overCost = 0;
                }
            }
        }
    },
    //更新预制体节点的y坐标
    updatePrefatY : function(nodeArr){
                var self = this;
                //如果允许下落的话条的y坐标向下移动
                if(this.CheckIsDown(nodeArr)){
                        //下落节点数组,如果是横向的话分开这连个节点
                        this.down(nodeArr);
                }else{
                    //改变地图信息
                    this.changeMap(this.nodeArr);

                    var removeTime = 0;
                    function next(){
                        //生成下一个形状
                        self.nodeArr = self.nextBlock;
                        //生成下一个形状
                        self.createNext();
                    }
                    (function(n){
                        (function(){
                            //查看这个节点数组中是否可以消除如果满足条件进行消除
                            self.checkNodeArr(self.nodeArr,removeTime);
                        })();
                        n();
                    })(next);
                    
                    
                }
    },
    //检查一个节点数组是否满足消除条件
    checkNodeArr : function(nodeArr,removeTime){
        if(nodeArr.length > 0){
            //临时数组存放待消节点
            var waitQueue = [];
            if(this.canRemove(nodeArr,waitQueue).isRemove){
                //如果是可以消除的话进行消除这时候待消队列已经填满了节点
                // this.remove(this.nodeArr);
                //检测完这两个下落的方块的待消队列
                for(let j = 0;j<waitQueue.length;j++){
                    //如果该节点已经删除的话不对它操作
                    if(waitQueue[j] === null){
                        //将它从该数组删除
                        waitQueue.splice(j,1);
                    }
                    //将这些待消除的标记为可消除的
                    waitQueue[j].getComponent("Figure").isRemove = true;
                    
                }
                this.tempNodes = waitQueue;
                //加分
                this.addScore(waitQueue.length);
                //该消除的消除该下落的下落
                this.remove(waitQueue,removeTime);
            }
        }
        
    },
    //改变地图信息
    changeMap : function(nodeArr){
        if(nodeArr.length > 0){
            for(let k = 0;k<nodeArr.length;k++){
                //将所有的坐标变成只保留两位小数的数字
                nodeArr[k].x = Number(nodeArr[k].x.toFixed(2));
                nodeArr[k].y = Number(nodeArr[k].y.toFixed(2));
            }
            for(let i = 0;i<nodeArr.length;i++){
                //当前停止的节点对应的地图位置
                var row = nodeArr[i].getComponent("Figure").row;
                var col = nodeArr[i].getComponent("Figure").col;
                //如果有块在停止的时候更新了地图就不在这里更新地图信息了
                if(!nodeArr[i].getComponent("Figure").hasDown){
                    this.map[row][col] = 1;
                    //将背景方格的属性状态改为该节点数组对应的类型
                    this.backGroundArr[row][col].getComponent("Back").type = nodeArr[i].getComponent("Figure").type;
                    this.backGroundArr[row][col].getComponent("Back").innerNode = nodeArr[i];
                }else{
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
    canRemove : function(nodeArr,waitQueue){
        var result = {
            isRemove : false,
            queue    : null,
        }
        for(let m = 0;m < nodeArr.length;m++){
            var tempArr = [];
            var cRow = nodeArr[m].getComponent("Figure").row;
            var cCol = nodeArr[m].getComponent("Figure").col;
            var cType = nodeArr[m].getComponent("Figure").type; 
            this.find(nodeArr[m],cRow,cCol,cType,tempArr);
            if(tempArr.length >= 3){
                for(let k = 0;k < tempArr.length;k++){
                    var nodeType = tempArr[k].getComponent("Figure").type;
                    //画像方块的类型在0-3之间才允许加进去
                    if(!waitQueue.contain(tempArr[k]) && (nodeType < 4 && nodeType >= 0)){
                        //如果数组里面有这个节点的信息了说明已经加到数组里面了不用再重复加入了
                        waitQueue.push(tempArr[k]);
                    }else{
                        cc.log("该类型不在加入的条件");
                    }
                    
                }
            }
        }
        //递归的方式把待消队列找出来
        if(waitQueue.length >= 3){
            result.isRemove = true;
            result.queue = waitQueue;
        }else{
            result.isRemove = false;
            result.queue = [];
        }
        return result;

    },
    /**
     * 依据带消除队列里的长度进行计算分数
     * @param  {待消除队列的长度} waitQueueLength
     */
    addScore : function(waitQueueLength){
        var scoreLabel = this.scoreLabel.getComponent(cc.Label);
        switch(waitQueueLength){
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
    //消除操作，先播放消除动画删除相应节点，上面的节点依次下落
    /**
     * @param  {待消除队列} waitQueue
     * @param  {消除次数} removeTime
     */
    remove : function(waitQueue,removeTime){
        //播放消除音效
        this.playAudio(this.removeAudio);
        //先不删除这些节点等找到所有这些待消节点上方的节点之后删除他们
        //找到这几个待消节点上面的所有节点让他们自动执行下落动作（节点所挂的消除下落方法）
        var scoreLabel = this.scoreLabel.getComponent(cc.Label);
        removeTime++;
        this.totalRemoveTime++;
        this.totalTime++;
        if(removeTime >= 2){
            if(removeTime === 2){
                //产生一次连击
                this.score += 10;
            }else if(removeTime === 3){
                //产生两次连击
                this.score += 20;
            }else if(removeTime === 4){
                //产生3次连击
                this.score += 30;
            }else if(removeTime === 5){
                //产生4次连击
                this.score += 40;
            }
            scoreLabel.string = this.score;
        }
        var waitDownArr = [];
        for(let m = 0;m<waitQueue.length;m++){
            var cRow = waitQueue[m].getComponent("Figure").row;
            var cCol = waitQueue[m].getComponent("Figure").col;
            this.upFindNodes(cRow,cCol,waitDownArr);
        }
        cc.log("待下落节点数组为：" + waitDownArr);
        //得到激活之后的节点
        var activeNode = this.deleteNodeFromParent(waitQueue);
        
        // if(!waitDownArr.contain(activeNode))
        //     waitDownArr.push(activeNode);
        //下落其他节点
        for(let j = 0;j<waitDownArr.length;j++){
             waitDownArr[j].getComponent("Figure").afterRemoveDown(this.map,this.backGroundArr,false);
        }
        if(activeNode.length > 0){
            for(let i = 0;i<activeNode.length;i++){
                if(!waitDownArr.contain(activeNode[i])){
                    //将该激活节点加入到下降节点队列里检测是否可以再次消除
                    waitDownArr.push(activeNode[i]);
                }
            }
        }
        //检测下降的节点数组看看是否可以再次消除
        //0.5秒后检测下落的节点数组，为了防止下落块还没有执行action完又来了个action这样moveTo方法会出现错误
        //连消检测
        this.scheduleOnce(function(){
            this.checkNodeArr(waitDownArr,removeTime);
        },0.3);
        
    },
    /**
     * @param  {待消除队列} waitQueue
     */
    deleteNodeFromParent : function(waitQueue){
        var activeNodeArr = [];
        for(let i = 0;i<waitQueue.length;i++){
            var row = waitQueue[i].getComponent("Figure").row;
            var col = waitQueue[i].getComponent("Figure").col;
            // var upNodes = this.upFindNodes(row,col);
            //检查待消除方格的周围有没有封印的方格小块
            this.checkHasSealBlock(row,col,activeNodeArr);
            //恢复地图信息
            this.map[row][col] = 0;
            //恢复背景方格的原始属性
            this.backGroundArr[row][col].getComponent("Back").type = -1;
            this.backGroundArr[row][col].getComponent("Back").innerNode = null;
            waitQueue[i].getComponent("Figure").shine();
            
        }
        //返回激活队列
        return activeNodeArr;
        // if(activeNodeArr.length > 0){
        //     //检查激活过的节点是否存在消除的可能
        //     this.checkNodeArr(activeNodeArr);
        // }
    },
    //查看一个节点周围有没有封印的画像方块
    /**
     * @param  {该节点所处的行} row
     * @param  {该节点所处的列} col
     * @param  {激活节点数组} activeNodeArr
     */
    checkHasSealBlock : function(row,col,activeNodeArr){
        //四个方向的位置
        var directionArr = [[row-1,col],[row+1,col],[row,col-1],[row,col+1]];
        for(let m = 0;m<directionArr.length;m++){
            var crow = directionArr[m][0];
            var ccol = directionArr[m][1];
            //如果行或者列超出了边界位置就继续下一个方向数组对应的行和列
            if(crow > 11 || crow < 0 || ccol > 5 || ccol < 0){
                continue;
            }else{
                var node = this.backGroundArr[crow][ccol].getComponent("Back").innerNode;
                if(node === null){
                    continue;
                }
                //如果是待消除的方块的话就跳过该节点
                if(node.getComponent("Figure").isRemove === true){
                    continue;
                }
                var nodeType = this.backGroundArr[crow][ccol].getComponent("Back").type;
                if(nodeType >= 4 && nodeType <= 7){
                    // var nodeName = Number(node.name);
                    //证明该行该列存在封印的画像动态加载图片
                    cc.log("nodeType is " + nodeType);
                    var anim = node.getComponent(cc.Animation);
                    //激活状态设置为true
                    node.getComponent("Figure").isActive = true;
                    if(!activeNodeArr.contain(node)){
                        //将该激活节点加入到激活队列里
                        activeNodeArr.push(node);
                    }
                    if(nodeType === 4){
                        for(let j = 0;j<node.childrenCount;j++){
                            node.children[j].x = 0;
                            node.children[j].active = true;
                        }
                        anim.play("game_yellow_stone_unlock");
                        //改变背景方格的对应的状态类型
                        this.backGroundArr[crow][ccol].getComponent("Back").type = 0;
                        //设置该节点的类型为0
                        node.getComponent("Figure").type = 0;
                        node.name = "7";
                    }else if(nodeType === 5){
                        for(let j = 0;j<node.childrenCount;j++){
                            node.children[j].x = 0;
                            node.children[j].active = true;
                        }
                        anim.play("game_yellow_stone_unlock");
                        this.backGroundArr[crow][ccol].getComponent("Back").type = 1;
                        node.getComponent("Figure").type = 1;
                        node.name = "8";
                    }else if(nodeType === 6){
                        for(let j = 0;j<node.childrenCount;j++){
                            node.children[j].x = 0;
                            node.children[j].active = true;
                        }
                        anim.play("game_yellow_stone_unlock");
                        this.backGroundArr[crow][ccol].getComponent("Back").type = 2;
                        node.getComponent("Figure").type = 2;
                        node.name = "9";
                    }else if(nodeType === 7){
                        for(let j = 0;j<node.childrenCount;j++){
                            node.children[j].x = 0;
                            node.children[j].active = true;
                        }
                        anim.play("game_yellow_stone_unlock");
                        this.backGroundArr[crow][ccol].getComponent("Back").type = 3;
                        node.getComponent("Figure").type = 3;
                        node.name = "10";
                    }  
                }
            }
        }

    },
    //动态修改图片的spriteFrame
    /**
     * @param  {节点的名字} nodeName
     * @param  {待修改节点} node
     */
    dynamicLoad : function(nodeName,node){
        nodeName = Number(nodeName);
        function callback(err,spriteFrame){
            if(err){
                console.log(err);
            }
            node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            //加载完之后修改精灵的名字
            cc.log("设置");
        }
        (function test(callback){
            cc.loader.loadRes("Game4/" + nodeName-4,cc.SpriteFrame,callback);
        })(callback.bind(this));
    },
    
    //向上找节点
    upFindNodes : function(row,col,arr){
        if(arguments.length === 2){
            var tempArr = [];
        }
        while(row > 0){
            row--;
            var upNode = this.backGroundArr[row][col].getComponent("Back").innerNode;
            if(upNode != null){
                if(upNode.getComponent("Figure").isRemove === true){
                    continue;
                }else{
                    if(arguments.length === 3){
                        //将不是待消节点添加到数组中去
                        if(!arr.contain(upNode)){    
                            //如果该数组中还没有该节点的话就加进去
                            arr.push(upNode);
                        }
                    }else{
                        if(!tempArr.contain(upNode))
                            tempArr.push(upNode);
                    }
                }
            }else{
                //如果upNode是空的话
                break;
            }
        }
        if(arguments.length === 2){
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
   find : function(node,row,col,type,arr){
       //定义上下左右四个方向数组
       var round = [[row-1,col],[row+1,col],[row,col-1],[row,col+1]];
       if(!arr.contain(node)){
           //如果当前数组中不包含该节点就加入数组
           arr.push(node);
       }
       for(let i =0;i < round.length;i++){
           //如果计算的行或者列超出了边界继续下一个行列
           if(round[i][0] < 0 || round[i][0] >11 || round[i][1] > 5 || round[i][1] < 0){
               continue;
           }
           var checkType = this.backGroundArr[round[i][0]][round[i][1]].getComponent("Back").type;
           if(checkType === type && checkType < 4 && checkType >= 0){
                var waitDeleteNode = this.backGroundArr[round[i][0]][round[i][1]].getComponent("Back").innerNode;
                if(!arr.contain(waitDeleteNode)){
                    arr.push(waitDeleteNode);
                    //递归寻找节点
                    this.find(waitDeleteNode,round[i][0],round[i][1],type,arr);
                }
           }
       }
   },
   //方块下落方法
   down : function(nodeArr){
        //位移3个方格
        for(var i = nodeArr.length-1;i >= 0;i--){
            var row = this.getRow(nodeArr[i]);
            var col = this.getColumn(nodeArr[i]);
            nodeArr[i].y = this.backGroundArr[row+1][col].y; 
            nodeArr[i].getComponent("Figure").row = row+1;
        }
    },
    //将这两个预制体的坐标数值保留两位小数
    remainTwoNumber : function(nodeArr){
        for(let k = 0;k<nodeArr.length;k++){
            //将所有的坐标变成只保留两位小数的数字
            nodeArr[k].x = Number(nodeArr[k].x.toFixed(2));
            nodeArr[k].y = Number(nodeArr[k].y.toFixed(2));
        }
    },
    //旋转方法
    rotate : function(){
        if(!this.gameOver){
            //记录下旋转的位置
            // this.unscheduleAllCallbacks();
            if(this.isCreateOver){
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
                var rotate45X = (x-x0)*Math.cos(-Math.PI/4)-(y-y0)*Math.sin(-Math.PI/4) + x0;
                var rotate45Y = (x-x0)*Math.sin(-Math.PI/4)+(y-y0)*Math.cos(-Math.PI/4) + y0;
                //节点的旋转状态
                var nodeAngle = this.nodeArr[0].getComponent("Figure").angle;
                var canAction = false;
                if(nodeAngle === 0){
                    //边界旋转
                    if(x0Col === 5){
                        //改变旋转中心进行旋转内部进行判断是否可以旋转
                        this.changeRotateCenter(nodeAngle,x0Col);
                    }else{
                        if(this.checkIsRotate(x0Row,x0Col,nodeAngle)){
                            //旋转90度对应的坐标位置
                            var bezier = this.dealRotate(nodeAngle,x0Row,x0Col,rotate45X,rotate45Y,x,y,1);
                            //能够旋转
                            canAction = true;
                        }
                    }
                    
                }else if(nodeAngle === 1){
                    if(this.checkIsRotate(x0Row,x0Col,nodeAngle)){
                        var bezier = this.dealRotate(nodeAngle,x0Row,x0Col,rotate45X,rotate45Y,x,y,2);
                        canAction = true;
                    }
                }else if(nodeAngle === 2){
                    //边界旋转判断改为顺时针旋转（以#0块为旋转中心）
                    if(x0Col === 0){
                    this.changeRotateCenter(nodeAngle,x0Col);
                    }else{
                        if(this.checkIsRotate(x0Row,x0Col,nodeAngle)){
                            var bezier = this.dealRotate(nodeAngle,x0Row,x0Col,rotate45X,rotate45Y,x,y,3);
                            canAction = true;
                        }
                    }
                }else if(nodeAngle === 3){
                    if(this.checkIsRotate(x0Row,x0Col,nodeAngle)){
                        //创建贝塞尔曲线所对应的最少坐标
                        var bezier = this.dealRotate(nodeAngle,x0Row,x0Col,rotate45X,rotate45Y,x,y,0);
                        canAction = true;
                    }
                }
                if(canAction){
                    (function test(cb){
                        var bezierAction = cc.bezierTo(0.008,bezier);
                        self.nodeArr[0].runAction(bezierAction);
                        cb()
                    })(pro);
                    function pro() {
                        cc.log("承诺正常执行########");
                        cc.log("@@@@@@@@@@" + self.nodeArr[0].getComponent("Figure").row);
                        cc.log("@@@@@@@@@@" + self.nodeArr[0].getComponent("Figure").col);
                    }
                    cc.log("结束旋转动作!!!!!");
                }
            }
            this.scheduleOnce(function(){
                this.rotateButton.children[0].opacity = 0;
            },0.5);
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
    dealRotate : function(angle,row,col,rotate45X,rotate45Y,x,y,angleCode){
        if(angle === 0){
            var rotate90X = this.backGroundArr[row][col+1].x;
            var rotate90Y = this.backGroundArr[row][col+1].y;
            this.nodeArr[0].getComponent("Figure").row = row;
            this.nodeArr[0].getComponent("Figure").col = col+1;  
        }else if(angle === 1){
            var rotate90X = this.backGroundArr[row+1][col].x;
            var rotate90Y = this.backGroundArr[row+1][col].y;  
            this.nodeArr[0].getComponent("Figure").row = row+1;
            this.nodeArr[0].getComponent("Figure").col = col;  
        }else if(angle === 2){
            var rotate90X = this.backGroundArr[row][col-1].x;
            var rotate90Y = this.backGroundArr[row][col-1].y;
            this.nodeArr[0].getComponent("Figure").row = row;
            this.nodeArr[0].getComponent("Figure").col = col-1;   
        }else if(angle === 3){
            var rotate90X = this.backGroundArr[row-1][col].x;
            var rotate90Y = this.backGroundArr[row-1][col].y;
            this.nodeArr[0].getComponent("Figure").row = row-1;
            this.nodeArr[0].getComponent("Figure").col = col;    
        }
         
        //创建贝塞尔曲线所对应的最少坐标
        var bezier = [cc.p(x,y),cc.p(rotate45X,rotate45Y),cc.p(rotate90X,rotate90Y)];
        // //初始向量
        // var startV = cc.v2(x,y).sub(cc.v2(x0,y0));
        // var result = startV.rotate(Math.PI/2);
        this.nodeArr[0].x = rotate90X;
        this.nodeArr[0].y = rotate90Y;
        //旋转之后变成相应的角度
        this.nodeArr[0].getComponent("Figure").angle = angleCode;
        return bezier;
    },
    //变换旋转中心
    changeRotateCenter : function(nodeAngle,col){
        var canRotate = false;
        var self = this;
        var x00 = this.nodeArr[0].x;
        var y00 = this.nodeArr[0].y;
        var x00Row = this.getRow(this.nodeArr[0]);
        var x00Col = this.getColumn(this.nodeArr[0]);

        var xx = this.nodeArr[1].x;
        var yy = this.nodeArr[1].y;

        //旋转45度方向
        var rotate45Xc = (xx-x00)*Math.cos(-Math.PI/4)-(yy-y00)*Math.sin(-Math.PI/4) + x00;
        var rotate45Yc = (xx-x00)*Math.sin(-Math.PI/4)+(yy-y00)*Math.cos(-Math.PI/4) + y00;
        if(nodeAngle === 0 && col === 5){
            //检查是否可以旋转
            if(this.checkIsRotateByRotateCenter(x00Row,x00Col,nodeAngle)){
                var rotate90X = this.backGroundArr[x00Row][x00Col-1].x;
                var rotate90Y = this.backGroundArr[x00Row][x00Col-1].y;
                this.nodeArr[1].getComponent("Figure").row = x00Row;
                this.nodeArr[1].getComponent("Figure").col = x00Col-1;   
                canRotate = true;
            }
           
        }else if(nodeAngle === 2 && col === 0){
            if(this.checkIsRotateByRotateCenter(x00Row,x00Col,nodeAngle)){
                var rotate90X = this.backGroundArr[x00Row][x00Col+1].x;
                var rotate90Y = this.backGroundArr[x00Row][x00Col+1].y;   
                this.nodeArr[1].getComponent("Figure").row = x00Row;
                this.nodeArr[1].getComponent("Figure").col = x00Col+1;   
                canRotate = true;
            }
            
        }
        //如果能旋转的话就进行执行贝塞尔曲线
        if(canRotate){
            //创建贝塞尔曲线所对应的最少坐标
            var bezier = [cc.p(xx,yy),cc.p(rotate45Xc,rotate45Yc),cc.p(rotate90X,rotate90Y)];
            // //初始向量
            this.nodeArr[1].x = rotate90X;
            this.nodeArr[1].y = rotate90Y;
            //旋转之后变成270度
            if(nodeAngle === 2 && col === 0){
                this.nodeArr[0].getComponent("Figure").angle = 3;
            }else if(nodeAngle === 0 && col === 5){
                this.nodeArr[0].getComponent("Figure").angle = 1;
            }
            //执行贝塞尔曲线动作
            (function test(cb){
                
                var bezierAction = cc.bezierTo(0.008,bezier);
                self.nodeArr[1].runAction(bezierAction);
                cb()
            })(pro.bind(self));
            function pro() {
                cc.log("承诺正常执行########");
                cc.log("@@@@@@@@@@" + self.nodeArr[0].getComponent("Figure").row);
                cc.log("@@@@@@@@@@" + self.nodeArr[0].getComponent("Figure").col);
            }
        }
    },
    /**
     * 检查以0号数组元素为旋转中心检查是否可以旋转
     * @param  {以零号数组节点所在的行} centerRow
     * @param  {以零号数组节点所在的列} centerCol
     * @param  {以零号数组节点所在的角度} angle
     */
    checkIsRotateByRotateCenter : function(centerRow,centerCol,angle){
        if(angle === 2 && centerCol === 0){
            if(this.map[centerRow-1][centerCol+1] != 1 && this.map[centerRow][centerCol+1] != 1){
                return true;
            }else{
                return false;
            }
        }else if(angle === 0 && centerCol === 5){
            if(this.map[centerRow+1][centerCol-1] != 1 && this.map[centerRow][centerCol-1] != 1){
                return true;
            }else{
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
    checkIsRotate : function(centerRow,centerCol,angle){
            //四个方向
            //如果当前方向是0的话就看看一方向对应的背景方格的状态是什么
            if(angle === 0){
                //检查旋转中心节点的右边背景方格的状态是否为1和检查#0块右边对应的背景方格是否为1
                if(this.map[centerRow-1][centerCol+1] != 1 && this.map[centerRow][centerCol+1] != 1){
                    return true;
                }else{
                    return false;
                }
            }else if(angle === 1){
                if(this.map[centerRow+1][centerCol+1] != 1 && this.map[centerRow+1][centerCol] != 1){
                    return true;
                }else{
                    return false;
                }
            }else if(angle === 2){
                if(this.map[centerRow+1][centerCol-1] != 1 && this.map[centerRow][centerCol-1] != 1){
                    return true;
                }else{
                    return false;
                }
            }else if(angle === 3){
                if(this.map[centerRow-1][centerCol-1] != 1 && this.map[centerRow-1][centerCol] != 1){
                    return true;
                }else{
                    return false;
                }
            }
    },
     //左移方法
     moveLeft    : function(){
        if(!this.gameOver){
            this.remainTwoNumber(this.nodeArr);
            if(this.CheckIsLeft()){
                for(var i = 0;i < this.nodeArr.length;i++){
                    this.leftMove(this.nodeArr[i]);
                    cc.log(this.getColumn(this.nodeArr[i]));
                }
            }
        }
    },
    leftMove : function(node){
        var row = this.getRow(node);
        var col = this.getColumn(node);
        //将当前背景节点的node改为null
        // this.backGroundArr[row][col].node = null;
        node.x = this.backGroundArr[row][col-1].x;
        node.getComponent("Figure").row = row;
        node.getComponent("Figure").col = col-1;
    },
   //右移方法
   moveRight   : function(){
       if(!this.gameOver){
           this.remainTwoNumber(this.nodeArr);
           if(this.CheckIsRight()){
               for(var i = 0;i < this.nodeArr.length;i++){
                   this.rightMove(this.nodeArr[i]);
                }
            } 
        }
    },
    rightMove : function(node){
        var row = this.getRow(node);
        var col = this.getColumn(node);
        //将当前背景节点的node改为null
        node.x = this.backGroundArr[row][col+1].x;
        node.getComponent("Figure").row = row;
        node.getComponent("Figure").col = col+1;
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
    CheckIsDown : function(nodeArr){
        if(nodeArr.length != 0){
            //将坐标值转换为小数点两位小数
            this.remainTwoNumber(nodeArr);
            //如果#0块的属性angle为零的时候，只判断#1块下面是否为1，为1不下落，为地面不下落
            if(nodeArr[0].getComponent("Figure").angle === 0){
                return this.checkIsBottom(nodeArr[1],0);
            }else if(nodeArr[0].getComponent("Figure").angle === 1 || nodeArr[0].getComponent("Figure").angle === 3){
                //横条的形状的时候会出现有一个下落的情况
                if(this.checkDown(nodeArr) && !(this.checkDown(nodeArr) instanceof cc.Node)){
                    return true;
                }else if(!this.checkDown(nodeArr) && !(this.checkDown(nodeArr) instanceof cc.Node)){
                    return false;
                }else if(this.checkDown(nodeArr) instanceof cc.Node){
                    var targetNode = this.checkDown(nodeArr);
                    //找出这个下面背景方格状态为0的节点
                    var targetRow = this.findTheNodeDown(targetNode);
                    var col = this.getColumn(targetNode);
                    //单独下落这个节点
                    targetNode.getComponent("Figure").quickDown(targetRow,col,this.backGroundArr,this.map,false);
                    return false;
                }
            }else if(nodeArr[0].getComponent("Figure").angle === 2){
                return this.checkIsBottom(nodeArr[0],2);
            }
        }
    },
    
    /**
     * @param  {需要向下搜索背景方格的状态的初始节点} node
     */
    findTheNodeDown : function(node){
         //获得当前节点的行和列
         var row = this.getRow(node);
         var col = this.getColumn(node);
         //向下寻找
         while(row < 11){
            row++;
            if(this.map[row][col] === 1){
                break;
            }
            if(row === 11){
                break;
            }
         }
         //最底下的背景方格的状态不为1
         if(row === 11 && this.map[row][col] != 1){
             return 11;
         }else{
            return row-1;
         }
         
    },
    //判断横条的情况
    checkDown : function(nodeArr){
        this.remainTwoNumber(nodeArr);
        var count1 = 0;
        var count0 = 0;
        var nodeDownIsZero = [];
        //如果是第11行就放回false
        if(this.getRow(nodeArr[0]) === 11){
            return false;
        }
        for(let m = 0;m < nodeArr.length;m++){
            var row = this.getRow(nodeArr[m]);
            var col = this.getColumn(nodeArr[m]);
            if(this.map[row+1][col] === 1){
                count1++;
            }else if(this.map[row+1][col] ===0){
                count0++;
                nodeDownIsZero.push(nodeArr[m]);
            }
        }
        if(count1 === 2){
            //如果两个块的下面都为1的话不可以下落
            return false;
        }else if(count0 === 2){
            //如果两个块的下面都为0的话是可以下落的
            return true;
        }else{
            if(nodeDownIsZero.length > 0 && nodeDownIsZero.length === 1){
                return nodeDownIsZero[0];
            }
        }
        

    },
    // },
    //判断是否触底或者是下面还有方块
    /**
     * @param  {待检测的节点} node
     */
    checkIsBottom : function(node,angle){
        // if(angle === 0 || angle === 2){
            var row = this.getRow(node);
            var col = this.getColumn(node);
            if(row != 11){
                //下一行背景方格的状态是否为1
                if(this.map[row + 1][col] === 1){
                    //将对应的背景方格的状态改为1
                    return false;
                }else{
                    return true;
                }
            }else{
                return false;
            }
    },
    /**
       检测是否可以向左移动
    **/
   CheckIsLeft : function(){
        //如果两个形状还没有完全落下来不能左移右移
        if(this.nodeArr[0].y > this.nodeHeight/2){
                return false;
        }
        this.remainTwoNumber(this.nodeArr);
        var xArr = [];
        var rowArr = [];
        var colArr = [];
        for(let i = 0;i< this.nodeArr.length;i++){
            xArr.push(this.nodeArr[i].x);
            rowArr.push(this.getRow(this.nodeArr[i]));
            colArr.push(this.getColumn(this.nodeArr[i]));
        }
        var minX = Math.min.apply(Math,xArr);
        cc.log("minX is " + minX);
        //找到最小列
        var col = this.chooseColumnByLocation(minX);
        if(xArr.length > 0){
            if(xArr[0] === xArr[xArr.length-1]){
                if(col === 0){
                    return false;
                }
                //说明是同一列
                //找出x坐标最小的左边看看它的坐标地图状态值是多少
                if(this.map[rowArr[0]][col-1] === 0 && this.map[rowArr[1]][col-1] === 0){
                    return true;
                }else{
                    return false;
                }

            }else{
                //同一行
                if(this.map[rowArr[0]][col-1] === 0){
                    return true;
                }else{
                    return false;
                }
            }
        }
    },
    //检测是否可以向右移动
    CheckIsRight : function(){
          //如果两个形状还没有完全落下来不能左移右移
        if(this.nodeArr[0].y > this.nodeHeight/2){
            return false;
        }
        var xArr = [];
        var rowArr = [];
        var colArr = [];
        this.remainTwoNumber(this.nodeArr);
        for(let i = 0;i< this.nodeArr.length;i++){
            xArr.push(this.nodeArr[i].x);
            rowArr.push(this.getRow(this.nodeArr[i]));
            colArr.push(this.getColumn(this.nodeArr[i]));
        }
        var maxX = Math.max.apply(Math,xArr);
        cc.log("maxX is " + maxX);
        //找到最大列
        var col = this.chooseColumnByLocation(maxX);
        if(xArr.length > 0){
            if(xArr[0] === xArr[xArr.length-1]){
                if(col === 5){
                    return false;
                }
                //说明是同一列
                //找出x坐标最小的左边看看它的坐标地图状态值是多少
                if(this.map[rowArr[0]][col+1] === 0 && this.map[rowArr[1]][col+1] === 0){
                    return true;
                }else{
                    return false;
                }
            }else{
                //同一行
                if(this.map[rowArr[0]][col+1] === 0){
                    //如果最大行右边的背景方格的状态是0的话就可以移动
                    return true;
                }else{
                    return false;
                }
            }
        }
    },
    //暂停游戏
    pause : function(){
        if(!this.gameOver){
            //暂停游戏
            cc.director.pause();
            console.log("game3 is " + game3);
            console.log("暂停游戏开始！！！！");
            this.mask.active = true;
            this.pauseMenu.active = true;
        }
    },
    //播放音效方法
    playAudio : function(audioUrl){
        cc.audioEngine.play(audioUrl,false,1);
    },
    screenAdapt : function(){
        //获得当前屏幕的宽度
        let currentWidth = cc.director.getWinSize();
        //获得屏幕的宽度
        let winWidth = cc.view.getFrameSize();
        console.log("视图宽度是",winWidth);
        console.log("屏幕的宽度是",currentWidth);
    },
});
