
const canvas = document.getElementById("dateCircle");
const ctx = canvas.getContext("2d");
const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const radius = 120;
const markerRadius = 10;

let angle = 0;
let day = 1, month = 1, year = 1950;

function drawCircle() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = "#0af";
  ctx.lineWidth = 2;
  ctx.stroke();

  const markerX = centerX + radius * Math.cos(angle);
  const markerY = centerY + radius * Math.sin(angle);

  ctx.beginPath();
  ctx.arc(markerX, markerY, markerRadius, 0, 2 * Math.PI);
  ctx.fillStyle = "#0af";
  ctx.fill();
}

function updateDate() {
  day++;
  if (day > 31) {
    day = 1;
    month++;
    if (month > 12) {
      month = 1;
      year++;
    }
  }
  const format = n => n.toString().padStart(2, '0');
  document.getElementById("dateDisplay").textContent = 
    `${format(day)}/${format(month)}/${year}`;
}

function onRotate(x, y) {
  const dx = x - centerX;
  const dy = y - centerY;
  const newAngle = Math.atan2(dy, dx);
  const delta = newAngle - angle;

  if (Math.abs(delta) > 0.1) {
    updateDate();
  }

  angle = newAngle;
  drawCircle();
}

canvas.addEventListener("mousedown", startDrag);
canvas.addEventListener("touchstart", startDrag, { passive: false });

function startDrag(e) {
  e.preventDefault();
  const moveHandler = e => {
    const pos = e.touches ? e.touches[0] : e;
    const rect = canvas.getBoundingClientRect();
    onRotate(pos.clientX - rect.left, pos.clientY - rect.top);
  };
  const endHandler = () => {
    window.removeEventListener("mousemove", moveHandler);
    window.removeEventListener("touchmove", moveHandler);
    window.removeEventListener("mouseup", endHandler);
    window.removeEventListener("touchend", endHandler);
  };

  window.addEventListener("mousemove", moveHandler);
  window.addEventListener("touchmove", moveHandler);
  window.addEventListener("mouseup", endHandler);
  window.addEventListener("touchend", endHandler);
}

drawCircle();
