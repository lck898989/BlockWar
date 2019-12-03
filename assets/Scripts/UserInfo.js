/*
 * @Author: mikey.zhaopeng 
 * @Date: 2018-06-26 18:57:39 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-08-20 09:40:10
 */
//图片加载工具
var imageLoader = require("./ImageLoader");
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
        rankPrefab : cc.Prefab,
        loseLink : cc.Node,
        backAudio : {
            url : cc.AudioClip,
            default : null,
        },
        worldRankPrefab : cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.gameClubButton = null;
        //加载游戏圈
        if(CC_WECHATGAME){
            let width = 0;
            let height = 0;
            wx.getSystemInfo({
                success : function(res){
                    console.log("手机的品牌是：",res.brand);
                    width = res.screenWidth;
                    height = res.screenHeight;
                    console.log("width is ",width);
                    console.log("height is ",height);
                },
                fail : function(){

                },
                complete : function(){

                }
            })
            //加入游戏圈功能
            this.gameClubButton = wx.createGameClubButton({
                type : "image",
                text : "",
                image : "",
                icon  : 'dark',
                style : {
                    left : width/2-20,
                    top  : height-80,
                    width : 40,
                    height : 40,
                }

            });
            this.gameClubButton.hide();
        }
        this._isCapturing = false;
        var self = this;
        //将此节点作为常驻节点
        cc.game.addPersistRootNode(this.node);  
        this.loseLink.active = false;
        //初始化用户名字
        this.nameUser="";
        //初始化敌人的信息
        this.rivalName = "";
        //初始化用户token
        this.tokenMsg="";
        //初始化用户头像
        this.pictureUser="";
        //初始化用户计分
        this.nUserScore=0;
        //初始化玩家匹配状态
        this.matchState="";
        //初始化服务器广播的用户自己的信息
        this.userMsg;
        //初始化服务器广播的敌人的信息
        this.pictureEnemy="";
        //判断用户进入匹配界面是否加载完场景
        this.isLoad=false;
        //初始化用户的游戏类型
        this.nGameType="0";
        //用户头像图片
        this.userImage=null;
        //对手头像图片
        this.rivalImage = null;
        //敌人的游戏类型
        this.rivalGameType = "0";
        this.openid = "";
        //是否游戏结束或者死亡
        this.isOver = false;
        //单机版的俄罗斯方块最高分记录
        this.tetrisTopScore = cc.sys.localStorage.getItem('maxScoreTetris') === undefined ? "0" : cc.sys.localStorage.getItem('maxScoreTetris');
        //单机版的画像方块的最高分记录
        this.figureTopScore = cc.sys.localStorage.getItem('maxScoreFigure') === undefined ? "0" : cc.sys.localStorage.getItem('maxScoreFigure');
        //单机版的宝石方块的最高分记录
        this.stoneTopScore = cc.sys.localStorage.getItem('maxScoreStone') === undefined ? "0" : cc.sys.localStorage.getItem('maxScoreStone');
        if(cc.sys.os === cc.sys.OS_ANDROID){
            // cc.eventManager.addListener({
            //     event : cc.EventListener.KEYBOARD,
            //     onKeyPressed : function(keyCode,event){
            //         if(keyCode === cc.KEY.back){
            //             cc.director.end();
            //         }
            //     },
            //     onKeyReleased : function(keyCode,event){

            //     },
            // },this)
            console.log("进入原生安卓环境");
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this);
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,this.onKeyUp,this);
        }
        //断网监听
        this.loseLink.on("touchstart",function(){
            this.loseLink.active = false;
            cc.director.loadScene("Login");
        }.bind(this));
        if(CC_WECHATGAME){
            wx.showShareMenu({
                withShareTicket : true
            });
            wx.onShareAppMessage(function(){
                return {
                    title : '跟我一起玩方块大爆炸吧',
                    imageUrl : 'https://wx.qlogo.cn/mmhead/Q3auHgzwzM5iaibNxrPibic6NRlaOjEiaAnwBH5SkBIeVUVYXNEMUDN406w/0',
                }
            });
        }
        cc.audioEngine.play(this.backAudio,true,0.6);
    },
    onKeyDown : function(event){
        switch(event.keyCode){
            case cc.KEY.back:
                //如果用户点击了返回按钮退出游戏
                console.log("开始返回手机桌面");
                cc.director.end();
                break;
        }
    },
    onKeyUp   : function(event){
        switch(event.keyCode){
            case cc.KEY.back:
                //如果用户点击了返回按钮退出游戏
                break;
        }
    },
    onDestroy(){
        console.log("销毁监听事件");
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN,this.onKeyDown,this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP,this.onKeyUp,this);
    },
    //单机加载用户信息
    StandAloneLoad:function(){

    },
    //加载一个用户信息
LoadUser: function(iconUrl,nickname,nodeName,nodePicture){
    // var self = this;
    // this.qqNickname.getComponent(cc.Label).fontSize = 20;
    nodeName.getComponent(cc.Label).string = nickname;
    this.LoadUserPicture(iconUrl,nodePicture);
    // //远程加载资源
    // cc.loader.load({url:iconUrl,type:'jpg'},function(err,texture){
    //      var spriteFra = nodePicture.getComponent(cc.Sprite).spriteFrame;
    //      spriteFra.setTexture(texture);
    // }.bind(this));
},
//加载两个用户头像
LoadTwoUser:function(iconUrl,iconUr2,nodeName1,nickname,nodePicture1,nodePicture2){
    console.log("in LoadTwoUser iconUrl is " + iconUrl);
    console.log("in LoadTwoUser iconUr2 is " + iconUr2);
    console.log("in LoadTwoUser nodeName1 is " + nodeName1);
    console.log("in LoadTwoUser nickname is " + nickname);
    console.log("in LoadTwoUser nodePicture1 is " + nodePicture1);
    console.log("in LoadTwoUser nodePicture2 is " + nodePicture2);
    // var self = this;
    // this.qqNickname.getComponent(cc.Label).fontSize = 20;
    nodeName1.getComponent(cc.Label).string = nickname;
    console.log(nodeName1.getComponent(cc.Label).string+"nickname5555555555555555555555");
    if(cc.sys.isNative){
        this.LoadUserPicture(iconUrl,nodePicture1);
        this.LoadUserPicture(iconUr2,nodePicture2);
    }
    if(CC_WECHATGAME){
        this.loadUserPictureByWx(iconUrl,nodePicture1);
        this.loadUserPictureByWx(iconUr2,nodePicture2);
    }
//     //远程加载资源
//     cc.loader.load({url:iconUrl,type:'jpg'},function(err,texture){
//          var spriteFra = nodePicture1.getComponent(cc.Sprite).spriteFrame;
//          spriteFra.setTexture(texture);
//     }.bind(this));
//     cc.loader.load({url:iconUr2,type:'jpg'},function(err,texture){
//         var spriteFra = nodePicture2.getComponent(cc.Sprite).spriteFrame;
//         spriteFra.setTexture(texture);
//    }.bind(this));
},
//加载三个用户头像
LoadThreeUser:function(iconUrl,iconUr2,iconUr3,nodePicture1,nodePicture2,nodePicture3,nickname,nodeName1){
    var self = this;
    cc.log(iconUr3+"4444444444444444444444444444444444444444444444444");
    cc.log(nodePicture1);
    cc.log(nickname);
    // this.qqNickname.getComponent(cc.Label).fontSize = 20;
    nodeName1.getComponent(cc.Label).string = nickname;
    this.LoadUserPicture(iconUrl,nodePicture1);
    this.LoadUserPicture(iconUr2,nodePicture2);
    this.LoadUserPicture(iconUr3,nodePicture3);
},
//加载用户头像
LoadUserPicture:function(iconUr,nodePicture){
    // if(iconUr!="")
    // {
    //     cc.loader.load({url:iconUr,type:'jpg'},function(err,texture){
    //         if(err){
    //             console.log("加载头像出错");
    //         }
    //         console.log("============================加载用户头像==========================================");
    //         //将用户的头像保存起来以后用的时候不用再重复加载了
    //         console.log("===========================获取用户头像信息=====================================================");
    //         var sprite = nodePicture.getComponent(cc.Sprite);
    //         sprite.spriteFrame = new cc.SpriteFrame(texture);
    //    }.bind(this));
    // }
    //如果是相同的请求路径就从本地中提取图片
    if(cc.sys.isNative){
        imageLoader.imageLoadTool(iconUr,function(spriteFrame){
              nodePicture.getComponent(cc.Sprite).spriteFrame = spriteFrame;  
        }.bind(this));
    }
    if(CC_WECHATGAME){
        this.loadUserPictureByWx(iconUr,nodePicture);
    }
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
showRank : function(){
    //得到排行榜节点方便显示隐藏用
    this.rankNode = this.setPrefabPosition(this.rankPrefab,0,400,this.node);
},
showWorldRank : function(){
    var self = this;
    var vsNode = cc.find("PebmanentNode/vs");
    //显示世界排行榜页面
    cc.find("PebmanentNode/vs").active = true;
    //显示黑色背景
    cc.find("PebmanentNode/dark").active = true;
    // let responseData = [{
    //     name : 'Eagles',
    //     integral : '220',
    //     avaturl : "https://wx.qlogo.cn/mmopen/vi_32/rLH62uZPiaCJwc6SYVReibibtibUrCYj4aCh3TBL4ZGSeokVkCEL3BibLtLEHlndyFxNNz4a9bA3gAJO1t8BaQFF9KQ/132",
    // },
    // {
    //     name : 'WY',
    //     integral : '210',
    //     avaturl : "https://wx.qlogo.cn/mmopen/vi_32/rLH62uZPiaCJwc6SYVReibibtibUrCYj4aCh3TBL4ZGSeokVkCEL3BibLtLEHlndyFxNNz4a9bA3gAJO1t8BaQFF9KQ/132",
    // }]
    
    // for(let i = 0;i < responseData.length;i++){
    //     //获得openId
    //     // let openId = responseData[i].openid;
    //     //用户名
    //     let name = responseData[i].name;
    //     //积分
    //     let integral = responseData[i].integral;
    //     let url = responseData[i].avaturl;
    //     //显示世界排行榜数据
    //     let worldNode = self.setPrefabPosition(self.worldRankPrefab,3,385 - i * offset,vsNode);
    //     console.log("世界排行榜节点是：",worldNode);
    //     worldNode.getChildByName("rankNum").getComponent(cc.Label).string = i + 1;
    //     self.loadRivalPictureByWx(url,worldNode.getChildByName("userImage"));
    //     worldNode.getChildByName("nickName").getComponent(cc.Label).string = name;
    //     worldNode.getChildByName("score").getComponent(cc.Label).string = integral;
    // }
    //向服务器请求世界排行数据
    let url = "https://m5.ykplay.com/getWorldRankByName?openid="+this.openid;
    console.log("this.openid is ",this.openid);
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status < 400)) {
            var response = xhr.responseText;
            console.log(response);
            console.log(typeof response);
            let offset = 192;
            var responseData = JSON.parse(response);
            console.log("responseData is ",responseData);
            if(responseData.result === 'ok'){
                if(responseData.data != null){
                    for(let i = 0;i < responseData.data.length;i++){
                        //获得openId
                        let openId = responseData.data[i].openid;
                        //用户名
                        let name = responseData.data[i].name;
                        console.log("in UserInfo name is ",name);
                        let avatarUrl = responseData.data[i].avatarUrl;
                        console.log("in UserInfo avatarUrl is ",avatarUrl);
                        //积分
                        let integral = responseData.data[i].integral;
                        console.log("in UserInfo integral is ",integral);
                        //显示世界排行榜数据
                        let worldNode = self.setPrefabPosition(self.worldRankPrefab,0,385 - i * offset,vsNode);
                        console.log("世界排行榜节点是：",worldNode);
                        worldNode.getChildByName("rankNum").getComponent(cc.Label).string = responseData.data[i].rownum.toString();
                        if(CC_WECHATGAME){
                            let image =wx.createImage();
                            image.onload = function(){
                                let texture = new cc.Texture2D();
                                texture.initWithElement(image);
                                texture.handleLoadedTexture();
                                worldNode.getChildByName("userImage").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                            }
                            image.src = avatarUrl;
                        }
                        // cc.loader.load({url:avatarUrl,type:'jpg'},function(err,tex){
                        //     if(err){
                        //         console.log(err);
                        //     }
                        //     console.log("tex is ",tex);
                        //     let sprite = worldNode.getChildByName("userImage").getComponent(cc.Sprite);
                        //     console.log("sprite is ",sprite);
                        //     sprite.spriteFrame.setTexture(tex);
                        // });
                        // self.loadUserPictureByWx(avatarUrl,worldNode.getChildByName("userImage"));
                        if(name.length >=5){
                            name = name.substring(0,5) + "...";
                            worldNode.getChildByName("nickName").getComponent(cc.Label).string = name;
                        }else{
                            worldNode.getChildByName("nickName").getComponent(cc.Label).string = name;
                        }
                        worldNode.getChildByName("score").getComponent(cc.Label).string = integral;
                    }
                }
            }
        }
    };
    xhr.open("GET", url, true);
    xhr.send();
},
cacelShowWorldRank : function(){
    //关闭世界排行榜页面
    cc.find("PebmanentNode/vs").active = false;
    cc.find("PebmanentNode/dark").active = false;
    //将那些按钮开启
    cc.find("Canvas/OneGame").getComponent(cc.Button).interactable = true;
    cc.find("Canvas/PersobsGame").getComponent(cc.Button).interactable = true;
    cc.find("Canvas/Help").getComponent(cc.Button).interactable = true;
    cc.find("Canvas/Back").getComponent(cc.Button).interactable = true;
    cc.find("Canvas/menuBottom/RankList").getComponent(cc.Button).interactable = true;
    cc.find("Canvas/menuBottom/Friend").getComponent(cc.Button).interactable = true;
    cc.find("Canvas").getComponent("TurnScene").canClick = true;
},
loadUserPictureByWx : function(iconUrl,nodePicture){
    imageLoader.imageLoadToolForWechatGame(iconUrl,function(spriteFrame){
        console.log("spriteFrame is ",spriteFrame);
        nodePicture.getComponent(cc.Sprite).spriteFrame = spriteFrame;
    });
},
LoadRivalPicture : function(iconUr,nodePicture){
    if(CC_WECHATGAME){
        this.loadRivalPictureByWx(iconUr,nodePicture);
    }
},
loadRivalPictureByWx : function(iconUrl,nodePicture){
    imageLoader.rivalImageForWechatGame(iconUrl,function(spriteFrame){
        console.log("spriteFrame is ",spriteFrame);
        nodePicture.getComponent(cc.Sprite).spriteFrame = spriteFrame;
    });
},
//加载用户头像
LoadUserPictureAsync:function(iconUr,nodePicture){
    if(iconUr!="")
    {
        var self = this;
        //返回一个Promise
        return new Promise(function(resolve,reject){
            cc.loader.load({url:iconUr,type:'jpg'},function(err,texture){
                if(err){
                    console.log("加载头像出错");
                }
                console.log("============================加载用户头像==========================================",self.nameUser);
                //将用户的头像保存起来以后用的时候不用再重复加载了
                console.log("===========================获取用户头像信息=====================================================",self.nameUser);
                var sprite = nodePicture.getComponent(cc.Sprite);
                console.log("广播。。sprite"+sprite,self.nameUser);
                console.log("广播。。nodePicture"+nodePicture,self.nameUser);
                console.log("广播。。texture"+texture,self.nameUser);
                sprite.spriteFrame = new cc.SpriteFrame(texture);
                console.log("广播。。spriteFrame"+sprite.spriteFrame,self.nameUser);
                resolve("加载头像成功"+self.nameUser);
           }.bind(self));
        });
    }
    console.log("广播。。该URL为空的");
},
//分享朋友圈接口主动拉起微信分享
shareFriends : function(){
    if(CC_WECHATGAME){
        //微信小游戏平台
        wx.shareAppMessage({
            title    : '今天的方块,你来了吗？',
            imageUrl : 'https://wx.qlogo.cn/mmhead/Q3auHgzwzM7B4kyK03XibIzA3UGTia3BxicVjjfPYxPxIvEVDw5nOc0Ww/0',
        });
    }else if(cc.sys.isNative){
        //如果是原生平台的话就调用原生平台的方法
        this.nativeShare();
    }
},
//原生平台分享
nativeShare : function(){
    // 微信分享屏幕截图  
        // 网页端不支持  
        if (cc.sys.isBrowser) {  
            cc.log('网页端不支持微信分享~');  
            return;  
        }  
  
        // 正在截图中判断  
        if (this._isCapturing) {  
            return;  
        }  
        this._isCapturing = true;  
  
        // 截图文件判断  
        var fileName = "shareScreenshot.jpg";  
        var fullPath = jsb.fileUtils.getWritablePath() + fileName;  
        if (jsb.fileUtils.isFileExist(fullPath)) {  
            jsb.fileUtils.removeFile(fullPath);  
        }  
  
        // 截图并保存图片文件  
        var size = cc.director.getWinSize(); // 获取视图大小  
        var texture = new cc.RenderTexture(size.width, size.height); // 新建渲染纹理  
        texture.setPosition(cc.p(size.width / 2, size.height / 2)); // 移动渲染纹理到视图中心  
        texture.begin(); // 开始渲染  
        cc.director.getRunningScene().visit(); // 访问当前场景  
        texture.end(); // 渲染结束  
        texture.saveToFile(fileName, cc.IMAGE_FORMAT_JPG); // 保存渲染纹理到图片文件  
        console.log("渲染纹理完成");  
        // 延时50毫秒，检测截图文件是否存在  
        // 重复10次这个过程，如果超过10次仍没检测到图片文件，截图失败（超时）  
        var self = this;  
        var tryTimes = 0;  
        var fn = function () {  
            if (jsb.fileUtils.isFileExist(fullPath)) {  
                // 调用相应平台微信分享图片方法  
                if (cc.sys.os === cc.sys.OS_ANDROID) {  
                    jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', 'shareIMG', '(Ljava/lang/String;)V', fullPath);  
                    console.log("分享成功！！！");  
                } else if (cc.sys.os === cc.sys.OS_IOS) {  
                    jsb.reflection.callStaticMethod('AppController', 'shareIMG:', fullPath);  
                }  
                self._isCapturing = false;  
            } else {  
                tryTimes++;  
                if (tryTimes > 10) {  
                    self._isCapturing = false;  
                    cc.log('截图失败，超时~');  
                    return;  
                }  
                setTimeout(fn, 50);  
            }  
        };  
        setTimeout(fn, 50);  
        console.log("截图完成！！");  
},
//弹出广告
showAdvice : function(){
        var self = this;
        let bannerHeight = 80;
        let bannerWidth = 300;
        if(CC_WECHATGAME){
            let winSize = wx.getSystemInfoSync();
            console.log("winSize is ",winSize);
            if(this.advice === undefined){
                this.createAdvertisement();
            }else{
                //先销毁该advertisement
                this.advice.destroy();
                //创建一个新的广告实例
                this.createAdvertisement();
            }
        }
},
createAdvertisement : function(){
    if(CC_WECHATGAME){
        this.advice = wx.createBannerAd({
            adUnitId  : "",
            style     : {
                left  : (winSize.windowWidth - bannerWidth)/2,
                top   : winSize.windowHeight - bannerHeight,
                width : bannerWidth, 
            }
        });
        this.advice.show();
        console.log("advice is ",this.advice);
        this.advice.onLoad(()=>{
            console.log("banner 广告加载成功");
        });
        this.advice.onError(err=>{
            console.log("err is ",err);
        });
        //重新修剪广告位
        self.advice.onResize(res =>{
            console.log("res is ",res);
            console.log("realHeight is ",self.advice.style.realHeight);
            self.advice.style.top = winSize.windowHeight - self.advice.style.realHeight;
        });
    }
},
start () {

},
/**
 * //将最高分上传到微信托管平台
 * @param  {事件名称} action
 * @param  {游戏类型} type
 * @param  {该游戏类型的最高分} score
 */
postMessage : function(action, type, score) {
    console.log("开始保存到微信托管平台");
    console.log("action is ",action);
    console.log("type is ",type);
    console.log("score is ",score);
    if(!CC_WECHATGAME) return;
    let openDataContext = wx.getOpenDataContext();
    openDataContext.postMessage({
        action: action,
        data  : type,
        score : score,
    })
}
    // update (dt) {},
});
