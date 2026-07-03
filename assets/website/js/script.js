/* =========================================================================
   NovelX Tech School — script.js
   Vanilla JS. Bootstrap 5 JS (bundled separately via CDN) powers modals,
   carousel, and the navbar collapse. This file adds page-level behavior.
   ========================================================================= */

document.addEventListener('DOMContentLoaded', function () {
  "use strict";

  /* ---------------- Page Loader ---------------- */
  const loader = document.getElementById('pageLoader');
  window.addEventListener('load', function () {
    setTimeout(() => loader && loader.classList.add('loaded'), 350);
  });

  /* ---------------- AOS Init ---------------- */
  if (window.AOS) {
    AOS.init({
      duration: 1000,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80
    });
  }

  /* ---------------- Sticky / scrolled navbar ---------------- */
  const navbar = document.getElementById('mainNavbar');
  function handleNavbarScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  handleNavbarScroll();
  window.addEventListener('scroll', handleNavbarScroll);

  /* ---------------- Scrollspy active nav link ---------------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  function setActiveLink() {
    let current = '';
    const scrollPos = window.scrollY + 140;
    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
        current = sec.getAttribute('id');
      }
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', setActiveLink);
  setActiveLink();

  // Collapse mobile menu after clicking a nav link
  const navCollapse = document.getElementById('navMain');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navCollapse && navCollapse.classList.contains('show')) {
        bootstrap.Collapse.getOrCreateInstance(navCollapse).hide();
      }
    });
  });

  /* ---------------- Back to top ---------------- */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) backToTop.classList.add('show');
    else backToTop.classList.remove('show');
  });
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------------- Button ripple effect ---------------- */
  document.querySelectorAll('.btn-ripple').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple-el';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  /* ---------------- Animated counters ---------------- */
  const counters = document.querySelectorAll('.counter');
  let countersStarted = false;
  function animateCounters() {
    counters.forEach(el => {
      const target = parseInt(el.dataset.target, 10) || 0;
      const suffix = el.dataset.suffix || '';
      const duration = 1800;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(tick);
    });
  }
  const statsSection = document.querySelector('.stats-section');
  if (statsSection && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersStarted) {
          countersStarted = true;
          animateCounters();
          io.disconnect();
        }
      });
    }, { threshold: 0.4 });
    io.observe(statsSection);
  }

  const heroStatCounters = document.querySelectorAll('.hero-stat-card .num[data-target]');
  if (heroStatCounters.length) {
    heroStatCounters.forEach(el => {
      const target = parseInt(el.dataset.target, 10) || 0;
      const suffix = el.dataset.suffix || '';
      const start = performance.now();
      const duration = 1600;
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        el.textContent = Math.floor(progress * target) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(tick);
    });
  }

  /* ---------------- Enrollment: choice modal -> sub forms ---------------- */
  const enrollChoiceModalEl = document.getElementById('enrollChoiceModal');
  const consultationModalEl = document.getElementById('consultationModal');
  const enrollmentModalEl = document.getElementById('enrollmentModal');
  const enrollChoiceModal = enrollChoiceModalEl ? new bootstrap.Modal(enrollChoiceModalEl) : null;
  const consultationModal = consultationModalEl ? new bootstrap.Modal(consultationModalEl) : null;
  const enrollmentModal = enrollmentModalEl ? new bootstrap.Modal(enrollmentModalEl) : null;

  document.querySelectorAll('[data-open-choice]').forEach(trigger => {
    trigger.addEventListener('click', () => enrollChoiceModal && enrollChoiceModal.show());
  });

  const goConsultBtn = document.getElementById('choiceConsultationBtn');
  const goEnrollBtn = document.getElementById('choiceEnrollBtn');
  if (goConsultBtn) {
    goConsultBtn.addEventListener('click', () => {
      enrollChoiceModal.hide();
      setTimeout(() => consultationModal.show(), 350);
    });
  }
  if (goEnrollBtn) {
    goEnrollBtn.addEventListener('click', () => {
      enrollChoiceModal.hide();
      setTimeout(() => enrollmentModal.show(), 350);
    });
  }

  /* ---------------- Course card "Enroll" buttons feed the course field ---------------- */
  document.querySelectorAll('.js-course-enroll').forEach(btn => {
    btn.addEventListener('click', () => {
      const courseName = btn.dataset.course || '';
      const consultCourseField = document.getElementById('consultCourse');
      const enrollCourseField = document.getElementById('enrollCourse');
      if (consultCourseField) consultCourseField.value = courseName;
      if (enrollCourseField) enrollCourseField.value = courseName;
      enrollChoiceModal && enrollChoiceModal.show();
    });
  });

  /* ---------------- Generic form submit -> success toast-ish alert ---------------- */
  function handleFakeSubmit(formEl, successMsg, modalToClose) {
    if (!formEl) return;
    formEl.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!formEl.checkValidity()) {
        formEl.classList.add('was-validated');
        return;
      }
      formEl.reset();
      formEl.classList.remove('was-validated');
      if (modalToClose) modalToClose.hide();
      showToast(successMsg);
    });
  }
  handleFakeSubmit(document.getElementById('consultationForm'), 'Consultation request received! Our counselor will call you shortly.', consultationModal);
  handleFakeSubmit(document.getElementById('enrollmentForm'), 'Application submitted! Welcome to NovelX Tech School 🎉', enrollmentModal);
  handleFakeSubmit(document.getElementById('contactForm'), 'Message sent! We will get back to you within 24 hours.', null);

  function showToast(message) {
    const toastEl = document.getElementById('nxToast');
    if (!toastEl) { alert(message); return; }
    toastEl.querySelector('.toast-body').textContent = message;
    const toast = new bootstrap.Toast(toastEl, { delay: 4500 });
    toast.show();
  }

  /* ---------------- Star rating for review form ---------------- */
  const starRating = document.getElementById('starRating');
  const ratingInput = document.getElementById('reviewRatingValue');
  if (starRating) {
    const stars = starRating.querySelectorAll('i');
    stars.forEach(star => {
      star.addEventListener('click', () => {
        const val = parseInt(star.dataset.value, 10);
        ratingInput.value = val;
        stars.forEach(s => s.classList.toggle('active', parseInt(s.dataset.value, 10) <= val));
      });
      star.addEventListener('mouseenter', () => {
        const val = parseInt(star.dataset.value, 10);
        stars.forEach(s => s.classList.toggle('active', parseInt(s.dataset.value, 10) <= val));
      });
    });
    starRating.addEventListener('mouseleave', () => {
      const val = parseInt(ratingInput.value || '0', 10);
      stars.forEach(s => s.classList.toggle('active', parseInt(s.dataset.value, 10) <= val));
    });
  }

  /* ---------------- Dynamic review submission (no reload) ---------------- */
  const reviewForm = document.getElementById('reviewForm');
  const reviewsList = document.getElementById('reviewsList');

  const seedReviews = [
    { name: 'Priya Ramesh', course: 'UI/UX Design', rating: 5, text: 'The mentors genuinely care about your growth. My portfolio landed me a design internship within weeks of finishing.' },
    { name: 'Arun Kumar', course: 'Web Development', rating: 5, text: 'Laravel and React modules were taught with real client projects, not just theory. Best decision I made this year.' },
    { name: 'Divya S.', course: 'Flutter App Development', rating: 4, text: 'Loved the hands-on Firebase integration sessions. Placement team followed up consistently until I got hired.' }
  ];

  function renderReview({ name, course, rating, text }, animate) {
    const card = document.createElement('div');
    card.className = 'review-card col-12';
    card.style.opacity = animate ? '0' : '1';
    const starsHtml = Array.from({ length: 5 }, (_, i) =>
      `<i class="bi ${i < rating ? 'bi-star-fill' : 'bi-star'}"></i>`
    ).join('');
    card.innerHTML = `
      <div class="d-flex justify-content-between align-items-start">
        <div>
          <h6>${escapeHtml(name)}</h6>
          <span class="course-tag">${escapeHtml(course)}</span>
        </div>
        <div class="stars">${starsHtml}</div>
      </div>
      <p>${escapeHtml(text)}</p>
    `;
    reviewsList.prepend(card);
    if (animate) requestAnimationFrame(() => { card.style.transition = 'opacity .4s ease'; card.style.opacity = '1'; });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  if (reviewsList) {
    seedReviews.forEach(r => renderReview(r, false));
  }

  if (reviewForm) {
    reviewForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('reviewName').value.trim();
      const course = document.getElementById('reviewCourse').value;
      const rating = parseInt(ratingInput.value || '0', 10);
      const text = document.getElementById('reviewText').value.trim();

      if (!name || !course || !rating || !text) {
        reviewForm.classList.add('was-validated');
        return;
      }

      renderReview({ name, course, rating, text }, true);
      reviewForm.reset();
      reviewForm.classList.remove('was-validated');
      ratingInput.value = 0;
      starRating.querySelectorAll('i').forEach(s => s.classList.remove('active'));
      showToast('Thank you for your review!');
    });
  }

  /* ---------------- Current year in footer ---------------- */
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});


/* =========================================================================
   AI ASSISTANT WIDGET — UNCHANGED
   Copied verbatim from the previously built novelx-ai-assistant.html.
   Behavior, IDs and classes are untouched; only relocated into script.js.
   ========================================================================= */

(function(){
  "use strict";

  /* ---------------- state & elements ---------------- */
  const launcher = document.getElementById('nxLauncher');
  const chat = document.getElementById('nxChat');
  const body = document.getElementById('nxBody');
  const input = document.getElementById('nxInput');
  const sendBtn = document.getElementById('nxSend');
  const closeBtn = document.getElementById('nxCloseBtn');
  const minBtn = document.getElementById('nxMinBtn');
  const badge = document.getElementById('nxBadge');
  const chipsWrap = document.getElementById('nxChips');

  let isOpen = false;
  let isMinimized = false;
  let unread = 0;

  /* ---------------- helpers ---------------- */
  function now(){
    return new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  }

  function scrollToBottom(){
    body.scrollTop = body.scrollHeight;
  }

  function addMessage(sender, text){
    const row = document.createElement('div');
    row.className = 'nx-row ' + (sender === 'ai' ? 'ai' : 'user');

    const avatar = document.createElement('div');
    avatar.className = 'nx-msg-avatar';
    avatar.textContent = sender === 'ai' ? '🤖' : '🙂';

    const col = document.createElement('div');
    col.className = 'nx-bubble-col';

    const bubble = document.createElement('div');
    bubble.className = 'nx-bubble';
    bubble.textContent = text;

    const time = document.createElement('div');
    time.className = 'nx-time';
    time.textContent = now();

    col.appendChild(bubble);
    col.appendChild(time);
    row.appendChild(avatar);
    row.appendChild(col);
    body.appendChild(row);
    scrollToBottom();

    if(sender === 'ai' && (!isOpen || isMinimized)){
      unread++;
      badge.textContent = unread;
      badge.classList.remove('hide');
    }
  }

  function addOptions(options){
    const wrap = document.createElement('div');
    wrap.className = 'nx-options';
    options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'nx-opt-btn' + (opt.gold ? ' gold' : '');
      btn.textContent = opt.label;
      btn.style.animationDelay = (i * 0.06) + 's';
      btn.addEventListener('click', () => handleOptionClick(opt));
      wrap.appendChild(btn);
    });
    body.appendChild(wrap);
    scrollToBottom();
  }

  function showTyping(){
    const row = document.createElement('div');
    row.className = 'nx-row ai nx-typing-row';
    const avatar = document.createElement('div');
    avatar.className = 'nx-msg-avatar';
    avatar.textContent = '🤖';
    const typing = document.createElement('div');
    typing.className = 'nx-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    row.appendChild(avatar);
    row.appendChild(typing);
    body.appendChild(row);
    scrollToBottom();
    return row;
  }

  function botSay(text, delay){
    return new Promise(resolve => {
      const typingRow = showTyping();
      const wait = delay || (600 + Math.random() * 600);
      setTimeout(() => {
        typingRow.remove();
        addMessage('ai', text);
        resolve();
      }, wait);
    });
  }

  async function botSayMultiple(lines){
    for(const line of lines){
      await botSay(line);
    }
  }

  /* ---------------- open / close / minimize ---------------- */
  function openChat(){
    isOpen = true;
    isMinimized = false;
    chat.classList.remove('nx-minimized');
    chat.classList.add('nx-open');
    launcher.classList.add('open');
    unread = 0;
    badge.classList.add('hide');
    setTimeout(() => input.focus(), 300);
  }

  function closeChat(){
    isOpen = false;
    chat.classList.remove('nx-open');
    launcher.classList.remove('open');
  }

  function toggleMinimize(){
    isMinimized = !isMinimized;
    chat.classList.toggle('nx-minimized', isMinimized);
  }

  launcher.addEventListener('click', () => {
    if(isOpen && !isMinimized){ closeChat(); }
    else{ openChat(); }
  });
  closeBtn.addEventListener('click', closeChat);
  minBtn.addEventListener('click', toggleMinimize);

  /* ---------------- knowledge base ---------------- */
  const KB = [
    { keys:['duration','how long','months','weeks'], reply:"Our courses typically run 3–6 months depending on the track — UI/UX and Web Development are 4 months, Flutter is 3 months, and Software Testing is 3 months, with flexible weekend batches available." },
    { keys:['fee','fees','cost','price','payment'], reply:"We offer affordable fee plans starting with flexible EMI-style payment options. For exact pricing on your chosen course, I can connect you with a counselor." },
    { keys:['eligibility','qualification','eligible'], reply:"Most of our programs welcome both students and working professionals — no strict prerequisites for beginner tracks, while advanced tracks recommend basic programming familiarity." },
    { keys:['certificate','certification','certified'], reply:"Yes! You'll receive an industry-recognized NovelX certificate upon successful completion, along with a verified digital credential." },
    { keys:['placement','job','career','hire','internship'], reply:"Our placement support includes resume building, mock interviews, internship assistance, and access to our hiring partner network." },
    { keys:['batch','timing','schedule'], reply:"We run weekday and weekend batches, with both morning and evening slots to fit around your schedule." },
    { keys:['offline','online','mode','classroom'], reply:"Courses are available in both live online and in-person offline formats — you can choose whichever suits you best." },
    { keys:['demo','trial','free class'], reply:"Absolutely — we offer a free demo class so you can experience our teaching style before enrolling." },
    { keys:['faculty','trainer','teacher','instructor'], reply:"Our faculty are industry practitioners with real hands-on experience in their fields, not just academic trainers." },
    { keys:['location','address','where','campus'], reply:"We'd love to share our campus location details — a counselor can send you the exact address and directions." },
    { keys:['contact','phone','number','call'], reply:"You can reach our admissions team directly, or I can arrange for a counselor to call you back." },
    { keys:['scholarship','discount','financial aid'], reply:"Yes, we offer merit and need-based scholarships. A counselor can walk you through eligibility." },
    { keys:['ui/ux','ui ux','uiux','ux design','ui design'], reply:"Our UI/UX Design program covers design thinking, wireframing, prototyping and portfolio-building over a hands-on 4-month track." },
    { keys:['web development','web dev','frontend','backend'], reply:"Web Development covers HTML/CSS/JS through to full-stack frameworks, with real client-style projects." },
    { keys:['flutter','app development','mobile app'], reply:"Our Flutter track teaches cross-platform mobile app development from fundamentals to publishing on app stores." },
    { keys:['testing','software testing','qa'], reply:"Software Testing covers manual and automation testing, with tools used in real QA teams." },
    { keys:['research','r&d','r & d'], reply:"Our Research & Development track is project-based, ideal for those wanting to explore emerging tech deeply." }
  ];

  function findAnswer(text){
    const t = text.toLowerCase();
    for(const item of KB){
      if(item.keys.some(k => t.includes(k))){
        return item.reply;
      }
    }
    return null;
  }

  async function handleUserText(text){
    addMessage('user', text);
    const answer = findAnswer(text);
    if(answer){
      await botSay(answer);
      addOptions([
        { label:'💼 Talk to Counselor', action:'counselor' },
        { label:'📅 Book Consultation', action:'consult' }
      ]);
    } else {
      await botSay("I couldn't find the exact answer. Please connect with our admission counselor.");
      addOptions([
        { label:'📞 Call Now', action:'call', gold:true },
        { label:'💬 WhatsApp', action:'whatsapp' },
        { label:'📅 Book Consultation', action:'consult' }
      ]);
    }
  }

  /* ---------------- conversation flow tree ---------------- */
  async function handleOptionClick(opt){
    if(opt.label){
      addMessage('user', opt.label);
    }
    switch(opt.action){
      case 'courses':
        await botSayMultiple([
          "We currently offer:",
          "✨ UI/UX Design\n💻 Web Development\n🧪 Software Testing\n📱 Flutter App Development\n🔬 Research & Development",
          "Would you like more information?"
        ]);
        addOptions([
          { label:'View Curriculum', action:'curriculum' },
          { label:'Enroll Now', action:'enroll', gold:true },
          { label:'Talk to Counselor', action:'counselor' }
        ]);
        break;

      case 'admission':
        await botSayMultiple([
          "Our admission process is simple.",
          "1. Fill the application\n2. Free counselling\n3. Course selection\n4. Enrollment\n5. Start learning"
        ]);
        addOptions([
          { label:'Enroll Now', action:'enroll', gold:true },
          { label:'Free Consultation', action:'consult' }
        ]);
        break;

      case 'fees':
        await botSay("We offer affordable fee plans with flexible payment options.");
        addOptions([
          { label:'Request Fee Details', action:'feedetails' },
          { label:'Scholarship', action:'scholarship' },
          { label:'Call Counselor', action:'call' }
        ]);
        break;

      case 'placement':
        await botSayMultiple([
          "Our placement support includes:",
          "✔ Resume Building\n✔ Mock Interviews\n✔ Internship Assistance\n✔ Hiring Partner Network\n✔ Career Guidance"
        ]);
        addOptions([
          { label:'Success Stories', action:'stories' },
          { label:'Talk to Placement Team', action:'counselor' }
        ]);
        break;

      case 'consult':
        await botSay("Opening the free consultation form for you now — please fill in your details and our counselor will reach out shortly.");
        openConsultationModal();
        break;

      case 'enroll':
        await botSay("Opening the enrollment form — let's get you started!");
        openEnrollmentModal();
        break;

      case 'faqs':
        await botSay("Here are some things people often ask — you can also just type your own question below.");
        addOptions([
          { label:'Course Duration', action:'kb', q:'duration' },
          { label:'Certification', action:'kb', q:'certificate' },
          { label:'Batch Timings', action:'kb', q:'batch' },
          { label:'Scholarships', action:'kb', q:'scholarship' }
        ]);
        break;

      case 'counselor':
        await botSayMultiple([
          "Sure — connecting you with our admission counselor.",
          "You can call, WhatsApp, or book a slot directly."
        ]);
        addOptions([
          { label:'📞 Call Now', action:'call', gold:true },
          { label:'💬 WhatsApp', action:'whatsapp' },
          { label:'📅 Book Consultation', action:'consult' }
        ]);
        break;

      case 'call':
        await botSay("Great — tap below to call our admissions line directly.");
        addOptions([{ label:'📞 Dial Now', action:'noop', gold:true }]);
        break;

      case 'whatsapp':
        await botSay("Great — tap below to chat with us on WhatsApp.");
        addOptions([{ label:'💬 Open WhatsApp', action:'noop', gold:true }]);
        break;

      case 'curriculum':
        await botSay("I'll have a counselor send over the detailed curriculum PDF for your course of interest.");
        addOptions([{ label:'Talk to Counselor', action:'counselor' }]);
        break;

      case 'feedetails':
        await botSay("Our counselor will share the complete fee breakdown and available payment plans with you.");
        addOptions([{ label:'Talk to Counselor', action:'counselor' }]);
        break;

      case 'scholarship':
        await botSay("We offer merit and need-based scholarships — a counselor can check what you're eligible for.");
        addOptions([{ label:'Talk to Counselor', action:'counselor' }]);
        break;

      case 'stories':
        await botSay("Our graduates have gone on to roles at design studios, product startups and dev agencies — a counselor can share detailed success stories with you.");
        addOptions([{ label:'Talk to Placement Team', action:'counselor' }]);
        break;

      case 'kb':
        const item = KB.find(k => k.keys.includes(opt.q));
        if(item) await botSay(item.reply);
        addOptions([{ label:'Talk to Counselor', action:'counselor' }]);
        break;

      default:
        break;
    }
  }

  /* ---------------- modals (lightweight, self-contained) ---------------- */
  function buildModal(title, fields, submitLabel){
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(58,3,14,0.55);z-index:100000;display:flex;align-items:center;justify-content:center;padding:20px;animation:nx-fadeInMsg .25s ease;';
    const box = document.createElement('div');
    box.style.cssText = 'background:#FFF7EA;border-radius:16px;padding:28px;max-width:360px;width:100%;box-shadow:0 30px 70px rgba(0,0,0,0.35);font-family:Manrope,sans-serif;';
    box.innerHTML = `
      <div style="font-family:'Fraunces',serif;font-size:20px;font-weight:600;color:#3a030e;margin-bottom:4px;">${title}</div>
      <div style="font-size:12.5px;color:#8a6a5a;margin-bottom:18px;">We'll get back to you shortly.</div>
      <form id="nxModalForm" style="display:flex;flex-direction:column;gap:12px;">
        ${fields.map(f => `<input required type="${f.type}" placeholder="${f.placeholder}" style="border:1.5px solid rgba(109,7,26,0.18);border-radius:10px;padding:11px 14px;font-size:13.5px;font-family:Manrope,sans-serif;outline:none;background:#fff;">`).join('')}
        <button type="submit" style="margin-top:6px;border:none;background:linear-gradient(135deg,#6D071A,#8A0F28);color:#FFF7EA;font-weight:700;font-size:13.5px;padding:12px;border-radius:10px;cursor:pointer;">${submitLabel}</button>
        <button type="button" id="nxModalCancel" style="border:none;background:transparent;color:#8a6a5a;font-size:12px;cursor:pointer;padding:4px;">Cancel</button>
      </form>
    `;
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    box.querySelector('#nxModalCancel').addEventListener('click', () => overlay.remove());
    overlay.addEventListener('click', e => { if(e.target === overlay) overlay.remove(); });
    box.querySelector('#nxModalForm').addEventListener('submit', e => {
      e.preventDefault();
      overlay.remove();
      botSay("Thank you! Your request has been received — our team will contact you shortly. 🎉");
    });
  }

  function openConsultationModal(){
    buildModal('Book Free Consultation', [
      { type:'text', placeholder:'Full Name' },
      { type:'tel', placeholder:'Phone Number' },
      { type:'email', placeholder:'Email Address' }
    ], 'Book My Slot');
  }

  function openEnrollmentModal(){
    buildModal('Enroll Now', [
      { type:'text', placeholder:'Full Name' },
      { type:'tel', placeholder:'Phone Number' },
      { type:'email', placeholder:'Email Address' },
      { type:'text', placeholder:'Course of Interest' }
    ], 'Submit Application');
  }

  /* ---------------- input handling ---------------- */
  function sendFromInput(){
    const text = input.value.trim();
    if(!text) return;
    input.value = '';
    handleUserText(text);
  }
  sendBtn.addEventListener('click', sendFromInput);
  input.addEventListener('keydown', e => {
    if(e.key === 'Enter'){ e.preventDefault(); sendFromInput(); }
  });
  chipsWrap.addEventListener('click', e => {
    const chip = e.target.closest('.nx-chip');
    if(!chip) return;
    handleUserText(chip.dataset.q);
  });

  /* ---------------- welcome sequence ---------------- */
  async function runWelcome(){
    await botSay("👋 Welcome to NovelX Tech School!", 500);
    await botSay("I'm your AI Admission Assistant.", 700);
    await botSay("I'm here to help you explore courses, admissions, placements and career guidance.", 800);
    await botSay("How can I help you today?", 600);
    addOptions([
      { label:'📘 Explore Courses', action:'courses' },
      { label:'🎓 Admission Process', action:'admission' },
      { label:'💰 Fee Structure', action:'fees' },
      { label:'💼 Placement Support', action:'placement' },
      { label:'📅 Book Free Consultation', action:'consult', gold:true },
      { label:'📞 Contact Counselor', action:'counselor' },
      { label:'❓ FAQs', action:'faqs' }
    ]);
  }

  runWelcome();

  /* ---------------- auto-open once per session ---------------- */
  if(!sessionStorage.getItem('nxChatOpened')){
    sessionStorage.setItem('nxChatOpened', '1');
    setTimeout(openChat, 900);
  } else {
    // keep launcher badge subtle if not auto-opened
    badge.classList.add('hide');
  }

})();