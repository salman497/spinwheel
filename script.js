const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const segments = [
  { label: 'Common', color: '#FFEB3B', points: 100 },
  { label: 'UnCommon', color: '#FFC107', points: 500 },
  { label: 'Rare', color: '#FF9800', points: 1000 },
  { label: 'Epic', color: '#F44336', points: 1500 },
  { label: 'Legendary', color: '#E91E63', points: 2000 },
  { label: 'Special', color: '#9C27B0', points: 3000 },
  { label: 'Mythic', color: '#673AB7', points: 5000 },
];

let startAngle = 0;
let arc = Math.PI / (segments.length / 2);
let spinTimeout = null;
let spinAngleStart = 0;
let spinTime = 0;
let spinTimeTotal = 0;

function drawWheel() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  segments.forEach((segment, i) => {
    const angle = startAngle + i * arc;
    ctx.fillStyle = segment.color;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, angle, angle + arc, false);
    ctx.arc(canvas.width / 2, canvas.height / 2, 0, angle + arc, angle, true);
    ctx.fill();

    ctx.save();
    ctx.fillStyle = '#fff';
    ctx.translate(
      canvas.width / 2 + Math.cos(angle + arc / 2) * (canvas.width / 2 - 50),
      canvas.height / 2 + Math.sin(angle + arc / 2) * (canvas.height / 2 - 50)
    );
    ctx.rotate(angle + arc / 2 + Math.PI / 2);
    ctx.fillText(segment.label, -ctx.measureText(segment.label).width / 2, 0);
    ctx.restore();
  });

  // Draw arrow
  ctx.fillStyle = '#3f51b5';
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - 10, canvas.height / 2 - (canvas.height / 2) - 20);
  ctx.lineTo(canvas.width / 2 + 10, canvas.height / 2 - (canvas.height / 2) - 20);
  ctx.lineTo(canvas.width / 2, canvas.height / 2 - (canvas.height / 2));
  ctx.fill();
}

function spin() {
  spinAngleStart = Math.random() * 10 + 10;
  spinTime = 0;
  spinTimeTotal = Math.random() * 3 + 4 * 1000;
  rotateWheel();
}

function rotateWheel() {
  spinTime += 30;
  if (spinTime >= spinTimeTotal) {
    stopRotateWheel();
    return;
  }
  const spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
  startAngle += (spinAngle * Math.PI) / 180;
  drawWheel();
  spinTimeout = setTimeout(rotateWheel, 30);
}

function stopRotateWheel() {
  clearTimeout(spinTimeout);
  const degrees = (startAngle * 180) / Math.PI + 90;
  const arcd = (arc * 180) / Math.PI;
  const index = Math.floor((360 - (degrees % 360)) / arcd) % segments.length;
  const segment = segments[index];
  document.getElementById('result').innerText = `You won ${segment.label}! Points: ${segment.points}`;
}

function easeOut(t, b, c, d) {
  const ts = (t /= d) * t;
  const tc = ts * t;
  return b + c * (tc + -3 * ts + 3 * t);
}

document.getElementById('spin-button').addEventListener('click', spin);

drawWheel();