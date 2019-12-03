"use strict";
cc._RF.push(module, 'ed5e35FhrhNC42T94XPXBlh', 'Stone');
// Scripts/game3/Stone.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        //宝石类型
        type: null,
        //是否可以消除
        isRemove: false,
        //是否移动过
        isMove: false,
        //行
        row: 0,
        //列
        col: 0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad: function onLoad() {
        //目标位置X
        this.targetX = 0;
        //目标位置Y
        this.targetY = 0;
        //行偏移量
        this.offsetRow = 0;
        //计时
        this.time = 0;
        //消除下落时间
        this.xlTime = 0.1;
        //是否可以消除下落
        this.isRemoveDown = false;
        this.hasTarget = false;
    },
    start: function start() {},

    //消除下落操作
    afterRemoveDown: function afterRemoveDown(map, backGroundArr) {
        //自己向下找空穴的位置
        //自己占据的地图信息改为0
        // if(this.checkCanDown(map)){
        this.t = 0;
        map[this.row][this.col] = 0;
        //改变背景方格的类型状态及内置节点的引用风
        backGroundArr[this.row][this.col].getComponent("Back").type = -1;
        backGroundArr[this.row][this.col].getComponent("Back").innerNode = null;
        //向下扫描找到空穴的位置
        var targetRow = this.scanDown(map, this.row, this.col);
        cc.log("targetRow is " + targetRow);
        this.targetX = backGroundArr[targetRow][this.col].x;
        this.targetY = backGroundArr[targetRow][this.col].y;
        //目标行与当前行的差值
        this.offsetRow = targetRow - this.row;
        this.hasTarget = true;
        // this.isRemoveDown = true;
        var self = this;
        // // for(let i = 0;i<this.offsetRow;i++){
        // //     (function test(){
        // //         var action = cc.moveBy(0.3,cc.p(0,-self.node.height));
        // //         self.node.runAction(action);
        // //     })()
        // // }
        // function pro(){
        //     //将该节点的行设置成目标行
        self.row = targetRow;
        map[self.row][self.col] = 1;
        //设置背景方格的类型为该节点的类型
        backGroundArr[self.row][self.col].getComponent("Back").type = self.type;
        backGroundArr[self.row][self.col].getComponent("Back").innerNode = self.node;
        // }
        // // this.node.stopAllActions();
        // (function test(pro){
        //     (function(){
        //         var action = cc.moveTo(0.3,cc.p(self.targetX,self.targetY));
        //         self.node.runAction(action);
        //     })();
        //     pro();
        // })(pro);
        // }
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
    downShine: function downShine() {
        var self = this;
        (function test() {
            (function t() {
                var action1 = cc.fadeTo(0.2, 0);
                var action2 = cc.fadeTo(0, 2, 70);
                var action3 = cc.fadeTo(0.2, 100);
                var action4 = cc.fadeTo(0.2, 70);
                var action5 = cc.fadeTo(0.2, 0);
                var sequence = cc.sequence(action1, action2, action3, action4, action5);
                self.node.children[0].runAction(sequence);
                cc.log("adfadfadf");
            })();
        })();
    },
    //节点发光
    shine: function shine() {
        var self = this;
        (function test(a) {
            (function t() {
                var action1 = cc.fadeTo(0.2, 100);
                var action2 = cc.fadeTo(0, 2, 150);
                var action3 = cc.fadeTo(0.2, 180);
                var action4 = cc.fadeTo(0.2, 200);
                var sequence = cc.sequence(action1, action2, action3, action4);
                self.node.children[0].runAction(sequence);
                cc.log("adfadfadf");
            })();
            a();
        })(self.aaa.bind(self));
    },
    // LIFE-CYCLE CALLBACKS:
    aaa: function aaa() {
        // this.node.destroy();
        cc.log("发光完毕");
        this.scheduleOnce(function () {
            this.node.destroy();
        }, 0.2);
    },
    update: function update(dt) {
        if (this.hasTarget) {
            this.t += dt;
            cc.log(this.t);
            cc.log(this.node.y + "？？？？？？？？？？？？？？？？？？？？？？？？");
            cc.log(this.targetY + "/////////////////////////");
            if (this.node.y >= this.targetY + 120) {
                if (this.t >= 0.1) {
                    cc.log("33434343434343434434");
                    //  cc.director.getPhysicsManager().enabled = false;
                    this.node.y -= 120;
                    this.t = 0;
                }
            }
        }
    }
});

cc._RF.pop();