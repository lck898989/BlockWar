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
    onLoad () {
     
        // //初始化物体下落计时器
        // this.fDownTime=0;
        //判断下落方块是否固定
        this.isStationary=false;
        //初始化物体触底，触碰方块计时器
        this.fCollisionTime=0;
        //判断物体是否和底部或 方块触碰
        this.isCollision=false;
    },
    start () {

    },
    update (dt) {
        if(this.node.getPositionY()+this.node.parent.getPositionY()<1920)
        {
            this.node.parent.getComponent("OperateBlock").isJoin=true;
        }
    },
    // //俄罗斯方块旋转
    // RotateBlock:function(){
    //     if(this.isStationary==false)
    //     {
    //         //刷新1s计时时间
    //         this.fCollisionTime=0;
    //         //旋转次数自加1
    //         this.nRotate++;
    //         this.node.rotation=this.nRotate*90;
    //         if(this.nRotate==4)
    //         {
    //             this.nRotate=1;
    //         }
    //     }
    // },

 
});
