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
