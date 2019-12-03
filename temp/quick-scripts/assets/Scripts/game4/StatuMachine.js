(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/Scripts/game4/StatuMachine.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '83fafqlbSBFB4JaXQV882Xs', 'StatuMachine', __filename);
// Scripts/game4/StatuMachine.js

"use strict";

module.exports = {
    //开始游戏
    STATE_BEGIN: 0,
    //游戏中
    STATE_PLAY: 1,
    //游戏结束
    STATE_OVER: 2,
    //消除动作
    STATE_REMOVE: 3
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
        //# sourceMappingURL=StatuMachine.js.map
        