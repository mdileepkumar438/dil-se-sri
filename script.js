const target = new Date('2026-08-15T10:33:00+05:30').getTime();
const fields = {
  days: document.getElementById('cd-days'),
  hours: document.getElementById('cd-hours'),
  minutes: document.getElementById('cd-minutes'),
  seconds: document.getElementById('cd-seconds')
};

function updateCountdown() {
  const remaining = Math.max(0, target - Date.now());
  const values = {
    days: Math.floor(remaining / 86400000),
    hours: Math.floor(remaining / 3600000) % 24,
    minutes: Math.floor(remaining / 60000) % 60,
    seconds: Math.floor(remaining / 1000) % 60
  };

  Object.entries(values).forEach(([key, value]) => {
    fields[key].textContent = String(value).padStart(2, '0');
  });

  if (remaining === 0) clearInterval(timer);
}

const timer = setInterval(updateCountdown, 1000);
updateCountdown();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const landing = document.getElementById('landing');
const openInvitation = document.getElementById('openInvitation');
const petals = document.getElementById('petals');
const music = document.getElementById('backgroundMusic');
const musicToggle = document.getElementById('musicToggle');
let musicAvailable = false;

document.body.classList.add('landing-open');

for (let index = 0; index < 16; index += 1) {
  const petal = document.createElement('span');
  petal.className = 'petal';
  petal.style.left = `${5 + Math.random() * 90}%`;
  petal.style.setProperty('--fall-duration', `${8 + Math.random() * 7}s`);
  petal.style.setProperty('--fall-delay', `${-Math.random() * 12}s`);
  petal.style.setProperty('--petal-rotation', `${Math.random() * 180}deg`);
  petal.style.scale = `${0.55 + Math.random() * 0.75}`;
  petals.appendChild(petal);
}

function syncMusicButton() {
  const playing = !music.paused;
  musicToggle.classList.toggle('is-playing', playing);
  musicToggle.setAttribute('aria-pressed', String(playing));
  musicToggle.setAttribute('aria-label', playing ? 'Pause background music' : 'Play background music');
}

music.volume = 0.32;
music.addEventListener('canplay', () => {
  musicAvailable = true;
});
music.addEventListener('play', syncMusicButton);
music.addEventListener('pause', syncMusicButton);
music.addEventListener('error', () => {
  musicAvailable = false;
  musicToggle.hidden = true;
});
music.load();

openInvitation.addEventListener('click', () => {
  landing.classList.add('is-opening');

  if (musicAvailable) {
    musicToggle.hidden = false;
    music.play().catch(() => syncMusicButton());
  }

  window.setTimeout(() => {
    landing.classList.add('is-leaving');
    landing.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('landing-open');
    document.querySelector('.monogram').focus({ preventScroll: true });
  }, 1050);

  window.setTimeout(() => landing.remove(), 1900);
});

musicToggle.addEventListener('click', () => {
  if (music.paused) {
    music.play().catch(() => syncMusicButton());
  } else {
    music.pause();
  }
});

window.requestAnimationFrame(() => openInvitation.focus({ preventScroll: true }));
