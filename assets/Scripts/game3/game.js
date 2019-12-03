var Common = require("Common");
cc.Class({
    extends: cc.Component,

    properties: {
        //预制体数组
        prefabArr : {
            default : [],
            type    : [cc.Prefab],
        },
        girdSize : 20,
        backPrefab  : {
            default : null,
            type    : cc.Prefab,
        },
        scoreLabel : {
            default : null,
            type    : cc.Node,
        },
        //下一个形状显示区域节点
        nextShape   : {
            default : null,
            type    : cc.Node,
        },
        //联网版的时候是对手信息
        rivalInfoNode : {
            default : null,
            type    : cc.Node,
        },
        //下落按钮
        downButton  : {
            default : null,
            type    : cc.Node,
        },
        //单机版的时候是下下个方格状态
        next2 : {
            default : null,
            type    : cc.Node,
        },
        //gameover标签
        // gameBye : {
        //     default : null,
        //     type    : cc.Node,
        // },
        //滑动按钮
        slideButton : {
            default : null,
            type    : cc.Node,
        },
        rotateButton : {
            default : null,
            type    : cc.Node,
        },
        //遮罩
        mask : {
            default : null,
            type    : cc.Node,
        },
        //暂停结束菜单
        pauseMenu : {
            default   : null,
            type      : cc.Node,
        },
        pauseBack : cc.Node,
        pauseContinue : cc.Node,
        pauseRestart : cc.Node,
        //游戏结束菜单
        overMenu  : {
            default : null,
            type    : cc.Node,
        },
        gameSlide : cc.Node,
        nickName : cc.Node,
        icon     : cc.Node,
        //按钮点击音效
        clickAudio : {
            url : cc.AudioClip,
            default : null,
        },
        //消除音效
        removeAudio : {
            url : cc.AudioClip,
            default : null,
        },
        //失败音效
        loseAudio : {
            url : cc.AudioClip,
            default : null,
        },
        darkNode : cc.Node,
        handNode : cc.Node,
        noticePrefab : cc.Prefab,
    },
    // use this for initialization
    onLoad: function () {
        this.showNoticeHelp = true;
        this.noticeBtn = this.setPrefabPosition(this.noticePrefab,0,0,this.node.parent.getChildByName("noticeDark"));
        this.noticeBtn.active = true;
        this.invalidRemoveTime = 0;
        this.normalSpeed = 0.7,
        this.quickSpeed  = 0.07,
        this.up = 10;
        this.lr = 12;
        console.log("noticeBtn is ",this.noticeBtn);
        cc.log("当前游戏是否是处于暂停状态"+cc.director.isPaused());
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
        this.noticeBtn.on("touchstart",function(){
            this.darkNode.active = false;
            this.handNode.active = false;
            this.noticeBtn.active =false;
            this.showNoticeHelp = false;
        }.bind(this));
        this.darkNode.on("touchstart",function(){
            this.darkNode.active = false;
            this.handNode.active = false;
            this.noticeBtn.active =false;
            this.showNoticeHelp = false;
        }.bind(this));
        this.handNode.on("touchstart",function(){
            this.darkNode.active = false;
            this.handNode.active = false;
            this.noticeBtn.active =false;
            this.showNoticeHelp = false;
        }.bind(this));
        // Menu.prototype.onLoad();
        // if(Common.MOVEMODEL === 1){
        //     this.slideButton.active = true;
        //     this.leftAndRight.active = false;
        // }else if(Common.MOVEMODEL === 2){
        //     this.slideButton.active = false;
        //     this.leftAndRight.active = true;
        //     //为左右按钮添加点击事件
        // }
        //消除的总次数
        this.totalRemoveTime = 0;
        this.totalTime = 0;
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
        this.initMap(this.up,this.lr,this.backPrefab,12,6);
        //存放每次生成的预制体数组即是活动的条
        this.nodeArr = this.createShape(this.node);
        //生成下一个形状
        this.createNext();
        // //显示下一个形状
        // this.showNextShape(this.nextBlock);
        //显示下下个形状
        // this.showNextShape();
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
        Array.prototype.contain = function(shape){
            if(shape != undefined){
                for(var i = 0;i<this.length;i++){
                    if(this[i].x === shape.x && this[i].y === shape.y && this[i].getComponent("Stone").type === shape.getComponent("Stone").type){
                        return true;
                    }
                }
            }
            return false;
        };
        //下落按钮监听
        this.downButton.on("touchstart",function(){
            this.playAudio(this.clickAudio);
            this.downButton.children[0].opacity = 120;
            this.xltime = this.quickSpeed;
        }.bind(this));
        this.downButton.on("touchend",function(){
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
        var self = this;
        //触屏的当前列
        this.nCol = 0;
        this.rightDirection = false;
        this.leftDirection = false;
        this.slideStart = 0;
        this.invokeRemoveTime = 0;
        this.pauseBack.on("touchstart",function(){
            console.log("暂停页面退出");
            cc.director.resume();
            cc.director.loadScene("OneChoose");
            // cc.director.resume();
            // self.mask.active = false;
            // self.pauseMenu.active = false;
            
        }.bind(this));
        this.pauseContinue.on("touchstart",function(){
            console.log("暂停页面继续");
            cc.director.resume();
            self.mask.active = false;
            self.pauseMenu.active = false;
        }.bind(this));
        this.pauseRestart.on("touchstart",function(){
            console.log("暂停页面重新开始");
            cc.director.resume();
            self.mask.active = false;
            self.pauseMenu.active = false;
            cc.director.loadScene("Game3");
        }.bind(this));
    },
    leftFunction : function(){
        this.moveLeft();
    },
    rightFunction : function(){
        this.moveRight();
    },
    playAudio : function(audioUrl){
        cc.audioEngine.play(audioUrl,false,1);
    },
    //注册键盘监听
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
            this.slideButton.children[0].opacity = 120;
            // this.onSlide = true;
            //获得当前点击的全局坐标
            // self.slidePosition = event.getLocation();
            //获得开始触点的坐标
            // this.slideStart = event.getLocation();
            // cc.log("self.slidePositionX is " + self.slidePosition.x);
        }.bind(this));
        //在滑动节点上移动的时候
        this.slideButton.on("touchmove",function(event){
            // if(event.getLocation().x - self.slidePosition.x > 0){
            //     this.rightDirection = true;
            //     cc.log("------>>>>>>");
            // }else if(event.getLocation().x - self.slidePosition.x < 0){
            //     this.leftDirection = true;
            //     cc.log("<<<<<-------");
            // }
            this.slideButton.children[0].opacity = 120;
            this.onSlide = true;
            self.slidePosition = event.getLocation();
            cc.log("slidePositionX is " + self.slidePosition.x);
        }.bind(this));
        //在滑动节点上离开的时候
        this.slideButton.on("touchend",function(event){
            self.slidePosition = event.getLocation();
            this.slideButton.children[0].opacity = 0;
            this.onSlide = true;
        }.bind(this));
        //在滑动节点上离开的时候
        this.slideButton.on("touchcancel",function(event){
            self.slidePosition = event.getLocation();
            this.slideButton.children[0].opacity = 0;
            this.onSlide = false;
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
    },
    //返回触点对应的列数
    /**
     * @param  {触摸的是哪个节点} buttonNode
     * @param  {世界节点坐标系} worldPosition
     */
    getTouchLine : function(buttonNode,worldPosition){
        //将触点的x坐标转化为本地坐标系
        var localX = buttonNode.convertToNodeSpaceAR(cc.v2(worldPosition.x,worldPosition.y)).x;
        cc.log("local is " + localX);
        if(localX > 0){
             var n1 = Math.floor(localX/(buttonNode.width/6));
             if(n1 >= 0 && n1 < 1){
                this.nCol = 3;
             }else if(n1 >= 1 && n1 < 2){
                 this.nCol = 4;
             }else if(n1 >= 2 && n1 < 3){
                 this.nCol = 5;
             }
        }else if(localX < 0){
            var n2 = Math.floor(-localX/(buttonNode.width/6));
            if(n2 >= 0 && n2 < 1){
               this.nCol = 2;
           }else if(n2 >= 1 && n2 < 2){
               this.nCol = 1;
           }else if(n2 >= 2 && n2 < 3){
               this.nCol = 0;
           }
        }
        if(this.nCol >= 5){
            this.nCol = 5;
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
    //产生随机数
    createRandom : function(min,max){
         return Math.floor(Math.random()*(max - min) + min);
    },
    //初始化游戏场景主背景12行6列的网格
    /**
     * @param  {外框上边缘的厚度} up
     * @param  {外框左右边缘的厚度} lr
     * @param  {背景网格的预制体} back
     * @param  {行数} row
     * @param  {列数} col
     */
    initMap : function(up,lr,back,row,col){
        //初始化y坐标
        var y = this.nodeHeight/2 - this.girdSize/2 - up;
        //初始化x坐标
        var x = -this.nodeWidth/2 + this.girdSize/2 + lr;
        cc.log("x is " + x);
        this.backGroundArr = [];
        this.map = [];
        //12行6列的网格
        for(var i = 0;i < row; i++){
            //设置它的y坐标
            var tempY =y - i * this.girdSize;
            cc.log("tempY is " + tempY);
            this.backGroundArr[i] = [];
            this.map[i] = [];
            for(var j = 0; j < col;j++){
                var outArr = this.backGroundArr[i];
                var mapData = this.map[i];
                var tempX = x + j * this.girdSize;
                cc.log("tempX is " + tempX);
                //y坐标不变，x坐标要变
                var tempPrefab = this.setPrefabPosition(back,tempX,tempY,this.node,null);
                // var shape = new Shape(tempPrefab,-1);
                tempPrefab.getComponent("Back").type = -1;
                tempPrefab.getComponent("Back").innerNode = null;
                // var shape = new Shape(tempPrefab,-1);
                outArr[j]=tempPrefab;
                mapData[j] = 0;
            }
        }
        cc.log("backGroundArr is " +this.backGroundArr);
    },
    /**
    @param prefab:将要生成预制节点的预制体
    @param x     :将要生成预制节点的x坐标
    @param y     :将要生成预制节点的y坐标
    @param parentNode : 生成的预制节点的父节点
    @param trimSizeJson : 裁减预制体的json对象
     */
    setPrefabPosition : function(prefab,x,y,parentNode,trimSizeJson){
           var prefab = this.createPrefab(prefab);
           if(trimSizeJson != null){
               prefab.width = trimSizeJson.width;
               prefab.height = trimSizeJson.height;
           }
        //    prefab.setPosition(x,y);
           prefab.x = x;
           prefab.y = y;
           parentNode.addChild(prefab);
           return prefab;
    },
    createPrefab : function(prefab){
        var prefabNode = cc.instantiate(prefab);
        return prefabNode;
    },
    //生成形状每一个节点设置为都为0行随机列
    createShape : function(parentNode){
        //该节点数组消除次数容易计分
        // this.removeTime = 0;
        this.cishu = 0;
        //动态生成一个新的节点将生成的预制体节点加入到该父节点上
        // var newNode = new cc.Node();
        // parentNode.addChild(newNode);
        //用来存放预制体的数组
        var randomCol = this.createRandom(2,4);
        var prefabArrTemp = [];
        //盛放颜色代码的数组每次重新生成预制体节点的时候将之前的颜色代码数组置空
        this.boxColorArr = [];
        for(var i = 0;i < 3;i++){
            // var offSet = i * this.girdSize;
            // cc.log("offSet is " + offSet);
            // //产生0-3的随机数
            var index = this.createRandom(0,4);

            // //将对应的颜色索引存放到该数组中
            // // this.boxColorArr.push(this.prefabArr[index].color);
            // cc.log("index is " + index);
            // //将对应的预制体取出来转化为节点然后显示
            var prefabNode = this.createPrefab(this.prefabArr[index]);
            var self = this;
            //设置预制节点的位置
            // prefabNode.setPosition(self.backGroundArr[0][randomCol].x,self.backGroundArr[0][randomCol].y);
            prefabNode.x = self.backGroundArr[0][randomCol].x;
            prefabNode.y = self.backGroundArr[0][randomCol].y;
            prefabNode.getComponent("Stone").type = index;
            prefabNode.getComponent("Stone").row = 0;
            prefabNode.getComponent("Stone").col = randomCol;
            prefabNode.active = false;

            // this.backGroundArr[i][randomCol].innerNode = prefabNode;
            cc.log("------type is " + prefabNode.getComponent("Stone").type);
            //将该预制节点添加为parentNode的孩子
            parentNode.addChild(prefabNode);
            // var shape = new Shape(prefabNode,index);
            //将当前预制体节点存放到预制体临时数组里面
            prefabArrTemp.push(prefabNode);
            // (function(num){
            //     //动态加载图片
            //     function loadImage(){
            //         return new Promise(function(resolve,reject){
            //             cc.loader.loadRes("Game3/"+index.toString(),cc.SpriteFrame,function(err,spriteFrame){
            //                 if(err){
            //                     console.log("加载失败");
            //                     reject();
            //                 }
            //                 resolve(spriteFrame);
            //             })
            //         });
            //     }
            //     loadImage().then(function(spriteFrame){
            //     },function(){
            //         console.log("加载失败！！！！！");
            //     });
            // })(i);
        }
        console.log(prefabArrTemp);
        return prefabArrTemp;
    },
    //生成下一个形状
    createNext : function(){
        if(this.next2Block === undefined){
            this.nextBlock = this.generateNext(this.node);
            //显示下一个形状
            this.showNextShape(this.nextBlock,this.nextShape,null);
        }else{
            this.nextBlock = this.next2Block;
            this.showNextShape(this.nextBlock,this.nextShape,null);
        }
        //生成下下个形状
        this.next2Block = this.generateNext(this.node);
        var trimSizeJson = {
            width      : 100,
            height      : 100,
        }
        //显示下下个形状
        this.showNextShape(this.next2Block,this.next2,trimSizeJson);
    },
    //显示下一个形状
    /**
     * @param  {下一个形状的数组} nextBlock
     * @param  {父节点} parentNode
     * @param  {是否修改预制体节点的大小} TrimSizeJson
     */
    showNextShape : function(nextBlock,parentNode,trimSizeJson){
        //显示下一个形状之前删除这个节点的所有子节点
        if(parentNode.childrenCount > 0){
            for(let k = 0;k<parentNode.childrenCount;k++){
                //销毁该子节点,如果销毁节点成功的话就显示下一个形状
                parentNode.children[k].destroy();
            }
        }
        //依次生成预制节点组成的节点数组
        for(let i = 0;i<3;i++){
            var type = nextBlock[i].getComponent("Stone").type;
            // if(trimSizeJson != null){
            //     this.prefabArr[type].width = trimSizeJson.width;
            //     this.prefabArr[type].height = trimSizeJson.height;
            // }
            // var spriteFrame = nextBlock[i].getComponent("cc.Sprite").spriteFrame;
            if(trimSizeJson === null){
                this.setPrefabPosition(this.prefabArr[type],0,120-i*this.girdSize,parentNode,trimSizeJson);
            }else{
                this.setPrefabPosition(this.prefabArr[type],0,100-i*trimSizeJson.height,parentNode,trimSizeJson);
            }
            
        }
        // for(let k = 0;k<3;k++){
        //     var pre = ;
        //     this.setPrefabPosition(,50,50+k*this.girdSize,this.nextShape);
        // }
    },
    getNodeArrMaxCol : function(){
        var maxCol;
        var colArr = [];
        for(let i = 0;i<this.nodeArr.length;i++){
            colArr.push(this.nodeArr[i].getComponent("Stone").col);
        }
        maxCol = Math.max.apply(Math,colArr);
        //返回最大列
        return maxCol;
    },
    getNodeArrMinCol : function(){
        var minCol;
        var colArr = [];
        for(let i = 0;i<this.nodeArr.length;i++){
            colArr.push(this.nodeArr[i].getComponent("Stone").col);
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
    // called every frame
    update: function (dt) {
        if(this.showNoticeHelp){
            return;
        }else{
            if(this.onSlide || this.onGameSlide){
                this.index += dt;
                // cc.log("this.slidePosition is " + this.slidePosition.x);
                // if(this.index === dt){
                //     this.column1 = this.getTouchLine(this.slidePosition);
                // }
                // if(this.index >= 0.3){
                //     this.column2 = this.getTouchLine(this.slidePosition);
                //     this.index = 0;
                // }
                if(this.onSlide){
                    var column = this.getTouchLine(this.slideButton,this.slidePosition);
                    //当用的是滑屏的时候将空节点的滑动状态改为false
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
            switch(this.iState){
                case Common.STATE_COVER:
                    //执行封面
                case Common.STATE_MENU:
                    //菜单
                case Common.STATE_PLAY:
                    //游戏 --执行游戏代码
                case Common.STATE_REMOVE:
                   //消除 -- 执行消除代码
                case Common.STATE_OVER:
                  //游戏结束 -- 执行游戏结束代码
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
                this.time += dt;
                if(this.cishu === 0 && this.xltime < this.normalSpeed){
                    //如果重新生成一个形状的话就将下落的速度改为this.normalSpeed
                    this.xltime = this.normalSpeed;
                }
                if(this.totalTime === 3){
                    if(this.totalRemoveTime <= 17){
                        //将下落速度提升
                        this.normalSpeed -= 0.1;
                    }
                    this.totalTime = 0;
                }
                if(this.time > this.xltime){
                    if(this.cishu < 3){
                        if(this.cishu === 0){
                            if(this.map[0][this.nodeArr[2].getComponent("Stone").col] != 1)
                                this.nodeArr[2].active = true;
                            else
                                this.gameOver = true;    
                        }else if(this.cishu === 1){
                            if(this.map[1][this.nodeArr[1].getComponent("Stone").col] != 1){
                                this.nodeArr[2].y = this.backGroundArr[1][this.nodeArr[1].getComponent("Stone").col].y;
                                this.nodeArr[2].getComponent("Stone").row = 1;
                                this.nodeArr[1].active = true;
                                this.nodeArr[1].y = this.backGroundArr[0][this.nodeArr[0].getComponent("Stone").col].y;
                                this.nodeArr[1].getComponent("Stone").row = 0;
                            }else{
                                this.gameOver = true;
                            }
                        }else if(this.cishu === 2){
                            if(this.map[2][this.nodeArr[1].getComponent("Stone").col] != 1){
                                this.nodeArr[2].y = this.backGroundArr[2][this.nodeArr[1].getComponent("Stone").col].y;
                                this.nodeArr[2].getComponent("Stone").row = 2;
        
                                this.nodeArr[1].y = this.backGroundArr[1][this.nodeArr[0].getComponent("Stone").col].y;
                                this.nodeArr[1].getComponent("Stone").row = 1;
        
                                this.nodeArr[0].active = true;
                                this.nodeArr[0].getComponent("Stone").row = 0;
                            }else{
                                this.gameOver = true;
                            }
                            
                        }
                        this.cishu++;
                    }else{
                        // this.cishu = 0;
                        this.updatePrefatY(this.nodeArr,false);
    
                    }
                    this.time = 0;
                }
            }else{
                this.overMenu.active = true;
                this.playAudio(this.loseAudio);
                //显示分数
                this.overMenu.getChildByName("scoreValue").getComponent(cc.Label).string = this.score;
                this.overCost += dt;
                // //暂停游戏
                // cc.director.pause();
                if(cc.sys.localStorage.getItem('maxScoreStone') === undefined){
                    //设置值
                    cc.sys.localStorage.setItem('maxScoreStone',this.score);
                }else{
                    if(this.score > cc.sys.localStorage.getItem('maxScoreStone')){
                        //设置值
                        cc.sys.localStorage.setItem('maxScoreStone',this.score);
                        //将最高分数保存起来
                        cc.find("PebmanentNode").getComponent("UserInfo").stoneTopScore = this.score.toString();
                        // let username = cc.find("PebmanentNode").getComponent("UserInfo").nameUser;
                        //将最高分上传到微信托管平台
                        cc.find("PebmanentNode").getComponent("UserInfo").postMessage("SaveScore","stoneRankScore",this.score.toString());
                    }
                    console.log("宝石方块的最高分是: ",cc.sys.localStorage.getItem('maxScoreStone'));
                }
                if(this.overCost >= 4){
                    //恢复游戏主逻辑
                    cc.director.resume();
                    cc.director.loadScene("OneChoose");
                    this.overCost = 0;
                }
            }
        }
    },
    Over : function(){
        //将游戏结束的标记重置为true
        this.gameOver = true;
        //显示游戏结束图片  
        // this.gameBye.active = true;
    },
    //设置游戏状态 --开始 --暂停 --游戏 --消除 --游戏结束 --
    setState : function(state){
        this.iState = state;
    },
    //更新预制体节点的y坐标
    updatePrefatY : function(nodeArr,isNetWork){
        var self = this;
        cc.log("nodeArr is " + nodeArr);
        if(nodeArr.length != 0){
            //如果允许下落的话条的y坐标向下移动
            if(this.CheckIsDown(nodeArr)){
                    //下落节点数组
                    this.down(nodeArr,isNetWork);
                //判断方格是否可以消除
            }else{
                //如果不能下落的话改变背景方格状态(背景方格更新完成之后进行再次生成节点数组)
                this.updateMap(nodeArr);
                // //生成下一个形状
                // this.createNext();
                this.invokeRemoveTime = 0;
                var removeTime = 0;
                //消除次数
                function next(){
                    if(isNetWork){
                        //如果是网络版的话就加入网络接口
                        if(removeTime > 0){
                            let jsonR = {
                                row : removeTime,
                                col : 0,
                            };
                            removeJsonToServer.removeMapList1.push(jsonR);
                            //向服务器发送消除的次数以便进行惩罚
                            // cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg(removeJsonToServer);
                        }
                    }
                    //固定完之后重新生成随机预制体节点
                    self.nodeArr = self.nextBlock;
                    //生成下一个形状
                    self.createNext();
                    // this.nextBlock = this.next2Block;
                }
                (function(n){
                    if(isNetWork){
                        self.checkNodeArr(nodeArr,removeTime,isNetWork);
                    }else{
                        self.checkNodeArr(nodeArr,removeTime,isNetWork);
                    }
                    console.log("removeTiem is " + removeTime);
                    n();
                })(next.bind(self));
                
               
            }
        }
    },
    updateMap : function(nodeArr){
        if(nodeArr.length > 0){
            for(let i = 0;i<nodeArr.length;i++){
                var row = nodeArr[i].getComponent("Stone").row;
                var col = nodeArr[i].getComponent("Stone").col;
                this.map[row][col] = 1;
                //将背景方格的属性状态改为该节点数组对应的类型
                this.backGroundArr[row][col].getComponent("Back").type = nodeArr[i].getComponent("Stone").type;
                this.backGroundArr[row][col].getComponent("Back").innerNode = nodeArr[i];
                nodeArr[i].getComponent("Stone").downShine();
            }
        }
    },
    //方块下落方法
    down : function(nodeArr,isNetWork){
        //如果游戏结束的话不允许向下移动
        if(!this.gameOver){
            //位移3个方格
            for(var i = nodeArr.length-1;i >= 0;i--){
                var row = nodeArr[i].getComponent("Stone").row;
                var col = nodeArr[i].getComponent("Stone").col;
                nodeArr[i].y = this.backGroundArr[row+1][col].y; 
                nodeArr[i].getComponent("Stone").row = row+1;
            }
        }
    },
    /*创建一个二维数组的方法
     *@param rows : 二维数组的行数
      @param cols : 二维数组的列数
     *@param initial : 二维数组的初始值
    */
    createMatrix : function(rows,cols,initial){
        var arr = [];
        for(var i = 0;i < rows;i++){
            var columns = [];
            for(var j = 0;j<cols;j++){
                columns[j] = initial;
            }
            arr[i] = columns;
        }
        return arr;
    },
    /**
        1：旋转的时候判断旋转的坐标对应的背景方格的状态是否为1
        2：当竖条出现在最左边的时候改变旋转中心为最上面的预制体节点
        3：当竖条出现在最右边的时候改变旋转中心为最下面的预制节点
    **/
    rotate       : function(){
        //游戏结束之后不可以再操作这些块了
        if(!this.gameOver){
            this.playAudio(this.clickAudio);
            this.rotateButton.children[0].opacity = 120;
            //判断周围的网格状态是否为true
            /**
             * 
             * 旋转之后方块的颜色变换，第一个变成第二个，第二个变成第三个，第三个变成第一个
             * 
             * ** */
            // cc.log(this.boxColorArr);
            var before0Name = this.nodeArr[0].name;
            var before0Type = this.nodeArr[0].getComponent("Stone").type;
            var before0Frame = this.nodeArr[0].getComponent("cc.Sprite").spriteFrame;
            var before0Row = this.nodeArr[0].getComponent("Stone").row;
            // cc.log("before0 is " + before0);
            var before1Name = this.nodeArr[1].name;
            var before1Type = this.nodeArr[1].getComponent("Stone").type;
            var before1Frame = this.nodeArr[1].getComponent("cc.Sprite").spriteFrame;
            var before1Row = this.nodeArr[1].getComponent("Stone").row;
            // cc.log("before1 is " + before1);
            var before2Name = this.nodeArr[2].name;
            var before2Type = this.nodeArr[2].getComponent("Stone").type;
            var before2Frame = this.nodeArr[2].getComponent("cc.Sprite").spriteFrame;
            var before2Row = this.nodeArr[2].getComponent("Stone").row;
            // cc.log("before2 is " + before2);
            //分别改变颜色
            this.nodeArr[0].name = before2Name;
            this.nodeArr[0].getComponent("Stone").type = before2Type;
            this.nodeArr[0].getComponent("cc.Sprite").spriteFrame = before2Frame;
            this.nodeArr[1].name = before0Name;
            this.nodeArr[1].getComponent("Stone").type = before0Type;
            this.nodeArr[1].getComponent("cc.Sprite").spriteFrame = before0Frame;
            this.nodeArr[2].name = before1Name;
            this.nodeArr[2].getComponent("Stone").type = before1Type;
            this.nodeArr[2].getComponent("cc.Sprite").spriteFrame = before1Frame;
            console.log("arguments's length is ",arguments.length);
            console.log("arguments's length is ",arguments[0]);
            //如果是网络版的发送旋转数据到服务器
            if(arguments.length === 2){
                //发送数据到服务器
                var jsonData0 = {
                    row : before0Row,
                    col : this.nodeArr[0].getComponent("Stone").col,
                    color : before0Type.toString(),
                };
                var jsonData1 = {
                    row  : before1Row,
                    col : this.nodeArr[0].getComponent("Stone").col,
                    color : before1Type.toString(),
                };
                var jsonData2 = {
                    row   : before2Row,
                    col   : this.nodeArr[0].getComponent("Stone").col,
                    color : before2Type.toString(),
                };
                var jsonData3 = {
                    row   : before0Row,
                    col   : this.nodeArr[0].getComponent("Stone").col,
                    color : this.nodeArr[0].getComponent("Stone").type.toString(),
                };
                var jsonData4 = {
                    row   : before1Row,
                    col   : this.nodeArr[0].getComponent("Stone").col,
                    color : this.nodeArr[1].getComponent("Stone").type.toString(),
                };
                var jsonData5 = {
                    row   : before2Row,
                    col   : this.nodeArr[0].getComponent("Stone").col,
                    color : this.nodeArr[2].getComponent("Stone").type.toString(),
                };
                var jsonArr = [];
                jsonArr = Array.of(jsonData0,jsonData1,jsonData2,jsonData3,jsonData4,jsonData5);
                console.log("jsonArr is ",jsonArr);
                for(let m = 0;m < jsonArr.length;m++){
                    this.jsonMsgToServer.changeMapList1.push(jsonArr[m]);
                }
            }
            this.scheduleOnce(function(){
                this.rotateButton.children[0].opacity = 0;
            },0.2);
        }
    },
    //左移方法
    moveLeft    : function(){
        //如果游戏结束就不能再左右移动
        if(!this.gameOver){
            if(this.CheckIsLeft()){
                console.log("arguments.length is ",arguments.length);
                var rowArr = [];
                for(var i = 0;i < this.nodeArr.length;i++){
                    //参数的长度为1的话被认定为网络版的方法
                    if(arguments.length === 1){
                        console.log("进入左移网络版");
                        this.leftMove(this.nodeArr[i],true);
                        //将行数保留下来
                        rowArr.push(this.nodeArr[i].getComponent("Stone").row);
                    }else{
                        this.leftMove(this.nodeArr[i]);
                    }
                }
                //网络版的方法
                if(arguments.length === 1){
                    console.log("进入网络版左移");
                    //将这些数据发送给服务器让对手显示游戏
                    for(let m = 0;m < rowArr.length;m++){
                        var jsonDataForServer = {
                            row   : rowArr[m],
                            col   : this.nodeArr[m].getComponent("Stone").col+1,
                            color : "-1",
                        };
                        this.jsonMsgToServer.changeMapList1.push(jsonDataForServer);
                    }
                }
            }
        }
    },
    leftMove : function(node){
        var row = node.getComponent("Stone").row;
        var col = node.getComponent("Stone").col;
        //将当前背景节点的node改为null
        node.x = this.backGroundArr[row][col-1].x;
        //改变该节点的列
        node.getComponent("Stone").col = col-1;
        //网络版的数据
        if(arguments.length != 1){
            //加入发送到服务器的信息
            let afterLeftJson = {
                row   : row,
                col   : col - 1,
                color : node.getComponent("Stone").type.toString(),
            }
            this.jsonMsgToServer.changeMapList1.push(afterLeftJson);
        }
    },
    //右移方法
    moveRight   : function(){
        if(!this.gameOver){
            if(this.CheckIsRight()){
                var rowArr = [];
                for(var i = 0;i < this.nodeArr.length;i++){
                    if(arguments.length === 1){
                        console.log("进入左移网络版");
                        this.rightMove(this.nodeArr[i],true);
                        //将行数保留下来
                        rowArr.push(this.nodeArr[i].getComponent("Stone").row);
                    }else{
                        this.rightMove(this.nodeArr[i]);
                    }
                }
                if(arguments.length === 1){
                    console.log("进入网络版左移");
                    //将这些数据发送给服务器让对手显示游戏
                    for(let m = 0;m < rowArr.length;m++){
                        var jsonDataForServer = {
                            row   : rowArr[m],
                            col   : this.nodeArr[m].getComponent("Stone").col - 1,
                            color : "-1",
                        };
                        this.jsonMsgToServer.changeMapList1.push(jsonDataForServer);
                    }
                }
            }
        }
    },
    rightMove : function(node){
        var row = node.getComponent("Stone").row;
        var col = node.getComponent("Stone").col;
        node.x = this.backGroundArr[row][col+1].x;
        //设置该节点的列
        node.getComponent("Stone").col = col + 1;
        if(arguments.length != 1){
            //加入发送到服务器的信息
            let afterLeftJson = {
                row   : row,
                col   : col + 1,
                color : node.getComponent("Stone").type.toString(),
            }
            this.jsonMsgToServer.changeMapList1.push(afterLeftJson);
        }
    },
    /**
        检测是否可以向下移动
        返回true或者false
        @return true  : 可以下落
        @return false : 不可以下落
    **/
    CheckIsDown : function(nodeArr){
        if(nodeArr.length != 0){
            var row = nodeArr[nodeArr.length - 1].getComponent("Stone").row;
            var col = nodeArr[nodeArr.length - 1].getComponent("Stone").col;
            //获取最后一个
                //如果最大的行号是11的话不用再这里判断这样的情况是触底的情况
                if(row != 11){
                    if(this.map[row + 1][col] === 1){
                        //将对应的背景方格的状态改为1
                        return false;
                    }else{
                        return true;
                    }
                }else{
                        return false;
                }
        }
    },
    /**
       检测是否可以向左移动
    **/
   CheckIsLeft : function(){
        var row = [];
        for(var i = 0;i<3;i++){
            row[i] = this.nodeArr[i].getComponent("Stone").row;
        }
        var col = this.nodeArr[2].getComponent("Stone").col;
        //如果达到左边界不可左移
        if(col <= 0){
            return false;
        }
        //每下降一个格检测一次
        //如果列的个数为1的话
        for(var m = 0;m<row.length;m++){
            //获得行数
            var mr = row[m];
            //只要一个方格的左边的背景方格的状态为1的话就停止移动
            if(this.map[mr][col - 1] === 1){
                //一个方格的左边背景方格的状态是1的话就说明不可以向左边移动
                return false;
            }
        }
        return true;
    },
    //检测是否可以向右移动
    CheckIsRight : function(){
        var row = [];
        for(var i = 0;i<3;i++){
            row[i] = this.nodeArr[i].getComponent("Stone").row;
        }
        var col = this.nodeArr[2].getComponent("Stone").col;
        //如果达到右边界不可右移
        if(col >= 5){
            return false;
        }
        //每下降一个格检测一次
        //如果列的个数为1的话说明是竖条的形状
        for(var m = 0;m<row.length;m++){
            //获得行数
            var mr = row[m];
            //只要一个方格的左边的背景方格的状态为1的话就停止移动
            if(this.map[mr][col + 1] === 1){
                //一个方格的左边背景方格的状态是1的话就说明不可以向左边移动
                return false;
            }
        }
        return true;
    },
    //改变该节点数组是否存在可消除的节点
    checkNodeArr : function(nodeArr,removeTime,isNetWork){
        if(nodeArr.length != 0){
            if(nodeArr.length > 0){
                //临时数组存放待消节点
                var waitQueue = [];
                if(this.canRemove(nodeArr,waitQueue)){
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
                        waitQueue[j].getComponent("Stone").isRemove = true;
                    }
                    // this.tempNodes = waitQueue;
                    this.addScore(waitQueue.length);
                    //该消除的消除该下落的下落
                    if(isNetWork){
                        return this.remove(waitQueue,removeTime,isNetWork);
                    }else{
                        this.remove(waitQueue,removeTime,isNetWork);
                    }
                }else{
                    //如果是网络版的走这句话
                    if(isNetWork){
                        if(this.rivalTouchBarry){
                            console.log("对手不能消除在发送消息给服务器！！！！！！");
                            // callback(0);
                            return new Promise(function(resolve,reject){
                                console.log("进入消除零次的Promise");
                                resolve(0);
                            });
                        }else{
                            //如果是自己的话消除零次发送给服务器但是在不能下落的时候不发送该数据
                            return new Promise(function(resolve,reject){
                                console.log("对手没有给我发消息");
                                resolve(0); 
                            });
                        }
                    }
                }
                
            }
        }    
    },
    //消除代码
    /**
     * @param  {待消队列} waitQueue
     * @param  {消除次数} removeTime
     * @param  {是否是网络版的宝石方块} isNetWork
     */
    remove : function(waitQueue,removeTime,isNetWork){
        //连消的情况是remove方法被执行了几次就形成了几次连消
        // this.removeTime++;
        // if(this.removeTime >= 2){
        //     cc.log("连消了两次");
        // }
        this.playAudio(this.removeAudio);
        removeTime++
        this.invokeRemoveTime++;
        this.totalRemoveTime++;
        this.totalTime++;
        if(removeTime >= 2){
            var scoreLabel = this.scoreLabel.getComponent(cc.Label);
            cc.log("产生了连消！！！！");
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
        // for(let m = 0;m<waitQueue.length;m++){
        //     var cRow = waitQueue[m].getComponent("Stone").row;
        //     var cCol = waitQueue[m].getComponent("Stone").col;
        //     this.upFindNodes(cRow,cCol,waitDownArr);
        // }
        // cc.log("待下落节点数组为：" + waitDownArr);
        this.deleteNodeFromParent(waitQueue,waitDownArr);
        
        // if(!waitDownArr.contain(activeNode))
        //     waitDownArr.push(activeNode);
        //下落其他节点让节点自己找空穴目标位置进行下落
        // for(let j = 0;j<waitDownArr.length;j++){
        //      waitDownArr[j].getComponent("Stone").afterRemoveDown(this.map,this.backGroundArr);
        //     //  waitDownArr[j].stopAction();
        // }
        
        //检查这些下落的节点数组是否可以再次消除
        if(!isNetWork){
            this.scheduleOnce(function(){
                this.checkNodeArr(waitDownArr,removeTime,isNetWork);
            }.bind(this),0.5);
        }else{
            var self = this;
            function next(){
                //向服务器发送分数信息
                var jsonMsgToServer = {
                    tag1            : 11,
                    score           : 0,
                    type            : "4",
                    state1          : "",
                    changeMapList1  : [],
                    removeMapList1  : 0,
                    nMapRow         : "",
                    nMapCol         : "",
                    loading1        : "",
                    nDisappear1     : 0,
                }
                jsonMsgToServer.tag1 = 11;
                jsonMsgToServer.score = self.score;
                jsonMsgToServer.nDisappear1 = self.score;
                // cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg(jsonMsgToServer);
                // return true;
            }
            function waitPromise(){
                return new Promise(function(resolve,reject){
                    setTimeout(function(){
                        console.log("1034 line " + removeTime);
                        //检查是否能再次消除
                        var isP = self.checkNodeArr(waitDownArr,removeTime,isNetWork);
                        if(isP instanceof Promise){
                            console.log("1038 --->" + isP);
                            isP.then(function(data){
                                resolve(data);
                            });
                        }
                    },500);
                });
            }
            return waitPromise().then(function(data){
                console.log("在消除方法中消除次数是",removeTime);
                console.log("全局的消除变量是",self.invokeRemoveTime);
                next();
                // overPromise();
            });
        }
        
        
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
    canRemove : function(nodeArr,waitQueue){
        for(let i = 0;i < nodeArr.length;i++){
            this.addWillDeleteArr(nodeArr[i],waitQueue);
        }
        if(waitQueue.length >= 3){
           return true;
        }else{
            return false;
        }
    },
    /**
     * @param  {需要各个方向扫描的节点} node
     * @param  {消除队列} willDeleteArr
     */
    addWillDeleteArr(node,willDeleteArr){
        //用于存放该节点类型数组,存放个数>=3个的节点
        var typeArr = [];
        //获得宝石的类型
        var type = node.getComponent("Stone").type;
        //获得当前方格节点所在的行
        var row = node.getComponent("Stone").row;
        //获得当前节点所在的列
        var col = node.getComponent("Stone").col;
        for(var i = 0;i<4;i++){
            //四个方向查找待消节点
            this.directorFind(typeArr,row,col,i,type,node);
        }
        cc.log("typeArr is " + typeArr);
        if(typeArr.length >= 3){
            for(let t = 0;t<typeArr.length;t++){
                //将待消除的节点添加到待消队列里面去
                if(!willDeleteArr.contain(typeArr[t])){
                    //将该节点push进待消队列
                    willDeleteArr.push(typeArr[t]);
                }
            }
        }
        cc.log("willDeleteArr is " + willDeleteArr);
    },
    /**
     * 根据角度填充各个方向数组
     * @param  {遍历每个节点的时候传递进来的一个空数组} typeArr
     * @param  {需要扫描的节点的行} row
     * @param  {需要扫描的节点的列} col
     * @param  {需要扫描的方向} direction
     * @param  {该节点的类型} type
     * @param  {当前需要各个方向扫描的节点} node
     */
    directorFind : function(typeArr,row,col,direction,type,node){
        //存放这个方向的临时数组
        var directionArr = [];
        //45度和-135度方向检测
        var leftRow = row;
        var leftCol = col;
        // if(leftCol === undefined){
        //     cc.director.pause();
        //     //暂停游戏
        //     cc.director.pause();
        // }
        //先把自己push进去(前提是类型相同)
        directionArr.push(node);
        while(leftRow >= 0 || leftRow <= 11 || leftCol >= 0 || leftCol <= 5){
             //行和列都减1
             //0度方向
             if(direction === 0){
                leftCol++;
             }else if(direction === 1){
                 //90度方向
                 leftRow--;
             }else if(direction === 2){
                 //45度方向
                 leftRow--;
                 leftCol++;
             }else if(direction === 3){
                 //135度方向
                 leftCol--;
                 leftRow--;
             }
             //如果寻找的行或者列超出边界
             if(leftRow < 0 || leftRow >11 || leftCol < 0 || leftCol > 5){
                 break;
             }
            //  alert("leftRow-->" + leftRow + "leftCol-->"+leftCol);
             cc.log("leftRow is " + leftRow + " leftCol is " + leftCol + " type is " + type);
             if(this.isCommonType(leftRow,leftCol,type)){
                 //如果当前数组里有当前的元素就不加进去了
                 var nextNode = this.backGroundArr[leftRow][leftCol].getComponent("Back").innerNode;
                 if(!directionArr.contain(nextNode)){
                    //如果找到跟自己颜色一样的话将它放到消除队列里面
                    directionArr.push(nextNode);
                 }
             }else{
                 break;
             }
        }
        leftRow = row;
        leftCol = col;
        while(leftRow >= 0 || leftRow <= 11 || leftCol >=0 || leftCol <= 5){
            if(direction === 1){
                //-90度方向
                leftRow++;
            }else if(direction === 0){
                //180度方向
                leftCol--;
            }else if(direction === 2){
                //-135度方向
                leftRow++;
                leftCol--;
            }else if(direction === 3){
                //-45度方向
                leftCol++;
                leftRow++;
            }
            //如果超出了边界就退出当前循环
            if(leftRow < 0 || leftRow >11 || leftCol < 0 || leftCol > 5){
                break;
            }
            // alert("leftRow-->" + leftRow + "leftCol-->"+leftCol);
            if(this.isCommonType(leftRow,leftCol,type)){
                var nextNode = this.backGroundArr[leftRow][leftCol].getComponent("Back").innerNode;
                //将该节点的待消状态设置为true
                if(!directionArr.contain(nextNode)){
                    //如果找到跟自己颜色一样的话将它放到消除队列里面
                    directionArr.push(nextNode);
                 }
            }else{
                break;
            }
        }
        if(directionArr.length >= 3){
             //加上自己就满足消除条件了
            //  return typeArr;
             for(let j = 0;j<directionArr.length;j++){
                 //将这些节点的待消状态改为true
                 directionArr[j].getComponent("Stone").isRemove = true;
                 //将该形状类加入到相同类型的数组里
                 typeArr.push(directionArr[j]);
             }
        }
    },
    
    //向上找节点
    /**
     * @param  {当前节点所在的行} row
     * @param  {当前节点所在的列} col
     * @param  {存放消除节点以上的节点数组} arr
     */
    upFindNodes : function(row,col,arr){
        if(arguments.length === 2){
            var tempArr = [];
        }
        while(row > 0){
            row--;
            var upNode = this.backGroundArr[row][col].getComponent("Back").innerNode;
            if(upNode != null){
                if(upNode.getComponent("Stone").isRemove === true){
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
    /**
     * @param  {待消除队列} waitQueue
     */
    deleteNodeFromParent : function(waitQueue,waitDownArr){
        for(let i = 0;i<waitQueue.length;i++){
            var row = waitQueue[i].getComponent("Stone").row;
            var col = waitQueue[i].getComponent("Stone").col;
            //恢复地图信息
            this.map[row][col] = 0;
            //恢复背景方格的原始属性
            this.backGroundArr[row][col].getComponent("Back").type = -1;
            this.backGroundArr[row][col].getComponent("Back").innerNode = null;
            waitQueue[i].getComponent("Stone").shine();
            //获得该节点以上的所有节点
            var downArr = this.upFindNodes(row,col);
            for(let j = 0;j<downArr.length;j++){
                 if(!waitDownArr.contain(downArr[j])){
                     waitDownArr.push(downArr[j]);
                 }
                 downArr[j].getComponent("Stone").afterRemoveDown(this.map,this.backGroundArr);
            }
        }
    },
    //判断类型是否和传进来的类型相同
    /**
     * @param  {该节点所处的行} row
     * @param  {该节点所处的列} col
     * @param  {该节点的类型} type
     * @returns {Boolean} true | false
     */
    isCommonType : function(row,col,type){
          //如果该行该列的背景网格的内置节点为空的话说明该网格没有宝石
          if(this.backGroundArr[row][col].getComponent("Back").innerNode === null){
              return false;
          }else{
              return this.backGroundArr[row][col].getComponent("Back").type === type ? true : false;
          }
    },
    //生成下一个形状
    generateNext : function(parentNode){
        return this.createShape(parentNode);
    },
    pause : function(){
        if(!this.gameOver){
            //暂停游戏
            cc.director.pause();
            console.log("暂停游戏开始宝石单机");
            this.mask.active = true;
            this.pauseMenu.active = true;
        }
        
    },
    
});