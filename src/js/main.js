
var player;
var playerBlobs = [];
var blobs = [];

var canvasHeight = 1000;
var canvasWidth = 1000;

var worldHeight = 10000;
var worldWidth = 10000;

function setup() {
    createCanvas(1000,1000);
    player = new Player('Player', worldWidth/2, worldHeight/2, 96, getRandomColor());
    for (var i = 0; i < 1000; i++) {
        var x = random(0, worldWidth);
        var y = random(0, worldHeight);
        blobs[i] = new Blob(x, y, 24, getRandomColor());
    }
    // noLoop();
}

function draw() {
    background(0);
    translate(width / 2, height / 2);
    var newzoom = 96 / player.r;
    player.zoom = lerp(player.zoom, newzoom, 0.1);
    scale(player.zoom);
    translate(-player.pos.x, -player.pos.y);

    for (var i = blobs.length - 1; i >= 0; i--) {
        blobs[i].show();
        if (player.eats(blobs[i])) {
            blobs.splice(i, 1);
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
}
