/*
 * @Author: mikey.zhaopeng 
 * @Date: 2018-06-20 09:51:08 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-08-19 14:56:55
 */
cc.Class({
    extends: cc.Component,

    properties: {
        nickName : cc.Node,
        icon     : cc.Node,
        clickAudio :{
            url : cc.AudioClip,
            default : null,
        },
    },
    

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if(CC_WECHATGAME){
            //隐藏游戏圈
            cc.find("PebmanentNode").getComponent("UserInfo").gameClubButton.hide();
        }
        // //预加载这些场景
        cc.director.preloadScene("Game1",function(){
            cc.log("俄罗斯方块预加载成功！！");
        });
        cc.director.preloadScene("Game2",function(){
            cc.log("宝石方块预加载成功");
        });
        // cc.director.preloadScene("Game3",function(){
        //     cc.log("噗哟噗哟预加载成功");
        // });
        cc.director.preloadScene("Game4",function(){
            cc.log("画像方块预加载成功");
        });
    },
   
    start () {
        if(cc.sys.isNative){
            // var userInfoScript = cc.find("PebmanentNode").getComponent("UserInfo");
            // this.nickName.getComponent(cc.Label).string = userInfoScript.nameUser;
            // userInfoScript.LoadUserPicture(userInfoScript.pictureUser,this.icon);
        }
        if(CC_WECHATGAME){
            var userInfoScript = cc.find("PebmanentNode").getComponent("UserInfo");
            console.log("in chooseModel nameUser is ",userInfoScript.nameUser);
            this.nickName.getComponent(cc.Label).string = userInfoScript.nameUser;
            cc.find("PebmanentNode").getComponent("UserInfo").loadUserPictureByWx(cc.find("PebmanentNode").getComponent("UserInfo").pictureUser,cc.find("Canvas/icon"));
        }
       
    },
    //画像方块
    figureBlock : function(){
        if(CC_WECHATGAME){
            wx.showLoading({
                title : '火速加载中...',
                mask  : true,
            })
        }
        this.playClickMusic();
        cc.director.loadScene("Game4",function(){
            if(CC_WECHATGAME){
               //隐藏加载框
               wx.hideLoading();
            }
        });
    },
    //噗哟噗哟
    puyoBlock   : function(){
        // this.playClickMusic();
        // cc.director.loadScene("Game2");
    },
    //俄罗斯方块
    tetrisBlock : function(){
        if(CC_WECHATGAME){
            wx.showLoading({
                title : '火速加载中...',
                mask  : true,
            })
        }
        this.playClickMusic();
        cc.director.loadScene("Game1",function(){
            if(CC_WECHATGAME){
               //隐藏加载框
               wx.hideLoading();
            }
        });
    },
    //宝石方块
    stoneBlock  : function(){
        if(CC_WECHATGAME){
            wx.showLoading({
                title : '火速加载中...',
                mask  : true,
            })
        }
        this.playClickMusic();
        cc.director.loadScene("Game3",function(){
            if(CC_WECHATGAME){
               //隐藏加载框
               wx.hideLoading();
            }
        });
    },
    //匹配返回
    back        : function(){
        if(CC_WECHATGAME){
            wx.showLoading({
                title : '火速加载中...',
                mask  : true,
            })
        }
        this.playClickMusic();
        cc.director.loadScene("Main",function(){
            if(CC_WECHATGAME){
                wx.hideLoading();
            }
        });
    },
    share : function(){
        if(CC_WECHATGAME){
            console.log("首页share");
            cc.find("PebmanentNode").getComponent("UserInfo").shareFriends();
        }else if(cc.sys.isNative){
            //原生平台分享
            // cc.find("PebmanentNode").getComponent("UserInfo").nativeShare();
        }
    },
    playClickMusic : function(){
        cc.audioEngine.play(this.clickAudio,false,1);
    },
    // update (dt) {},
    
});
