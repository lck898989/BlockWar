(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/game3/Menu.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '7f435pk2pRAB6Cz9AwAzajN', 'Menu', __filename);
// Scripts/game3/Menu.js

"use strict";

var comm = require("./Common");
cc.Class({
    extends: cc.Component,

    properties: {
        continue: {
            default: null,
            type: cc.Node
        },
        back: {
            default: null,
            type: cc.Node
        },
        restart: {
            default: null,
            type: cc.Node
        },
        mask: cc.Node,
        editor: {
            default: null,
            executionOrder: -1
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        // this.moveModel = 1;
        //监听返回按钮
        this.back.on("touchstart", function () {
            this.backFunction();
        }.bind(this));
        //监听继续按钮
        this.continue.on("touchstart", function () {
            //恢复游戏主逻辑
            cc.director.resume();
            this.continueFunction();
        }.bind(this));
        //监听重新开始按钮
        this.restart.on("touchstart", function (event) {
            cc.log("event is " + event);
            if (event.target.parent.name === "pause4Menu") {
                cc.director.resume();
                cc.director.loadScene("Game4");
            } else if (event.target.parent.name === "menu") {
                cc.director.resume();
                cc.director.loadScene("Game3");
            }
            this.restartFunction();
        }.bind(this));
    },

    backFunction: function backFunction() {
        this.node.active = false;
        cc.log("this.mask is " + this.mask);
        this.mask.active = false;
        //加载选择单机的四种模式场景
        cc.director.loadScene("OneChoose");
    },
    continueFunction: function continueFunction() {
        this.node.active = false;
        cc.log("this.mask is " + this.mask);
        this.mask.active = false;
    },
    restartFunction: function restartFunction() {
        this.node.active = false;
        cc.log("mask is " + this.mask);
        this.mask.active = false;
    },
    start: function start() {},

    //移动模式一
    modelOneFunction: function modelOneFunction() {
        comm.MOVEMODEL = 1;
    },
    //移动模式二
    modelTwoFunction: function modelTwoFunction() {
        comm.MOVEMODEL = 2;
    },
    //移动模式三
    modelThreeFunction: function modelThreeFunction() {
        comm.MOVEMODEL = 3;
    },
    update: function update(dt) {}
});

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=Menu.js.map
        