/* =============================================
   BIRTHDAY PAGE — script.js
============================================= */

/* ---------- ENVELOPE / INTRO ---------- */
const openBtn      = document.getElementById('open-btn');
const envelope     = document.getElementById('envelope');
const introScreen  = document.getElementById('intro-screen');
const mainPage     = document.getElementById('main-page');
const confettiWrap = document.getElementById('confetti-container');
const bgMusic      = document.getElementById('bg-music');
const soundBtn     = document.getElementById('sound-toggle');

let musicOn = false;

openBtn.addEventListener('click', startExperience);

function startExperience() {
  // 1. Animate envelope
  envelope.classList.add('opening');

  // 2. Confetti
  setTimeout(launchConfetti, 300);

  // 3. Music (must be triggered by user gesture)
  bgMusic.volume = 0.55;
  bgMusic.play().then(() => {
    musicOn = true;
    soundBtn.textContent = '🔊';
  }).catch(() => {
    musicOn = false;
    soundBtn.textContent = '🔇';
  });

  // 4. Fade out intro, fade in main
  setTimeout(() => {
    introScreen.classList.add('hide');
    mainPage.style.display = 'block';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        mainPage.classList.add('visible');
      });
    });
    initIntersectionObservers();
    updateDayCounter();
  }, 1100);
}

/* ---------- CONFETTI ---------- */
const CONFETTI_COLORS = ['#FFD966','#F4A7B9','#E8637A','#fff5a5','#ff9eaf','#ffd6e7','#ffe484'];

function launchConfetti() {
  for (let i = 0; i < 90; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.cssText = `
      left: ${Math.random() * 100}%;
      background: ${CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]};
      width: ${6 + Math.random() * 10}px;
      height: ${6 + Math.random() * 10}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      animation-delay: ${Math.random() * 0.8}s;
      animation-duration: ${1.4 + Math.random() * 1.2}s;
    `;
    confettiWrap.appendChild(piece);
  }
  setTimeout(() => { confettiWrap.innerHTML = ''; }, 3500);
}

/* ---------- SOUND TOGGLE ---------- */
soundBtn.addEventListener('click', () => {
  if (musicOn) {
    bgMusic.pause();
    musicOn = false;
    soundBtn.textContent = '🔇';
  } else {
    bgMusic.play().catch(() => {});
    musicOn = true;
    soundBtn.textContent = '🔊';
  }
});

/* ---------- INTERSECTION OBSERVERS ---------- */
function initIntersectionObservers() {
  // fade-up elements
  const fadeEls = document.querySelectorAll('.fade-up');
  const fadeObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        fadeObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  fadeEls.forEach(el => fadeObs.observe(el));

  // typewriter trigger
  const msgSection = document.getElementById('message-section');
  const msgObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      startTypewriter();
      msgObs.disconnect();
    }
  }, { threshold: 0.2 });
  msgObs.observe(msgSection);
}

/* ---------- TYPEWRITER ---------- */
const MESSAGE = `Hola amor,

Dime lo que quieras pero llevo esperando este día con mucha emoción jajaja, creeme que desde que llegaste a mi vida, tomaste muchísima más relevancia de la que creí que podía tomar una persona a estas alturas de mi vida, pero me gusta como no te imaginas

El panorama de lo que tenemos es muy bonito, parace que cuento los días en que lleguemos a todas las promesas y deseos de lo que ambos hemos hablado. También prometo disfrutar mucho todos los días a tu lado, porque hasta en lo que pudiera parecer simple, yo encuentro felicidad cuando se trata de ti.

Amor de mi vida, espero que este cumpleaños a tu lado sea el primero de muchos, te deseo mucha salud, mucha felicidad, mucho éxito, estar rodeada de excelentes personas como lo eres, y que te lo bueno del mundo recaiga sobre ti.

Espero seguir viéndote crecer agarrados de la mano. Te amo mucho Alexia de mi corazón ❤️`;

function startTypewriter() {
  const el = document.getElementById('typewriter-text');
  el.innerHTML = '';

  // cursor
  const cursor = document.createElement('span');
  cursor.className = 'typewriter-cursor';
  el.appendChild(cursor);

  let i = 0;
  const speed = 28; // ms per char

  function type() {
    if (i < MESSAGE.length) {
      const char = MESSAGE[i];
      const textNode = document.createTextNode(char);
      el.insertBefore(textNode, cursor);
      i++;
      setTimeout(type, char === '\n' ? speed * 3 : speed);
    } else {
      // remove blinking cursor after done
      setTimeout(() => cursor.remove(), 2000);
    }
  }
  type();
}

/* ---------- LIGHTBOX ---------- */
const lightbox    = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

function openLightbox(src) {
  lightboxImg.src = src;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  lightboxImg.src = '';
}
// close on ESC
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

/* ---------- DAY COUNTER ---------- */
function updateDayCounter() {
  const start = new Date('2025-03-07T00:00:00');
  const now   = new Date();
  const diff  = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  const el    = document.getElementById('day-counter');
  if (el) {
    // Animated count-up
    let count = 0;
    const step = Math.ceil(diff / 60);
    const timer = setInterval(() => {
      count = Math.min(count + step, diff);
      el.textContent = count.toLocaleString();
      if (count >= diff) clearInterval(timer);
    }, 20);
  }
}

/* ---------- MINI GAME ---------- */
const PHRASES = [
  'Rata', 'De balls', 'Ratita', 'Te amo',
  'Me encantas', 'Alesiaaaaaa', 'HBD', 'De buebos'
];

const gameArea      = document.getElementById('game-area');
const gameScore     = document.getElementById('game-score');
const startBtn      = document.getElementById('start-game-btn');
const gameWin       = document.getElementById('game-win');
const finalHearts   = document.getElementById('final-hearts');

const TARGET  = 10;
let score     = 0;
let gameActive = false;
let spawnInterval = null;

startBtn.addEventListener('click', startGame);

function startGame() {
  startBtn.style.display = 'none';
  gameScore.style.display = 'block';
  score = 0;
  gameActive = true;
  updateScore();

  // clear old hearts
  gameArea.querySelectorAll('.falling-heart').forEach(h => h.remove());

  spawnInterval = setInterval(spawnHeart, 900);
  // initial burst
  spawnHeart(); spawnHeart();
}

function spawnHeart() {
  if (!gameActive) return;

  const heart = document.createElement('div');
  heart.className = 'falling-heart';
  heart.textContent = '❤️';

  const areaW = gameArea.offsetWidth;
  const left  = 20 + Math.random() * (areaW - 60);
  const dur   = 2.8 + Math.random() * 2;

  heart.style.cssText = `left:${left}px; top:-40px; animation-duration:${dur}s;`;
  gameArea.appendChild(heart);

  heart.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!gameActive) return;
    score++;
    updateScore();
    showPhrase(heart);
    heart.remove();
    if (score >= TARGET) winGame();
  });
  heart.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (!gameActive) return;
    score++;
    updateScore();
    showPhrase(heart);
    heart.remove();
    if (score >= TARGET) winGame();
  }, { passive: false });

  // auto-remove after animation
  setTimeout(() => { if (heart.parentNode) heart.remove(); }, dur * 1000 + 200);
}

function showPhrase(heartEl) {
  const phrase = PHRASES[Math.floor(Math.random() * PHRASES.length)];
  const tag = document.createElement('div');
  tag.className = 'heart-phrase';
  tag.textContent = phrase;
  tag.style.left = heartEl.style.left;
  tag.style.top  = parseInt(heartEl.style.top || 0) + 'px';
  gameArea.appendChild(tag);
  setTimeout(() => tag.remove(), 1300);
}

function updateScore() {
  gameScore.textContent = `${score} / ${TARGET}`;
}

function winGame() {
  gameActive = false;
  clearInterval(spawnInterval);
  gameArea.querySelectorAll('.falling-heart').forEach(h => h.remove());

  gameWin.classList.remove('hidden');
  gameWin.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // final floating hearts
  for (let i = 0; i < 18; i++) {
    setTimeout(() => {
      const fh = document.createElement('span');
      fh.className = 'float-heart';
      fh.textContent = Math.random() > 0.5 ? '❤️' : '🩷';
      fh.style.left = 5 + Math.random() * 90 + '%';
      fh.style.animationDelay = Math.random() * 1.5 + 's';
      fh.style.fontSize = (1.2 + Math.random() * 1.4) + 'rem';
      finalHearts.appendChild(fh);
    }, i * 160);
  }
  setTimeout(() => { finalHearts.innerHTML = ''; }, 7000);
}

/* ---------- HIDE main page initially ---------- */
mainPage.style.display = 'none';
