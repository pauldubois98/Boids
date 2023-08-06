ctx = simulation.getContext("2d");
const initialSpeed = 2;
var separationRadius = 20;
var separationForce = 0.2;
var cohesionRadius = 80;
var cohesionForce = 0.01;
var alignmentRadius = 50;
var alignmentForce = 0.3;
const turnFactor = 0.2;
const turnMargin = 0.1;
const minSpeed = 0.5;
const maxSpeed = 2;
var boids = [];

function Boid(x, y, vx, vy) {
  boid = { vx: vx, vy: vy, x: x, y: y };
  return boid;
}

function add_one_boid(display = true) {
  // random velocity of uni length
  var vx = Math.random() * 2 - 1;
  var vy = Math.random() * 2 - 1;
  var length = Math.sqrt(vx * vx + vy * vy);
  vx *= initialSpeed / length;
  vy *= initialSpeed / length;
  boids.push(new Boid(simulation.width / 2, simulation.height / 2, vx, vy));
  if (display) {
    draw();
  }
}
function del_one_boid() {
  boids.pop();
  draw();
}

function add_boids(n) {
  for (var i = 0; i < n; i++) {
    add_one_boid(false);
  }
  draw();
}

function del_all_boids() {
  boids = [];
}

function init() {
  boids = [];
  for (var i = 0; i < 100; i++) {
    add_one_boid(false);
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
    // cohesion radius blue
    if (show_cohesion_radius.checked) {
      ctx.fillStyle = "#00f1";
      ctx.beginPath();
      ctx.arc(boid.x, boid.y, cohesionRadius, 0, 2 * Math.PI);
      ctx.fill();
    }
    // alignment radius yellow
    if (show_alignment_radius.checked) {
      ctx.fillStyle = "#ff02";
      ctx.beginPath();
      ctx.arc(boid.x, boid.y, alignmentRadius, 0, 2 * Math.PI);
      ctx.fill();
    }
    // separation radius red
    if (show_separation_radius.checked) {
      ctx.fillStyle = "#f003";
      ctx.beginPath();
      ctx.arc(boid.x, boid.y, separationRadius, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
}

function update() {
  for (let i = 0; i < boids.length; i++) {
    const boid = boids[i];
    // move
    boid.x += boid.vx;
    boid.y += boid.vy;
    // boundary
    if(boundaries_torus.checked){
      // torus
      if (boid.x < 0) {
        boid.x += simulation.width;
      }
      if (boid.x > simulation.width) {
        boid.x -= simulation.width;
      }
      if (boid.y < 0) {
        boid.y += simulation.height;
      }
      if (boid.y > simulation.height) {
        boid.y -= simulation.height;
      }
    }
    if(boundaries_bounce.checked){
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
    }
    // separation
    var separation = { x: 0, y: 0 };
    for (let j = 0; j < boids.length; j++) {
      if (i == j) {
        continue;
      }
      const other_boid = boids[j];
      const dx = boid.x - other_boid.x;
      const dy = boid.y - other_boid.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < separationRadius) {
        separation.x += dx / dist;
        separation.y += dy / dist;
      }
    }
    var separation_length = Math.sqrt(separation.x ** 2 + separation.y ** 2);
    if (separation_length > 0) {
      separation.x /= separation_length;
      separation.y /= separation_length;
    }
    boid.vx += separationForce * separation.x;
    boid.vy += separationForce * separation.y;
    // cohesion
    var cohesion = { x: 0, y: 0 };
    for (let j = 0; j < boids.length; j++) {
      if (i == j) {
        continue;
      }
      const other_boid = boids[j];
      const dx = other_boid.x - boid.x;
      const dy = other_boid.y - boid.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < cohesionRadius && dist > separationRadius) {
        cohesion.x += dx / dist;
        cohesion.y += dy / dist;
      }
    }
    var cohesion_length = Math.sqrt(cohesion.x ** 2 + cohesion.y ** 2);
    if (cohesion_length > 0) {
      cohesion.x /= cohesion_length;
      cohesion.y /= cohesion_length;
    }
    boid.vx += cohesionForce * cohesion.x;
    boid.vy += cohesionForce * cohesion.y;
    // alignment
    var alignment = { x: 0, y: 0 };
    for (let j = 0; j < boids.length; j++) {
      if (i == j) {
        continue;
      }
      const other_boid = boids[j];
      const dx = boid.x - other_boid.x;
      const dy = boid.y - other_boid.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < alignmentRadius) {
        alignment.x += other_boid.vx;
        alignment.y += other_boid.vy;
      }
    }
    var alignment_length = Math.sqrt(alignment.x ** 2 + alignment.y ** 2);
    if (alignment_length > 0) {
      alignment.x /= alignment_length;
      alignment.y /= alignment_length;
    }
    boid.vx += alignmentForce * alignment.x;
    boid.vy += alignmentForce * alignment.y;
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

function update_loop() {
  update();
  draw();
  if (play_pause_btn.checked) {
    setTimeout(update_loop, 1000 / 60);
  }
}

reset_btn.onclick = init;
play_pause_btn.onclick = update_loop;

init();
if (play_pause_btn.checked) {
  update_loop();
}

function update_consts() {
  separationRadius = parseFloat(separation_radius.value);
  separationForce = parseFloat(separation_force.value);
  if(inverse_separation_force.checked){
    separationForce *= -1;
  }
  cohesionRadius = parseFloat(cohesion_radius.value);
  cohesionForce = parseFloat(cohesion_force.value);
  if(inverse_cohesion_force.checked){
    cohesionForce *= -1;
  }
  alignmentRadius = parseFloat(alignment_radius.value);
  alignmentForce = parseFloat(alignment_force.value);
  if(inverse_alignment_force.checked){
    alignmentForce *= -1;
  }
}
update_consts();
