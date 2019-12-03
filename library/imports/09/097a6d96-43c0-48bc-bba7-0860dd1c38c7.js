"use strict";
cc._RF.push(module, '097a62WQ8BIvLunCGDdHDjH', 'ImageLoader');
// Scripts/ImageLoader.js

"use strict";

/*
 * @Author: mikey.zhaopeng 
 * @Date: 2018-07-12 19:47:53 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-08-09 16:40:48
 */
/**
 * 远程加载图片到本地，供以后使用
 */

var md = require("./md5");
cc.Class({
    extends: cc.Component,
    statics: {
        loadImage: function loadImage(url, callback) {
            cc.loader.load(url, function (err, tex) {
                var spriteFrame = new cc.SpriteFrame(tex, cc.Rect(0, 0, tex.width, tex.height));
                callback(spriteFrame);
            });
        },
        //自己的头像地址
        filePath: "",
        //敌人的图片的地址路径
        rivalFilePath: "",
        //敌人图片的路径保存到本地
        rivalImageForWechatGame: function rivalImageForWechatGame(url, callback) {
            var self = this;
            this.wxDownloadImage(self.rivalFilePath, url, callback, "rival");
        },
        //微信小游戏保存图片到本地
        imageLoadToolForWechatGame: function imageLoadToolForWechatGame(url, callback) {
            var self = this;
            console.log("self.filePath is ", self.filePath);
            //下载图片
            this.wxDownloadImage(self.filePath, url, callback, "self");
        },

        /**
         * @param  {保存到本地的图片地址} imagePath
         * @param  {远程图片的地址url} url
         * @param  {回调函数将spriteFrame返回出去} callback
         * @param  {是对手请求图片还是自己请求图片} tag
         */
        wxDownloadImage: function wxDownloadImage(imagePath, url, callback, tag) {
            var self = this;
            if (CC_WECHATGAME) {
                console.log("imagePath is ", imagePath);
                // var self = this;
                // var localPath = wx.env.USER_DATA_PATH + '/';
                if (imagePath !== "") {
                    // var fileManager = wx.getFileSystemManager();
                    // //从路径里面取图片
                    // var imageData = fileManager.readFileSync(imagePath);
                    // var jpgPath = imagePath.lastIndexOf('/');
                    // var jpgName = imagePath.slice(jpgPath);
                    // var localPath = wx.env.USER_DATA_PATH + '/' + jpgName;
                    // var urlX = 
                    console.log("用户的头像已经存在在本地");
                    cc.loader.load(imagePath, function (err, tex) {
                        if (err) {
                            cc.error(err);
                        } else {
                            var spriteFrame = new cc.SpriteFrame(tex);
                            if (spriteFrame) {
                                callback(spriteFrame);
                            }
                        }
                    });
                } else {
                    wx.downloadFile({
                        url: url,
                        header: {
                            "content-type": "image/jpeg"
                        },
                        success: function success(res) {
                            console.log("tempFilePath is ", res.tempFilePath);
                            console.log("响应消息 is ", res.statusCode);
                            var tempFilePath = res.tempFilePath;
                            console.log("tempFilePath is ", tempFilePath);
                            var jpgPath = tempFilePath.lastIndexOf('/');
                            var jpgName = tempFilePath.slice(jpgPath);
                            // wx.saveImageToPhotosAlbum({
                            //     filePath : tempFilePath,
                            //     success  : function(res){
                            //         console.log("图片保存到系统相册",res);
                            //     }
                            // });
                            var fileManager = wx.getFileSystemManager();
                            var localPath = wx.env.USER_DATA_PATH + '/' + jpgName;
                            new Promise(function (resolve, reject) {
                                fileManager.saveFile({
                                    tempFilePath: tempFilePath,
                                    filePath: localPath,
                                    success: function success(res) {
                                        console.log("savedFilePath is ", res.savedFilePath);
                                        //图片地址
                                        if (tag === "self") {
                                            self.filePath = res.savedFilePath;
                                        } else if (tag === 'rival') {
                                            self.rivalFilePath = res.savedFilePath;
                                        }
                                        // imagePath = res.savedFilePath;
                                        resolve(res.savedFilePath);
                                    },
                                    fail: function fail() {
                                        console.log("文件保存失败！！");
                                    }
                                });
                            }).then(function (filePath) {
                                //保存完相册完毕之后取出来
                                cc.loader.load(filePath, function (err, tex) {
                                    if (err) {
                                        cc.error(err);
                                    } else {
                                        var spriteFrame = new cc.SpriteFrame(tex);
                                        if (spriteFrame) {
                                            callback(spriteFrame);
                                        }
                                    }
                                });
                            });
                        },
                        fail: function fail() {
                            console.log("下载文件失败");
                        },
                        complete: function complete() {}
                    });
                }
            }
        },
        imageLoadTool: function imageLoadTool(url, callback) {
            var dirpath = jsb.fileUtils.getWritablePath() + 'customHeadImage/';
            console.log("dirpath ->", dirpath);
            //对路径url进行加密
            var md5URL = md(url);
            var filepath = dirpath + md5URL + '.jpg';
            console.log("filepath ->", filepath);
            function loadEnd() {
                cc.loader.load(filepath, function (err, tex) {
                    if (err) {
                        cc.error(err);
                    } else {
                        var spriteFrame = new cc.SpriteFrame(tex);
                        if (spriteFrame) {
                            spriteFrame.retain();
                            callback(spriteFrame);
                        }
                    }
                });
            }
            if (jsb.fileUtils.isFileExist(filepath)) {
                cc.log('Remote is find' + filepath);
                loadEnd();
                return;
            }
            var saveFile = function saveFile(data) {
                if (typeof data !== 'undefined') {
                    if (!jsb.fileUtils.isDirectoryExist(dirpath)) {
                        jsb.fileUtils.createDirectory(dirpath);
                    } else {
                        console.log("路径exist");
                    }
                    // new Uint8Array(data) writeDataToFile  writeStringToFile
                    if (jsb.fileUtils.writeDataToFile(new Uint8Array(data), filepath)) {
                        cc.log('Remote write file succeed.');
                        loadEnd();
                    } else {
                        cc.log('Remote write file failed.');
                    }
                } else {
                    cc.log('Remote download file failed.');
                }
            };
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                cc.log("xhr.readyState  " + xhr.readyState);
                cc.log("xhr.status  " + xhr.status);
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        //responseType一定要在外面设置
                        // xhr.responseType = 'arraybuffer'; 
                        saveFile(xhr.response);
                    } else {
                        saveFile(null);
                    }
                }
            }.bind(this);
            //responseType一定要在外面设置
            xhr.responseType = 'arraybuffer';
            xhr.open("GET", url, true);
            xhr.send();
        }
    }
});

cc._RF.pop();