var Game4Fight = require("./Game4Fight");
var Game3 = require("../FightGame3/FightGame3");
cc.Class({
    extends: cc.Component,

    properties: {
        // back : cc.Prefab,
        backArr : {
            default : [],
            type    : [cc.Prefab],
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.nodeWidth = this.node.width;
        this.nodeHeight = this.node.height;
        this.up = 5;
        this.lr = 4;
        // this.back.width = 50;
        // this.back.height = 50;
        // this.back;
        //初始化地图
        // this.initMap(this.up,this.lr,this.back);
    },
    /**
     * @param  {生成对手游戏的行数} rowNum
     * @param  {生成对手的列数} colNum
     * @param  {游戏类型} type
     */
    initMap(rowNum,colNum,type){
        
        //俄罗斯方块类型
        if(type === "1"){
            this.back = this.backArr[0];
            this.girdSize = 30;
        }else if(type === "4"){
            //画像游戏类型
            this.back = this.backArr[1];
           this.girdSize = 50;
        }else if(type === "3"){
            //噗哟噗哟游戏类型
            this.back = this.backArr[3];
            this.girdSize = 50;
        }else if(type === "2"){
            //宝石方块游戏类型
            this.back = this.backArr[2];
            this.girdSize = 50;
        }
        if(type === "4" || type === "2"){
            Game4Fight.prototype.initMap.call(this,this.up,this.lr,this.back,rowNum,colNum);
        }else if(type === "1" || type === "3"){
            Global.initMapForEnemy.call(this,this.up,this.lr,this.back,rowNum,colNum,"PrefabState");
        }
        // switch (type) {
        //     case "4":
        //         //利用第四个游戏的生成地图的方法
        //         Game4Fight.prototype.initMap.call(this,this.up,this.lr,this.back,rowNum,colNum);
        //         break;
        //     case "3":
        //         Game3.prototype.initMap.call
        //         break;
        // }
        

    },
     /**
    @param prefab:将要生成预制节点的预制体
    @param x     :将要生成预制节点的x坐标
    @param y     :将要生成预制节点的y坐标
    @param parentNode : 生成的预制节点的父节点
     */
    setPrefabPosition : function(prefab,x,y,parentNode){
        var prefab = this.createPrefab(prefab);
        prefab.setPosition(x,y);
        parentNode.addChild(prefab);
        return prefab;
    },
    //创建一个预制体节点
    createPrefab : function(prefab){
        var prefabNode = cc.instantiate(prefab);
        return prefabNode;
    },
    start () {
        
    },
    //显示对手的游戏信息
    update (dt) {
        // console.log("对手信息");
    },
});
