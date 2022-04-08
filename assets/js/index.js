var canvas = $('canvas')[0];
var ctx = canvas.getContext('2d');

var sketch = $('main')[0];
var sketch_style = getComputedStyle(sketch);
canvas.width = parseInt(sketch_style.getPropertyValue('width'));
canvas.height = parseInt(sketch_style.getPropertyValue('height'));

var mouse = { x: 0, y: 0 };

canvas.addEventListener('mousemove', function (e) {
  var c = $('canvas');
  mouse.x = e.pageX - c.offset().left;
  mouse.y = e.pageY - c.offset().top;
}, false);


ctx.lineWidth = 40;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.strokeStyle = 'black';

canvas.addEventListener('mousedown', function (e) {
  ctx.beginPath();
  ctx.moveTo(mouse.x, mouse.y);
  canvas.addEventListener('mousemove', onPaint, false);
}, false);

canvas.addEventListener('mouseup', function () {
  canvas.removeEventListener('mousemove', onPaint, false);
}, false);

var onPaint = function () {
  ctx.lineTo(mouse.x, mouse.y);
  ctx.stroke();
  var url = canvas.toDataURL();
  $('div').css({ display: 'initial', 'mask-image': 'url(' + url + ')' });
};

$('div').css({
  display: 'initial'
})

var timeline = new TimelineMax({ repeat: -1, yoyo: true }),
feTurb = document.querySelector('#heatturb');

timeline.add(
new TweenMax.to(feTurb, 8, {
  onUpdate: function () {
    var bfX = this.progress() * 0.01 + 0.025,
    bfY = this.progress() * 0.003 + 0.01,
    bfStr = bfX.toString() + ' ' + bfY.toString();
    feTurb.setAttribute('baseFrequency', bfStr);
  } }),
0);


function clear() {
  $('div').css({ display: 'none', 'mask-image': 'none' });
}

$('.button').click(function () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  clear();
});

document.getElementById('upload').onchange = function (e) {
  var imageFile = this.files[0];
  var newImg = window.URL.createObjectURL(imageFile);
  // var newImg = $("input").value;
  console.log(newImg);
  clear();
  $('main').css({
    'background': 'url("' + newImg + '")',
    'background-size': 'cover',
    'background-position': 'center' });

  $('.mask-inner').css({
    'background': 'url("' + newImg + '")',
    'background-size': 'cover',
    'background-position': 'center' });

};