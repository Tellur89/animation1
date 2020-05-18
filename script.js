"use strict";







let c, ctx, W, H;
let sl, slImg, widthSl, color;
let text = "Kuba ssie fiuta";
let pixels = [];

class Sl {
    constructor() {
        this.x = -widthSl*2;
        this.y = H/2-widthSl/2-2;
    }
    draw() {
        ctx.beginPath();
        ctx.drawImage(slImg, this.x, this.y, widthSl, widthSl);
        ctx.closePath();
    }
    check() {
        this.x += 3;
        if(this.x>W+widthSl*2)this.x = -widthSl*2;
        this.draw();
    }
    update() {
        this.check();
    }
}

const random = (max=1, min=0) => Math.random() * (max - min) + min;

const newRadient = () => {
    ctx.font = "bold 45px Courier";
    let textSize = ctx.measureText(text).width;
    let x0 = (W-textSize)/2;
    let x1 = W-x0;
    let nR = ctx.createLinearGradient(x0,0, x1, 0);
    nR.addColorStop(0, '#e6545d');
    nR.addColorStop(0.2, '#e9589f');
    nR.addColorStop(0.4, "#34b6e7");
    nR.addColorStop(0.6, "#138994");
    nR.addColorStop(0.8, "#6db64c");
    nR.addColorStop(1, "#eb7442");
    return nR;
};

const getPixels = () => {
    ctx.fillStyle = color;
    ctx.font = "bold 45px Courier";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, W/2, H/2);
    var m=ctx.getImageData(0,0,W,H);
    for(let i=0; i<m.data.length; i+=4) {
        pixels.push(
            i/4%W,
            ~~(i/4/W),
            m.data[i],
            m.data[i+1],
            m.data[i+2],
            m.data[i+3],
            random(W),
            random(H)
            );
    }
};

const lerp = (a,b,c,d) => a+(b-a)*c;

const displayText = () => {
    var m=ctx.createImageData(W,H);
    for(let i=0; i<pixels.length; i+=8) {
        var ind=~~(Math.round(pixels[i+6])+Math.round(pixels[i+7])*W)*4
        m.data[ind] = pixels[i+2];
        m.data[ind+1] = pixels[i+3];
        m.data[ind+2] = pixels[i+4];
        m.data[ind+3] = pixels[i+5];
        if(Math.hypot(sl.x+widthSl/2-pixels[i+6],sl.y+widthSl/2-pixels[i+7])<widthSl/1.6) {
            var ang=Math.atan2(sl.y+widthSl/2-pixels[i+7],sl.x+widthSl/2-pixels[i+6]);
            pixels[i+6]-=Math.cos(ang)*6;
            pixels[i+7]-=Math.sin(ang)*6;
        }
        pixels[i+6] = lerp(pixels[i+6], pixels[i],0.05);
        pixels[i+7] = lerp(pixels[i+7], pixels[i+1],0.05);
    }
    ctx.putImageData(m,0,0);
};

const animate = () => {
    ctx.fillRect(0, 0, W, H);
    displayText();
    sl.update();
    requestAnimationFrame(animate);
};

const init = () => {
    c = document.getElementById("canvas");
    c.width = W = window.innerWidth;
    c.height = H = window.innerHeight;
    ctx = c.getContext("2d");
    slImg = new Image();
    slImg.src = "fiut.png";
    widthSl = 40;
    sl = new Sl();
    color = newRadient();
    getPixels();
    animate();
};

onload = init;
