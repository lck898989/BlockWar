cc.Class({
    extends: cc.Component,

    properties: {
        levelLabel : {
            default : null,
            type    : cc.Node,
        },
        scoreLabel : {
            default : null,
            type    : cc.Node,
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if(this.node.name === "over4"){
            //表示是第四个游戏结束了
            // game4.prototype.over();
            //显示分数

        }else if(this.node.name === "over3"){
            // game4.prototype.over();
        }
    },

    start () {

    },

    // update (dt) {},
});
