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
const player: Location & Size = {x: 0, y: 0, w: 10, h: 10};
const keys: Record<string,boolean> = {
  "KeyW": false,
  "KeyA": false,
  "KeyS": false,
  "KeyD": false,
  "ArrowRight": false,
  "ArrowLeft": false,
  "ArrowUp": false,
  "ArrowDown": false,
  "Space": false,
};

function recordDown(e:KeyboardEvent){
  keys[e.code] = true;
};
function recordUp(e:KeyboardEvent) {
  keys[e.code] = false;
}''

window.addEventListener("keydown", recordDown);
window.addEventListener("keyup", recordUp);

function gameLoop(){
  if (!ctx){
    throw new Error("2d canvas not found");
  };
  ctx.clearRect(0 , 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.fillRect(player.x, player.y, player.w, player.h);
  if (keys["KeyA"] || keys["ArrowLeft"]) player.x -= 5;
  if (keys["KeyD"] || keys["ArrowRight"]) player.x += 5;
  if (keys["KeyW"] || keys["ArrowUp"]) player.y -= 5;
  if (keys["KeyS"] || keys["ArrowDown"]) player.y += 5;
  requestAnimationFrame(gameLoop);
};

gameLoop();
