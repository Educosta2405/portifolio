// Nav scroll shadow
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
});

// Mobile menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// Skill bars — animate when visible
const fills = document.querySelectorAll('.skill-item__fill');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animationPlayState = 'running';
    }
  });
}, { threshold: 0.2 });
fills.forEach(el => {
  el.style.animationPlayState = 'paused';
  observer.observe(el);
});

// Contact form
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const feedback = document.getElementById('formFeedback');
  feedback.textContent = 'Mensagem enviada! Entrarei em contato em breve.';
  feedback.className = 'form__feedback success';
  this.reset();
  setTimeout(() => { feedback.textContent = ''; feedback.className = 'form__feedback'; }, 5000);
});

// Fade-in sections on scroll
const sections = document.querySelectorAll('.section');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.08 });
sections.forEach(s => {
  s.style.opacity = '0';
  s.style.transform = 'translateY(32px)';
  s.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  sectionObserver.observe(s);
});
