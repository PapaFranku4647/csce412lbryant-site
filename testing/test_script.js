const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.width= 400;
canvas.height= 400;



let ball = { x: 200, y: 200, r: 20 };
let smallBall = {    x: 0,
    y: 0,
    r: 0,
    maxR: 10,
    currentTarget: {},
startingPosition: {}};
let numBalls = 8;
let smallBalls = [];
let target = { x: 300, y: 300 };
let isExtended = false;
let animating = false;


function drawBigCircle() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawSmallCircle(smallBall) {
  ctx.beginPath();
  ctx.arc(smallBall.x, smallBall.y, smallBall.r, 0, Math.PI * 2);
  ctx.fillStyle = "#4CAF50";
  ctx.fill();
  ctx.closePath();
}

function drawLine(smallBall) {
  ctx.beginPath();
  ctx.moveTo(ball.x, ball.y);
  ctx.lineTo(smallBall.x, smallBall.y);
  ctx.strokeStyle = "#FF0000";
  ctx.stroke();
  ctx.closePath();
}
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function animate() {
  if (animating) {
      for (let i = 0; i < smallBalls.length; i++) {
          const smallBall = smallBalls[i];
          
          const dx = smallBall.currentTarget.x - smallBall.x;
          const dy = smallBall.currentTarget.y - smallBall.y;

          console.log(smallBall.startingPosition);
          const totalTravelDistance = Math.sqrt((smallBall.currentTarget.x - smallBall.startingPosition.y)**2 + (smallBall.currentTarget.y - smallBall.startingPosition.y)**2);
          const distanceToTarget = Math.sqrt(dx * dx + dy * dy);
          const distanceToOrigin = Math.sqrt(
              Math.pow(smallBall.x - ball.x, 2) + Math.pow(smallBall.y - ball.y, 2)
          );
          
          smallBall.r = Math.max(2, smallBall.maxR * (distanceToOrigin / totalTravelDistance));

          smallBall.x += dx * 0.05;
          smallBall.y += dy * 0.05;

          if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
              smallBall.x = smallBall.currentTarget.x;
              smallBall.y = smallBall.currentTarget.y;
          }
      }

      clearCanvas();
      smallBalls.forEach(smallBall => drawLine(smallBall));

      smallBalls.forEach(smallBall => drawSmallCircle(smallBall));
      drawBigCircle();

      if (smallBalls.every(smallBall => {
          const dx = smallBall.currentTarget.x - smallBall.x;
          const dy = smallBall.currentTarget.y - smallBall.y;
          return Math.abs(dx) < 1 && Math.abs(dy) < 1;
      })) {
          animating = false;
      }

      requestAnimationFrame(animate);
  }
}

canvas.addEventListener("click", function(event) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  if (Math.pow(x - ball.x, 2) + Math.pow(y - ball.y, 2) < Math.pow(ball.r, 2)) {
      if (!isExtended) {
          makeSmallBalls(numBalls);
          isExtended = true;
      } else {
          smallBalls.forEach(smallBall => {
                smallBall.startingPosition = {x: smallBall.x, y: smallBall.y};
              smallBall.currentTarget = { x: ball.x, y: ball.y };
          });
          isExtended = false;
      }
      animating = true;
      animate();
  }
});


function makeSmallBalls(numBalls)
{
  let childWidth = (numBalls-1) * 30;
  let startingX = ball.x - (childWidth / 2);
  for (let i = 0; i < numBalls; i++) {
    smallBalls[i] = { x: ball.x, y: ball.y, r: 1, maxR: 10, currentTarget: { x: startingX + i*30, y: ball.y + 100 }, startingPosition: {x:ball.x, y: ball.y}};
  }
console.log(ball.x, startingX);
}

makeSmallBalls(numBalls);
drawBigCircle();