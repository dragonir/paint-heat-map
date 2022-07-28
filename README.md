# 使用 mask-image 让静态图片动起来 💢

![banner.gif](./assets/images/banner.gif)

> 声明：本文涉及图文和模型素材仅用于个人学习、研究和欣赏，请勿二次修改、非法传播、转载、出版、商用、及进行其他获利行为。

## 背景

如 `👆` `Banner` 图貂蝉 `猫影幻舞` 皮肤所示，如果你有玩过 `《王者荣耀》` 、 `《阴阳师》` 等手游，一定有注意到过，它的启动动画、皮肤卡片立绘等，经常看起来是一张静态的图片，但是局部有**液态流动动画**效果，如流动的水流、飘动的雾气、风、衣物等。本文使用前端开发技术，来实现类似的液化流动效果。

## 效果

> `🎮` 在线体验：<https://dragonir.github.io/paint-heat-map/>

下面几张图是使用本文内容生成的流动效果，gif图压缩比较严重效果不太好，大家可以打开示例链接，亲自上传图片体验效果。

🌅 湖面波动

![sample_0](./assets/images/sample_0.gif)

🎨 文字液化

![sample_1](./assets/images/sample_1.gif)

🔥 岩浆沸腾

![sample_2](./assets/images/sample_2.gif)

> `📌` ps：体验页面部署在Gitpage文中上传图片功能不是真正上传到服务器，而是只会加载到浏览器本地，页面不会获取任何信息，大家可以放心体验，不用担心隐私泄漏问题。

## 原理

### mask-image

`mask-image` `CSS` 属性用于设置元素上遮罩层的图像。

* 初始值：`none`
* 适用元素：所有元素，在 `SVG` 中它生效于除了 `defs` 元素和所有图形元素以外的所有容器元素
* 是否是继承属性：否
* 计算值：按照指定，但 `url` 值设为绝对值
* 动画类型：离散型

#### 语法

```css
/* 默认值，透明的黑色图像层，也就是没有遮罩层。 */
mask-image: none;
/* <mask-source><mask>或CSS图像的url的值 */
mask-image: url(masks.svg#mask1);
/* <image> 图片作为遮罩层 */
mask-image: linear-gradient(rgba(0, 0, 0, 1.0), transparent);
mask-image: image(url(mask.png), skyblue);
/* 多个值 */
mask-image: image(url(mask.png), skyblue), linear-gradient(rgba(0, 0, 0, 1.0), transparent);
/* 全局值 */
mask-image: inherit;
mask-image: initial;
mask-image: unset;
```

![caniuse](./assets/images/caniuse.png)

#### 例子

```css
#masked {
  width: 100px;
  height: 100px;
  background-color: #8cffa0;
  mask-image: url(https://mdn.mozillademos.org/files/12676/star.svg);
  -webkit-mask-image: url(https://mdn.mozillademos.org/files/12676/star.svg);
}
```

```html
<div id="masked"></div>
```

> `⚡` 此功能某些浏览器尚在开发中，需要使用浏览器前缀以兼容不同浏览器。

## 实现

页面主要由两部分构成，顶部用于加载图片，并且可以通过按住鼠标绘制的方式给图片添加流动效果；底部是控制区域，点击按钮 `🔘` **清除画布**，可以清除绘制的流动动画效果、点击按钮 `🔘` **切换图片**可以加载本地的图片。`⚠` 注意，还有一个隐形的功能，当你绘制完成时，可以点击 `🖱` 鼠标右键，然后选择保存图片，保存的这张图片就是我们绘制流体动画路径的热点图，利用这张热点图，使用本文的 `CSS` 知识，就能把静态图片转化成动态图啦！

![step_0](./assets/images/step_0.png)

### 页面

feTurbulence
该滤镜利用 Perlin 噪声函数创建了一个图像。它实现了人造纹理比如说云纹、大理石纹的合成。

feDisplacementMap
映射置换滤镜，该滤镜用来自图像中从in2到空间的像素值置换图像从in到空间的像素值。

```html
<main id="sketch">
  <canvas id="canvas" data-img=""></canvas>
  <div class="mask">
    <div id="maskInner" class="mask-inner"></div>
  </div>
</main>
<section class="button_container">
  <button class="button">清除画布</button>
  <button class="button"><input class="input" type="file" id="upload">上传图片</button>
</section>
<svg xlmns="http://www.w3.org/2000/svg" version="1.1">
  <filter id="heat" filterUnits="objectBoundingBox" x="0" y="0" width="100%" height="100%">
    <feTurbulence id="heatturb" type="fractalNoise" numOctaves="1" seed="2" />
    <feDisplacementMap xChannelSelector="G" yChannelSelector="B" scale="22" in="SourceGraphic" />
  </filter>
</svg>
```

### 绘制

```js
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var sketch = document.getElementById('sketch');
var sketchStyle = window.getComputedStyle(sketch);
var mouse = { x: 0, y: 0 };

canvas.width = parseInt(sketchStyle.getPropertyValue('width'));
canvas.height = parseInt(sketchStyle.getPropertyValue('height'));

canvas.addEventListener('mousemove', e => {
  mouse.x = e.pageX - canvas.getBoundingClientRect().left;
  mouse.y = e.pageY - canvas.getBoundingClientRect().top;
}, false);

ctx.lineWidth = 40;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.strokeStyle = 'black';

canvas.addEventListener('mousedown', () => {
  ctx.beginPath();
  ctx.moveTo(mouse.x, mouse.y);
  canvas.addEventListener('mousemove', onPaint, false);
}, false);

canvas.addEventListener('mouseup', () => {
  canvas.removeEventListener('mousemove', onPaint, false);
}, false);

var onPaint = () => {
  ctx.lineTo(mouse.x, mouse.y);
  ctx.stroke();
  var url = canvas.toDataURL();
  document.querySelectorAll('div').forEach(item => {
    item.style.cssText += `
      display: initial;
      -webkit-mask-image: url(${url});
      mask-image: url(${url});
    `;
  });
};

document.querySelectorAll('div').forEach(item => {
  item.style.cssText += `
    display: initial;
  `;
});

var timeline = new TimelineMax({
  repeat: -1,
  yoyo: true
}),
feTurb = document.querySelector('#heatturb');

timeline.add(
  new TweenMax.to(feTurb, 8, {
    onUpdate: function () {
      var bfX = this.progress() * 0.01 + 0.025,
        bfY = this.progress() * 0.003 + 0.01,
        bfStr = bfX.toString() + ' ' + bfY.toString();
      feTurb.setAttribute('baseFrequency', bfStr);
    }
  }),
0);


function clear() {
  document.querySelectorAll('div').forEach(item => {
    item.style.cssText += `
      display: none;
      -webkit-mask-image: none;
      mask-image: none;
    `;
  });
}

document.querySelectorAll('.button').forEach(item => {
  item.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    clear();
  })
});

document.getElementById('upload').onchange = function () {
  var imageFile = this.files[0];
  var newImg = window.URL.createObjectURL(imageFile);
  clear();
  document.getElementById('sketch').style.cssText += `
    background: url(${newImg});
    background-size: cover;
    background-position: center;
  `;
  document.getElementById('maskInner').style.cssText += `
    background: url(${newImg});
    background-size: cover;
    background-position: center;
  `;
};
```

通过修改svg的属性，实现动画效果

### 样式

```css
main {
  cursor: -webkit-grab;
  cursor: grab;
  width: 960px;
  height: 540px;
  flex-shrink: 0;
  background-image: url('../images/bg.jpg');
  background-size: cover;
  background-position: 100% 50%;
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 1px 1px 10px rgba(0, 0, 0, .5);
  border: 1px groove rgba(255, 255, 255, .2);
}
canvas {
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.mask {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  mask-mode: luminance;
  -webkit-mask-size: 100% 100%;
          mask-size: 100% 100%;
  -webkit-backdrop-filter: hard-light;
          backdrop-filter: hard-light;
  -webkit-mask-image: url('../images/mask.png');
  mask-image: url('../images/mask.png');
}
.mask-inner {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('../images/bg.jpg') 0% 0% repeat;
  background-size: cover;
  background-position: 100% 50%;
  filter: url(#heat);
  -webkit-mask-image: url('../images/mask.png');
  mask-image: url('../images/mask.png')
}
```

在页面右键保存生成的热点图

![mask](./assets/images/mask.png)

![banner.gif](./assets/images/banner.gif)

## 附录

* [我的3D专栏可以点击此链接访问 👈](https://juejin.cn/column/7049923956257587213)
* [1]. [🦊 Three.js 实现3D开放世界小游戏：阿狸的多元宇宙](https://juejin.cn/post/7081429595689320478)
* [2]. [🔥 Three.js 火焰效果实现艾尔登法环动态logo](https://juejin.cn/post/7077726955528781832)
* [3]. [🐼 Three.js 实现2022冬奥主题3D趣味页面，含冰墩墩](https://juejin.cn/post/7060292943608807460)
* `...`

* [1]. [📷 前端实现很哇塞的浏览器端扫码功能](https://juejin.cn/post/7018722520345870350)
* [2]. [🌏 前端瓦片地图加载之塞尔达传说旷野之息](https://juejin.cn/post/7007432493569671182)
* [3]. [😱 仅用CSS几步实现赛博朋克2077风格视觉效果](https://juejin.cn/post/6972759988632551460)
* `...`

## 参考

* [1]. [https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/feDisplacementMap](https://developer.mozilla.org/zh-CN/docs/Web/SVG/Element/feDisplacementMap)
