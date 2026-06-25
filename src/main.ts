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

// initializing game objects variables
const player: Player = {x: canvas.width/2-5, y: canvas.height-30, w: 20, h: 10, lives: 3};
const keys: Record<string,boolean> = {
  "KeyA": false,
  "KeyD": false,
  "ArrowRight": false,
  "ArrowLeft": false,
  "Space": false,
};
let bullets: Bullet[] = [];
const playerSpeed = 400; // pixels per seconds
const bulletSpeed = 200;
let lastTime = 0;
let spaceWasDown = false;

const enemies: Enemy[] = [];
const ENEMY_W = 30, ENEMY_H = 20;
const ROWS = 5, COLS = 8;
const OFFSET_X = 40, OFFSET_Y = 40; // margin
const GAP = 15; // space between enemies

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

  ctx.fillStyle = "lime";
  for (let enemy of enemies){
    if (enemy.alive){
      ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h);
    }
  }
}

function update(delta: number){
  let dx = 0;
  if (keys["KeyA"] || keys["ArrowLeft"]) dx -= playerSpeed * delta;
  if (keys["KeyD"] || keys["ArrowRight"]) dx += playerSpeed * delta;
  if (player.x + dx >= 0 && player.x + player.w + dx <= canvas.width) player.x += dx;

  for (let bullet of bullets){
    if (!bullet.hit){
      bullet.y -= bulletSpeed * delta;
    }
  }

  bullets = bullets.filter((bullet) => bullet.y + bullet.h > 0);
 
}

window.addEventListener("keydown", recordDown);
window.addEventListener("keyup", recordUp);

function gameLoop(currentTime: number){
  if (lastTime == 0) lastTime = currentTime;
  const delta = (currentTime - lastTime) / 1000; // pixels per second
  lastTime = currentTime;
  const spaceDown = keys["Space"];


  if (spaceDown && !spaceWasDown) {
    bullets.push({x: player.x + player.w/2, y: player.y, w: 2, h: 5, hit: false});
  };

  spaceWasDown = spaceDown;

  update(delta);
  draw();

  requestAnimationFrame(gameLoop);
};

requestAnimationFrame(gameLoop);
