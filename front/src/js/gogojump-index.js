//面向对象
//1，添加属性
//通过this关键字， 绑定属性，并且制定他的值
//原型链
//2，添加方法
//在banner.prototype上绑定方法就可以了

// function Banner() {
//     //这个里面写的代码相当于python中的__init__方法
//     console.log('init')
// }
//
// Banner.prototype.greet = function (word) {
//     console.log("hello world",word)
// }
//
// var banner = new Banner();
// banner.greet('domobird');

function Banner() {
    this.bannerWidth = body.offsetHeight;
    this.bannerGroup = $("#banner-group");
    this.index = 1;
    this.leftArrow = $(".left-arrow");
    this.rightArrow = $(".right-arrow");
    this.bannerUI = $('#banner-ul');
    this.liList = this.bannerUI.children("li");
    this.bannerCount = this.liList.length;
    this.pageControl = $(".page-control");
}

Banner.prototype.initBanner = function () {
    var self = this;
    var firstBanner = self.liList.eq(0).clone();
    var lastBanner = self.liList.eq(self.bannerCount-1).clone();
    self.bannerUI.append(firstBanner);
    self.bannerUI.prepend(lastBanner);
    this.bannerUI.css({"width":self.bannerWidth*(self.bannerCount+2),
    'left':-self.bannerWidth});

}

Banner.prototype.initPageControl = function () {
    var self = this;
    for (var i=0; i<self.bannerCount; i++){
        var cicle = $("<li></li>");
        self.pageControl.append(cicle);
        if(i === 0){
            cicle.addClass("active");
        }
    }
    self.pageControl.css({"width":self.bannerCount*12+8*2+16*(self.bannerCount-1)});
}

Banner.prototype.toggleArrow = function (isShow) {
    var self = this;
    if(isShow){
        self.leftArrow.show();
        self.rightArrow.show();
    }else {
        self.leftArrow.hide();
        self.rightArrow.hide();
    }
}

Banner.prototype.animate = function () {
    var self = this;
    self.bannerUI.animate({"left":-798*self.index},500);
    var index = self.index;
    if(index === 0){
        index = self.bannerCount-1;
    }else if(index === self.bannerCount+1){
        index = 0;
    }else {
        index = self.index - 1;
    }
    self.pageControl.children('li').eq(index).addClass('active').siblings().removeClass('active');
}

Banner.prototype.loop = function () {
    var self = this;
    //图片轮播定时器
    this.timer = setInterval(function () {
        if(self.index >=self.bannerCount+1) {
            self.bannerUI.css({"left": -self.bannerWidth});
            self.index = 2;
        }else {
            self.index++;
        }
        self.animate();
    },2000);
}

Banner.prototype.listenArrowClick = function(){
  var self = this;
  self.leftArrow.click(function () {
      if(self.index === 0){
          self.bannerUI.css({"left":-self.bannerCount*self.bannerWidth});
          self.index = self.bannerCount - 1;
      }else {
          self.index--;
      }
      self.animate();
  });

  self.rightArrow.click(function () {
      if(self.index === self.bannerCount + 1){
          self.bannerUI.css({"left":-self.bannerWidth});
          self.index = 2;
      }else {
          self.index++;
      }
      self.animate();
  })
};

Banner.prototype.listenBannerHover = function () {
    var self = this;//通过这个方法才可以在下面的function里使用全局（banner）里的变量
    this.bannerGroup.hover(function () {
        //第一个函数是，把鼠标移动到banner 上会执行的函数
        clearInterval(self.timer)//这里不能用this.timer因为这里的this代表的是它当前的function而不是全局(banner)
        self.toggleArrow(true);
    },function () {
        //第二函数， 把鼠标从banner上移走会执行的函数
        self.loop();
        self.toggleArrow(false);
    })
};

//小圆点-点击
Banner.prototype.listenPageControl = function () {
    var self = this;
    self.pageControl.children("li").each(function (index,obj) {
        $(obj).click(function () {
            self.index = index;
            self.animate();
        });

    })
}
//轮播图片效果
Banner.prototype.run = function () {
    this.initBanner();
    this.initPageControl();
    this.loop();
    this.listenBannerHover();
    this.listenArrowClick();
    this.listenPageControl();
};

//运行轮播图片
$(function () {
  var banner = new Banner();
  banner.run();
})