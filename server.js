
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
var server = app.listen(8080);
var io = require('socket.io')(server);

app.get('/blobs', (request, response) => {
  response.json(blobs);
});

app.get('/players', (request, response) => {
  response.json(playerBlobs);
});

io.sockets.on('connection', function(socket) {
    console.log('new client: ' + socket.id);

    socket.on('start', function(data) {
      var player = new Player(data.name, data.x, data.y, data.r, data.red, data.green, data.blue);
      playerBlobs[socket.id] = player;
    });

    socket.on('update', function(data) {
      playerBlobs[socket.id].x = data.x;
      playerBlobs[socket.id].y = data.y;

      for(var i=0; i<blobs.length; i++) {
        if(playerBlobs[socket.id].eats(blobs[i])) {
          var x = Math.random()*worldWidth;
          var y = Math.random()*worldHeight;
          blobs[i] = new Blob(x, y, 24, Math.random()*255, Math.random()*255, Math.random()*255);
        }
      }

      for(var [id, player] of Object.entries(playerBlobs)) {
        if(id != socket.id && playerBlobs[socket.id].eats(player)) {
          //console.log(playerBlobs[socket.id].name + ' ate ' + player.name);
          socket.emit('endgame', id);
        }
        else if(id != socket.id && player.eats(playerBlobs[socket.id])) {
          //console.log(player.name + ' ate ' + playerBlobs[i]);
        }
        else {
          //console.log('no one ate.');
        }
      }

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

      this.eats = function(other) {
        var a = this.x - other.x;
        var b = this.y - other.y;
        var d = Math.sqrt(a*a + b*b);
        if (d < this.r + other.r && this.r*0.8 > other.r) {
            var sum = Math.PI*this.r*this.r+Math.PI*other.r*other.r;
            radius = Math.sqrt(sum / Math.PI);
            this.r = radius;
            return true;
        } else {
            return false;
        }
      }

  }

  function populate() {
    for(var i=blobs.length; i < 1000; i++) {
      var x = Math.random()*worldWidth;
      var y = Math.random()*worldHeight;
      blobs[i] = new Blob(x, y, 24, Math.random()*255, Math.random()*255, Math.random()*255);
    }
  }
