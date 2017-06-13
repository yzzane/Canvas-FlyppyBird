// 整个程序只保留一个全局对象，这个对象就是：Fly
// 游戏中所有其他的对象，都挂到这个 Fly 对象中
// 比如：
// 
// Bird --> Fly.Bird
// Sky  --> Fly.Sky
// Land --> Fly.Land
// Pipe --> Fly.Bird
// Game --> Fly.Game

// 并且一些于对象无关的工具性的函数，也要挂载到 Fly 对象中
// 比如：
// loadImages --> Fly.loadImages
// toRadian   --> Fly.toRadian

(function (window) {
  'use strict';
  var FlyObj = {};

  // 角度转弧度：
  FlyObj.toRadian = function (angle) {
    return angle / 180 * Math.PI;
  };

  // 加载图片：
  FlyObj.loadImages = function (srcList, callback) {
    var count = 0,
      allLength = srcList.length,
      imgsObj = {};

    srcList.forEach(function (srcStr) {
      var img = new Image();
      img.src = './images/' + srcStr + '.png';
      imgsObj[srcStr] = img;

      img.onload = function () {
        count++;
        if (count >= allLength) {
          callback(imgsObj);
        }
      };
    });
  }

  // 工厂函数
  // 第一个参数表示：创建对象的类型
  // 第二个参数表示：构造函数的参数
  FlyObj.factory = function(type, option) {
    switch(type) {
      case 'Bird':
        return new FlyObj.Bird(option);
      case 'Sky':
        return new FlyObj.Sky(option);
      case 'Land':
        return new FlyObj.Land(option);
      case 'Pipe':
        return new FlyObj.Pipe(option);
    }
  };

  // 暴露到全局环境中
  window.Fly = FlyObj;
})(window);