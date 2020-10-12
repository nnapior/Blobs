var socket;

var player;
var players = {};
var blobs = [];

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
  player = new Player('Blob', random(0, worldWidth), random(0, worldHeight), 96, getRandomColor());
  noLoop();
  setInterval(function(){$.getJSON('http://localhost:8080/blobs', function(data) {
    blobs = data;
  })}, 50);
  setInterval(function(){$.getJSON('http://localhost:8080/players', function(data) {
    players = data;
  })}, 33);
}

function startGame() {
  //socket = io.connect('https://blobs.nicknapior.com:443');
  socket = io.connect('http://localhost:8080');
  if (input.value() != '')
    player.name = input.value();
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

  for(var i=0; i<blobs.length; i++) {
    fill(blobs[i].red, blobs[i].green, blobs[i].blue);
    ellipse(blobs[i].x, blobs[i].y, blobs[i].r*2, blobs[i].r * 2);
  }

  for(var [id, blob] of Object.entries(players)) {
    if(id != socket.id) {
      //console.log(blob.x + " " + blob.y);
      fill(blob.red, blob.green, blob.blue);
      ellipse(blob.x, blob.y, blob.r*2, blob.r*2);

      textSize(0.4*blob.r);
      textAlign(CENTER, CENTER);
      fill(255);
      text(blob.name, blob.x, blob.y);
    }
    else if(id == socket.id){
      player.r = blob.r;
    }
  }
  if(socket != null) {
    player.show();
    player.update();
    var data = {
      name : player.name,
      x : player.pos.x,
      y : player.pos.y
    }
    socket.emit('update', data);
  }
}

function getRandomColor() {
  return color(random(5, 245), random(5, 245), random(5, 245))
}
