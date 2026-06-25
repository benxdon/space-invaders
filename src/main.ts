import './style.css'

// declaring type constants
type Location = {
  x: number,
  y: number
};

type Size = {
  w: number,
  h: number,
};

type Player = Location & Size & {lives: number};
type Enemy = Location & Size & {alive: boolean};
type Bullet = Location & Size & {hit: boolean};

// intializing game canvas variables
const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d")!;
if (!ctx){
  throw new Error("2d canvas not found");
};
canvas.width = 600, canvas.height = 600;

// player variables
const player: Player = {x: canvas.width/2-5, y: canvas.height-30, w: 20, h: 10, lives: 3};
const playerSpeed = 400; // pixels per seconds
const keys: Record<string,boolean> = {
  "KeyA": false,
  "KeyD": false,
  "ArrowRight": false,
  "ArrowLeft": false,
  "Space": false,
};

// bullets variables
let bullets: Bullet[] = [];
const bulletSpeed = 200;
let lastTime = 0;
let spaceWasDown = false;

// enemies variables
let enemies: Enemy[] = [];
let enemyDx = 60;
const ENEMY_DROP = 20;
const ENEMY_W = 30, ENEMY_H = 20;
const ROWS = 5, COLS = 8;
const OFFSET_X = 40, OFFSET_Y = 40; // margin
const GAP = 15; // space between enemies

// games variables
let score = 0;
let gameState: "playing" | "won" | "lost" = "playing";

for (let row = 0; row < ROWS; row++){
  for (let col = 0; col < COLS; col++){
    enemies.push({
      x: OFFSET_X + col * (ENEMY_W + GAP),
      y: OFFSET_Y + row * (ENEMY_H + GAP),
      w: ENEMY_W,
      h: ENEMY_H,
      alive: true,
    });
  }
}

function recordDown(e:KeyboardEvent){
  keys[e.code] = true;
};
function recordUp(e:KeyboardEvent) {
  keys[e.code] = false;
};

function draw(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.fillRect(player.x, player.y, player.w, player.h);
  for (let bullet of bullets){
    if (!bullet.hit){
      ctx.fillRect(bullet.x, bullet.y, bullet.w, bullet.h);
    }
  };
  ctx.font = "12px monospace";
  ctx.fillText(`Score: ${score}`, 10, 20);
  ctx.fillText(`Lives: ${player.lives}`, canvas.width - 80, 20);

  ctx.fillStyle = "lime";
  for (let enemy of enemies){
    if (enemy.alive){
      ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h);
    }
  }
}

function isOverlapping(bullet: Bullet, enemy: Enemy) {
  let withinX = bullet.x >= enemy.x && bullet.x + bullet.w <= enemy.x + enemy.w;
  let withinY = bullet.y >= enemy.y && bullet.y + bullet.h <= enemy.y + enemy.h;
  if (withinX && withinY) return true;
  return false;
}

function checkCollisions(){
  for (let bullet of bullets){
    for (let enemy of enemies){
      if (isOverlapping(bullet, enemy)) {
        bullet.hit = true;
        enemy.alive = false;
        score++;
      }
    }
  }
}

function update(delta: number){
  let playerDx = 0;
  const hitRight = enemies.some((e) => e.x + e.w + enemyDx * delta >= canvas.width);
  const hitLeft = enemies.some((e) => e.x + enemyDx * delta <= 0);

  if (keys["KeyA"] || keys["ArrowLeft"]) playerDx -= playerSpeed * delta;
  if (keys["KeyD"] || keys["ArrowRight"]) playerDx += playerSpeed * delta;
  if (player.x + playerDx >= 0 && player.x + player.w + playerDx <= canvas.width) player.x += playerDx;

  for (let bullet of bullets){
    if (!bullet.hit){
      bullet.y -= bulletSpeed * delta;
    }
  }

  if (hitLeft || hitRight){
    enemyDx *= -1;
    for (let enemy of enemies){
      enemy.y += ENEMY_DROP;
    }
  }

  for (let enemy of enemies){
    enemy.x += enemyDx * delta
  }


  checkCollisions();
  bullets = bullets.filter((bullet) => bullet.y + bullet.h > 0 && !bullet.hit);
  enemies = enemies.filter((enemy) => enemy.alive);
}

function drawEndScreen(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "32px monospace";
  ctx.textAlign = "center";
  ctx.fillText(
    gameState === "won" ? "YOU WIN!" : "GAME OVER",
    canvas.width/2, canvas.height/2
  );
  ctx.font = "16px monospace";
  ctx.fillText(`Score ${score}`, canvas.width/2, canvas.height/2 + 40);
  ctx.textAlign = "left";
}

window.addEventListener("keydown", recordDown);
window.addEventListener("keyup", recordUp);

function gameLoop(currentTime: number){
  if (gameState !== "playing"){
    drawEndScreen();
    requestAnimationFrame(gameLoop);
    return;
  }

  if (lastTime == 0) lastTime = currentTime;
  const delta = (currentTime - lastTime) / 1000; // pixels per second
  lastTime = currentTime;
  const spaceDown = keys["Space"];

  if (spaceDown && !spaceWasDown) {
    bullets.push({x: player.x + player.w/2, y: player.y, w: 4, h: 8, hit: false});
  };

  spaceWasDown = spaceDown;

  update(delta);

  if (enemies.length === 0) gameState = "won";
  if (enemies.some((e) => e.y + e.h >= canvas.height) || player.lives === 0) gameState = "lost";
 
  draw();

  requestAnimationFrame(gameLoop);
};

requestAnimationFrame(gameLoop);
