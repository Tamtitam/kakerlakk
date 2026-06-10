const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// --- Assets ---
const playerImg = new Image();
playerImg.src = 'images/cockroach.png';

const foodImgs = [ 'images/food1.png', 'images/food2.png', 'images/food3.png' ];

// Bakgrunner nivå 1..10 med preloading
const bgImgs = [];
let assetsReady = false;
let gameStarted = false;

function preloadBackgrounds() {
  const total = 10; let loaded = 0;
  for (let i = 1; i <= total; i++) {
    const img = new Image();
    img.onload = () => { loaded++; if (loaded === total) { assetsReady = true; startGame(); } };
    img.onerror = () => { console.error(`Kunne ikke laste images/bg${i}.png`); };
    img.src = `images/bg${i}.png`;
    bgImgs.push(img);
  }
}
preloadBackgrounds();

// Lyd
const shootSound = document.getElementById('shootSound');
const hitSound   = document.getElementById('hitSound');
const msg = document.getElementById('msg');
function safePlay(el) {
  if (!el) return; try { el.currentTime = 0; } catch {}
  const p = el.play(); if (p && typeof p.catch === 'function') { p.catch(()=>{}); }
}
let audioUnlocked = false;
document.addEventListener('keydown', () => {
  if (!audioUnlocked) {
    [shootSound, hitSound].forEach(el => { if (el) { el.muted = false; el.volume = 0.8; } });
    audioUnlocked = true; if (msg) msg.textContent = '';
    // Focus the canvas so keyboard users can immediately control the game
    if (canvas && typeof canvas.focus === 'function') try { canvas.focus(); } catch (e) {}
  }
});

// --- Game state ---
const player = { x: WIDTH/2 - 25, y: HEIGHT - 80, width: 50, height: 50, speed: 7, shooting: false };
let bullets = []; const bulletSpeed = 10;
let foods = []; const foodSizes = [40, 50, 60];
let score = 0; let keys = {}; let gameOver = false;

// --- Nivåsystem ---
let level = 1; const maxLevel = 10; const levelUpIntervalSec = 20;
function speedForLevel(lvl){ const minSpeed=0.4, maxSpeed=5.0; if(lvl<=1)return minSpeed; if(lvl>=maxLevel)return maxSpeed; const t=(lvl-1)/(maxLevel-1); return minSpeed + t*(maxSpeed-minSpeed);} 
let foodSpeed = speedForLevel(level);
function spawnRateForLevel(lvl){ const maxRate=140, minRate=40; if(lvl<=1)return maxRate; if(lvl>=maxLevel)return minRate; const t=(lvl-1)/(maxLevel-1); return Math.round(maxRate - t*(maxRate-minRate)); }
let currentSpawnRate = spawnRateForLevel(level);
let startTimestamp = performance.now(); let nextLevelTimestamp = startTimestamp + levelUpIntervalSec*1000;

// Input
document.addEventListener('keydown', e => { keys[e.key] = true; if (gameOver && (e.key==='Enter' || e.key==='Return')) restartGame(); });
document.addEventListener('keyup',   e => { keys[e.key] = false; });

// Start game once (guard)
function startGame(){ if (gameStarted) return; gameStarted = true; requestAnimationFrame(gameLoop); }

// Tegn
function drawBackground(){ const idx = Math.min(level-1, bgImgs.length-1); const bg = bgImgs[idx]; if (bg && bg.complete) { ctx.drawImage(bg, 0, 0, WIDTH, HEIGHT); } else { ctx.fillStyle = '#eaeaea'; ctx.fillRect(0, 0, WIDTH, HEIGHT); } }
function drawPlayer(){ ctx.drawImage(playerImg, player.x, player.y, player.width, player.height); }
function drawBullets(){ ctx.fillStyle = '#000'; bullets.forEach(b => ctx.fillRect(b.x, b.y, 5, 10)); }
function drawFoods(){ foods.forEach(f => ctx.drawImage(f.img, f.x, f.y, f.size, f.size)); }
function drawHUD(){ ctx.fillStyle='#fff'; ctx.font='24px Arial'; ctx.textAlign='left'; ctx.fillText(`Score: ${score}`, 10, 30); ctx.textAlign='right'; ctx.fillStyle='#fff'; ctx.fillText(`Level: ${level}`, WIDTH-10, 30); }
function drawGameOver(){ ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.fillRect(0,0,WIDTH,HEIGHT); ctx.fillStyle='#fff'; ctx.textAlign='center'; ctx.font='bold 72px Arial'; ctx.fillText('GAME OVER', WIDTH/2, HEIGHT/2-20); ctx.font='28px Arial'; ctx.fillText(`Score: ${score}`, WIDTH/2, HEIGHT/2+20); ctx.font='20px Arial'; ctx.fillText('Trykk ENTER for å starte på nytt', WIDTH/2, HEIGHT/2+60); }

// Hjelpere
function rectIntersect(ax,ay,aw,ah,bx,by,bw,bh){ return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by; }
function spawnFood(){ if (Math.random() < 1/currentSpawnRate){ const size = foodSizes[Math.floor(Math.random()*foodSizes.length)]; const img = new Image(); img.src = foodImgs[Math.floor(Math.random()*foodImgs.length)]; foods.push({ x: Math.random()*(WIDTH-size), y: -size, size, img }); } }
function restartGame(){ player.x = WIDTH/2 - player.width/2; player.y = HEIGHT - 80; bullets = []; foods = []; score = 0; gameOver = false; level = 1; foodSpeed = speedForLevel(level); currentSpawnRate = spawnRateForLevel(level); startTimestamp = performance.now(); nextLevelTimestamp = startTimestamp + levelUpIntervalSec*1000;
  // Focus the canvas after restarting the game
  if (canvas && typeof canvas.focus === 'function') try { canvas.focus(); } catch (e) {}
}
function updateLevel(now){ if (gameOver || level>=maxLevel) return; if (now >= nextLevelTimestamp){ level++; foodSpeed = speedForLevel(level); currentSpawnRate = spawnRateForLevel(level); nextLevelTimestamp = now + levelUpIntervalSec*1000; } }

// Logikk
function update(){ if (gameOver) return; const now = performance.now(); updateLevel(now);
  if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
  if (keys['ArrowRight'] && player.x < WIDTH - player.width) player.x += player.speed;
  if (keys[' '] || keys['Spacebar']) { if (!player.shooting){ bullets.push({ x: player.x + player.width/2 - 2, y: player.y }); safePlay(shootSound); player.shooting = true; } } else { player.shooting = false; }
  for (let i = bullets.length-1; i>=0; i--){ bullets[i].y -= bulletSpeed; if (bullets[i].y < -12) bullets.splice(i,1); }
  spawnFood();
  for (let i = foods.length-1; i>=0; i--){ const f=foods[i]; f.y += foodSpeed; if (f.y > HEIGHT + f.size) foods.splice(i,1); }
  for (let bi = bullets.length-1; bi>=0; bi--){ const b=bullets[bi]; for (let fi=foods.length-1; fi>=0; fi--){ const f=foods[fi]; if (b.x>=f.x && b.x<=f.x+f.size && b.y>=f.y && b.y<=f.y+f.size){ bullets.splice(bi,1); foods.splice(fi,1); safePlay(hitSound); score += f.size===40 ? 10 : (f.size===50 ? 5 : 2); break; } } }
  for (let i=0; i<foods.length; i++){ const f=foods[i]; if (rectIntersect(player.x,player.y,player.width,player.height, f.x,f.y,f.size,f.size)){ gameOver = true; break; } }
}

// Hovedløkke med korrekt rydding/tegnerekkefølge
function gameLoop(){
  // 1) Rydd hele lerretet
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  // 2) Tegn opak bakgrunn som dekker hele canvas
  drawBackground();
  // 3) Oppdater tilstand
  update();
  // 4) Tegn sprites og HUD
  drawPlayer();
  drawBullets();
  drawFoods();
  drawHUD();
  // 5) Overlay ved Game Over
  if (gameOver) drawGameOver();
  requestAnimationFrame(gameLoop);
}
