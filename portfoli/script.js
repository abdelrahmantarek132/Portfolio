/* ============ THEME (in-memory only — no storage APIs) ============ */
(function(){
  const root = document.documentElement;
  const btn = document.getElementById('themeBtn');
  let theme = 'dark';
  function apply(){
    root.setAttribute('data-theme', theme);
    btn.textContent = theme === 'dark' ? '☾' : '☀';
  }
  apply();
  btn.addEventListener('click', ()=>{
    theme = theme === 'dark' ? 'light' : 'dark';
    apply();
  });
})();

/* ============ MOBILE MENU ============ */
(function(){
  const menu = document.getElementById('mobileMenu');
  document.getElementById('burgerBtn').addEventListener('click', ()=> menu.classList.add('open'));
  document.getElementById('closeMenu').addEventListener('click', ()=> menu.classList.remove('open'));
  menu.querySelectorAll('a').forEach(a=> a.addEventListener('click', ()=> menu.classList.remove('open')));
})();

/* ============ SCROLL PROGRESS + NAV ACTIVE STATE ============ */
(function(){
  const bar = document.getElementById('progress');
  const navLinks = document.querySelectorAll('[data-nav]');
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', ()=>{
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    bar.style.width = scrolled + '%';
  }, {passive:true});

  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const id = e.target.getAttribute('id');
        navLinks.forEach(l=>{
          l.classList.toggle('active', l.getAttribute('href') === '#'+id);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s=>obs.observe(s));
})();

/* ============ CUSTOM CURSOR ============ */
(function(){
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (window.matchMedia('(pointer: coarse)').matches) return;
  let mx=0,my=0, rx=0, ry=0;
  window.addEventListener('mousemove', (e)=>{
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
  });
  function loop(){
    rx += (mx-rx)*0.16; ry += (my-ry)*0.16;
    ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  }
  loop();
  document.querySelectorAll('a, button, .icon-card, .project-mini').forEach(el=>{
    el.addEventListener('mouseenter', ()=> ring.classList.add(el.hasAttribute('data-cursor') ? 'link' : 'hover'));
    el.addEventListener('mouseleave', ()=> ring.classList.remove('link','hover'));
  });
})();

/* ============ REVEAL ON SCROLL ============ */
(function(){
  const els = document.querySelectorAll('.reveal');
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('in'); obs.unobserve(e.target); }
    });
  }, { threshold:.15 });
  els.forEach(el=>obs.observe(el));

  // hero headline stagger
  document.querySelectorAll('.hero h1 .line span').forEach((s,i)=>{
    s.style.transition = `transform .9s cubic-bezier(.16,1,.3,1) ${0.15 + i*0.12}s`;
    requestAnimationFrame(()=> requestAnimationFrame(()=>{ s.style.transform='translateY(0)'; }));
  });
})();

/* ============ EDUCATION TIMELINE PROGRESS ============ */
(function(){
  const tl = document.getElementById('eduTimeline');
  const progress = document.getElementById('eduProgress');
  const items = document.querySelectorAll('.t-item');
  window.addEventListener('scroll', ()=>{
    if(!tl) return;
    const rect = tl.getBoundingClientRect();
    const vh = window.innerHeight;
    let pct = (vh*0.75 - rect.top) / rect.height * 100;
    pct = Math.max(0, Math.min(100, pct));
    progress.style.height = pct + '%';
    items.forEach(it=>{
      const r = it.getBoundingClientRect();
      if(r.top < vh*0.75) it.classList.add('in');
    });
  }, {passive:true});
})();

/* ============ SKILL TABS ============ */
(function(){
  const tabs = document.querySelectorAll('.skill-tab');
  const panels = document.querySelectorAll('.skill-panel');
  tabs.forEach(tab=>{
    tab.addEventListener('click', ()=>{
      tabs.forEach(t=>t.classList.remove('active'));
      panels.forEach(p=>p.classList.remove('active'));
      tab.classList.add('active');
      document.querySelector(`.skill-panel[data-panel="${tab.dataset.tab}"]`).classList.add('active');
    });
  });
})();

/* ============ ICON CARD SPOTLIGHT ============ */
(function(){
  document.querySelectorAll('.icon-card').forEach(card=>{
    card.addEventListener('mousemove', (e)=>{
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX-r.left)+'px');
      card.style.setProperty('--my', (e.clientY-r.top)+'px');
    });
  });
})();

/* ============ PROJECT CARD TILT ============ */
(function(){
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || window.matchMedia('(pointer: coarse)').matches) return;
  document.querySelectorAll('.project-mini, .project-feature').forEach(card=>{
    card.style.willChange = 'transform';
    card.style.transition = 'transform .35s cubic-bezier(.16,1,.3,1)';
    card.addEventListener('mousemove', (e)=>{
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(800px) rotateX(${(-py*5).toFixed(2)}deg) rotateY(${(px*6).toFixed(2)}deg) translateY(-3px)`;
    });
    card.addEventListener('mouseleave', ()=>{ card.style.transform = ''; });
  });
})();

/* ============ MAGNETIC BUTTONS ============ */
(function(){
  document.querySelectorAll('.btn').forEach(btn=>{
    btn.addEventListener('mousemove', (e)=>{
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width/2;
      const y = e.clientY - r.top - r.height/2;
      btn.style.transform = `translate(${x*0.22}px, ${y*0.35}px)`;
    });
    btn.addEventListener('mouseleave', ()=>{ btn.style.transform = 'translate(0,0)'; });
  });
})();

/* ============ PROJECT VISUAL — generative canvas pattern ============ */
(function(){
  const canvas = document.querySelector('#visual-0 canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let w,h;
  function resize(){
    w = canvas.parentElement.clientWidth; h = canvas.parentElement.clientHeight;
    canvas.width = w * devicePixelRatio; canvas.height = h * devicePixelRatio;
    ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  }
  resize();
  window.addEventListener('resize', resize);
  const styles = getComputedStyle(document.documentElement);
  let t = 0;
  function draw(){
    t += 0.004;
    ctx.clearRect(0,0,w,h);
    ctx.strokeStyle = 'rgba(231,161,61,0.16)';
    ctx.lineWidth = 1;
    const gap = 28;
    for(let x=-gap; x<w+gap; x+=gap){
      ctx.beginPath();
      for(let y=0;y<=h;y+=6){
        const off = Math.sin((y*0.02)+(x*0.04)+t*6) * 10;
        ctx.lineTo(x+off, y);
      }
      ctx.stroke();
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ============ BACKGROUND PARTICLE FIELD ============ */
(function(){
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let w,h, particles=[];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function resize(){
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  const count = window.innerWidth < 720 ? 28 : 60;
  for(let i=0;i<count;i++){
    particles.push({
      x: Math.random()*w, y: Math.random()*h,
      vx: (Math.random()-0.5)*0.15, vy: (Math.random()-0.5)*0.15,
      r: Math.random()*1.4+0.4
    });
  }
  function draw(){
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle = 'rgba(231,161,61,0.5)';
    particles.forEach(p=>{
      p.x += p.vx; p.y += p.vy;
      if(p.x<0) p.x=w; if(p.x>w) p.x=0;
      if(p.y<0) p.y=h; if(p.y>h) p.y=0;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fill();
    });
    if(!reduced) requestAnimationFrame(draw);
  }
  draw();
})();



(function(){
  const intro = document.getElementById('intro-screen');
  if(!intro) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // lock scroll on the underlying portfolio while intro is shown
  const htmlEl = document.documentElement;
  const prevHtmlOverflow = htmlEl.style.overflow;
  const prevBodyOverflow = document.body.style.overflow;
  htmlEl.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';

  const terminalEl   = document.getElementById('introTerminal');
  const typeLineEl   = document.getElementById('introTypeLine');
  const nameEl       = document.getElementById('introName');
  const subtitleEl   = document.getElementById('introSubtitle');
  const btnEl        = document.getElementById('introEnterBtn');
  const bgLayerEl    = intro.querySelector('.intro-bg-layer');
  const codesEl      = intro.querySelector('.intro-codes');

  const lines = [
    '> Initializing system...',
    '> Loading portfolio assets...',
    '> Welcome, Abdelrahman.'
  ];

  function typeLines(onDone){
    if(reduced){
      typeLineEl.textContent = lines[lines.length-1];
      onDone();
      return;
    }
    let li = 0, ci = 0;
    const caret = document.createElement('span');
    caret.className = 'intro-caret';
    caret.textContent = '_';

    function typeChar(){
      const current = lines[li];
      typeLineEl.textContent = current.slice(0, ci) + '';
      typeLineEl.appendChild(caret);
      if(ci < current.length){
        ci++;
        setTimeout(typeChar, 26 + Math.random()*22);
      } else {
        if(li < lines.length - 1){
          setTimeout(()=>{
            li++; ci = 0;
            typeLineEl.textContent = '';
            typeChar();
          }, 420);
        } else {
          setTimeout(onDone, 380);
        }
      }
    }
    typeChar();
  }

  function reveal(el, delay){
    if(!el) return;
    setTimeout(()=> el.classList.add('is-in'), reduced ? 0 : delay);
  }

  // cinematic build-up sequence
  requestAnimationFrame(()=>{
    intro.classList.add('is-active');           // 1. dark screen present (base state)
    reveal(bgLayerEl, 150);                      // 2. background elements slowly appear
    reveal(codesEl, 150);
    setTimeout(()=>{
      reveal(terminalEl, 0);                     // 3. terminal appears
      terminalEl.classList.add('is-in');
      setTimeout(()=>{
        typeLines(()=>{                          // 4. typing animation
          reveal(nameEl, 120);                   // 5. name reveals
          reveal(subtitleEl, 420);               // 6. subtitle appears
          reveal(btnEl, 720);                    // 7. CTA button appears
          if(btnEl){
            setTimeout(()=> btnEl.disabled = false, reduced ? 0 : 720);
          }
          // auto-advance into the portfolio once the sequence has fully played —
          // no click required. Clicking/pressing the button still skips ahead instantly.
          setTimeout(enterPortfolio, reduced ? 350 : 2400);
        });
      }, reduced ? 0 : 500);
    }, reduced ? 0 : 650);
  });

  function enterPortfolio(){
    if(intro.classList.contains('is-leaving')) return;
    intro.classList.add('is-leaving');           // 8. cinematic exit transition
    const finish = () => {
      intro.classList.add('is-gone');            // 9. intro disappears
      intro.setAttribute('aria-hidden', 'true');
      intro.style.display = 'none';
      htmlEl.style.overflow = prevHtmlOverflow;  // 10. existing portfolio behaves exactly as before
      document.body.style.overflow = prevBodyOverflow;
      const hero = document.getElementById('hero');
      if(hero){ hero.setAttribute('tabindex','-1'); hero.focus({preventScroll:true}); hero.removeAttribute('tabindex'); }
    };
    intro.addEventListener('transitionend', function handler(e){
      if(e.target !== intro) return;
      intro.removeEventListener('transitionend', handler);
      finish();
    });
    // safety fallback in case transitionend doesn't fire
    setTimeout(finish, reduced ? 50 : 1100);
  }

  if(btnEl){
    btnEl.addEventListener('click', enterPortfolio);
    btnEl.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); enterPortfolio(); }
    });
  }

  // allow Escape or Enter key anywhere to skip the intro
  document.addEventListener('keydown', function skipKey(e){
    if(intro.classList.contains('is-gone')) { document.removeEventListener('keydown', skipKey); return; }
    if(e.key === 'Escape'){ enterPortfolio(); }
  });

  /* ---- minimal drifting particle field, independent canvas ---- */
  if(!reduced){
    const canvas = document.getElementById('intro-particle-canvas');
    if(canvas){
      const ctx = canvas.getContext('2d');
      let w,h, dots=[];
      function size(){
        w = canvas.width = canvas.offsetWidth * devicePixelRatio;
        h = canvas.height = canvas.offsetHeight * devicePixelRatio;
      }
      size();
      window.addEventListener('resize', size);
      const n = window.innerWidth < 720 ? 22 : 42;
      for(let i=0;i<n;i++){
        dots.push({
          x: Math.random()*w, y: Math.random()*h,
          vy: -(Math.random()*0.12 + 0.03) * devicePixelRatio,
          r: (Math.random()*1.3 + 0.4) * devicePixelRatio,
          a: Math.random()*0.5 + 0.15
        });
      }
      let raf;
      function draw(){
        ctx.clearRect(0,0,w,h);
        dots.forEach(p=>{
          p.y += p.vy;
          if(p.y < -4) { p.y = h + 4; p.x = Math.random()*w; }
          ctx.beginPath();
          ctx.fillStyle = `rgba(231,225,208,${p.a})`;
          ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
          ctx.fill();
        });
        if(!intro.classList.contains('is-gone')){
          raf = requestAnimationFrame(draw);
        }
      }
      draw();
    }
  }
})();