function Blob(x, y, r, color) {
    this.pos = createVector(x, y);
    this.r = r;
    this.vel = createVector(0, 0);
    this.color = color;

    this.show = function() {
        fill(this.color);
        ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
    };
}
