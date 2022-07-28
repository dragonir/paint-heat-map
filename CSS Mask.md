## 更多示例

### example 0

Say you had an element with a photographic background, and a black-and-white SVG graphic to use as a mask, like this:

![image_0](https://i0.wp.com/css-tricks.com/wp-content/uploads/2020/03/image-and-mask.png?resize=1000%2C857&ssl=1)

You could set the image as a background-image and the mask as a mask-image on the same element, and get something like this:

```html
<div class="el"></div>
```

```css
body {
  margin: 0;
  background: #a8ff78;
  background: -webkit-linear-gradient(to right, #78ffd6, #a8ff78);
  background: linear-gradient(to right, #78ffd6, #a8ff78);
}
.el {
  width: 100vw;
  height: 100vh;
  padding: 1rem;
  background-image: url('../assets/images/bg.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  -webkit-mask-image: url('../assets/images/sun.svg');
  -webkit-mask-size: 100vmin;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-image: url('../assets/images/sun.svg');
  mask-size: 100vmin;
  mask-repeat: no-repeat;
  mask-position: center;
}
```

![example_0](./assets/images/example_0.png)

That works because the top of the linear-gradient is transparent. I would have assumed it would work if it was white as well as long as the mask-type was luminance, but that doesn’t seem to work in any browser for me.

Speaking of luminance masks, that doesn’t seem to work for images-as-masks that are a raster format like JPG or PNG for me. Update: Reader Micheal Hall writes in with a demo where it might have something to do with using the long-hand properties. Firefox seems to support this concept if you only use the shorthand.

But alpha masks seem to work just fine. As in raster graphics that use actual alpha transparency. Like this:

#### example 1

![dragonir](./assets/images/dragonir.png)

```html
<div class="el"></div>
```

```css
body {
  margin: 0;
  background: #f08c0a;
  background: -webkit-linear-gradient(to right, #03c03c, #f08c0a);
  background: linear-gradient(to right, #03c03c, #f08c0a);
  background-position-x: 0;
  animation: size 2s infinite ease-in-out;
}
@keyframes size {
  to {
    background-position-x: 100vw;
  }
}
.el {
  width: 100vw;
  height: 100vh;
  background-image: url('../assets/images/bg.jpg');
  background-size: cover;
  background-position: center;
  -webkit-mask-image: url('../assets/images/dragonir.png');
  -webkit-mask-size: cover;
  mask-image: url('../assets/images/dragonir.png');
  mask-size: cover;
}
```

![example_0](./assets/images/example_1.gif)

#### example 2

The mask-image property can also be used directly inside SVG elements. Like check out this elliptical mask that also has a blurred filter:

```html
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="170" height="200">
  <defs>
    <filter id="filter">
      <feGaussianBlur stdDeviation="5" />
    </filter>
    <mask id="mask">
      <ellipse cx="50%" cy="50%" rx="25%" ry="25%" fill="white" filter="url(#filter)"></ellipse>
    </mask>
  </defs>
  <image xlink:href="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/Harry-Potter-1-.jpg" width="170" height="200" mask="url(#mask)"></image>
</svg>
```

It kinda looks like you could snag that SVG mask and apply it to other elements with mask-image: url(#mask); but I don’t find that actually works. It only works within SVG, and has a nasty side effect of entirely erasing an image if used outside the SVG.

![example_0](./assets/images/example_2.png)

We covered the use of the clip-path property for clipping using CSS, so it’s only natural that we now go over masking. Contrary to clipping, where a part of an image or element is either completely invisible or completely visible, with masking we can hide or show parts of an image with different levels of opacity.

Masking in CSS is done using the mask-image property, and an image has to be provided as the mask. Anything that’s 100% black in the image mask with be completely visible, anything that’s 100% transparent will be completely hidden, and anything in-between will partially mask the image. Linear and radial gradients in CSS are generated images, so they can be used as the image mask. SVGs that use the mask element can also be used as the image mask. Let’s go over the 3 possibilities for image masks with concrete examples:

Masking Using Gradients
Let’s first use a simple linear gradient that goes from transparent to black. The first image is our default starting image, and the second image has our linear gradient applied as the mask-image value:

![example_0](./assets/images/example_3.png)

Here’s the CSS rules used here:

```css
.mask1 {
  -webkit-mask-image: linear-gradient(to bottom, transparent 25%, black 75%);
  mask-image: linear-gradient(to bottom, transparent 25%, black 75%);
}
```

Here are two more examples of interesting effects that can be accomplished with masking using gradients:

![example_0](./assets/images/example_4.png)

And the CSS rules for these 2 gradient masks:

```css
.mask2 {
  -webkit-mask-image: radial-gradient(circle at 50% 60%, black 50%, rgba(0, 0, 0, 0.6) 50%);
  mask-image: radial-gradient(circle at 50% 60%, black 50%, rgba(0, 0, 0, 0.6) 50%);
}
.mask3 {
  -webkit-mask-image: radial-gradient(ellipse 90% 80% at 48% 78%, black 40%, transparent 50%);
  mask-image: radial-gradient(ellipse 90% 80% at 48% 78%, black 40%, transparent 50%);
}
```

##### Masking Using Images

Here’s we’re using an image that was created using Sketch as our image mask. The first image is the image mask itself, and the second image has that mask applied to it:

![example_0](./assets/images/example_5.png)

And our CSS looks like this:

```css
.mask4 {
  -webkit-mask-image: url("/path/to/image-mask.png");
  mask-image: url("/path/to/image-mask.png");
  -webkit-mask-size: 400px 600px;
  mask-size: 400px 600px;
}
```

We specified a value for mask-size here because our image mask is 800px by 1200px, but here we want everything shrunk by half so that the image can look sharp on retina displays.

##### Masking Using SVG Masks

Finally, if SVG is your groove, you can define image masks using the SVG mask element.

The first example currently only seems to be working in Firefox (you probably won’t see anything in non-supporting browsers). It defines the SVG mask and then we reference the ID of the mask in CSS as usual. The second example seems to have wider support and defines the image as part of the SVG element itself.

> Also note that with SVG masks, the colors to use are white and black instead of transparent and black. The colors also work in reverse and white/partially white is what will be visible.

![example_0](./assets/images/example_6.png)

Example 1 (triangle)
Here’s the SVG markup for the first example:

```html
<svg width="0" height="0" viewBox="0 0 400 600">
  <defs>
    <mask id="my-svg-mask">
      <rect fill="#000000" x="0" y="0" width="400" height="600"></rect>
      <polygon fill="#FFFFFF" points="200.5 152 349 449 52 449"></polygon>
    </mask>
  </defs>
</svg>
```

Then we can apply the mask to our image with mask-image as usual by refecencing the ID of the SVG mask:

```css
.mask5 {
  -webkit-mask-image: url(#my-svg-mask);
  mask-image: url(#my-svg-mask);
}
```

Example 2 (bubbles)
For our second SVG example, everything is contained in the SVG definition, including our main image itself:

```html
<svg width="400px" height="600px" viewBox="0 0 400 600">
  <defs>
    <mask id="my-svg-mask2">
      <rect id="Rectangle" fill="#000000" x="0" y="0" width="400" height="600"></rect>
      <circle id="Oval" fill="#FFFFFF" cx="67.5" cy="51.5" r="67.5"></circle>
      <circle id="Oval" fill="#FFFFFF" cx="296.597656" cy="118.597656" r="56.5976562"></circle>
      <circle id="Oval" fill="#FFFFFF" cx="53.4648437" cy="256.464844" r="81.4648437"></circle>
      <circle id="Oval" fill="#FFFFFF" cx="239.587891" cy="313.587891" r="70.5878906"></circle>
      <circle id="Oval" fill="#FFFFFF" cx="366.597656" cy="562.597656" r="56.5976562"></circle>
      <circle id="Oval" fill="#FFFFFF" cx="93.203125" cy="486.203125" r="76.203125"></circle>
    </mask>
  </defs>
  <image mask="url(#my-svg-mask2)" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="/images/css/masking/masking-example1.jpg" width="400" height="600"></image>
</svg>
```

## 参考资料

* [1]. <https://developer.mozilla.org/zh-CN/docs/Web/CSS/mask-image>
* [2]. <https://css-tricks.com/almanac/properties/m/mask-image/>
* [3]. <https://www.digitalocean.com/community/tutorials/css-masking-with-mask-image>
