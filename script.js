ctx = simulation.getContext("2d");
var boids = [];

function Boid(x, y, vx, vy) {
    boid = {vx: vx, vy: vy, x: x, y: y};
    return boid;
}

function init() {
  for (var i = 0; i < 100; i++) {
    // random velocity of uni length
    var vx = Math.random() * 2 - 1;
    var vy = Math.random() * 2 - 1;
    var length = Math.sqrt(vx * vx + vy * vy);
    vx /= length;
    vy /= length;
    boids.push(new Boid(simulation.width / 2, simulation.height / 2, vx, vy));
  }
}
