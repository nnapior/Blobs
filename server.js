
const express = require("express");
const app = express();

var players = {};
var blobs = [];
var ate = [];

const worldHeight = 10000;
const worldWidth = 10000;

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
var server = app.listen(8080);
var io = require('socket.io')(server);
populate();

app.get('/blobs', (request, response) => {
    response.json(blobs);
});

app.get('/players', (request, response) => {
    response.json(players);
});

app.get('/ate', (request, response) => {
    response.json(ate);
});

setInterval(heartbeat, 33);
function heartbeat() {
    var data = {
        players : players,
        blobs : blobs
    }
    io.sockets.emit('heartbeat', data);
}

io.sockets.on('connection', function(socket) {
    console.log('new client: ' + socket.id);

    socket.on('start', function(data) {
        var player = new Player(data.name, data.x, data.y, data.r, data.red, data.green, data.blue);
        players[socket.id] = player;
    });

    socket.on('update', function(data) {
        players[socket.id].x = data.x;
        players[socket.id].y = data.y;

        for(var i=0; i<blobs.length; i++) {
            if(eats(players[socket.id], blobs[i])) {
                var sum = Math.PI*players[socket.id].r*players[socket.id].r+Math.PI*blobs[i].r*blobs[i].r;
                radius = Math.sqrt(sum / Math.PI);
                players[socket.id].r = radius;
                var x = Math.random()*worldWidth;
                var y = Math.random()*worldHeight;
                blobs[i] = new Blob(x, y, 24, Math.random()*255, Math.random()*255, Math.random()*255);
            }
        }
        });

    socket.on('ate', function(data) {
            console.log(data);
            var sum = Math.PI*players[data.eater].r*players[data.eater].r+Math.PI*data.amount*data.amount;
            radius = Math.sqrt(sum / Math.PI);
            players[data.eater].r = radius;
            ate.push(data.eaten);
        });

        socket.on('disconnect', function() {
            console.log('Client has disconnected ' + socket.id);
            delete players[socket.id];
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

    function eats(blob1, blob2) {
        var a = blob1.x - blob2.x;
        var b = blob1.y - blob2.y;
        var d = Math.sqrt(a*a + b*b);
        if (d < blob1.r + blob2.r && blob1.r*0.9 > blob2.r) {
            return true;
        } else {
            return false;
        }
    }

    function populate() {
        for(var i=blobs.length; i < 700; i++) {
            var x = Math.random()*worldWidth;
            var y = Math.random()*worldHeight;
            blobs[i] = new Blob(x, y, 24, Math.random()*255, Math.random()*255, Math.random()*255);
        }
    }
