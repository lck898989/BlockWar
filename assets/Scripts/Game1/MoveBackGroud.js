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
        //控制背景的移动速度
        nSpeed:50,
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
        //获取暂停场景子节点
        this.nodeChildPause=this.node.getChildren();
    },
    start () {

    },

    update (dt) {
        this.nodeChildPause[0].x -=this.nSpeed;
        this.nodeChildPause[1].x -=this.nSpeed;
        if(this.nodeChildPause[0].x<=-1080)
        {
            this.nodeChildPause[0].x=1080+this.nodeChildPause[1].x;
        }
        if(this.nodeChildPause[1].x<=-1080)
        {
            this.nodeChildPause[1].x=1080+this.nodeChildPause[0].x;
        }
    },
});
