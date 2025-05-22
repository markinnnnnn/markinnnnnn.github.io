const car = document.getElementById("car");
const circle = document.getElementById("circle");
const inputDate = document.getElementById("nascimento");
const overlay = document.getElementById("warningOverlay");

const bounds = circle.getBoundingClientRect();
const centerX = bounds.width / 2;
const centerY = bounds.height / 2;
const radius = bounds.width / 2 - 45;

let currentDate = new Date('1950-01-01');
inputDate.valueAsDate = currentDate;

const today = new Date();
inputDate.max = today.toISOString().split('T')[0];

let dragging = false;
let lastAngle = 0;
let accumulatedDegrees = 0;

function updateCarPosition(angleDeg) {
  const angleRad = angleDeg * Math.PI / 180;
  const x = centerX + radius * Math.cos(angleRad);
  const y = centerY + radius * Math.sin(angleRad);
  car.style.left = `${x}px`;
  car.style.top = `${y}px`;
  car.style.transform = `translate(-50%, -50%) rotate(${angleDeg}deg)`;
}

function getAngleFromCenter(x, y) {
  const rect = circle.getBoundingClientRect();
  const dx = x - (rect.left + centerX);
  const dy = y - (rect.top + centerY);
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

  const dx = clientX - (circle.getBoundingClientRect().left + centerX);
  const dy = clientY - (circle.getBoundingClientRect().top + centerY);
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (Math.abs(distance - radius) > 30) {
    showWarning();
    stopDrag();
    return;
  }

  const angle = getAngleFromCenter(clientX, clientY);
  let delta = angle - lastAngle;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;

  updateDateByRotation(delta);
  updateCarPosition(angle);
  lastAngle = angle;
}

function startDrag(e) {
  e.preventDefault();
  dragging = true;
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  lastAngle = getAngleFromCenter(clientX, clientY);
  document.addEventListener('mousemove', onMove, { passive: false });
  document.addEventListener('touchmove', onMove, { passive: false });
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

function showWarning() {
  overlay.style.display = 'flex';
}

function hideWarning() {
  overlay.style.display = 'none';
}

updateCarPosition(0);
car.addEventListener('mousedown', startDrag);
car.addEventListener('touchstart', startDrag);
