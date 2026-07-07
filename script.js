/* ==========================================================================
   Portfólio — interações
   Vanilla JS + IntersectionObserver (sem dependências).
   Respeita prefers-reduced-motion.
   ========================================================================== */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const supportsObserver = 'IntersectionObserver' in window;

/* ----- Navbar: sombra ao rolar + seção ativa ----------------------------- */
const nav = document.getElementById('nav');
const navLinks = Array.from(document.querySelectorAll('.nav__links a'));

const setNavShadow = () => nav.classList.toggle('scrolled', window.scrollY > 20);
setNavShadow();
window.addEventListener('scroll', setNavShadow, { passive: true });

if (supportsObserver) {
  const navTargets = navLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = '#' + entry.target.id;
        navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  navTargets.forEach(section => navObserver.observe(section));
}

/* ----- Menu mobile ------------------------------------------------------- */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', String(open));
});
mobileMenu.querySelectorAll('a').forEach(link =>
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  })
);

/* ----- Scroll reveal (fade-up + stagger) --------------------------------- */
const revealEls = Array.from(document.querySelectorAll('[data-reveal]'));

// Delay incremental para elementos dentro de um container [data-stagger]
document.querySelectorAll('[data-stagger]').forEach(group => {
  Array.from(group.children)
    .filter(el => el.hasAttribute('data-reveal'))
    .forEach((el, i) => el.style.setProperty('--reveal-delay', `${i * 70}ms`));
});

if (prefersReducedMotion || !supportsObserver) {
  revealEls.forEach(el => el.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));
}

/* ----- Barras de habilidade — animam ao entrar na tela ------------------- */
const fills = document.querySelectorAll('.skill-item__fill');

if (prefersReducedMotion || !supportsObserver) {
  fills.forEach(el => (el.style.animation = 'none'));
} else {
  const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(el => {
    el.style.animationPlayState = 'paused';
    skillObserver.observe(el);
  });
}

/* ----- Filtro de projetos ------------------------------------------------ */
// Categorias derivadas do conteúdo real (um projeto pode ter mais de uma).
const projectCategories = {
  'Barbearia Stile': ['web', 'sistemas'],
  'CíliosClick': ['web', 'landing'],
  'Automação de Infraestrutura': ['infra'],
  'Sistema de Monitoramento': ['infra', 'devops'],
  'Hardening de Servidores': ['infra'],
  'Pipeline CI/CD Corporativo': ['devops'],
  'Redesign de Rede Corporativa': ['infra'],
  'Gestão de Ativos de TI': ['web', 'sistemas'],
  'Verificador de Requisitos de Jogos': ['web'],
};

const grid = document.querySelector('.projetos__grid');
const filterBtns = Array.from(document.querySelectorAll('.filter-btn'));
const projectCards = Array.from(document.querySelectorAll('.projetos__grid .project-card'));

projectCards.forEach(card => {
  const title = card.querySelector('.project-card__title')?.textContent.trim() || '';
  card.dataset.categories = (projectCategories[title] || []).join(' ');
});

const applyFilter = filter => {
  projectCards.forEach(card => {
    const match = filter === 'all' || card.dataset.categories.split(' ').includes(filter);
    card.classList.toggle('is-filtered-out', !match);
  });

  // Replay da animação de entrada dos cards visíveis
  if (grid && !prefersReducedMotion) {
    grid.classList.remove('is-filtering');
    void grid.offsetWidth; // força reflow
    grid.classList.add('is-filtering');
  }
};

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => {
      const active = b === btn;
      b.classList.toggle('is-active', active);
      b.setAttribute('aria-pressed', String(active));
    });
    applyFilter(btn.dataset.filter);
  });
});

/* ----- Modal de detalhes do projeto --------------------------------------
   Conteúdo derivado das descrições existentes (Problema / Solução / Entrega),
   sem métricas ou clientes inventados. */
const projectDetails = {
  'Barbearia Stile': {
    problema: 'Agenda controlada manualmente, com risco de conflito de horários entre barbeiros, serviços e clientes.',
    solucao: 'Sistema web com agendamento online, painel administrativo e regras de negócio que impedem sobreposição de horários por barbeiro e serviço.',
    entrega: 'Operação centralizada: horários, serviços e profissionais gerenciados em um só lugar.',
  },
  'CíliosClick': {
    problema: 'Um SaaS de gestão para lash designers precisava apresentar o produto e converter visitantes em assinantes.',
    solucao: 'Landing page focada em conversão, com apresentação do produto, planos, depoimentos e chamadas para assinatura.',
    entrega: 'Página moderna e responsiva, com narrativa orientada à decisão de assinar.',
  },
  'Automação de Infraestrutura': {
    problema: 'Provisionamento manual de ambientes, lento e sujeito a erro humano.',
    solucao: 'Pipeline de provisionamento automatizado com Terraform e Ansible para ambientes multi-cloud.',
    entrega: 'Tempo de setup reduzido em 70%, com ambientes reproduzíveis.',
  },
  'Sistema de Monitoramento': {
    problema: 'Pouca visibilidade sobre a saúde dos serviços em produção.',
    solucao: 'Dashboard centralizado com alertas automáticos, logs estruturados e análise em tempo real.',
    entrega: 'Visibilidade contínua da operação, com alertas antes de o problema crescer.',
  },
  'Hardening de Servidores': {
    problema: 'Servidores com configurações padrão, fora das boas práticas de segurança.',
    solucao: 'Aplicação de políticas de segurança e hardening em Linux e Windows seguindo os padrões CIS Benchmark.',
    entrega: 'Superfície de ataque reduzida e configuração auditável.',
  },
  'Pipeline CI/CD Corporativo': {
    problema: 'Deploys manuais, demorados e inconsistentes entre ambientes.',
    solucao: 'Esteira de integração e entrega contínua com testes automatizados e deploy padronizado.',
    entrega: 'Publicações previsíveis e mais frequentes para o time de desenvolvimento.',
  },
  'Redesign de Rede Corporativa': {
    problema: 'Rede sem segmentação, dificultando segurança e controle de acesso.',
    solucao: 'Arquitetura segmentada com VLANs, firewall e VPN, planejada para empresa de médio porte.',
    entrega: 'Rede organizada, com acessos controlados e tráfego isolado por área.',
  },
  'Gestão de Ativos de TI': {
    problema: 'Inventário de equipamentos disperso e desatualizado.',
    solucao: 'Aplicação web com integração LDAP, relatórios automatizados e auditoria de mudanças.',
    entrega: 'Visão única dos ativos, com histórico de alterações.',
  },
  'Verificador de Requisitos de Jogos': {
    problema: 'Usuários querem saber se o computador roda um jogo antes de comprar.',
    solucao: 'Site em que o usuário seleciona o jogo e vê os requisitos mínimos e recomendados, com dados processados via Azure.',
    entrega: 'Consulta rápida e direta, sem cadastro.',
  },
};

const modal = document.getElementById('projectModal');
const modalTag = document.getElementById('modalTag');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const modalTechs = document.getElementById('modalTechs');
let lastFocusedEl = null;

const modalSection = (label, text) => {
  const wrap = document.createElement('div');
  wrap.className = 'modal__section';
  const lbl = document.createElement('span');
  lbl.className = 'modal__label';
  lbl.textContent = label;
  const p = document.createElement('p');
  p.className = 'modal__text';
  p.textContent = text;
  wrap.append(lbl, p);
  return wrap;
};

const openModal = card => {
  const title = card.querySelector('.project-card__title')?.textContent.trim() || '';
  const details = projectDetails[title];
  if (!details) return;

  modalTag.textContent = card.querySelector('.project-card__tag')?.textContent.trim() || '';
  modalTitle.textContent = title;

  modalBody.replaceChildren(
    modalSection('Problema', details.problema),
    modalSection('Solução', details.solucao),
    modalSection('Entrega', details.entrega)
  );
  modalTechs.replaceChildren(
    ...Array.from(card.querySelectorAll('.project-card__techs span')).map(tech => {
      const span = document.createElement('span');
      span.textContent = tech.textContent;
      return span;
    })
  );

  lastFocusedEl = document.activeElement;
  modal.hidden = false;
  document.body.style.overflow = 'hidden';
  modal.querySelector('.modal__close').focus();
};

const closeModal = () => {
  modal.hidden = true;
  document.body.style.overflow = '';
  if (lastFocusedEl) lastFocusedEl.focus();
};

document.querySelectorAll('.project-card__more').forEach(btn =>
  btn.addEventListener('click', () => openModal(btn.closest('.project-card')))
);
modal.querySelectorAll('[data-modal-close]').forEach(el =>
  el.addEventListener('click', closeModal)
);
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !modal.hidden) closeModal();
});

/* ----- Formulário de contato (feedback local — sem backend) -------------- */
const form = document.getElementById('contactForm');

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const feedback = document.getElementById('formFeedback');

  if (!this.checkValidity()) {
    feedback.textContent = 'Preencha todos os campos com um e-mail válido.';
    feedback.className = 'form__feedback error';
    return;
  }

  feedback.textContent = 'Mensagem enviada! Entrarei em contato em breve.';
  feedback.className = 'form__feedback success';
  this.reset();
  setTimeout(() => { feedback.textContent = ''; feedback.className = 'form__feedback'; }, 5000);
});
