
var player;
var playerBlobs = {};
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
  noLoop();
}

function startGame() {
  socket = io.connect('https://blobs.nicknapior.com:443');
  if (input.value() != null)
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
  socket.on('playerHeartbeat', function(data) {
    //console.log(data);
    playerBlobs = data;
  });
  socket.on('blobHeartbeat', function(data) {
    //console.log(data);
    blobs = data;
  });
  loop();
}

function draw() {
  background(0);
  translate(width / 2, height / 2);
  var newzoom = 96 / player.r;
  player.zoom = lerp(player.zoom, newzoom, 0.1);
  scale(player.zoom);
  translate(-player.pos.x, -player.pos.y);

  var ateBlobs = []
  for (var i = blobs.length - 1; i >= 0; i--) {
    fill(blobs[i].red, blobs[i].green, blobs[i].blue);
    ellipse(blobs[i].x, blobs[i].y, blobs[i].r*2, blobs[i].r*2);
    if (player.eats(blobs[i])) {
      socket.emit('ateBlob', i);
    }
  }

  for (const [id, playerBlob] of Object.entries(playerBlobs)) {
    if (id != socket.id) {
      fill(playerBlob.red, playerBlob.green, playerBlob.blue);
      ellipse(playerBlob.x, playerBlob.y, playerBlob.r*2, playerBlob.r*2);
      textSize(0.4*playerBlob.r);
      textAlign(CENTER, CENTER);
      fill(255);
      text(playerBlob.name, playerBlob.x, playerBlob.y);
    }
  }

  if(player.pos.x >= worldWidth)
    player.pos.x = worldWidth;
  if(player.pos.x <= 0)
    player.pos.x = 0;
  if(player.pos.y >= worldHeight)
    player.pos.y = worldHeight;
  if(player.pos.y <= 0)
    player.pos.y = 0;

  player.show();
  player.update();

  var data = {
    name : player.name,
    x : player.pos.x,
    y : player.pos.y,
    r : player.r
  };
  socket.emit('update', data);
  // console.log(blobs.length);
}

function getRandomColor() {
    return color(random(5, 245), random(5, 245), random(5, 245))
}
