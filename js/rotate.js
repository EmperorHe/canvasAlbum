/**
 * 实现canvas绘制多张图片同时旋转的功能
 */
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 400;
var imgWidth = canvas.width / 2;
var imgHeight = canvas.height / 2;
var x = canvas.width / 4;
var y = canvas.height / 4;
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
]
images[0].width = imgWidth;
images[0].height = imgHeight;
images[1].width = imgWidth;
images[1].height = imgHeight;
images[2].width = imgWidth;
images[2].height = imgHeight;

var drawImages = function (index) {
    var num = 6 * (images.length - 1);
    for (var i = images.length - 1; i >= index; i--) {
        ctx.save();
        ctx.translate((x + imgWidth / 2), (y + imgHeight / 2));
        ctx.rotate(num * Math.PI / 180);
        num -= 6;
        ctx.translate(-(x + imgWidth / 2), -(y + imgHeight / 2));
        ctx.drawImage(images[i], x, y, imgWidth, imgHeight);
        ctx.strokeStyle = "#fff";
        ctx.strokeRect(x, y, imgWidth, imgHeight);
        ctx.strokeRect(x - 1, y - 1, imgWidth + 2, imgHeight + 2);
        ctx.restore();
    }
}

/**
 * 设计一个图片旋转的方法，用来在canvas里绘制图片的旋转动画
 * @param {*} img 要旋转的图片对象
 */
var timer = null;
var num = 6;
var num1 = 180;
var num2 = 160;
var num3 = 140;
var imgRotate1 = function (img, x, y, ) {
    if (num1 >= 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save()
        ctx.translate((x + img.width / 2), (y + img.height / 2));
        ctx.rotate(num1 * Math.PI / 180);
        ctx.translate(-(x + img.width / 2), -(y + img.height / 2));
        ctx.drawImage(img, x, y, img.width, img.height);
        ctx.restore()
    } else {
        clearInterval(timer);
        ctx.save()
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.translate((x + img.width / 2), (y + img.height / 2));
        ctx.rotate(0 * Math.PI / 180);
        ctx.translate(-(x + img.width / 2), -(y + img.height / 2));
        ctx.drawImage(img, x, y, img.width, img.height);
        ctx.restore()
    }
    num1--;
}

var canvasRotate = function () {
    if(num >=0){
        ctx.save();
        //先清屏
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        //设置canvas的中心
        ctx.translate((canvas.width/ 2), (canvas.height / 2));
        //以中心为圆心旋转num角度
        ctx.rotate(num * Math.PI / 180);
        //再将中心设置回来
        ctx.translate(-(canvas.width/ 2), -(canvas.height / 2));
        //在正常的canvas里绘图片
        drawImages(0);
        ctx.restore();
    }else{
        clearInterval(timer);
        ctx.save()
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.translate((canvas.width/ 2), (canvas.height / 2));
        ctx.rotate(0 * Math.PI / 180);
        ctx.translate(-(canvas.width/ 2), -(canvas.height / 2));
        drawImages(0);
        ctx.restore()
    }
    num--;
}

window.onload = function () {
    // this.drawImages(0)
    // timer = setInterval(function () {
    //     imgRotate1(this.images[0], x, y);
    //     imgRotate2(this.images[1], x, y);
    //     imgRotate3(this.images[2], x, y);
    // }, 10)
    // imgRotate(this.images[0], x, y);
    timer = setInterval(function() {
        canvasRotate();
    }, 50);
}