// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

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
        jindu : cc.Label
    },
    onLoad () {
        this.progressBar = this.node.getComponent(cc.ProgressBar);
        console.log("准备跳转微信登录");
        var self = this;
        if(CC_WECHATGAME){
            this.LoginScene = false;
            this.url = [
                {url : 'res/import/08/0870c92c9.24289.json',type : 'json'},
                {url : 'res/raw-assets/Textures/cPart/vs.3f508.png',type : 'png'},
                {url : 'res/raw-assets/Textures/shareIcon.81701.png',type : 'png'},
                {url : 'res/raw-assets/Textures/fenxiang.e347a.png',type : 'png'},
                //音频文件
                {url : 'res/raw-assets/Audio/rival1.3e5c4.mp3',type : 'mp3'},
                {url : 'res/raw-assets/Textures/Common1.d9856.png',type : 'png'},
                {url : 'res/raw-assets/Textures/Common2.eaac7.png',type : 'png'},
                {url : 'res/raw-assets/Textures/cover.96e9c.png',type : 'png'},
            ];
            this.progressBar.progress = 0;
            this.clearAll();
            cc.loader.load(self.url,self.progressCallback.bind(self),self.completeCallback.bind(self));
        }else{
            this.node.active =false;
            cc.director.loadScene("Login");
        }
    },

    start () {

    },
    clearAll : function(){
        for(let i = 0;i < this.url.length;i++){
            let u = this.url[i];
            cc.loader.release(u);
        }
    },
    progressCallback : function(completedCount,totalCount,res){
        console.log("进入回调函数");
        console.log("已经完成的数量",completedCount);
        console.log("资源的总数量",totalCount);
        this.progress = completedCount/totalCount;
        console.log("进度是：",this.progress);
        this.resource = res;
    },
    completeCallback : function(err,texture){
        if(err){
            console.log("下载图片失败");
        }
        console.log("texture is ",texture);
    },
    update (dt) {
        if(!this.resource){
            return ;
        }
        this.progressBar.progress = this.progress;
        let result = new Number(this.progress*100);
        result = result.toFixed();
        if(result.length === 1){
            this.jindu.string = "    " + result;
        }else if(result.length === 2){
            this.jindu.string = "  " + result;
        }else if(result.length === 3){
            this.jindu.string = result;
        }
        console.log("this.progress is ",this.progress);
        if(this.progress >= 1){
            console.log("加载完成");
            //如果登录场景没有加载过就加载一次
            if(!this.LoginScene){
                cc.director.loadScene("Login");
                //场景已经加载过了
                this.LoginScene = true;
            }
            return;
        }
        // if(progress < this.progress){
        //     progress += dt;
        // }
        // this.progressBar.progress = progress;

    },
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},


    // update (dt) {},
});
