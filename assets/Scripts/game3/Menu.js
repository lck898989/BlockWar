var comm = require("./Common");
cc.Class({
    extends: cc.Component,

    properties: {
        continue : {
            default : null,
            type    : cc.Node,
        },
        back     : {
            default : null,
            type    : cc.Node,
        },
        restart  : {
            default : null,
            type    : cc.Node,
        },
        mask : cc.Node,
        editor : {
            default : null,
            executionOrder : -1,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // this.moveModel = 1;
        //监听返回按钮
        this.back.on("touchstart",function(){
            this.backFunction();
        }.bind(this));
        //监听继续按钮
        this.continue.on("touchstart",function(){
            //恢复游戏主逻辑
            cc.director.resume();
            this.continueFunction();
        }.bind(this));
        //监听重新开始按钮
        this.restart.on("touchstart",function(event){
            cc.log("event is " + event);
            if(event.target.parent.name === "pause4Menu"){
                cc.director.resume();
                cc.director.loadScene("Game4");
            }else if(event.target.parent.name === "menu"){
                cc.director.resume();
                cc.director.loadScene("Game3");
            }
            this.restartFunction();
        }.bind(this));
    },
    backFunction : function(){
        this.node.active = false;
        cc.log("this.mask is " + this.mask);
        this.mask.active = false;
        //加载选择单机的四种模式场景
        cc.director.loadScene("OneChoose");
    },
    continueFunction : function(){
        this.node.active = false;
        cc.log("this.mask is " + this.mask);
        this.mask.active = false;
    },
    restartFunction : function(){
        this.node.active = false;
        cc.log("mask is " + this.mask);
        this.mask.active = false;
    },
    start () {

    },
    //移动模式一
    modelOneFunction : function(){
        comm.MOVEMODEL = 1;
    },
    //移动模式二
    modelTwoFunction : function(){
        comm.MOVEMODEL = 2;
    },
    //移动模式三
    modelThreeFunction : function(){
        comm.MOVEMODEL = 3;
    },
    update (dt) {

    },
});
