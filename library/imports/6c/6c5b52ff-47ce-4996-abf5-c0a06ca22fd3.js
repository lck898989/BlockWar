"use strict";
cc._RF.push(module, '6c5b5L/R85Jlqv1wKBsoi/T', 'Image');
// Scripts/game4/Image.js

"use strict";

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
        //宝石类型
        type: null,
        //是否可以消除
        isRemove: false,
        //是否移动过
        isMove: false,
        //是否可以激活
        isActive: false,
        /**
         * 0 : 0度方向
         * 1 : 90度方向
         * 2 : 180度方向
         * 3 : 270度方向
         * 4 : 360度方向也就是0度方向
         */
        angle: 0,
        //是否可以快速下落
        hasDown: false,
        //该节点所处的行和列
        row: 0,
        col: 0
        // active : false,
    },
    quickDown: function quickDown(row, col, backGroundArr, map) {
        //改变当前行
        var self = this;
        backGroundArr[self.row][self.col].getComponent("Back").type = -1;
        cc.log("map is " + map);
        var targetX = backGroundArr[row][col].x;
        var targetY = backGroundArr[row][col].y;

        var moveAction = cc.moveTo(0.0001, cc.p(targetX, targetY));
        self.node.runAction(moveAction);
        //该节点已经下落过了，以后更新地图的时候不更新
        self.hasDown = true;
        // this.node.x = targetX;
        // this.node.y = targetY;
        map[row][col] = 1;
        //设置背景方格的类型为该节点的类型
        backGroundArr[row][col].getComponent("Back").type = this.type;
        backGroundArr[row][col].getComponent("Back").innerNode = this.node;
        //设置当前的行为下落之后的行
        this.row = row;
    },
    //消除下落操作
    afterRemoveDown: function afterRemoveDown(map, backGroundArr) {
        if (this.isActive) {
            cc.log("不可消除块下落了，需要你引起注意");
        }
        //自己向下找空穴的位置
        //自己占据的地图信息改为0
        if (this.checkCanDown(map)) {
            map[this.row][this.col] = 0;
            //改变背景方格的类型状态及内置节点的引用风
            backGroundArr[this.row][this.col].getComponent("Back").type = -1;
            backGroundArr[this.row][this.col].getComponent("Back").innerNode = null;
            //向下扫描找到空穴的位置
            var targetRow = this.scanDown(map, this.row, this.col);
            cc.log("targetRow is " + targetRow);
            var targetX = backGroundArr[targetRow][this.col].x;
            var targetY = backGroundArr[targetRow][this.col].y;
            // var distance = targetRow - this.row;
            // if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
            //     cc.renderer.enableDirtyRegion(false);
            // }
            var action = cc.moveTo(0.3, cc.p(targetX, targetY));
            this.node.runAction(action);
            // this.node.y = targetY;
            //将该节点的行设置成目标行
            this.row = targetRow;
            map[this.row][this.col] = 1;
            //设置背景方格的类型为该节点的类型
            backGroundArr[this.row][this.col].getComponent("Back").type = this.type;
            backGroundArr[this.row][this.col].getComponent("Back").innerNode = this.node;
            //如果该节点的坐标超出游戏场景底部那么把它拉回到11行去
            // if(this.node.y <= backGroundArr[11][this.col].y){
            //     this.node.y = backGroundArr[11][this.col].y;
            // }
        }
    },
    scanDown: function scanDown(map, row, col) {
        //向下寻找
        while (row < 11) {
            row++;
            if (map[row][col] === 1) {
                break;
            }
            if (row === 11) {
                break;
            }
        }
        //最底下的背景方格的状态不为1
        if (row === 11 && map[row][col] != 1) {
            return 11;
        } else {
            return row - 1;
        }
    },
    //检测该节点是否可以下落
    checkCanDown: function checkCanDown(map) {
        if (map[this.row + 1][this.col] === 1) {
            return false;
        } else {
            return true;
        }
    },
    //节点发光
    shine: function shine() {
        var self = this;
        (function test(a) {
            (function t() {
                var action1 = cc.fadeTo(0.1, 70);
                var action2 = cc.fadeTo(0, 1, 100);
                var action3 = cc.fadeTo(0.1, 130);
                var action4 = cc.fadeTo(0.1, 160);
                var sequence = cc.sequence(action1, action2, action3, action4);
                self.node.runAction(sequence);
                cc.log("adfadfadf");
            })();
            a();
        })(self.aaa.bind(self));
    },
    //旋转操作
    rotate: function rotate(centerX, centerY, backGroundArr) {},
    // LIFE-CYCLE CALLBACKS:
    aaa: function aaa() {
        // this.node.destroy();
        cc.log("发光完毕");
        this.scheduleOnce(function () {
            this.node.destroy();
        }, 0.2);
    },
    onLoad: function onLoad() {
        // cc.log("%%%%%%%%%%%");
        this.delay = 0;
    },
    start: function start() {},
    update: function update(dt) {
        // this.delay += dt;
        // cc.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
        // cc.log("this.isRemove is " + this.isRemove);
        // //如果该节点是消除状态的时候让它发光
        // if(this.delay > 0.5){
        //     if(this.isRemove){
        //         this.shine();
        //     }
        //     this.delay = 0;
        // }
        if (!this.isActive && this.type >= 4) {
            //不显示它们的子节点
            for (var i = 0; i < this.node.childrenCount; i++) {
                this.node.children[i].active = false;
            }
        }
        // if(this.isActive && this.type >= 4){
        //     for(let i = 0;i<this.node.childrenCount;i++){
        //         this.node.children[i].active = true;
        //     }
        // }
    }
});

cc._RF.pop();