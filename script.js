ctx = simulation.getContext("2d");
const initialSpeed = 2;
const separationRadius = 40;
const separationForce = 0.2;
const minSpeed = 0.5;
const maxSpeed = 2;
var boids = [];

function Boid(x, y, vx, vy) {
  boid = { vx: vx, vy: vy, x: x, y: y };
  return boid;
}

function init() {
  boids = [];
  for (var i = 0; i < 100; i++) {
    // random velocity of uni length
    var vx = Math.random() * 2 - 1;
    var vy = Math.random() * 2 - 1;
    var length = Math.sqrt(vx * vx + vy * vy);
    vx *= initialSpeed / length;
    vy *= initialSpeed / length;
    boids.push(new Boid(simulation.width / 2, simulation.height / 2, vx, vy));
  }
}

function draw() {
  ctx.clearRect(0, 0, simulation.width, simulation.height);
  for (let i = 0; i < boids.length; i++) {
    const boid = boids[i];
    const length = Math.sqrt(boid.vx * boid.vx + boid.vy * boid.vy);
    const vx = boid.vx / length;
    const vy = boid.vy / length;
    ctx.fillStyle = "black";
    // ctx.beginPath();
    // ctx.moveTo(boid.x, boid.y);
    // ctx.lineTo(boid.x + vx * 10, boid.y + vy * 10);
    // ctx.stroke();
    // ctx.beginPath();
    // ctx.arc(boid.x, boid.y, 5, 0, 2 * Math.PI);
    // ctx.fill();
    ctx.beginPath();
    ctx.moveTo(boid.x + vx * 12, boid.y + vy * 12);
    ctx.lineTo(boid.x - vy * 4, boid.y + vx * 4);
    ctx.lineTo(boid.x + vy * 4, boid.y - vx * 4);
    ctx.lineTo(boid.x + vx * 12, boid.y + vy * 12);
    ctx.fill();
    // separation radius red
    ctx.fillStyle = "#f002";
    ctx.beginPath();
    ctx.arc(boid.x, boid.y, separationRadius, 0, 2 * Math.PI);
    ctx.fill();
  }
}

function update() {
  for (let i = 0; i < boids.length; i++) {
    const boid = boids[i];
    // move
    boid.x += boid.vx;
    boid.y += boid.vy;
    // boundary
    // torus
    // if (boid.x < 0) {
    //   boid.x += simulation.width;
    // }
    // if (boid.x > simulation.width) {
    //   boid.x -= simulation.width;
    // }
    // if (boid.y < 0) {
    //   boid.y += simulation.height;
    // }
    // if (boid.y > simulation.height) {
    //   boid.y -= simulation.width;
    // }
    // bounce
    if (boid.x < 0) {
      boid.x *= -1;
      boid.vx *= -1;
    }
    if (boid.x > simulation.width) {
      boid.x = simulation.width - (boid.x - simulation.width);
      boid.vx *= -1;
    }
    if (boid.y < 0) {
      boid.y *= -1;
      boid.vy *= -1;
    }
    if (boid.y > simulation.height) {
      boid.y = simulation.height - (boid.y - simulation.height);
      boid.vy *= -1;
    }
    // separation
    for (let j = 0; j < boids.length; j++) {
      if (i == j) {
        continue;
      }
      const other_boid = boids[j];
      const dx = boid.x - other_boid.x;
      const dy = boid.y - other_boid.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < separationRadius) {
        boid.vx += (separationForce * dx) / dist;
        boid.vy += (separationForce * dy) / dist;
      }
    }
    // clip velocity
    const length = Math.sqrt(boid.vx * boid.vx + boid.vy * boid.vy);
    // exact
    // if (length > initialSpeed) {
    //   boid.vx *= initialSpeed / length;
    //   boid.vy *= initialSpeed / length;
    // }
    // min max
    if (length > maxSpeed) {
      boid.vx *= maxSpeed / length;
      boid.vy *= maxSpeed / length;
    }
    if (length < minSpeed) {
      boid.vx *= minSpeed / length;
      boid.vy *= minSpeed / length;
    }
  }
}

init();

function update_loop() {
  update();
  draw();
  if (play_pause_btn.checked) {
    setTimeout(update_loop, 1000 / 60);
  }
}

reset_btn.onclick = init;
play_pause_btn.onclick = update_loop;
