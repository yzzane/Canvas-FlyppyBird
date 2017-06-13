(function (Fly) {
  'use strict';
  
  var Game = function (config) {
    this.imgsArr = ['birds', 'land', 'pipe1', 'pipe2', 'sky'];
    this.isStart = true;
    this.delta = 0; // 两帧时间间隔
    this.lastFrameTime = new Date();
    this.curFrameTime = 0;
    this.roles = [];
    // 英雄（小鸟）
    this.hero = null;

    // 创建canvas标签
    this.createCanvas(config.id);
  };
  
  Game.prototype = {
    constructor: Game,

    // 开始游戏
    start: function () {
      var that = this;

      // 等待所有的游戏资源加载完毕，开始游戏！
      Fly.loadImages(that.imgsArr, function (imgList) {
        // 初始化游戏角色
        that.initRols(imgList);

        // 渲染游戏
        that.render(imgList);

        // 绑定事件：
        that.bindEvent();
      });
    },

    // 初始化游戏中所有的角色：
    initRols: function (imgList) {
      var context = this.ctx;
      var i;
      var imgSky = imgList.sky;
      var imgLand = imgList.land;
      var that = this;

      // 创建小鸟对象
      this.hero = Fly.factory('Bird', {
        img: imgList.birds,
        ctx: context
      });

      // 添加小鸟碰撞消息的订阅:
      this.hero.addListener(function() {
        that.isStart = false;
      });

      // 创建两个天空对象
      for (i = 0; i < 2; i++) {
        var sky = Fly.factory('Sky', {
          img: imgSky,
          ctx: context,
          x: i * imgSky.width
        });

        this.roles.push(sky);
      }

      // 创建6组管道对象
      for (i = 0; i < 6; i++) {
        var pipe = Fly.factory('Pipe', {
          imgTop: imgList.pipe2,
          imgBottom: imgList.pipe1,
          ctx: context,
          x: 300 + i * imgList.pipe1.width * 3,
          pipeSpace: 150
        });

        this.roles.push(pipe);
      }

      // 创建4个陆地对象
      for (i = 0; i < 4; i++) {
        var land = Fly.factory('Land', {
          img: imgLand,
          ctx: context,
          x: i * imgLand.width,
          y: imgSky.height - imgLand.height
        });

        this.roles.push(land);
      }
    },

    // 绑定事件：
    bindEvent: function () {
      var that = this;

      that.ctx.canvas.addEventListener('click', function () {
        that.hero.changeSpeed(-0.3);
      });
    },

    // 渲染游戏：
    render: function (imgList) {
      var that = this;
      var context = that.ctx;
      var bird = that.hero;
      var cvW = context.canvas.width;
      var cvH = context.canvas.height;
      var imgLand = imgList.land;
      var imgSky = imgList.sky;

      (function renderGame() {
        // 保存绘制状态
        context.save();
        context.clearRect(0, 0, cvW, cvH);
        context.beginPath();

        that.curFrameTime = new Date();
        // 两帧时间间隔
        that.delta = that.curFrameTime - that.lastFrameTime;
        that.lastFrameTime = that.curFrameTime;

        // 渲染游戏中的角色
        that.roles.forEach(function (role) {
          role.draw(that.delta);
        });

        // 绘制小鸟
        bird.draw(that.delta);

        // 碰撞检测
        // 1 小鸟超出了画布的顶端
        // 2 小鸟与陆地接触
        // 3 小鸟与管道接触

        // 观察者模式：
        // 小鸟是消息的发布者，Game对象是消息的订阅者
        // 当小鸟发生碰撞以后，会发布消息，通知所有的订阅者！
        // Game对象接受到消息以后，让游戏停止
        
        // if (bird.y <= 0 || bird.y >= (imgSky.height - imgLand.height) || context.isPointInPath(bird.x, bird.y)) {
        //   that.isStart = false;
        // }

        // 恢复状态
        context.restore();

        if (that.isStart) {
          requestAnimationFrame(renderGame);
        }
      })();
    },

    // 创建canvas对象
    createCanvas: function( id ) {
      var cv = document.createElement('canvas');
      cv.height = 600;
      cv.width = 800;
      var container = document.getElementById(id) || document.body;
      container.appendChild(cv);

      // 设置上下文
      this.ctx = cv.getContext('2d');
    }
  };

  // 单例模式：
  // 实例，用来存储Game对象
  var insance = null;
  Fly.getGame = function( config ) {
    if(insance === null) {
      insance = new Game(config);
    }

    return insance;
  };

  // Fly.Game = Game;
})(Fly);