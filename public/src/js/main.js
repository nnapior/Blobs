
var player;
var clientBlobs = [];

var canvasHeight = 1000;
var canvasWidth = 1000;

var worldHeight = 10000;
var worldWidth = 10000;

function setup() {
  createCanvas(1000,1000);

  input = createInput();
  input.position(canvasWidth/2-120, canvasWidth/2);

  play = createButton('play');
  play.position(input.x + input.width+5, canvasWidth/2);
  play.mousePressed(startGame);
  noLoop();
}

function startGame() {
  //socket = io.connect('https://blobs.nicknapior.com:443');
  socket = io.connect('http://localhost:8080');
  if (input.value() != '')
    player = new Player(input.value(), random(0, worldWidth), random(0, worldHeight), 96, getRandomColor());
  else
    player = new Player('Blob', random(0, worldWidth), random(0, worldHeight), 96, getRandomColor());
  input.remove();
  play.remove();

  var data = {
    name : player.name,
    x : player.pos.x,
    y : player.pos.y,
    r : player.r,
    red : red(player.color),
    green : green(player.color),
    blue : blue(player.color)
  };
  socket.emit('start', data);
  loop();
}

function draw() {
  background(0);
  translate(width / 2, height / 2);
  var newzoom = 96 / player.r;
  player.zoom = lerp(player.zoom, newzoom, 0.1);
  scale(player.zoom);
  translate(-player.pos.x, -player.pos.y);

  if(player.pos.x >= worldWidth)
    player.pos.x = worldWidth;
  if(player.pos.x <= 0)
    player.pos.x = 0;
  if(player.pos.y >= worldHeight)
    player.pos.y = worldHeight;
  if(player.pos.y <= 0)
    player.pos.y = 0;

    $.getJSON('http://localhost:8080/blobs', function(data) {
      for(var i=0; i<data.length; i++) {
        fill(data[i].red, data[i].green, data[i].blue);
        ellipse(data[i].x, data[i].y, data[i].r*2, data[i].r * 2);
      }
    });

    console.log(player);

  player.show();
  player.update();
  var data = {
    name : player.name,
    x : player.pos.x,
    y : player.pos.y,
    r : player.r
  };
  socket.emit('update', data);
}

function getRandomColor() {
    return color(random(5, 245), random(5, 245), random(5, 245))
}
