
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
// ctx.imageSmoothingEnabled = true;

//timer是执行过渡动画的计时器
var timer = null;
//timer1是旋转canvas的动画计时器
var timer1 = null;
var index = 0;
var alpha = 1;
//每张图片需要旋转的角度
var deg = 10;
//用来存储图片对象的位置和宽高
var obj={
    x:100,
    y:100,
    width:500,
    height:350
};
var w = 500;
var h = 300;
var x = obj.x;
var num = 0;
canvas.setAttribute('width', w * 2 );
canvas.setAttribute('height', h *2 );
canvas.style.width = w + 'px';
canvas.style.height = h + 'px';
// //canvas的宽度
// canvas.width = 500;
// //canvas的高度
// canvas.height = 350;
var imgInit = function (url) {
    var img = new Image();
    img.onload = null;
    img.src = url
    return img;
}
var images = [
    imgInit("./imgs/1.jpg"),
    imgInit("./imgs/2.jpg"),
    imgInit("./imgs/3.jpg"),
    imgInit("./imgs/4.jpg"),
    // imgInit("./imgs/5.jpg"),
    // imgInit("./imgs/6.jpg"),
]


var drawImages = function(index){
    var num = deg*(images.length-1);
    for(var i=images.length-1; i >= index; i--){
        ctx.save();
        ctx.translate((obj.x+obj.width  /2),(obj.y+obj.height  /2));
        ctx.rotate(num*Math.PI/180);
        num-=deg;
        ctx.translate(-(obj.x+obj.width  /2),-(obj.y+obj.height  /2));
        ctx.drawImage(images[i], 0,0,images[i].width,images[i].height, obj.x, obj.y, obj.width , obj.height  ); 
        //绘制矩形类似图片的边框
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 3;
        ctx.strokeRect(obj.x,obj.y,obj.width  ,obj.height  );
        ctx.restore();
    }
}
//用于改变图片内部的索引顺序的函数
var changeImagesOrder = function(){
    var image = images[0];
    for(var i =0; i<images.length; i++){ 
        images[i] = images[i+1];
    }
    images[images.length-1] = image;
}
//移动当前第一张图片的方法
var onMoveFirstImage = function(){
    // ctx.clearRect(0,0,canvas.width,canvas.height)
    alpha -= 0.008;
    
    if(alpha < 0){
        //当第一张图片消失后
        //将偏移量重置
        x = obj.x;
        //透明度重置
        alpha = 1;
        //关闭移动图片的计时器
        clearInterval(timer);
        //将图片进行旋转
        transtionCanvas()
    }else{
        ctx.save();
        x+=2;
        ctx.globalAlpha = alpha;
        ctx.drawImage(images[0],0,0, images[0].width,images[0].height, x, obj.y, obj.width  , obj.height  )
        //绘制矩形边框，跟随移动的图片
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 3;
        ctx.strokeRect(x,obj.y,obj.width  ,obj.height  );
        ctx.restore();
    }
}
var animateImage = function(){
    //清除画布
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //绘制剩余的图片保持不动
    ctx.save();
    drawImages(index+1);
    ctx.restore();

    //绘制当前移动的图片
    ctx.save();
    onMoveFirstImage();
    ctx.restore();
}
//该方法相当于play方法
var myAnimate = function(){
    clearInterval(timer);
    setTimeout(function(){
        timer = setInterval(animateImage,1);
    },1000)
}

//旋转整个canvas的方法
var canvasRotate = function () {
    if(num >= -deg){
        clearInterval(timer)
        //在canvas旋转前，先在最底部绘制当前滑走的图片。
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.translate((obj.x+obj.width  /2),(obj.y+obj.height  /2));
        ctx.rotate(deg*(images.length-1) * Math.PI / 180);
        ctx.translate(-(obj.x+obj.width  /2),-(obj.y+obj.height  /2));
        ctx.drawImage(images[0],0,0,images[0].width,images[0].height,obj.x,obj.y,obj.width  ,obj.height  );
        //绘制矩形边框
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 3;
        ctx.strokeRect(obj.x,obj.y,obj.width,obj.height);
        ctx.restore();

        ctx.save();
        //这里不执行clearRect，就可以显示最后一张图片
        //设置canvas的中心
        ctx.translate((obj.x+obj.width  /2),(obj.y+obj.height  /2));
        //以中心为圆心旋转num角度
        ctx.rotate(num * Math.PI / 180);
        //再将中心设置回来(不设置回中心，绘制的图片会以canvas中心为起点绘制)
        ctx.translate(-(obj.x+obj.width  /2),-(obj.y+obj.height  /2));
        //在正常的canvas里绘图片
        drawImages(1);
        ctx.restore();
    }else {
        //当旋转结束时，重置num
        num = 0;
        clearInterval(timer1);
        ctx.save();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.translate((obj.x+obj.width  /2),(obj.y+obj.height  /2));
        ctx.rotate(0 * Math.PI / 180);
        ctx.translate(-(obj.x+obj.width  /2),-(obj.y+obj.height  /2));
        //所有旋转动画完成后，改变图片索引的顺序
        changeImagesOrder();
        //重新在canvas上绘制所有的图片
        drawImages(0)
        //继续执行往右过渡图片的动画
        myAnimate();
        ctx.restore();
    }
    num--;
}
//旋转canvas的方法
var transtionCanvas = function(){
    clearInterval(timer1);
    timer1 = setInterval(function() {
        canvasRotate();
    }, 50);
    // console.log("123")
}

window.onload = function () {
    drawImages(0);
    this.myAnimate();
}




/**
 * 首先要绘制所有图片，每张图片旋转一定的角度r                                                          drawImages(0)
 *  第一张图片往右移动并减小透明度直至消失                                                              onMoveFirstImage()
 *  剩余的图片保持在原位置不动                                                                         drawImages(1)
 * 其次，当第一张图片消失后，第二张图片变成第一张，第三张变成第二张，以此类推，第一张变成最后一张            changeImagesOrder()
 *  然后所有的图片在原基础上旋转一定的角度，与上面的r相等的角度                                           rotateCanvas()
 *  至此，就是一个轮回，然后继续开始让第一张图片往右移动并减小透明度直至消失                               
 */


