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

// intializing game canvas variables
const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
canvas.width = 600, canvas.height = 600;

// initializing game objects variables
const player: Location & Size = {x: canvas.width/2-5, y: canvas.height-30, w: 20, h: 10};
const keys: Record<string,boolean> = {
  "KeyA": false,
  "KeyD": false,
  "ArrowRight": false,
  "ArrowLeft": false,
  "Space": false,
};
const playerSpeed = 400; // pixels per seconds
let lastTime = 0;

function recordDown(e:KeyboardEvent){
  keys[e.code] = true;
};
function recordUp(e:KeyboardEvent) {
  keys[e.code] = false;
};

window.addEventListener("keydown", recordDown);
window.addEventListener("keyup", recordUp);

function gameLoop(currentTime: number){
  if (lastTime == 0) lastTime = currentTime;
  const delta = (currentTime - lastTime) / 1000; // pixels per second
  lastTime = currentTime;

  if (!ctx){
    throw new Error("2d canvas not found");
  };

  ctx.clearRect(0 , 0, canvas.width, canvas.height);

  let dx = 0;
  if (keys["KeyA"] || keys["ArrowLeft"]) dx -= playerSpeed * delta;
  if (keys["KeyD"] || keys["ArrowRight"]) dx += playerSpeed * delta;

  if (player.x + dx >= 0 && player.x + player.w + dx <= canvas.width) player.x += dx;

  ctx.fillStyle = "white";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  requestAnimationFrame(gameLoop);
};

requestAnimationFrame(gameLoop);
