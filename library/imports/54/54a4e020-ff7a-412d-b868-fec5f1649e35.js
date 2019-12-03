"use strict";
cc._RF.push(module, '54a4eAg/3pBLbho/sXxZJ41', 'PressButton');
// Scripts/Game1/PressButton.js

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
        //获取暂停界面节点
        nodeStop: {
            default: null,
            type: cc.Node
        },

        //获取改变透明度的节点
        nodeOpacity: {
            default: null,
            type: cc.Node
        }
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
        // var self=this;
        // this.isPress=false;
        // this.node.on(cc.Node.EventType.MOUSE_DOWN, function (event) {
        //       cc.log("aaaaaaaaa");
        //     self.isPress=true;
        //   }, this);
        //   // 使用枚举类型来注册
        //   this.node.on(cc.Node.EventType.MOUSE_UP, function (event) {
        //     self.isPress=false;
        //   }, this);

    },

    //按下暂停按钮
    PressPause: function PressPause() {

        //显示暂停界面
        this.nodeStop.active = true;
        this.nodeOpacity.opacity = 120;
        cc.director.pause();
    },
    //按下继续
    PressContinue: function PressContinue() {
        //恢复游戏主循环
        cc.director.resume();
        this.nodeOpacity.opacity = 0;
        this.nodeStop.active = false;
    },
    //按下返回
    PressBack: function PressBack() {
        cc.director.resume();
        cc.director.loadScene("OneChoose");
    },
    //按下重新开始
    PressRestart: function PressRestart() {
        //恢复游戏主循环
        cc.director.resume();
        cc.director.loadScene("Game1");
    },
    //点击 再来一局
    PressNext: function PressNext() {
        if (cc.sys.isNative) {
            cc.director.resume();
        }
        //给服务器发送消息
        cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg({ "tag1": 1, "type": "1", "score": "", "nMapRow": "", "nMapCol": "" });
        console.log("进入游戏匹配界面");
        cc.director.loadScene("MatchUser");
    },
    PressTuiChu: function PressTuiChu() {
        if (cc.sys.isNative) {
            cc.director.resume();
        }
        cc.director.loadScene("PersonsChoose");
    },
    start: function start() {
        // if(this.isPress)
        // {
        //     Global.game1Main.DownQuick();
        // }
    },
    update: function update(dt) {

        // if(this.isPress)
        // {
        //     Global.game1Main.DownQuick();
        // }
    }
});

cc._RF.pop();