function Blob(x, y, r, red, green, blue) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.red = red;
  this.green = green;
  this.blue = blue;

  this.show = function() {
      fill(this.red, this.green, this.blue);
      ellipse(this.x, this.y, this.r * 2, this.r * 2);
  };
}

function PlayerBlob(name, x, y, r, red, green, blue) {
  this.name = name;
  this.x = x;
  this.y = y;
  this.r = r;
  this.red = red;
  this.green = green;
  this.blue = blue;

  this.show = function() {
      fill(this.red, this.green, this.blue);
      ellipse(this.x, this.y, this.r * 2, this.r * 2);

      textSize(0.4*this.r);
      textAlign(CENTER, CENTER);
      fill(255);
      text(this.name, this.pos.x, this.pos.y);
  };
}

function Player(name, x, y, r, color) {
    this.name = name;
    this.pos = createVector(x, y);
    this.r = r;
    this.vel = createVector(0, 0);
    this.color = color;
    this.zoom = 1;

    this.update = function() {
        var newvel = createVector(mouseX - width / 2, mouseY - height / 2);
        newvel.setMag(3);
        this.vel.lerp(newvel, 0.2);
        this.pos.add(this.vel);
    };

    this.show = function() {
        fill(this.color);
        ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);

        textSize(0.4*this.r);
        textAlign(CENTER, CENTER);
        fill(255);
        text(this.name, this.pos.x, this.pos.y);
    };
}
