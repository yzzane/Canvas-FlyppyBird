(function (Fly) {
  'use strict';
  
  var Pipe = function(config) {
    this.imgTop = config.imgTop;
    this.imgBottom = config.imgBottom;
    this.ctx = config.ctx;
    this.x = config.x;
    this.pipeSpace = config.pipeSpace;

    this.imgW = this.imgTop.width;
    this.imgH = this.imgTop.height;
    
    // 随机生成高度
    this.topY = 0;
    this.bottomY = 0;
    this.speed = 0.1;

    // 管道的高度是创建对象的时候，生成的！
    this.initPipeHeight();
  };

  // 绘制管道
  Pipe.prototype.draw = function( delta ) {
    this.x -= this.speed * delta;

    if(this.x <= -this.imgW * 3) {
      this.x += this.imgW * 3 * 6;

      // 重新生成管道的高度
      this.initPipeHeight();
    }

    // 为每一个管道描绘路径
    this.ctx.rect(this.x, this.topY, this.imgW, this.imgH);
    this.ctx.rect(this.x, this.bottomY, this.imgW, this.imgH);
    // this.ctx.fill();

    this.ctx.drawImage(this.imgTop, this.x, this.topY);
    this.ctx.drawImage(this.imgBottom, this.x, this.bottomY);
  };

  // 随机生成管道的高度
  Pipe.prototype.initPipeHeight = function() {
    // 上面管道的高度
    var pipeTopHeight = Math.random() * 200 + 50;
    
    // 下面管道的y坐标
    this.bottomY = pipeTopHeight + this.pipeSpace;
    // 上面管道的y坐标
    this.topY = pipeTopHeight - this.imgH;
  };

  Fly.Pipe = Pipe;

})(Fly);