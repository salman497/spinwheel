const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const avatarCenter = document.getElementById('avatar-center');
const avatarNameElem = document.getElementById('avatar-name');
const spinButton = document.getElementById('spin-button');
let currentSegmentLabel = document.getElementById('result');

// Add a new div to show current position dynamically
let currentPositionLabel = document.createElement('div');
currentPositionLabel.id = 'current-position';
currentPositionLabel.style.fontSize = '1.5rem';
currentPositionLabel.style.marginTop = '20px';
currentPositionLabel.style.color = '#333';
document.querySelector('.wheel-container').appendChild(currentPositionLabel);

const segments = [
  { label: 'Common', color: '#FFEB3B', points: 100, chance: 70, avatars: ['fas fa-user', 'fas fa-user-ninja', 'fas fa-user-astronaut', 'fas fa-user-secret', 'fas fa-user-md', 'fas fa-user-injured', 'fas fa-user-alt', 'fas fa-user-tag', 'fas fa-child', 'fas fa-baby'], names: ['Mr. Average', 'Ninja Joe', 'Space Hero', 'Secret Agent', 'Dr. Grey', 'Injury Prone', 'Tag Champ', 'The Kid', 'Tiny Toddler', 'Babyface'] },
  { label: 'UnCommon', color: '#FFC107', points: 500, chance: 60, avatars: ['fas fa-robot', 'fas fa-cat', 'fas fa-dog', 'fas fa-hippo', 'fas fa-frog', 'fas fa-dragon', 'fas fa-horse'], names: ['Robo Rex', 'Whiskers', 'Barker', 'Happy Hippo', 'Froggy', 'Mini Dragon', 'Galloper'] },
  { label: 'Rare', color: '#FF9800', points: 1000, chance: 50, avatars: ['fas fa-dove', 'fas fa-spider', 'fas fa-crow', 'fas fa-kiwi-bird', 'fas fa-otter', 'fas fa-fish'], names: ['Dovey', 'Creepy Crawly', 'Dark Feather', 'Kiwi Kid', 'Otto the Otter', 'Fishy'] },
  { label: 'Epic', color: '#F44336', points: 1500, chance: 25, avatars: ['fas fa-dragon', 'fas fa-ghost', 'fas fa-meteor', 'fas fa-fire'], names: ['Fire Dragon', 'Casper', 'Meteor Smash', 'Inferno'] },
  { label: 'Special', color: '#9C27B0', points: 3000, chance: 10, avatars: ['fas fa-hat-wizard', 'fas fa-bolt', 'fas fa-feather-alt'], names: ['Wizard Hat', 'Thunderbolt', 'Feather Fly'] },
  { label: 'Mythic', color: '#673AB7', points: 5000, chance: 5, avatars: ['fas fa-crown', 'fas fa-star'], names: ['King Crown', 'Star Child'] }
];

let startAngle = 0;
let arc = Math.PI / (segments.length / 2);
let spinTimeout = null;
let spinAngleStart = 0;
let spinTime = 0;
let spinTimeTotal = 0;
let avatarChangeInterval;

// Weighted random selection for winning chances
function getRandomSegment() {
  const totalChance = segments.reduce((sum, seg) => sum + seg.chance, 0);
  const random = Math.random() * totalChance;
  let runningSum = 0;

  for (let i = 0; i < segments.length; i++) {
    runningSum += segments[i].chance;
    if (random <= runningSum) {
      return segments[i];
    }
  }
}

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

  // Draw enhanced arrow
  ctx.fillStyle = '#3f51b5';
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - 10, canvas.height / 2 - (canvas.height / 2) - 40);
  ctx.lineTo(canvas.width / 2 + 10, canvas.height / 2 - (canvas.height / 2) - 40);
  ctx.lineTo(canvas.width / 2, canvas.height / 2 - (canvas.height / 2) - 20);
  ctx.fill();
}

// Start the spin animation
function spin() {
  spinAngleStart = Math.random() * 10 + 10;
  spinTime = 0;
  spinTimeTotal = Math.random() * 3 + 4 * 1000;
  
  // Start changing avatar randomly during spin
  startAvatarChange();

  rotateWheel();
}

// Animate the wheel rotation and update current position
function rotateWheel() {
  spinTime += 30;
  if (spinTime >= spinTimeTotal) {
    stopRotateWheel();
    return;
  }

  const spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
  startAngle += (spinAngle * Math.PI) / 180;

  // Update current position display
  updateCurrentSegment();

  drawWheel();
  spinTimeout = setTimeout(rotateWheel, 30);
}

// Start changing the avatar randomly every 200ms during spin
function startAvatarChange() {
  avatarChangeInterval = setInterval(() => {
    const randomSegment = segments[Math.floor(Math.random() * segments.length)];
    updateCenterAvatar(randomSegment);
  }, 200); // change avatar every 200ms
}

// Stop the wheel and finalize the result
function stopRotateWheel() {
  clearTimeout(spinTimeout);
  clearInterval(avatarChangeInterval); // stop changing avatar once spin ends
  const segment = getRandomSegment();
  currentSegmentLabel.innerText = `You won ${segment.label}! Points: ${segment.points}`;
  
  // Update the final avatar from the selected segment
  updateCenterAvatar(segment);
}

// Function to animate the easing of the spin
function easeOut(t, b, c, d) {
  const ts = (t /= d) * t;
  const tc = ts * t;
  return b + c * (tc + -3 * ts + 3 * t);
}

// Function to update current position based on wheel angle
function updateCurrentSegment() {
  const currentIndex = Math.floor(((startAngle % (2 * Math.PI)) + 2 * Math.PI) / arc) % segments.length;
  const segment = segments[currentIndex];
  currentPositionLabel.innerText = `Current Position: ${segment.label}`;
}

// Function to update the center avatar and name
function updateCenterAvatar(segment) {
  const randomIndex = Math.floor(Math.random() * segment.avatars.length);
  avatarCenter.querySelector('i').className = segment.avatars[randomIndex];
  avatarNameElem.innerText = segment.names[randomIndex];
}

// Initial draw of the wheel
drawWheel();

// Event listener for the spin button
spinButton.addEventListener('click', spin);