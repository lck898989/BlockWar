(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/game3/Common.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'd3577nwtkhNUZTgQ38ohHzy', 'Common', __filename);
// Scripts/game3/Common.js

"use strict";

module.exports = {
    STATE_COVER: 0,
    //
    STATE_MENU: 1,
    //玩游戏状态
    STATE_PLAY: 2,
    //消除状态
    STATE_REMOVE: 3,
    //游戏结束状态
    STATE_OVER: 4,
    //网格的行和列
    MAP_ROW: 12,
    MAP_COL: 6,
    MOVEMODEL: 1
};

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
        //# sourceMappingURL=Common.js.map
        