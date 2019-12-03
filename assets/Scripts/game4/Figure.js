cc.Class({
    extends: cc.Component,
    properties: {
        //宝石类型
        type:null,
        //是否可以消除
        isRemove:false,
        //是否移动过
        isMove : false,
        //是否可以激活
        isActive : false,
        t        : 0,
        /**
         * 0 : 0度方向
         * 1 : 90度方向
         * 2 : 180度方向
         * 3 : 270度方向
         * 4 : 360度方向也就是0度方向
         */
        angle    : 0,
        //是否可以快速下落
        hasDown : false,
        //该节点所处的行和列
        row : 0,
        col : 0,      
    },
    onLoad (){  
    },
    /**
     * @param  {目标位置的行} row
     * @param  {目标位置的列} col
     * @param  {背景节点数组} backGroundArr
     * @param  {背景方格模型数据} map
     * @param  {是否是网络版的游戏} isNetWork
     */
    quickDown : function(row,col,backGroundArr,map,isNetWork){
        var jsonMsgToServer = {
            tag1            : 9,
            score           : "",
            type            : "",
            state1          : "",
            changeMapList1  : [],
            removeMapList1  : 0,
            nMapRow         : "",
            nMapCol         : "",
            loading1        : "",
        };
        //改变当前行
        var self = this;
        //将当前要快速下路的节点的背景方格模型数据的状态改为0
        var beforeRow = self.row;
        var beforeCol = self.col;
        map[self.row][self.col] = 0;
        backGroundArr[self.row][self.col].getComponent("Back").type = -1;
        backGroundArr[self.row][self.col].getComponent("Back").innerNode = null;
        cc.log("map is " + map);
        var targetX = backGroundArr[row][col].x;
        var targetY = backGroundArr[row][col].y;
        var moveAction = cc.moveTo(0.0008,cc.p(targetX,targetY));
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
        //如果是网络版游戏的话就发送数据到服务器
        if(isNetWork){
            //填充jsonMsgToServer
            jsonMsgToServer.changeMapList1.push({row:beforeRow,col:beforeCol,color:"-1"});
            jsonMsgToServer.changeMapList1.push({row:row,col:col,color:this.type.toString()});
            //发送数据到服务器
            cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg(jsonMsgToServer);
        }
        
    },
    //消除下落操作
    afterRemoveDown : function(map,backGroundArr,isNetWork){
        var jsonMsgToServer = {
            tag1            : 9,
            score           : "",
            type            : "",
            state1          : "",
            changeMapList1  : [],
            removeMapList1  : 0,
            nMapRow         : "",
            nMapCol         : "",
            loading1        : "",
        };
        this.t = 0;
        //开启物理组件刚体
        // cc.director.getPhysicsManager().enabled = true;
        if(this.isActive){
            console.log("不可消除块下落了，需要你引起注意");
        }
        //当最底下有两个要消除的时候上方的两个方格下落会出现问题
        
        //自己向下找空穴的位置
        //自己占据的地图信息改为0
        // if(this.checkCanDown(map)){
            let beforeRow = this.row;
            let beforeCol = this.col;
            map[this.row][this.col] = 0;
            //改变背景方格的类型状态及内置节点的引用风
            backGroundArr[this.row][this.col].getComponent("Back").type = -1;
            backGroundArr[this.row][this.col].getComponent("Back").innerNode = null;
            //向下扫描找到空穴的位置
            var targetRow = this.scanDown(map,this.row,this.col);
            cc.log("targetRow is " + targetRow);
            this.targetX = backGroundArr[targetRow][this.col].x;
            this.targetY = backGroundArr[targetRow][this.col].y;
            this.hasTarget = true;
            // var distance = targetRow - this.row;
            // if (cc._renderType === cc.game.RENDER_TYPE_CANVAS) {
            //     cc.renderer.enableDirtyRegion(false);
            // }
            // var action = cc.moveTo(0.3,cc.p(targetX,targetY));
            // this.node.runAction(action);
            // this.node.y = targetY;
            //将该节点的行设置成目标行
            this.row = targetRow;
            map[this.row][this.col] = 1;
            //设置背景方格的类型为该节点的类型
            backGroundArr[this.row][this.col].getComponent("Back").type = this.type;
            backGroundArr[this.row][this.col].getComponent("Back").innerNode = this.node;
            console.log("++++++++beforeRow is +++++++++++" + beforeRow);
            console.log("++++++++beforeRow is +++++++++++" + beforeCol);
            let json1 = {
                row     : beforeRow,
                col     : beforeCol,
                color   : "-1",
            };
            let json2 = {
                row     : this.row,
                col     : this.col,
                color   : this.type.toString(),
            };
            //如果是网络版的游戏发送消息到服务器
            if(isNetWork){
                jsonMsgToServer.changeMapList1.push(json1);
                jsonMsgToServer.changeMapList1.push(json2);
                cc.find("PebmanentNode").getComponent("GetServer").SendLongMsg(jsonMsgToServer);
            }
            
            // if(this.node.y <= backGroundArr[11][this.col].y){
            //     this.node.y = backGroundArr[11][this.col].y;
            // }
        // }
    },
    // //下落惩罚
    // downPunish : function(){

    // },
    scanDown : function(map,row,col){
         //向下寻找
         while(row < 11){
            row++;
            if(map[row][col] === 1){
                break;
            }
            if(row === 11){
                break;
            }
         }
         //最底下的背景方格的状态不为1
         if(row === 11 && map[row][col] != 1){
             return 11;
         }else{
            return row-1;
         }
    },
    //检测该节点是否可以下落
    checkCanDown : function(map){
        if(map[this.row+1][this.col] === 1){
            return false;
        }else{
            return true;
        }
    },
    //节点发光
    shine : function(){
        var self = this;
          (function test(a){
              (function t(){
                var action1 = cc.fadeTo(0.1,70);
                var action2 = cc.fadeTo(0,1,100);
                var action3 = cc.fadeTo(0.1,130);
                var action4 = cc.fadeTo(0.1,160);
                var sequence = cc.sequence(action1,action2,action3,action4);
                self.node.runAction(sequence);
                cc.log("adfadfadf");
              })();
            a();
        })(self.aaa.bind(self));
    },
    //旋转操作
    rotate : function(centerX,centerY,backGroundArr){


    },
    // LIFE-CYCLE CALLBACKS:
    aaa:function(){
        // this.node.destroy();
        cc.log("发光完毕");
        this.scheduleOnce(function(){
            this.node.destroy();
        },0.2);
        
    },
    onLoad () {
        // cc.log("%%%%%%%%%%%");
        this.delay = 0;
    },

    start () {

    },
    update (dt) {
          
            if(this.hasTarget){
                    cc.log("dt s " + dt);
                    cc.log("this.t is " + this.t);
                    this.t += dt;
                    cc.log(this.t);
                    cc.log(this.node.y+"？？？？？？？？？？？？？？？？？？？？？？？？");
                    cc.log(this.targetY+"/////////////////////////");
                    if(this.node.y >= this.targetY+120){
                        if(this.t >= 0.1){
                            cc.log("33434343434343434434");
                            //  cc.director.getPhysicsManager().enabled = false;
                            this.node.y -= 120;
                            this.t = 0;
                        }
                    }
            }
            if(!this.isActive && this.type >= 4){
                //不显示它们的子节点
                for(let i = 0;i<this.node.childrenCount;i++){
                    this.node.children[i].active = false;
                }
            }
            // if(this.isActive && this.type >= 4){
            //     for(let i = 0;i<this.node.childrenCount;i++){
            //         this.node.children[i].active = true;
            //     }
            // }
    },
});
