// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
window.Global = {
    //声明全局Game1Main
     game1Main:null,
     //单机版小方块的宽度
     nWidth:72,
     //单机板浦友浦友的小块宽度
     nWidthPuYo:120,        
     //俄罗斯方块下落时间间隔
     nTimeInteval:0.7,  
     //游戏界面背景框边的长度
     nSide:8,
     //噗呦噗呦背景狂的长度
     nSide1:12,   
     //微信是否登录成功
     wechatSuccess : false,                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
     //生成对手游戏背景
     CreatBackGround:function(arrayBackGround,nRow,nLine,prefab,groundParent,width){
         cc.log("arrayBackGround111111111111111111111"+arrayBackGround);
         cc.log("nRow111111111111111111111111"+nRow);
         cc.log("nLine111111111111111111"+nLine);
         cc.log(prefab+"prefab1111111111111111111111111111")
        for(var i=0;i<=nLine-1;i++)
        {
            arrayBackGround[i]=[];
        }
        for(var i=0;i<=nLine-1;i++)
        {
            for(var j=0;j<=nRow-1;j++)
            {
                var groundNode=cc.instantiate(prefab);
                groundNode.parent=groundParent;
                groundNode.setPosition(cc.p(i*width,j*width));
                arrayBackGround[i].push(groundNode);
                if(i === 0 && j === 0){
                    console.log("第0列第0行的节点坐标是",arrayBackGround[i][j].x,arrayBackGround[i][j].y);
                }
            }
        }  
     },
     //从小到大排序数组行数
     SortArray:function(nArrayLength,nLineX,nRowY){
        for(var k=0;k<=nArrayLength-1;k++)
        {
            if(k<=nArrayLength-2)
            {
                for(var l=k+1;l<=3;l++)
                {
                    if(nRowY[l]<nRowY[k])
                    {
                        var oldX=nLineX[k];
                        nLineX[k]=nLineX[l];
                        nLineX[l]=oldX;
                         var oldY=nRowY[k];
                         nRowY[k]=nRowY[l];
                         nRowY[l]=oldY;
                    }
                }
            }
        }
     },
     //设置背景父节点位置 父节点 和背景节点在同一个坐标系里
     SetBackground:function(nodeBox,groundParent,nBox,nSide){
        var x=nodeBox.getPositionX()-nodeBox.width/2+nSide+nBox/2;
        var y=nodeBox.getPositionY()-nodeBox.height/2+nSide+nBox/2;
        groundParent.setPosition(x,y);

     },
      //网络板小方块的快宽度
      nServerWidth : 30,
      nServerFigureWidth : 50,
      //初始化敌人地图
    /**
     *@param  {外框上边缘的厚度} up
     * @param  {外框左右边缘的厚度} lr
     * @param  {背景网格的预制体} back
     * @param  {行数} row
     * @param  {列数} col
     */
    initMapForEnemy : function(up,lr,back,row,col){
        //初始化y坐标(从下往上生成网格)
        var y = -this.nodeHeight/2 + this.girdSize/2 + up;
        //初始化x坐标
        var x = -this.nodeWidth/2 + this.girdSize/2 + lr;
        console.log("--->>>>x is " + x);
        console.log("--->>>>row is " + row);
        console.log("--->>>>col is " + col);
        this.backGroundArr = [];
        this.map = [];
        //12行6列的网格
        for(var i = 0;i < col;i++){
            //设置它的y坐标
            var tempX =x + i * this.girdSize + 1;
            tempX = Number(tempX.toFixed(2));
            console.log("--->>>>tempX is " + tempX);
            this.backGroundArr[i] = [];
            this.map[i] = [];
            for(var j = 0; j < row;j++){
                var outArr = this.backGroundArr[i];
                var mapData = this.map[i];
                var tempY = y + j * this.girdSize + 1;
                tempY = Number(tempY.toFixed(2));
                console.log("--->>>>tempY is " + tempY);
                //y坐标不变，x坐标要变
                var tempPrefab = this.setPrefabPosition(back,tempX,tempY,this.node);
                if(arguments.length === 6){
                    tempPrefab.getComponent(arguments[5]).isFilled = 0;
                    // tempPrefab.isFilled = 0;
                    // console.log("tempPrefab.isFilled is " + tempPrefab.isFilled);
                    tempPrefab.getComponent(arguments[5]).type = -1;
                    tempPrefab.getComponent(arguments[5]).innerNode = null;
                }else if(arguments.length === 5){
                    // var node = new Shape(tempPrefab,-1);
                    tempPrefab.getComponent("Back").isFilled = 0;
                    // tempPrefab.isFilled = 0;
                    // console.log("tempPrefab.isFilled is " + tempPrefab.isFilled);
                    tempPrefab.getComponent("Back").type = -1;
                    tempPrefab.getComponent("Back").innerNode = null;
                }
                
                // var shape = new Shape(tempPrefab,-1);
                outArr[j]=tempPrefab;
                mapData[j] = 0;
            }
        }
        console.log("backGroundArr is " +this.backGroundArr);
    }
};
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

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
