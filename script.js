
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let keys = {};
window.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

const player = {
  x: 400, y: 400, width: 40, height: 80,
  speed: 4,
  color: 'orange',
  jumping: false,
  velocityY: 0,
  gravity: 0.6,
  canShoot: true,
  shootCooldown: 0,
};

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y - player.height, player.width, player.height);
}

function updatePlayer() {
  // Left/right movement
  if (keys['a'] || keys['arrowleft']) player.x -= player.speed;
  if (keys['d'] || keys['arrowright']) player.x += player.speed;
  // Boundaries
  if (player.x < 0) player.x = 0;
  if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;

  // Gravity & jumping
  if (player.jumping) {
    player.velocityY += player.gravity;
    player.y += player.velocityY;
    if (player.y >= 400) {
      player.y = 400;
      player.jumping = false;
      player.velocityY = 0;
      player.canShoot = true;
      // Shoot on landing if shooting button held
      if (keys[' ']) shootBall();
    }
  } else if ((keys['w'] || keys['arrowup']) && !player.jumping) {
    player.jumping = true;
    player.velocityY = -12;
    player.canShoot = false;
  }
}

let balls = [];
function shootBall() {
  if (!player.canShoot) return;
  balls.push({
    x: player.x + player.width / 2,
    y: player.y - player.height,
    radius: 8,
    speedY: -8,
    speedX: 0,
    shot: true,
  });
  player.canShoot = false;
}

function updateBalls() {
  for (let i = balls.length - 1; i >= 0; i--) {
    const b = balls[i];
    b.x += b.speedX;
    b.y += b.speedY;
    b.speedY += 0.4; // gravity for ball
    // Remove ball if off screen
    if (b.y > canvas.height + 20) balls.splice(i, 1);
  }
}

function drawBalls() {
  ctx.fillStyle = 'white';
  balls.forEach(b => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    ctx.fill();
  });
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  updatePlayer();
  updateBalls();
  drawBalls();
  requestAnimationFrame(gameLoop);
}

gameLoop();
