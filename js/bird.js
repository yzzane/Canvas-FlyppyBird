(function (Fly) {
  'use strict';

  // 构造函数
  var Bird = function (config) {
    this.img = config.img;
    this.ctx = config.ctx;

    this.imgW = this.img.width / 3;
    this.imgH = this.img.height;
    this.frameIndex = 0;
    this.x = 100;
    this.a = 0.0005;
    this.maxAngle = 45;
    this.maxSpeed = 0.3;

    this.curAngle = 0;
    this.speed = 0;
    this.y = 100;

    // 订阅者列表
    this.listeners = [];
  };
    
  // 原型对象
  Bird.prototype = {
    constructor: Bird,

    // 绘制小鸟
    draw: function (delta) {
      // 每一次绘制小鸟, 都检测小鸟是否发生碰撞
      this.isDie();

      // 计算小鸟经过时间 delta 之后的位置：
      this.speed = this.speed + this.a * delta;
      this.y += this.speed * delta + 1 / 2 * this.a * Math.pow(delta, 2);

      // 计算角度：
      this.curAngle = this.speed / this.maxSpeed * this.maxAngle;
      // 处理角度超过最大角度的问题：
      if (this.curAngle > this.maxAngle) {
        this.curAngle = this.maxAngle;
      } else if (this.curAngle < -this.maxAngle) {
        this.curAngle = -this.maxAngle;
      }

      // 先平移，再旋转
      this.ctx.translate(this.x, this.y);
      this.ctx.rotate(Fly.toRadian(this.curAngle));

      this.ctx.drawImage(this.img, this.imgW * this.frameIndex++, 0, this.imgW, this.imgH, -1 / 2 * this.imgW, -1 / 2 * this.imgH, this.imgW, this.imgH);

      this.frameIndex %= 3;
    },

    // 碰撞检测方法
    isDie: function () {
      if (this.y <= 0 || this.y >= (600 -112) || this.ctx.isPointInPath(this.x, this.y)) {
        // that.isStart = false;
        // 发布消息, 通知所有的订阅者, 游戏应该结束!
        this.listeners.forEach(function(fn) {
          fn();
        });
      }
    },

    // 添加订阅的方法:
    addListener: function( fn ) {
      this.listeners.push( fn );
    },

    // 改变速度
    changeSpeed: function (speed) {
      this.speed = speed;
    }
  };

  // 将小鸟对象暴露给 Fly 全局对象
  Fly.Bird = Bird;

})(Fly);