const car = document.getElementById("car");
const circle = document.getElementById("circle");
const inputDate = document.getElementById("nascimento");

const centerX = circle.offsetWidth / 2;
const centerY = circle.offsetHeight / 2;
const radius = circle.offsetWidth / 2 - 15;

let currentDate = new Date('1950-01-01');
inputDate.valueAsDate = currentDate;

// Limitar até hoje
const today = new Date();
inputDate.max = today.toISOString().split('T')[0];

let dragging = false;
let lastAngle = 0;
let accumulatedDegrees = 0;

function updateCarPosition(angleDeg) {
  const angleRad = angleDeg * Math.PI / 180;
  const x = centerX + radius * Math.cos(angleRad) - 15;
  const y = centerY + radius * Math.sin(angleRad) - 15;
  car.style.left = `${x}px`;
  car.style.top = `${y}px`;
}

function getAngleFromCenter(x, y) {
  const dx = x - (circle.getBoundingClientRect().left + centerX);
  const dy = y - (circle.getBoundingClientRect().top + centerY);
  return Math.atan2(dy, dx) * 180 / Math.PI;
}

function updateDateByRotation(deltaAngle) {
  accumulatedDegrees += deltaAngle;

  const degreesPerDay = 360 / 365;
  const daysToAdd = Math.floor(accumulatedDegrees / degreesPerDay);

  if (daysToAdd !== 0) {
    for (let i = 0; i < Math.abs(daysToAdd); i++) {
      let nextDate = new Date(currentDate);
      nextDate.setDate(currentDate.getDate() + Math.sign(daysToAdd));

      // Limite superior: hoje
      if (nextDate > today) break;

      currentDate = nextDate;
    }

    inputDate.valueAsDate = currentDate;
    accumulatedDegrees -= daysToAdd * degreesPerDay;
  }
}

function onMove(e) {
  if (!dragging) return;

  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  const angle = getAngleFromCenter(clientX, clientY);
  let delta = angle - lastAngle;

  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;

  updateDateByRotation(delta);
  updateCarPosition(angle);
  lastAngle = angle;
}

function startDrag(e) {
  dragging = true;
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  lastAngle = getAngleFromCenter(clientX, clientY);
  document.addEventListener('mousemove', onMove);
  document.addEventListener('touchmove', onMove);
  document.addEventListener('mouseup', stopDrag);
  document.addEventListener('touchend', stopDrag);
}

function stopDrag() {
  dragging = false;
  document.removeEventListener('mousemove', onMove);
  document.removeEventListener('touchmove', onMove);
  document.removeEventListener('mouseup', stopDrag);
  document.removeEventListener('touchend', stopDrag);
}

// Inicializar posição do carro
updateCarPosition(0);
car.addEventListener('mousedown', startDrag);
car.addEventListener('touchstart', startDrag);
