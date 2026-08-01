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

document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = `${(index % 3) * 70}ms`;
  observer.observe(element);
});

const landing = document.getElementById('landing');
const openInvitation = document.getElementById('openInvitation');
const petals = document.getElementById('petals');
const music = document.getElementById('backgroundMusic');
const musicToggle = document.getElementById('musicToggle');
const guestActions = document.getElementById('guestActions');
const shareInvitation = document.getElementById('shareInvitation');
const invitationTrigger = document.getElementById('invitationTrigger');
const invitationViewer = document.getElementById('invitationViewer');
const closeInvitation = document.getElementById('closeInvitation');
const viewerCanvas = document.getElementById('viewerCanvas');
const viewerImage = document.getElementById('viewerImage');
let musicAvailable = false;
let viewerHistoryActive = false;
let lastViewerTap = 0;

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
  openInvitation.disabled = true;
  landing.classList.add('is-opening');

  if (musicAvailable) {
    musicToggle.hidden = false;
    music.play().catch(() => syncMusicButton());
  }

  window.setTimeout(() => {
    landing.classList.add('is-leaving');
    landing.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('landing-open');
    document.body.classList.add('actions-visible');
    guestActions.hidden = false;
    window.requestAnimationFrame(() => guestActions.classList.add('is-visible'));
    document.querySelector('.monogram').focus({ preventScroll: true });
  }, 1050);

  window.setTimeout(() => landing.remove(), 1900);
}, { once: true });

musicToggle.addEventListener('click', () => {
  if (music.paused) {
    music.play().catch(() => syncMusicButton());
  } else {
    music.pause();
  }
});

const shareData = {
  title: 'Dileep Kumar & Srinithya — Engagement',
  text: 'Two hearts, one beautiful beginning. Join us on 15 August 2026 at Green Treat, Kothapet. #Dil se Sri',
  url: 'https://mdileepkumar438.github.io/dil-se-sri/'
};

shareInvitation.addEventListener('click', async () => {
  if (navigator.share) {
    try {
      await navigator.share(shareData);
      return;
    } catch (error) {
      if (error.name === 'AbortError') return;
    }
  }

  const message = encodeURIComponent(`${shareData.text}\n${shareData.url}`);
  window.open(`https://wa.me/?text=${message}`, '_blank', 'noopener,noreferrer');
});

function setViewerZoom(zoomed) {
  viewerCanvas.classList.toggle('is-zoomed', zoomed);
  if (!zoomed) {
    viewerCanvas.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }
}

function closeViewer(fromHistory = false) {
  if (!invitationViewer.open) return;
  invitationViewer.close();
  setViewerZoom(false);
  if (viewerHistoryActive && !fromHistory) history.back();
  viewerHistoryActive = false;
}

invitationTrigger.addEventListener('click', () => {
  if (!viewerImage.src) viewerImage.src = viewerImage.dataset.src;
  invitationViewer.showModal();
  history.pushState({ invitationViewer: true }, '');
  viewerHistoryActive = true;
});

closeInvitation.addEventListener('click', () => closeViewer());
invitationViewer.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeViewer();
});
window.addEventListener('popstate', () => {
  if (invitationViewer.open) closeViewer(true);
});

viewerCanvas.addEventListener('dblclick', () => {
  if (Date.now() - lastViewerTap > 500) {
    setViewerZoom(!viewerCanvas.classList.contains('is-zoomed'));
  }
});
viewerCanvas.addEventListener('touchend', (event) => {
  if (event.changedTouches.length !== 1) return;
  const now = Date.now();
  if (now - lastViewerTap < 300) {
    setViewerZoom(!viewerCanvas.classList.contains('is-zoomed'));
    lastViewerTap = now;
  } else {
    lastViewerTap = now;
  }
}, { passive: true });

window.requestAnimationFrame(() => openInvitation.focus({ preventScroll: true }));
