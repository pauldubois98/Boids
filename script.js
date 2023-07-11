ctx = simulation.getContext("2d");
const initialSpeed = 2;
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
    vx *= initialSpeed/length;
    vy *= initialSpeed/length;
    boids.push(new Boid(simulation.width / 2, simulation.height / 2, vx, vy));
  }
}

function draw() {
  ctx.clearRect(0, 0, simulation.width, simulation.height);
  for (let i = 0; i < boids.length; i++) {
    const boid = boids[i];
    // ctx.beginPath();
    // ctx.moveTo(boid.x, boid.y);
    // ctx.lineTo(boid.x + boid.vx * 10, boid.y + boid.vy * 10);
    // ctx.stroke();
    // ctx.beginPath();
    // ctx.arc(boid.x, boid.y, 5, 0, 2 * Math.PI);
    // ctx.fill();
    ctx.beginPath();
    ctx.moveTo(boid.x + boid.vx * 12, boid.y + boid.vy * 12);
    ctx.lineTo(boid.x - boid.vy * 4, boid.y + boid.vx * 4);
    ctx.lineTo(boid.x + boid.vy * 4, boid.y - boid.vx * 4);
    ctx.lineTo(boid.x + boid.vx * 12, boid.y + boid.vy * 12);
    ctx.fill();
  }
}

function update() {
  for (let i = 0; i < boids.length; i++) {
    const boid = boids[i];
    boid.x += boid.vx;
    boid.y += boid.vy;
  }
}

init();
setInterval(() => {
  update();
  draw();
}, 1000 / 60);
