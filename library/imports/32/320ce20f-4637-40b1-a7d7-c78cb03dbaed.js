"use strict";
cc._RF.push(module, '320ceIPRjdAsafXx4ywPbrt', 'JumpLogin');
// Scripts/JumpLogin.js

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
        // progressBar : {
        //     default : null,
        //     type    : cc.ProgressBar
        // }

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        // console.log("准备跳转微信登录");
        // var self = this;
        // if(wx !== undefined){
        //     this.url = [];
        //     //     {url : 'http://47.92.126.116:81/res/import/08/0870c92c9.24289.json',type : 'json'},
        //     //     {url : 'http://47.92.126.116:81/res/raw-assets/Textures/start/stat.27266.png',type : 'png'},
        //     //     //音频文件
        //     //     {url : 'http://47.92.126.116:81/res/raw-assets/Audio/rival1.3e5c4.mp3',type : 'mp3'},
        //     //     {url : 'http://47.92.126.116:81/res/raw-assets/Textures/Common.23767.png',type : 'png'},
        //     // ];
        //     this.resource = "adfad";
        //     this.progressBar.progress = 0;
        //     // this.clearAll();
        //     cc.loader.load(self.url,self.progressCallback.bind(self),self.completeCallback.bind(self));
        //     this.LoginScene = false;
        // }else{

        // }
    },
    start: function start() {},

    // clearAll : function(){
    //     for(let i = 0;i < this.url.length;i++){
    //         let u = this.url[i];
    //         cc.loader.release(u);
    //     }
    // },
    // progressCallback : function(completedCount,totalCount,res){
    //     console.log("进入回调函数");
    //     console.log("已经完成的数量",completedCount);
    //     console.log("资源的总数量",totalCount);
    //     this.progress = completedCount/totalCount;
    //     console.log("进度是：",this.progress);
    //     this.resource = res;
    //     this.comleteCount = completedCount;
    //     this.totalCount = totalCount;
    // },
    // completeCallback : function(err,texture){
    //     if(err){
    //         console.log("下载图片失败");
    //     }
    //     console.log("texture is ",texture);
    // },
    update: function update(dt) {
        // if(!this.resource){
        //     return ;
        // }
        // var progress = this.progressBar.progress;
        // if(progress >= 1){
        //     console.log("加载完成");
        //     //如果登录场景没有加载过就加载一次
        //     if(!this.LoginScene){
        //         cc.director.loadScene("Login");
        //         //场景已经加载过了
        //         this.LoginScene = true;
        //     }else{
        //         console.log("场景已经加载过了");
        //     }
        //     return;
        // }
        // if(progress < 1){
        //     progress += dt;
        // }
        // this.progressBar.progress = progress;

    }
});

cc._RF.pop();