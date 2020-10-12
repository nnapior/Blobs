// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.



const express = require("express");
const app = express();

var playerBlobs = {};
var blobs = [];

var worldHeight = 10000;
var worldWidth = 10000;

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
populate();
var server = app.listen(3000);
var io = require('socket.io')(server);

setInterval(playerHeartbeat, 33);
setInterval(blobHeartbeat, 50);

function playerHeartbeat() {
  io.sockets.emit('playerHeartbeat', playerBlobs);
}

function blobHeartbeat() {
  io.sockets.emit('blobHeartbeat', blobs);
}

io.sockets.on('connection', function(socket) {
    console.log('new client: ' + socket.id);

    socket.on('start', function(data) {
      var player = new Player(data.name, data.x, data.y, data.r, data.red, data.green, data.blue);
      playerBlobs[socket.id] = player;
    });

    socket.on('update', function(data) {
      //console.log(socket.id + " " + data.x + " " + data.y + " " + data.r);
      // var blob;
      // for (var i = 0; i < playerBlobs.length; i++) {
      //   if (socket.id == playerBlobs[i].id) {
      //     blob = playerBlobs[i];
      //   }
      // }
      // blob.x = data.x;
      // blob.y = data.y;
      // blob.r = data.r;
      playerBlobs[socket.id].x = data.x;
      playerBlobs[socket.id].y = data.y;
      playerBlobs[socket.id].r = data.r;
    });

    socket.on('ateBlob', function(data) {
      blobs[data].x = Math.random()*worldWidth;
      blobs[data].y = Math.random()*worldHeight;
    });

    socket.on('atePlayer', function(data) {

    });

    socket.on('disconnect', function() {
      console.log('Client has disconnected');
      delete playerBlobs[socket.id];
    });
  });

  function Blob(x, y, r, red, green, blue) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.red = red;
      this.green = green;
      this.blue = blue;
  }

  function Player(name, x, y, r, red, green, blue) {
      this.name = name;
      this.x = x;
      this.y = y;
      this.r = r;
      this.red = red;
      this.green = green;
      this.blue = blue;
  }

  function populate() {
    for(var i=blobs.length; i < 1000; i++) {
      var x = Math.random()*worldWidth;
      var y = Math.random()*worldHeight;
      blobs[i] = new Blob(x, y, 24, Math.random()*255, Math.random()*255, Math.random()*255);
    }
  }
