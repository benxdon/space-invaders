import './style.css'

const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d");
canvas.width = 600, canvas.height = 600;

if (!ctx){
  throw new Error("2d canvas not existed");
}

ctx.fillStyle = "green";
ctx.fillRect(0,0,canvas.width,canvas.height);
