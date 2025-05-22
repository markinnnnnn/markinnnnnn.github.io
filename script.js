const car = document.getElementById('car');
const road = document.getElementById('road');

let isDragging = false;
let centerX, centerY, radius;

function updateCenter() {
  const rect = road.getBoundingClientRect();
  centerX = rect.left + rect.width / 2;
  centerY = rect.top + rect.height / 2;
  radius = rect.width / 2 - 20;
}

updateCenter();
window.addEventListener('resize', updateCenter);

car.addEventListener('mousedown', (e) => {
  isDragging = true;
  e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
  if (!isDragging) return;

  const dx = e.clientX - centerX;
  const dy = e.clientY - centerY;
  const angle = Math.atan2(dy, dx);

  const x = centerX + radius * Math.cos(angle);
  const y = centerY + radius * Math.sin(angle);

  car.style.left = `${x}px`;
  car.style.top = `${y}px`;
});

document.addEventListener('mouseup', () => {
  isDragging = false;
});
