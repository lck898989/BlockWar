"use strict";
cc._RF.push(module, 'baed1buAPZPm657GDN739Ta', 'wxRankList');
// Scripts/Main1/wxRankList.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Consts = {
    OpenDataKeys: {
        InitKey: "initKey",
        Grade: "testkey",
        LevelKey: "reachlevel",
        ScoreKey: "levelScore",
    },
    DomainAction: {
        FetchFriend: "FetchFriend",
        FetchGroup: "FetchGroup",
        FetchFriendLevel: "FetchFriendLevel",
        FetchFriendScore: "FetchFriendScore",
        HorConmpar: "HorConmpar",
        Paging: "Paging",
        Scrolling: "Scrolling",
        SaveScore: "SaveScore",
    },
};
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var wxRankList = /** @class */ (function (_super) {
    __extends(wxRankList, _super);
    function wxRankList() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.rankRender = null; // render spr
        _this.rankListNode = null;
        _this.horRankNode = null;
        _this.rankBgNode = null;
        _this.labelTitle = null;
        _this.touchLayer = null;
        _this.enableScroll = false; //是否可滑动排行榜列表
        _this._timeCounter = 0;
        _this.rendInterval = 0.5; //刷新排行画布间隔s
        _this.rankTexture = null;
        _this.rankSpriteFrame = null;
        _this.closeBackRank = 0; // 关闭后操作
        return _this;
    }
    wxRankList_1 = wxRankList;
    // LIFE-CYCLE CALLBACKS:
    wxRankList.prototype.onLoad = function () {
        wxRankList_1.instance = this;
        this._timeCounter = 0;
        this.rankTexture = new cc.Texture2D();
        this.rankSpriteFrame = new cc.SpriteFrame();
        this.resizeSharedCanvas(this.rankRender.node.width, this.rankRender.node.height);
        //当前用户
        this.username = cc.find("PebmanentNode").getComponent("UserInfo").nameUser;
    };
    // start() {
    // }
    wxRankList.prototype.update = function (dt) {
        // this._timeCounter += dt
        // if (this._timeCounter < this.rendInterval) return
        // this._timeCounter = 0
        this.updateRankList();
    };
    wxRankList.prototype.resizeSharedCanvas = function (width, height) {
        if (!window["wx"])
            return;
        var sharedCanvas = window["wx"].getOpenDataContext().canvas;
        sharedCanvas.width = width;
        sharedCanvas.height = height;
    };
    wxRankList.prototype.changeRender = function (renderNode) {
        if (renderNode.name === "sprHorRank") {
            this.horRankNode.active = true;
            this.rankListNode.active = false;
            this.rankBgNode.active = false;
        }
        else if (renderNode.name === "sprRankList") {
            this.horRankNode.active = false;
            this.rankListNode.active = true;
            this.rankBgNode.active = true;
        }
        this.rankRender.node.width = renderNode.width;
        this.rankRender.node.height = renderNode.height;
        this.rankRender.node.position = renderNode.position;
        this.resizeSharedCanvas(renderNode.width, renderNode.height);
    };
    wxRankList.prototype.updateRankList = function () {
        if (!window["wx"])
            return;
        if (!this.rankTexture)
            return;
        var sharedCanvas = window["wx"].getOpenDataContext().canvas;
        this.rankTexture.initWithElement(sharedCanvas);
        this.rankTexture.handleLoadedTexture();
        this.rankSpriteFrame.setTexture(this.rankTexture);
        this.rankRender.spriteFrame = this.rankSpriteFrame;
    };
    wxRankList.prototype.onEnable = function () {
        this.touchLayer.active = true;
        if (this.enableScroll) {
            this.rankRender.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        }
        // this.postMessage(Consts.DomainAction.FetchFriendLevel)
    };
    wxRankList.prototype.onDisable = function () {
        if (this.enableScroll) {
            this.rankRender.node.off(cc.Node.EventType.TOUCH_MOVE);
        }
    };
    wxRankList.prototype.onViewDetailRank = function () {
        this.closeBackRank = 1;
        //加载分数排行
        this.loadLevelScoreRank();
    };
    wxRankList.prototype.onPageUp = function () {
        cc.log(this);
        this.postMessage("Paging", -1);
    };
    wxRankList.prototype.onPageDown = function () {
        this.postMessage("Paging", 1);
    };
    wxRankList.prototype.onClose = function () {
        // if(this.closeBackRank===1){
        //     this.closeBackRank = 0;
        //     this.loadHorRank(utils.curLevel)
        //     return
        // }
        this.node.active = false;
        cc.find("PebmanentNode/dark").active = false;
        cc.find("Canvas/OneGame").getComponent(cc.Button).interactable = true;
        cc.find("Canvas/PersobsGame").getComponent(cc.Button).interactable = true;
        cc.find("Canvas/Help").getComponent(cc.Button).interactable = true;
        cc.find("Canvas/Back").getComponent(cc.Button).interactable = true;
        cc.find("Canvas").getComponent("TurnScene").canClick = true;
        cc.find("Canvas/menuBottom/RankList").getComponent(cc.Button).interactable = true;
        cc.find("Canvas/menuBottom/Friend").getComponent(cc.Button).interactable = true;
    };
    wxRankList.prototype.onTouchMove = function (event) {
        var deltaY = event.getDeltaY();
        // console.log("rank touchmove:", deltaY);
        this.postMessage("Scrolling", deltaY);
    };
    //获取关卡得分排行
    /**
     * @param  {游戏类型} level
     * @param  {该游戏类型的最高分} score
     */
    wxRankList.prototype.loadLevelScoreRank = function (level, score) {
        console.log("level is ", level);
        console.log("score is ", score);
        // this.labelTitle.string = "俄罗斯方块排行"
        this.node.active = true;
        this.touchLayer.active = true;
        this.changeRender(this.rankListNode);
        this.postMessage(Consts.DomainAction.FetchFriendScore, level, score);
    };
    //获取关卡进度排行
    wxRankList.prototype.loadLevelOpenRank = function () {
        this.labelTitle.string = "关卡排行";
        this.node.active = true;
        this.touchLayer.active = true;
        this.changeRender(this.rankListNode);
        this.postMessage(Consts.DomainAction.FetchFriendLevel);
    };
    //横向比较
    // loadHorRank(level=1){
    //     this.node.active = true;
    //     this.touchLayer.active = false        
    //     this.changeRender(this.horRankNode)
    //     this.postMessage(Consts.DomainAction.HorConmpar, level, utils.getScore(level))
    // }
    //向子域发送消息
    wxRankList.prototype.postMessage = function (action, type, score) {
        if (type === void 0) { type = null; }
        if (score === void 0) { score = null; }
        if (!window["wx"])
            return;
        var openDataContext = window["wx"].getOpenDataContext();
        openDataContext.postMessage({
            action: action,
            data: type,
            score: score,
        });
    };
    // //检查得分
    // checkScore(key, callback){
    //     if (!window.wx) return
    //     wx.getUserCloudStorage({
    //         keyList:[key],
    //         success:res=>{
    //             res.data.
    //         }
    //     })
    // }
    //wx api
    // 上传关卡分数
    wxRankList.prototype.uploadScore = function (level, score) {
        if (!window["wx"])
            return;
        score = score.toString();
        window["wx"].setUserCloudStorage({
            KVDataList: [
                { key: Consts.OpenDataKeys.ScoreKey + level, value: score },
            ],
            success: function (res) {
                console.log("uploadScore success:res=>", res);
            },
            fail: function (res) {
                console.log("uploadScore fail:res=>", res);
            }
        });
    };
    // 上传关卡开启进度
    wxRankList.prototype.uploadLevelOpen = function (level) {
        if (!window.window["wx"])
            return;
        level = level.toString();
        window["wx"].setUserCloudStorage({
            KVDataList: [
                { key: Consts.OpenDataKeys.LevelKey, value: level },
            ],
            success: function (res) {
                console.log("uploadScore success:res=>", res);
            },
            fail: function (res) {
                console.log("uploadScore fail:res=>", res);
            }
        });
    };
    //删除微信数据
    wxRankList.prototype.removeUserKey = function (key_or_keys) {
        if (!window.window["wx"])
            return;
        if (typeof (key_or_keys) === "string") {
            key_or_keys = [key_or_keys];
        }
        window["wx"].removeUserCloudStorage({
            keyList: key_or_keys,
            success: function (res) {
                console.log("uploadScore success:res=>", res);
            },
            fail: function (res) {
                console.log("uploadScore fail:res=>", res);
            }
        });
    };
    // 分享
    /* args:{
                title: string
                imageUrl: string
                query: string
                success: func
                fail: func
            }
    */
    wxRankList.prototype.share = function (args) {
        if (!window.window["wx"])
            return;
        if (!args)
            args = {};
        args.imageUrl = args.imageUrl || "http://img.zcool.cn/community/01c2ac57beb18d0000012e7eaa6d19.jpg@1280w_1l_2o_100sh.jpg";
        window["wx"].shareAppMessage({
            title: "今天的方块，你来了吗？",
            // imageUrl: "res/raw-assets/res/shengming.25929.png",
            imageUrl: args.imageUrl,
            query: "key=testshare",
            success: function (res) {
                console.log("success:", res);
                if (args.success) {
                    args.success(res);
                }
            },
            fail: function (res) {
                console.log("fail:", res);
                if (args.fail) {
                    args.fail(res);
                }
            }
        });
    };
    wxRankList.prototype.initRank = function () {
    };
    wxRankList.prototype.snapshotSync = function () {
        if (!window['wx'])
            return;
        var canvas = cc.game.canvas;
        var width = cc.winSize.width;
        var height = cc.winSize.height;
        return canvas['toTempFilePathSync']({
            x: 0,
            y: 0,
            width: width * 1.5,
            height: height,
            destWidth: width * 1.5,
            destHeight: height
        });
    };
    wxRankList.prototype.tetrisRank = function () {
        //俄罗斯方块的最高分是
        var tetrisScore = cc.find("PebmanentNode").getComponent("UserInfo").tetrisTopScore;
        //俄罗斯方块排行,将最高分加载进来
        this.loadLevelScoreRank("tetrisRankScore", tetrisScore);
        //抓取好友数据
        console.log("获取俄罗斯方块的排名");
    };
    wxRankList.prototype.figureRank = function () {
        //画像方块的排行
        var figureScore = cc.find("PebmanentNode").getComponent("UserInfo").figureTopScore;
        console.log("figureScore is ", figureScore);
        this.loadLevelScoreRank("figureRankScore", figureScore);
        //将自己的最高分交给微信服务器托管
        console.log("获取画像方块的排名");
    };
    wxRankList.prototype.stoneRank = function () {
        //宝石方块的排行
        var stoneScore = cc.find("PebmanentNode").getComponent("UserInfo").stoneTopScore;
        this.loadLevelScoreRank("stoneRankScore", stoneScore);
        console.log("获取宝石方块的排名");
    };
    var wxRankList_1;
    wxRankList.instance = null;
    __decorate([
        property(cc.Sprite)
    ], wxRankList.prototype, "rankRender", void 0);
    __decorate([
        property(cc.Node)
    ], wxRankList.prototype, "rankListNode", void 0);
    __decorate([
        property(cc.Node)
    ], wxRankList.prototype, "horRankNode", void 0);
    __decorate([
        property(cc.Node)
    ], wxRankList.prototype, "rankBgNode", void 0);
    __decorate([
        property(cc.Label)
    ], wxRankList.prototype, "labelTitle", void 0);
    __decorate([
        property(cc.Node)
    ], wxRankList.prototype, "touchLayer", void 0);
    __decorate([
        property(Boolean)
    ], wxRankList.prototype, "enableScroll", void 0);
    wxRankList = wxRankList_1 = __decorate([
        ccclass
    ], wxRankList);
    return wxRankList;
}(cc.Component));
exports.default = wxRankList;

cc._RF.pop();