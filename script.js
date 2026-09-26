/* ======================================================================
   CareerPath — frontend-only, deep-detail version
   Built by Dheeraj
   Everything below runs entirely in the browser — no server, no AI calls.
====================================================================== */

/* ---------------- 0. Intro loader (letter-by-letter) ---------------- */
(function initIntro() {
  document.body.classList.add("intro-active");
  const mark = document.getElementById("introMark");
  const text1 = "Career", text2 = "Path";
  let delay = 0.1, html = "";
  text1.split("").forEach(ch => { html += `<span class="intro-letter" style="animation-delay:${delay}s">${ch}</span>`; delay += 0.05; });
  text2.split("").forEach(ch => { html += `<span class="intro-letter accent" style="animation-delay:${delay}s">${ch}</span>`; delay += 0.05; });
  mark.innerHTML = html;

  setTimeout(() => {
    document.body.classList.remove("intro-active");
    const loader = document.getElementById("introLoader");
    if (loader) loader.style.display = "none";
  }, 3300);
})();

/* ---------------- 0b. Scroll reveal ---------------- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("in-view"); });
}, { threshold: 0.15 });
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

/* ---------------- 0b2. Premium animated tech background (particle network) ---------------- */
(function initParticles() {
  const canvas = document.getElementById("bgCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion) return;

  const colors = ["122,92,255", "0,230,160", "255,61,174"];
  let particles = [];
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    const count = w < 640 ? 26 : w < 1100 ? 42 : 60;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      c: colors[Math.floor(Math.random() * colors.length)]
    }));
  }
  window.addEventListener("resize", resize);
  resize();

  const linkDist = 130;
  function tick() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.c},0.75)`;
      ctx.fill();
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < linkDist) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${p.c},${0.14 * (1 - dist / linkDist)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();

/* ---------------- 0b3. 3D pointer-tilt on premium cards (fine-pointer devices only) ---------------- */
(function initTilt() {
  if (!window.matchMedia || !window.matchMedia("(pointer: fine)").matches) return;
  const targets = [".coverage-card", "#quizCard"];
  document.querySelectorAll(targets.join(",")).forEach(el => el.classList.add("tilt"));

  document.addEventListener("mousemove", (e) => {
    const el = e.target.closest(targets.join(","));
    document.querySelectorAll(".tilt").forEach(card => {
      if (card !== el) card.style.transform = "";
    });
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(700px) rotateY(${px * 6}deg) rotateX(${-py * 6}deg) translateZ(4px)`;
  });
  document.addEventListener("mouseleave", () => {
    document.querySelectorAll(".tilt").forEach(card => { card.style.transform = ""; });
  }, true);
})();

/* ---------------- 0c. Greeting toast ---------------- */
function showGreeting(name) {
  const toast = document.getElementById("greetToast");
  toast.innerHTML = `Nice to meet you, <span>${name}</span>! Let's find your path 👋`;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

/* ---------------- 1. Exam details database (55 exams, full depth) ---------------- */

const EXAM_DETAILS = {
  "NDA": {
    full: "National Defence Academy (NDA)",
    conductedBy: "Union Public Service Commission (UPSC)",
    frequency: "Twice a year — NDA I (April) and NDA II (September)",
    eligibility: "Unmarried candidates who have passed Class 12 (PCM required for Air Force & Navy wings; any stream for Army wing)",
    ageLimit: "16.5 to 19.5 years",
    vacancies: "~370–400 seats per exam (varies each year)",
    salary: "No salary during training; after commissioning, starting pay is Level 10 (~₹56,100/month) plus Military Service Pay and allowances",
    selection: ["Written Examination (objective type)", "SSB Interview — 5-day personality & aptitude assessment", "Medical Examination"],
    pattern: ["Paper 1 – Mathematics: 300 marks, 2.5 hours", "Paper 2 – General Ability Test: 600 marks, 2.5 hours", "Total written: 900 marks; SSB Interview: 900 marks"],
    syllabus: ["Maths: Algebra, Matrices, Trigonometry, Calculus, Vectors, Statistics & Probability (Class 11–12 level)", "English: Grammar, comprehension, vocabulary", "General Knowledge: Physics, Chemistry, General Science, History, Geography, Current Affairs"]
  },
  "CDS": {
    full: "Combined Defence Services (CDS)",
    conductedBy: "UPSC",
    frequency: "Twice a year",
    eligibility: "Graduates (stream depends on the academy — IMA, INA, AFA, OTA); unmarried for IMA/INA/AFA",
    ageLimit: "19–24 years (varies by academy)",
    vacancies: "~300–450 across all academies per exam",
    salary: "Starting pay Level 10 (~₹56,100/month) plus allowances after commissioning",
    selection: ["Written Exam", "SSB Interview", "Medical Examination"],
    pattern: ["English: 100 marks", "General Knowledge: 100 marks", "Elementary Mathematics: 100 marks (IMA/INA/AFA only; OTA has only English & GK)"],
    syllabus: ["English comprehension & grammar", "GK: current affairs, history, geography, science", "Maths: up to Class 10 level — algebra, geometry, trigonometry, mensuration"]
  },
  "AFCAT": {
    full: "Air Force Common Admission Test (AFCAT)",
    conductedBy: "Indian Air Force",
    frequency: "Twice a year (Feb and Aug/Sept intake)",
    eligibility: "Graduates (specific degree requirements vary by branch — Flying, Technical, Ground Duty)",
    ageLimit: "20–24 years for Flying Branch (up to 26 for some Ground Duty branches)",
    vacancies: "~250–300 per intake",
    salary: "Starting pay Level 10 (~₹56,100/month) + Military Service Pay + flying/technical allowances",
    selection: ["Online written test", "AFSB Interview (psychological tests, group tasks, personal interview)", "Medical Examination"],
    pattern: ["100 questions, 300 marks, 2 hours — negative marking of 1 mark per wrong answer"],
    syllabus: ["General Awareness", "Verbal Ability in English", "Numerical Ability", "Reasoning & Military Aptitude Test"]
  },
  "Agniveer (Army/Navy/Air Force)": {
    full: "Agnipath Scheme — Agniveer (Army / Navy / Air Force)",
    conductedBy: "Respective service (Indian Army, Navy, Air Force)",
    frequency: "Multiple recruitment rallies/online applications through the year",
    eligibility: "Class 10 or 12 pass depending on the entry/trade",
    ageLimit: "17.5–21 years",
    vacancies: "Tens of thousands annually across all three services (varies by year)",
    salary: "Starts ~₹30,000/month (in-hand ~₹21,000 after fund contribution), rising to ~₹40,000/month by year 4, plus a lump-sum 'Seva Nidhi' package (~₹11.7 lakh) on completing 4 years",
    selection: ["Online written exam", "Physical Fitness Test", "Medical Examination", "Document verification"],
    pattern: ["Objective type — general science/maths/reasoning/general knowledge (varies by trade)"],
    syllabus: ["General Science", "General Knowledge & Current Affairs", "Basic Mathematics", "Logical & Analytical Reasoning"]
  },
  "Indian Coast Guard (Navik/Yantrik)": {
    full: "Indian Coast Guard — Navik (General Duty/Domestic Branch) & Yantrik",
    conductedBy: "Indian Coast Guard",
    frequency: "Twice a year",
    eligibility: "Class 12 with Maths & Physics (Navik GD); Diploma in relevant Engineering (Yantrik)",
    ageLimit: "18–22 years",
    vacancies: "Typically 250–350 per notification",
    salary: "Starting pay Level 3–5 (~₹21,700–₹29,200/month) plus allowances",
    selection: ["Written Exam", "Physical Fitness Test", "Medical Examination", "Document Verification"],
    pattern: ["Objective type — Maths, Physics, English, General Knowledge/Reasoning depending on post"],
    syllabus: ["Class 10–12 level Maths & Physics", "English comprehension", "General knowledge & current affairs"]
  },
  "CAPF AC": {
    full: "Central Armed Police Forces (CAPF) Assistant Commandant",
    conductedBy: "UPSC",
    frequency: "Once a year",
    eligibility: "Graduate in any discipline",
    ageLimit: "20–25 years",
    vacancies: "~200–350 depending on the year, across BSF, CRPF, CISF, ITBP, SSB",
    salary: "Level 10 pay scale (~₹56,100–₹1,77,500/month) plus allowances",
    selection: ["Written Exam (Paper 1 & 2)", "Physical Efficiency Test & Medical Exam", "Interview/Personality Test"],
    pattern: ["Paper 1: General Ability & Intelligence — 250 marks, objective", "Paper 2: General Studies, Essay & Comprehension — 200 marks, descriptive"],
    syllabus: ["General Studies (History, Polity, Geography, Economy)", "Current affairs", "Essay writing", "English comprehension & precis"]
  },
  "UPSC Civil Services Exam (CSE)": {
    full: "UPSC Civil Services Examination (IAS / IPS / IFS / IRS and allied services)",
    conductedBy: "UPSC",
    frequency: "Once a year",
    eligibility: "Graduate in any discipline from a recognised university",
    ageLimit: "21–32 years (relaxation for reserved categories)",
    vacancies: "Typically 700–1000+ vacancies per year across all services",
    salary: "Starting pay Level 10 (~₹56,100/month), rising quickly with seniority; senior positions cross ₹2,00,000+/month",
    selection: ["Preliminary Exam (objective, screening only)", "Main Exam (9 descriptive papers)", "Personality Test/Interview"],
    pattern: ["Prelims: GS Paper 1 (200 marks) + CSAT Paper 2 (qualifying, 200 marks)", "Mains: Essay, 4 GS papers, 2 optional subject papers, language papers"],
    syllabus: ["Indian Polity, History, Geography, Economy, Environment & Ecology", "Science & Technology, Current Affairs", "Ethics, Integrity & Aptitude (Mains GS-4)", "One optional subject of the candidate's choice"]
  },
  "UPSC Engineering Services Exam (ESE/IES)": {
    full: "Engineering Services Examination (ESE / IES)",
    conductedBy: "UPSC",
    frequency: "Once a year",
    eligibility: "Engineering degree (Civil, Mechanical, Electrical, Electronics & Telecom streams)",
    ageLimit: "21–30 years",
    vacancies: "~200–350 per year across all engineering streams",
    salary: "Starting pay Level 10 (~₹56,100/month) — a Group A gazetted officer post",
    selection: ["Preliminary Exam (objective)", "Main Exam (conventional/descriptive)", "Personality Test"],
    pattern: ["Prelims: General Studies + Engineering Discipline paper", "Mains: 2 papers of the chosen engineering discipline (descriptive)"],
    syllabus: ["Core engineering subjects of the chosen branch", "General Studies & Engineering Aptitude"]
  },
  "UPSC Combined Medical Services (CMS)": {
    full: "Combined Medical Services Examination (CMS)",
    conductedBy: "UPSC",
    frequency: "Once a year",
    eligibility: "MBBS degree with completed internship",
    ageLimit: "Up to 32 years (relaxable)",
    vacancies: "Typically 400–700 across Railways, MCD, Central Health Services",
    salary: "Starting pay Level 10–11 (~₹56,100–₹67,700/month) depending on post",
    selection: ["Written Exam (objective)", "Personality Test/Interview for some posts"],
    pattern: ["Paper 1: General Medicine & Paediatrics", "Paper 2: Surgery, Gynaecology & Obstetrics, Preventive & Social Medicine"],
    syllabus: ["MBBS-level clinical subjects as per the paper split above"]
  },
  "UPSC Indian Forest Service (IFoS)": {
    full: "Indian Forest Service Examination (IFoS)",
    conductedBy: "UPSC",
    frequency: "Once a year (Prelims conducted along with CSE Prelims)",
    eligibility: "Bachelor's in Botany, Zoology, Forestry, Engineering, Agriculture, Veterinary Science, Maths/Statistics/Physics/Chemistry/Geology",
    ageLimit: "21–32 years",
    vacancies: "~100–150 per year",
    salary: "Starting pay Level 10 (~₹56,100/month), similar structure to IAS/IPS",
    selection: ["Prelims (same paper as CSE)", "Mains (descriptive, subject papers)", "Interview"],
    pattern: ["Prelims: General Studies + CSAT", "Mains: General English, GK, 2 optional subjects (4 papers)"],
    syllabus: ["Optional subjects from Agriculture, Forestry, Geology, Animal Husbandry, Botany, Zoology, Chemistry, Physics, Maths, Statistics, Civil/Mechanical/Agri Engineering"]
  },
  "EPFO Enforcement Officer": {
    full: "EPFO Enforcement Officer / Accounts Officer",
    conductedBy: "UPSC / SSC (varies by recruitment cycle)",
    frequency: "As per vacancy — not strictly annual",
    eligibility: "Graduate in any discipline (Law/Accounting preferred for some posts)",
    ageLimit: "Up to 30 years typically",
    vacancies: "Often 150–300 per notification",
    salary: "Pay Level 8 (~₹47,600–₹1,51,100/month)",
    selection: ["Written exam (objective)", "Interview/Skill Test in some cycles"],
    pattern: ["General Awareness, Quant, Reasoning, English, and subject knowledge for relevant posts"],
    syllabus: ["General Studies & current affairs", "Quantitative Aptitude & Reasoning", "Industrial Relations & Labour Laws"]
  },
  "SSC CGL": {
    full: "Staff Selection Commission — Combined Graduate Level (CGL)",
    conductedBy: "SSC",
    frequency: "Once a year",
    eligibility: "Graduate in any discipline",
    ageLimit: "18–32 years depending on the post",
    vacancies: "Typically 5,000–8,000+ vacancies per year",
    salary: "Pay Level 4 to Level 8 (₹25,500–₹1,51,100/month range) depending on post",
    selection: ["Tier 1 (objective)", "Tier 2 (objective, multiple papers)", "Document Verification/Skill Test for some posts"],
    pattern: ["Tier 1: General Intelligence, General Awareness, Quant, English — 200 marks", "Tier 2: Multiple sessions — Maths, Reasoning, English, Data Analysis, post-specific papers"],
    syllabus: ["Quantitative Aptitude (Class 10 level)", "General Intelligence & Reasoning", "English Language & Comprehension", "General Awareness (Static GK + Current Affairs)"]
  },
  "SSC CHSL": {
    full: "Staff Selection Commission — Combined Higher Secondary Level (CHSL)",
    conductedBy: "SSC",
    frequency: "Once a year",
    eligibility: "Class 12 pass",
    ageLimit: "18–27 years",
    vacancies: "Typically 3,000–4,500 per year (LDC, JSA, DEO posts)",
    salary: "Pay Level 2–4 (₹19,900–₹63,200/month range)",
    selection: ["Tier 1 (objective)", "Tier 2 (descriptive + skill/typing test)"],
    pattern: ["Tier 1: General Intelligence, English, Quant, GK — 200 marks", "Tier 2: Essay/Letter + objective + typing test for DEO posts"],
    syllabus: ["Class 10–12 level Maths & Reasoning", "English grammar & comprehension", "General Awareness"]
  },
  "SSC MTS": {
    full: "Staff Selection Commission — Multi Tasking Staff (MTS)",
    conductedBy: "SSC",
    frequency: "Once a year",
    eligibility: "Class 10 pass",
    ageLimit: "18–25 years (varies by post)",
    vacancies: "Often 5,000–8,000+ per year",
    salary: "Pay Level 1 (~₹18,000–₹56,900/month)",
    selection: ["Computer Based Exam (Session 1 + Session 2)", "Document Verification"],
    pattern: ["Session 1: Numerical & Reasoning ability", "Session 2: General Awareness & English"],
    syllabus: ["Basic Maths (Class 10 level)", "Reasoning", "General English", "General Awareness"]
  },
  "SSC GD Constable": {
    full: "SSC — General Duty (GD) Constable in CAPFs, NIA, SSF & Rifleman in Assam Rifles",
    conductedBy: "SSC",
    frequency: "Once a year (varies)",
    eligibility: "Class 10 pass",
    ageLimit: "18–23 years",
    vacancies: "Often the largest SSC exam — 25,000 to 50,000+ in big years",
    salary: "Pay Level 3 (~₹21,700–₹69,100/month)",
    selection: ["Written Exam (objective)", "Physical Efficiency Test (PET) & Physical Standard Test (PST)", "Medical Exam"],
    pattern: ["100 questions, 100 marks — General Knowledge, Reasoning, Elementary Maths, Hindi/English"],
    syllabus: ["Class 10 level Maths", "General Reasoning", "General Awareness & Current Affairs", "Basic English/Hindi"]
  },
  "SSC JE": {
    full: "SSC — Junior Engineer (Civil, Mechanical, Electrical)",
    conductedBy: "SSC",
    frequency: "Once a year",
    eligibility: "Diploma or Degree in the relevant engineering branch",
    ageLimit: "Up to 32 years (varies by post)",
    vacancies: "Typically 500–1,500 per year",
    salary: "Pay Level 6 (~₹35,400–₹1,12,400/month)",
    selection: ["Paper 1 (objective — general + technical)", "Paper 2 (technical, descriptive/CBT)"],
    pattern: ["Paper 1: General Intelligence, GK, General Engineering (branch-specific)", "Paper 2: Branch-specific engineering — deeper technical questions"],
    syllabus: ["Core subjects of the relevant engineering branch (Diploma/Degree level)", "General Awareness & Reasoning"]
  },
  "SSC Stenographer": {
    full: "SSC Stenographer Grade C & D",
    conductedBy: "SSC",
    frequency: "Once a year",
    eligibility: "Class 12 pass",
    ageLimit: "18–30 years (Grade C), 18–27 years (Grade D)",
    vacancies: "Usually a few hundred to ~2,000 per year",
    salary: "Pay Level 4 (Grade C) / Level 2–4 (Grade D)",
    selection: ["Written Exam (objective)", "Skill Test in Stenography"],
    pattern: ["General Intelligence, General Awareness, English Language & Comprehension — 200 marks"],
    syllabus: ["Reasoning", "General Knowledge", "English grammar & comprehension", "Stenography speed & accuracy"]
  },
  "SSC CPO": {
    full: "SSC — Central Police Organisation (Sub-Inspector in Delhi Police & CAPFs)",
    conductedBy: "SSC",
    frequency: "Once a year",
    eligibility: "Graduate in any discipline",
    ageLimit: "20–25 years",
    vacancies: "Typically 1,000–4,300 depending on the year",
    salary: "Pay Level 6 (~₹35,400–₹1,12,400/month)",
    selection: ["Paper 1 (objective)", "Physical Endurance & Measurement Test", "Paper 2 (English)", "Medical Exam"],
    pattern: ["Paper 1: GK, Reasoning, Quant, English — 200 marks", "Paper 2: English Language & Comprehension — 200 marks"],
    syllabus: ["General Knowledge & Current Affairs", "Quantitative Aptitude", "Reasoning", "English grammar & comprehension"]
  },
  "IBPS PO": {
    full: "IBPS Probationary Officer (Public Sector Banks)",
    conductedBy: "Institute of Banking Personnel Selection (IBPS)",
    frequency: "Once a year",
    eligibility: "Graduate in any discipline",
    ageLimit: "20–30 years",
    vacancies: "Typically 3,000–4,500 per year across participating banks",
    salary: "Starting basic pay ~₹48,480/month; total in-hand with allowances often ₹60,000–₹70,000/month",
    selection: ["Prelims (objective)", "Mains (objective + descriptive)", "Interview"],
    pattern: ["Prelims: English, Quant, Reasoning — 100 marks", "Mains: Reasoning & Computer Aptitude, English, Quant, Banking Awareness, Descriptive test"],
    syllabus: ["Quantitative Aptitude", "Reasoning & Computer Aptitude", "English Language", "Banking & General/Economy Awareness"]
  },
  "IBPS Clerk": {
    full: "IBPS Clerk (Public Sector Banks)",
    conductedBy: "IBPS",
    frequency: "Once a year",
    eligibility: "Graduate in any discipline",
    ageLimit: "20–28 years",
    vacancies: "Often the largest banking exam — 5,000–7,000+ vacancies per year",
    salary: "Starting basic pay ~₹19,900/month; total in-hand with allowances often ₹29,000–₹31,000/month",
    selection: ["Prelims (objective)", "Mains (objective)"],
    pattern: ["Prelims: English, Quant, Reasoning — 100 marks", "Mains: General/Financial Awareness, English, Reasoning & Computer Aptitude, Quant"],
    syllabus: ["Quantitative Aptitude", "Reasoning Ability", "English Language", "General & Financial Awareness", "Computer Knowledge"]
  },
  "SBI PO": {
    full: "State Bank of India — Probationary Officer",
    conductedBy: "State Bank of India",
    frequency: "Once a year",
    eligibility: "Graduate in any discipline",
    ageLimit: "21–30 years",
    vacancies: "Typically 1,500–2,500 per year",
    salary: "Starting basic pay ~₹48,480/month; total in-hand with allowances often ₹70,000–₹80,000/month",
    selection: ["Prelims (objective)", "Mains (objective + descriptive/essay)", "Group Exercise & Interview"],
    pattern: ["Prelims: English, Quant, Reasoning — 100 marks", "Mains: Reasoning & Computer, Data Analysis, Banking Awareness, English, Descriptive (Essay & Letter)"],
    syllabus: ["Data Interpretation & Analysis", "Reasoning", "English Language", "Banking & Economic Awareness", "Essay/Letter writing"]
  },
  "SBI Clerk": {
    full: "State Bank of India — Junior Associate (Clerk)",
    conductedBy: "State Bank of India",
    frequency: "Once a year",
    eligibility: "Graduate in any discipline",
    ageLimit: "20–28 years",
    vacancies: "Often 5,000–8,000+ per year — one of the largest bank exams",
    salary: "Starting basic pay ~₹19,900/month; total in-hand with allowances around ₹29,000–₹33,000/month",
    selection: ["Prelims (objective)", "Mains (objective)"],
    pattern: ["Prelims: English, Quant, Reasoning — 100 marks", "Mains: General/Financial Awareness, English, Quant, Reasoning & Computer aptitude"],
    syllabus: ["Quantitative Aptitude", "Reasoning & Computer Aptitude", "English Language", "General & Financial Awareness"]
  },
  "RBI Grade B": {
    full: "Reserve Bank of India — Grade B Officer",
    conductedBy: "Reserve Bank of India",
    frequency: "Once a year",
    eligibility: "Graduate with minimum 60% marks (50% for reserved categories)",
    ageLimit: "21–30 years",
    vacancies: "Typically 150–300 per year",
    salary: "Starting basic pay ~₹55,200/month; total in-hand with allowances often over ₹1,00,000/month, plus housing perks",
    selection: ["Phase 1 (objective)", "Phase 2 (descriptive — essay, English, finance/management)", "Interview"],
    pattern: ["Phase 1: General Awareness, English, Quant, Reasoning — objective", "Phase 2: Economic & Social Issues, English (Writing), Finance & Management — descriptive"],
    syllabus: ["Indian Economy & Banking Awareness", "Finance & Management concepts", "English writing & comprehension", "Current affairs"]
  },
  "RBI Assistant": {
    full: "Reserve Bank of India — Assistant",
    conductedBy: "Reserve Bank of India",
    frequency: "As per vacancy (roughly every 1–2 years)",
    eligibility: "Graduate in any discipline",
    ageLimit: "20–28 years",
    vacancies: "Varies, typically 400–1,000 depending on notification",
    salary: "Starting basic pay ~₹20,700/month; in-hand with allowances often ₹35,000+/month",
    selection: ["Prelims (objective)", "Mains (objective)", "Language Proficiency Test"],
    pattern: ["Prelims: English, Quant, Reasoning", "Mains: Reasoning, English, Quant, General Awareness, Computer Knowledge"],
    syllabus: ["Quantitative Aptitude", "Reasoning", "English Language", "General Awareness & Computer Knowledge"]
  },
  "NABARD Grade A": {
    full: "National Bank for Agriculture and Rural Development — Grade A Officer",
    conductedBy: "NABARD",
    frequency: "Once a year (typically)",
    eligibility: "Graduate (Agriculture/Rural Development preferred for some posts)",
    ageLimit: "21–30 years",
    vacancies: "Usually 100–200 per year",
    salary: "Starting basic pay ~₹48,700/month; total in-hand with allowances often ₹80,000+/month",
    selection: ["Prelims (objective)", "Mains (descriptive + objective)", "Interview"],
    pattern: ["Prelims: Reasoning, English, Quant, GK, Computer Knowledge, Economic & Social Issues, Agriculture", "Mains: Descriptive papers in English + specialisation subject"],
    syllabus: ["Agriculture & Rural Development (for relevant streams)", "Economic & Social Issues", "English writing", "General Awareness"]
  },
  "LIC AAO": {
    full: "LIC — Assistant Administrative Officer (AAO)",
    conductedBy: "Life Insurance Corporation of India",
    frequency: "As per vacancy",
    eligibility: "Graduate in any discipline (Law/IT/Actuarial for some posts)",
    ageLimit: "21–30 years",
    vacancies: "Varies, typically 300–600 per notification",
    salary: "Starting basic pay ~₹32,795/month; total in-hand with allowances often ₹55,000+/month",
    selection: ["Prelims (objective)", "Mains (objective)", "Interview"],
    pattern: ["Prelims: Reasoning, Quant, English", "Mains: Reasoning, GK & Current Affairs, Insurance & Financial Market Awareness, Quant, English descriptive"],
    syllabus: ["Insurance & Financial Awareness", "Reasoning & Quant", "English Language", "General Knowledge & Current Affairs"]
  },
  "RRB NTPC": {
    full: "Railway Recruitment Board — Non-Technical Popular Categories (NTPC)",
    conductedBy: "Railway Recruitment Boards (RRB)",
    frequency: "As per vacancy (not strictly annual)",
    eligibility: "Class 12 or Graduate depending on the post",
    ageLimit: "18–33 years (varies by post)",
    vacancies: "Often 20,000–35,000+ vacancies when notified",
    salary: "Pay Level 2 to Level 6 (₹19,900–₹1,12,400/month range) depending on post",
    selection: ["CBT 1 (objective)", "CBT 2 (objective)", "Typing/Aptitude Test for some posts", "Document Verification & Medical"],
    pattern: ["CBT 1: Maths, General Intelligence & Reasoning, General Awareness", "CBT 2: Similar sections at higher difficulty"],
    syllabus: ["Class 10–12 level Maths", "General Reasoning", "General Awareness & Current Affairs"]
  },
  "RRB Group D": {
    full: "Railway Recruitment Board — Group D (Level 1 posts)",
    conductedBy: "RRB",
    frequency: "As per vacancy",
    eligibility: "Class 10 pass or ITI",
    ageLimit: "18–33 years",
    vacancies: "One of the largest govt exams — often 1,00,000+ vacancies when notified",
    salary: "Pay Level 1 (~₹18,000–₹56,900/month)",
    selection: ["CBT (objective)", "Physical Efficiency Test (PET)", "Document Verification & Medical"],
    pattern: ["100 questions — Maths, General Intelligence & Reasoning, General Science, GK & Current Affairs"],
    syllabus: ["Class 10 level Maths & Science", "General Reasoning", "Current Affairs"]
  },
  "RRB JE": {
    full: "Railway Recruitment Board — Junior Engineer (JE)",
    conductedBy: "RRB",
    frequency: "As per vacancy",
    eligibility: "Diploma/Degree in relevant Engineering",
    ageLimit: "18–33 years (varies)",
    vacancies: "Typically several thousand when notified",
    salary: "Pay Level 6 (~₹35,400–₹1,12,400/month)",
    selection: ["CBT 1 (objective)", "CBT 2 (objective, technical)", "Document Verification & Medical"],
    pattern: ["CBT 1: Maths, Reasoning, General Science, GK", "CBT 2: GK, Physics & Chemistry, Basics of Computers/Environment, Technical Engineering subjects"],
    syllabus: ["Core subjects of the relevant engineering branch (Diploma level)", "General Science & Reasoning"]
  },
  "RRB ALP": {
    full: "Railway Recruitment Board — Assistant Loco Pilot (ALP)",
    conductedBy: "RRB",
    frequency: "As per vacancy",
    eligibility: "Class 10 + ITI in a relevant trade, or Diploma/Degree in Engineering",
    ageLimit: "18–30 years",
    vacancies: "Typically several thousand to tens of thousands when notified",
    salary: "Pay Level 2 (~₹19,900–₹63,200/month)",
    selection: ["CBT 1 (objective)", "CBT 2 (objective, includes trade paper)", "Computer Based Aptitude Test", "Document Verification & Medical"],
    pattern: ["CBT 1: Maths, Reasoning, General Science, Current Affairs", "CBT 2: Basic Science & Engineering + relevant trade subjects"],
    syllabus: ["Class 10 level Maths & Science", "Relevant ITI trade subject", "General Reasoning"]
  },
  "GATE": {
    full: "Graduate Aptitude Test in Engineering (GATE)",
    conductedBy: "IITs/IISc on rotation",
    frequency: "Once a year (February)",
    eligibility: "B.Tech/B.E degree (final year students can also apply) in the relevant discipline",
    vacancies: "N/A — a qualifying exam for M.Tech admissions & PSU recruitment (thousands of PSU roles use GATE scores each year)",
    salary: "N/A directly — your GATE score decides your M.Tech seat or PSU application, which then follows that role's pay scale (typically Level 7–10, ₹40,000–₹60,000+/month starting for PSU engineers)",
    selection: ["Single computer-based test", "PSUs conduct further interviews/GD after shortlisting on GATE score"],
    pattern: ["3-hour computer-based test, 65 questions, 100 marks — General Aptitude + core engineering subject"],
    syllabus: ["Core subjects of the chosen engineering discipline (branch-specific)", "Engineering Mathematics", "General Aptitude (verbal & numerical)"]
  },
  "PSU Recruitment (via GATE)": {
    full: "Public Sector Undertaking (PSU) Recruitment via GATE Score",
    conductedBy: "Individual PSUs (ONGC, NTPC, BHEL, IOCL, SAIL, PGCIL, GAIL, HAL, BEL, etc.)",
    frequency: "Each PSU releases its own notification, usually once a year, after GATE results",
    eligibility: "Valid GATE score in the relevant discipline + degree requirements set by that PSU",
    vacancies: "Varies by PSU and year — a few dozen to a few hundred per company",
    salary: "Typically ₹50,000–₹1,00,000+/month (Executive Trainee level), plus allowances, medical benefits and pension",
    selection: ["GATE score-based shortlisting", "Group Discussion (some PSUs)", "Personal Interview", "Medical Examination"],
    pattern: ["No separate written exam for most PSUs — your GATE score is the screening test"],
    syllabus: ["Same as GATE syllabus for your branch"]
  },
  "ISRO Scientist/Engineer": {
    full: "ISRO — Scientist/Engineer 'SC' Recruitment",
    conductedBy: "Indian Space Research Organisation (ISRO)",
    frequency: "As per vacancy, roughly once a year",
    eligibility: "BE/B.Tech in Computer Science, Electronics, Mechanical or relevant branch with high first-class marks (65%+ typically)",
    ageLimit: "Up to 35 years typically",
    vacancies: "Usually 50–100 per notification",
    salary: "Starting basic pay ~₹56,100/month (Level 10), plus HRA, DA and other central government allowances",
    selection: ["Written Exam (objective, branch-specific)", "Interview"],
    pattern: ["Objective test covering core engineering subjects of the discipline"],
    syllabus: ["Core engineering subjects for the branch applied to (similar depth to GATE)"]
  },
  "DRDO Scientist Entry": {
    full: "DRDO — Scientist Entry Test (SET) / CEPTAM (Technical Staff)",
    conductedBy: "Defence Research and Development Organisation (DRDO)",
    frequency: "As per vacancy",
    eligibility: "BE/B.Tech/M.Tech/M.Sc depending on the post",
    ageLimit: "Up to 28 years for Scientist 'B' typically",
    vacancies: "Usually 100–300 per notification cycle",
    salary: "Starting basic pay ~₹56,100/month (Level 10) for Scientist 'B', with standard central government allowances",
    selection: ["Written Exam (objective, subject-specific)", "Interview"],
    pattern: ["Objective test on core subjects of the relevant engineering/science discipline"],
    syllabus: ["Core subjects of the discipline (similar to GATE-level depth)"]
  },
  "CTET": {
    full: "Central Teacher Eligibility Test (CTET)",
    conductedBy: "CBSE (on behalf of Ministry of Education)",
    frequency: "Twice a year",
    eligibility: "Paper 1 (Classes 1–5): 12th + 2-year Diploma in Elementary Education; Paper 2 (Classes 6–8): Graduate + B.Ed",
    vacancies: "N/A — an eligibility test; qualifying makes you eligible to apply for teaching posts in KVS, NVS and many state schools",
    salary: "Depends on the school/post you apply to afterward — govt school teachers typically start around ₹35,000–₹45,000/month (Pay Level 6–7)",
    selection: ["Single written exam", "Certificate valid for life (as per latest rules)"],
    pattern: ["150 questions, 150 marks, 2.5 hours — Child Development & Pedagogy, Language I & II, Maths, EVS/Social Science (varies by paper)"],
    syllabus: ["Child Development & Pedagogy", "Language proficiency (2 languages)", "Mathematics & Science / Social Studies pedagogy"]
  },
  "UGC NET": {
    full: "University Grants Commission — National Eligibility Test (UGC NET)",
    conductedBy: "National Testing Agency (NTA)",
    frequency: "Twice a year",
    eligibility: "Master's degree with 55% marks (50% for reserved categories) in the relevant subject",
    vacancies: "N/A — qualifying makes you eligible for Assistant Professor posts and/or a Junior Research Fellowship (JRF)",
    salary: "JRF stipend ~₹37,000/month for the first 2 years, ~₹42,000/month after; Assistant Professor pay typically starts around Level 10 (~₹57,700/month)",
    selection: ["Two papers on the same day (objective)"],
    pattern: ["Paper 1: Teaching & Research Aptitude — 100 marks", "Paper 2: Subject-specific — 200 marks"],
    syllabus: ["Paper 1: Reasoning, comprehension, teaching aptitude, research methodology", "Paper 2: Postgraduate-level syllabus of the chosen subject"]
  },
  "DSSSB/KVS Teacher Recruitment": {
    full: "DSSSB (Delhi) / KVS (Kendriya Vidyalaya) Teacher Recruitment",
    conductedBy: "Delhi Subordinate Services Selection Board / Kendriya Vidyalaya Sangathan",
    frequency: "As per vacancy",
    eligibility: "Graduate/Post-Graduate with B.Ed and CTET/TET qualification (varies by post — PRT/TGT/PGT)",
    ageLimit: "Up to 30 years typically (relaxable)",
    vacancies: "Varies widely — a few hundred to a few thousand depending on the cycle",
    salary: "Pay Level 6–8 (₹35,400–₹1,51,100/month range) depending on post",
    selection: ["Written Exam (objective)", "Document Verification/Interview for some posts"],
    pattern: ["General Awareness, Reasoning, Quant, Hindi/English language, Teaching subject/pedagogy"],
    syllabus: ["Subject-specific pedagogy for the post applied to", "General knowledge & reasoning"]
  },
  "State PSC": {
    full: "State Public Service Commission Exams (e.g., UPPSC, MPPSC, BPSC, MPSC)",
    conductedBy: "Respective State Public Service Commission",
    frequency: "Once a year (per state, timelines vary)",
    eligibility: "Graduate in any discipline",
    ageLimit: "21–40 years typically (varies significantly by state)",
    vacancies: "Varies by state — anywhere from 100 to 1,000+ per cycle",
    salary: "Comparable to central Group A/B services within that state — often Pay Level 7–10 (~₹44,900–₹1,00,000+/month) for top posts",
    selection: ["Preliminary Exam (objective)", "Main Exam (descriptive)", "Interview"],
    pattern: ["Similar structure to UPSC CSE but with state-specific General Studies content"],
    syllabus: ["State history, geography & culture", "National & state current affairs", "Indian Polity, Economy, General Science"]
  },
  "State CET (Engineering/Medical)": {
    full: "State Common Entrance Test (Engineering/Medical admissions — e.g., MHT-CET, WBJEE, KCET)",
    conductedBy: "Respective State CET Cell/Board",
    frequency: "Once a year",
    eligibility: "Class 12 with PCM (Engineering) or PCB (Medical)",
    vacancies: "N/A — determines admission rank for state engineering/medical/pharmacy colleges",
    salary: "N/A — this is an admission exam, not a recruitment exam",
    selection: ["Single entrance test, followed by centralized counselling based on rank"],
    pattern: ["Objective type — Physics, Chemistry, Maths (Engineering) or Biology (Medical)"],
    syllabus: ["Class 11 & 12 level Physics, Chemistry, Maths/Biology as per the state board syllabus"]
  },
  "State Police Recruitment (SI/Constable)": {
    full: "State Police Recruitment — Sub-Inspector (SI) / Constable",
    conductedBy: "Respective State Police Recruitment Board",
    frequency: "As per vacancy (varies by state)",
    eligibility: "Class 12 (Constable) or Graduate (Sub-Inspector)",
    ageLimit: "18–25 years (Constable), 20–28 years (SI), varies by state",
    vacancies: "Often several thousand per state when notified",
    salary: "Constable: Pay Level 3 (~₹21,700–₹69,100/month); SI: Pay Level 6 (~₹35,400–₹1,12,400/month)",
    selection: ["Written Exam (objective)", "Physical Efficiency & Measurement Test", "Medical Exam", "Document Verification"],
    pattern: ["General Knowledge, Reasoning, Numerical Ability, state-specific language paper"],
    syllabus: ["State-specific General Knowledge & current affairs", "Basic Maths & Reasoning", "Local language proficiency"]
  },
  "CLAT": {
    full: "Common Law Admission Test (CLAT)",
    conductedBy: "Consortium of National Law Universities",
    frequency: "Once a year",
    eligibility: "Class 12 pass (UG) with minimum 45% marks (40% for reserved categories)",
    vacancies: "N/A — admission exam for ~24 National Law Universities and other law colleges",
    salary: "N/A — an admission exam; law graduates from top NLUs often start at ₹10–20+ lakh/year in top law firms",
    selection: ["Single entrance test, followed by centralized counselling based on rank"],
    pattern: ["150 objective questions, 2 hours — passage-based comprehension format"],
    syllabus: ["English Language", "Current Affairs & General Knowledge", "Legal Reasoning", "Logical Reasoning", "Quantitative Techniques"]
  },
  "State Judicial Services Exam": {
    full: "State Judicial Services Examination (Civil Judge / Munsif posts)",
    conductedBy: "Respective State Public Service Commission/High Court",
    frequency: "As per vacancy (varies by state)",
    eligibility: "LLB degree, enrolled as an advocate (requirements vary by state)",
    ageLimit: "21–35 years typically (varies by state)",
    vacancies: "Varies — typically 50–300 per state cycle",
    salary: "Starting basic pay for Civil Judge is typically ₹77,840–₹1,36,520/month as per the latest judicial pay recommendations",
    selection: ["Preliminary Exam (objective)", "Main Exam (descriptive, law papers)", "Viva-Voce/Interview"],
    pattern: ["Prelims: GK + Law objective paper", "Mains: Multiple law papers (Civil, Criminal, Procedural law) + language paper"],
    syllabus: ["Civil Law (CPC, Contract, Property)", "Criminal Law (IPC, CrPC, Evidence Act)", "Constitutional Law", "Local/regional language"]
  },
  "CA (Chartered Accountancy)": {
    full: "Chartered Accountancy — Foundation, Intermediate & Final (ICAI)",
    conductedBy: "Institute of Chartered Accountants of India (ICAI)",
    frequency: "Exams held 3 times a year (Jan/May-June/Sept, varies by level)",
    eligibility: "Foundation: after Class 12; direct entry to Intermediate possible for graduates",
    vacancies: "N/A — a professional qualification, not direct government recruitment",
    salary: "Freshly qualified CAs typically start between ₹7–12 lakh/year in India (₹25–70+ lakh/year via international campus placements at top firms)",
    selection: ["Foundation exam", "Articleship (3 years practical training) + Intermediate exam", "Final exam"],
    pattern: ["Foundation: 4 papers (objective + descriptive)", "Intermediate: 6 papers across 2 groups", "Final: 6 papers across 2 groups"],
    syllabus: ["Accounting, Law, Economics, Maths & Stats (Foundation)", "Advanced Accounting, Taxation, Auditing, Costing, Financial Management (Inter & Final)"]
  },
  "CS (Company Secretary)": {
    full: "Company Secretary — Foundation, Executive & Professional (ICSI)",
    conductedBy: "Institute of Company Secretaries of India (ICSI)",
    frequency: "Exams held twice a year (June & December)",
    eligibility: "Foundation: after Class 12; direct entry to Executive for graduates",
    vacancies: "N/A — a professional qualification",
    salary: "Freshly qualified CS professionals typically start between ₹6–10 lakh/year, more in corporate legal/compliance roles with experience",
    selection: ["Foundation exam", "Executive exam", "Professional exam", "Practical training (21 months)"],
    pattern: ["Foundation: 4 papers", "Executive: 8 papers across 2 modules", "Professional: 9 papers across 3 modules"],
    syllabus: ["Business Law, Economics, Accounting (Foundation)", "Company Law, Securities Law, Tax Law, Governance (Executive & Professional)"]
  },
  "CMA (Cost & Management Accountant)": {
    full: "Cost & Management Accountant — Foundation, Intermediate & Final (ICMAI)",
    conductedBy: "Institute of Cost Accountants of India (ICMAI)",
    frequency: "Exams held twice a year (June & December)",
    eligibility: "Foundation: after Class 12; direct entry to Intermediate for graduates",
    vacancies: "N/A — a professional qualification",
    salary: "Freshly qualified CMAs typically start between ₹6–9 lakh/year in cost accounting, finance and manufacturing companies",
    selection: ["Foundation exam", "Intermediate exam", "Final exam", "Practical training"],
    pattern: ["Foundation: 4 papers", "Intermediate: 8 papers across 2 groups", "Final: 8 papers across 2 groups"],
    syllabus: ["Accounting, Costing fundamentals, Laws, Economics (Foundation)", "Cost & Management Accounting, Taxation, Financial Management, Strategic Management (Inter & Final)"]
  },
  "CAT (MBA Entrance)": {
    full: "Common Admission Test (CAT) for MBA/PGDM admissions",
    conductedBy: "IIMs (on rotation)",
    frequency: "Once a year (November)",
    eligibility: "Graduate in any discipline with minimum 50% marks (45% for reserved categories)",
    vacancies: "N/A — admission exam for IIMs and 1,000+ other B-schools",
    salary: "N/A directly — top IIM graduates often receive placement packages of ₹20–30+ lakh/year",
    selection: ["Single computer-based test", "Followed by WAT/GD/PI rounds at individual institutes"],
    pattern: ["3 sections, 2 hours — Verbal Ability & Reading Comprehension, Data Interpretation & Logical Reasoning, Quantitative Ability"],
    syllabus: ["Reading Comprehension & Verbal Ability", "Data Interpretation & Logical Reasoning", "Quantitative Ability (Class 10–12 level Maths)"]
  },
  "JEE Main & Advanced": {
    full: "Joint Entrance Examination — Main & Advanced",
    conductedBy: "JEE Main: National Testing Agency (NTA); JEE Advanced: an IIT (on rotation)",
    frequency: "JEE Main twice a year (Jan & April); JEE Advanced once a year (after Main)",
    eligibility: "Class 12 with Physics, Chemistry & Maths",
    vacancies: "N/A — an admission exam. IITs together offer ~17,000+ seats; NITs/IIITs/GFTIs via JEE Main offer tens of thousands more",
    salary: "N/A — an admission exam; engineering salaries depend on college & branch",
    selection: ["JEE Main (objective)", "Top ~2.5 lakh candidates qualify for JEE Advanced", "JEE Advanced (objective + numerical) decides IIT admission"],
    pattern: ["JEE Main: Physics, Chemistry, Maths — objective + numerical, 3 hours", "JEE Advanced: 2 papers, mixed question types, higher difficulty"],
    syllabus: ["Class 11–12 NCERT-level Physics, Chemistry & Mathematics, with advanced problem-solving for JEE Advanced"]
  },
  "NEET (UG)": {
    full: "National Eligibility cum Entrance Test — Undergraduate (NEET-UG)",
    conductedBy: "National Testing Agency (NTA)",
    frequency: "Once a year",
    eligibility: "Class 12 with Physics, Chemistry & Biology",
    vacancies: "N/A — admission exam for ~1,00,000+ MBBS/BDS/AYUSH seats across India",
    salary: "N/A — an admission exam; doctor salaries depend on specialisation & sector",
    selection: ["Single written exam, followed by centralized/state counselling based on rank"],
    pattern: ["200 questions (180 to be attempted), objective, 3 hours 20 minutes — Physics, Chemistry, Botany, Zoology"],
    syllabus: ["Class 11–12 NCERT-level Physics, Chemistry & Biology"]
  },
  "NATA": {
    full: "National Aptitude Test in Architecture (NATA)",
    conductedBy: "Council of Architecture (CoA)",
    frequency: "Multiple times a year",
    eligibility: "Class 12 with Maths",
    vacancies: "N/A — admission exam for B.Arch programs",
    salary: "N/A — an admission exam",
    selection: ["Single test combining drawing, aptitude and MCQ sections"],
    pattern: ["Drawing test, Mathematics & General Aptitude MCQs, PCM-based reasoning"],
    syllabus: ["Diagrammatic & spatial reasoning", "Observation & drawing skills", "Class 11–12 Maths", "General aptitude"]
  },
  "NEET-PG": {
    full: "NEET Post-Graduate (for MD/MS admissions)",
    conductedBy: "National Board of Examinations (NBE)",
    frequency: "Once a year",
    eligibility: "MBBS degree with completed internship",
    vacancies: "N/A — admission exam for MD/MS/PG Diploma seats",
    salary: "N/A — an admission exam; PG doctor stipends vary by state/college (~₹60,000–1,00,000+/month during residency)",
    selection: ["Single computer-based test, followed by counselling"],
    pattern: ["200 objective questions, 3.5 hours, covering all MBBS subjects"],
    syllabus: ["Complete MBBS curriculum — pre-clinical, para-clinical and clinical subjects"]
  },
  "NEET-MDS": {
    full: "NEET Master of Dental Surgery (MDS)",
    conductedBy: "National Board of Examinations (NBE)",
    frequency: "Once a year",
    eligibility: "BDS degree with completed internship",
    vacancies: "N/A — admission exam for MDS seats",
    salary: "N/A — an admission exam",
    selection: ["Single computer-based test, followed by counselling"],
    pattern: ["240 objective questions covering the BDS curriculum"],
    syllabus: ["Complete BDS curriculum — pre-clinical and clinical dental subjects"]
  },
  "GPAT": {
    full: "Graduate Pharmacy Aptitude Test (GPAT)",
    conductedBy: "National Testing Agency (NTA)",
    frequency: "Once a year",
    eligibility: "B.Pharm degree (final year students can also apply)",
    vacancies: "N/A — admission exam for M.Pharm seats; also used by some PSUs for pharma recruitment",
    salary: "N/A — an admission exam",
    selection: ["Single computer-based test"],
    pattern: ["125 objective questions, 3 hours, covering the B.Pharm syllabus"],
    syllabus: ["Pharmaceutics, Pharmaceutical Chemistry, Pharmacology, Pharmacognosy, Biochemistry & related B.Pharm subjects"]
  },
  "CSIR-NET": {
    full: "CSIR-UGC National Eligibility Test (for Science subjects)",
    conductedBy: "National Testing Agency (NTA)",
    frequency: "Twice a year",
    eligibility: "Master's degree in a science subject (Life Sciences, Chemical Sciences, Physical Sciences, Maths, Earth Sciences)",
    vacancies: "N/A — qualifying gives eligibility for JRF (with stipend) or Assistant Professor posts",
    salary: "JRF stipend ~₹37,000/month for the first 2 years, ~₹42,000/month after",
    selection: ["Single objective exam"],
    pattern: ["3 parts — General Aptitude, Subject-specific core, Subject-specific advanced"],
    syllabus: ["Postgraduate-level syllabus of the chosen science subject"]
  },
  "ICAR AIEEA": {
    full: "ICAR — All India Entrance Examination for Admission (Agriculture)",
    conductedBy: "Indian Council of Agricultural Research (ICAR), via NTA",
    frequency: "Once a year",
    eligibility: "Class 12 with PCB/PCM (UG); relevant Bachelor's degree for PG",
    vacancies: "N/A — admission exam for agricultural universities across India",
    salary: "N/A — an admission exam",
    selection: ["Single objective exam, followed by counselling"],
    pattern: ["Objective MCQs covering PCB/PCM at Class 12 level (for UG)"],
    syllabus: ["Class 11–12 Physics, Chemistry, Biology/Maths with an agriculture-oriented emphasis"]
  },
  "IMU-CET": {
    full: "Indian Maritime University — Common Entrance Test",
    conductedBy: "Indian Maritime University",
    frequency: "Once or twice a year",
    eligibility: "Class 12 with Physics, Chemistry & Maths (for UG marine courses)",
    vacancies: "N/A — admission exam for marine engineering & nautical science seats",
    salary: "N/A — an admission exam; Merchant Navy salaries often range ₹3–8+ lakh/year even at entry level",
    selection: ["Single objective exam, followed by counselling & medical fitness test"],
    pattern: ["Objective MCQs — Physics, Chemistry, Maths, English, General Aptitude"],
    syllabus: ["Class 11–12 Physics, Chemistry & Maths", "English comprehension", "General knowledge & aptitude"]
  }
};

/* ---------------- 1b. Exam pill rendering + modal ---------------- */

function examPill(name, colorClass) {
  const safe = name.replace(/"/g, "&quot;");
  return `<button type="button" class="exam-pill ${colorClass || ""}" data-exam="${safe}">${name}</button>`;
}

function openExamModal(name) {
  const d = EXAM_DETAILS[name];
  const overlay = document.getElementById("examModal");
  const body = document.getElementById("modalBody");
  if (!d) {
    body.innerHTML = `<p class="modal-eyebrow">Exam details</p><h3 class="modal-title">${name}</h3><p>Detailed information for this exam is coming soon.</p>`;
  } else {
    body.innerHTML = `
      <p class="modal-eyebrow">Exam details</p>
      <h3 class="modal-title">${d.full}</h3>
      <div class="modal-meta">
        <div class="meta-box"><div class="meta-label">Conducted by</div><div class="meta-value">${d.conductedBy}</div></div>
        <div class="meta-box"><div class="meta-label">Frequency</div><div class="meta-value">${d.frequency}</div></div>
        <div class="meta-box"><div class="meta-label">Eligibility</div><div class="meta-value">${d.eligibility}</div></div>
        ${d.ageLimit ? `<div class="meta-box"><div class="meta-label">Age Limit</div><div class="meta-value">${d.ageLimit}</div></div>` : ""}
        <div class="meta-box pop"><div class="meta-label">Vacancies</div><div class="meta-value">${d.vacancies}</div></div>
        <div class="meta-box pop"><div class="meta-label">Salary / Pay</div><div class="meta-value">${d.salary}</div></div>
      </div>
      <div class="modal-section">
        <h4><span class="dot-flag dot-violet"></span>Selection Process</h4>
        <ul>${d.selection.map(s => `<li>${s}</li>`).join("")}</ul>
      </div>
      <div class="modal-section">
        <h4><span class="dot-flag dot-mint"></span>Exam Pattern</h4>
        <ul>${d.pattern.map(s => `<li>${s}</li>`).join("")}</ul>
      </div>
      <div class="modal-section">
        <h4><span class="dot-flag dot-amber"></span>Syllabus</h4>
        <ul>${d.syllabus.map(s => `<li>${s}</li>`).join("")}</ul>
      </div>`;
  }
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeExamModal() {
  document.getElementById("examModal").classList.remove("open");
  document.body.style.overflow = "";
}

/* ---------------- 1c. Career details database (91 careers, full depth) ---------------- */

const CAREER_DETAILS = {
  "Software Developer": { salary: "₹4-8 LPA for freshers in services companies; ₹8-25+ LPA at product companies/startups", skills: ["Programming languages (JavaScript, Python, Java or C++)", "Data structures & algorithms", "Git/version control", "Problem-solving & debugging"], howTo: ["Build 2-3 solid personal projects or a portfolio website", "Learn a full stack (frontend + backend) or specialise in one", "Practice coding problems on LeetCode/HackerRank", "Apply via campus placements, internships, or direct applications"], whereToApply: ["IT services companies (TCS, Infosys, Wipro)", "Product companies & startups", "Freelance platforms (Upwork, Toptal)", "Remote-first companies"] },
  "Data Scientist / ML Engineer": { salary: "₹6-12 LPA for freshers; ₹15-30+ LPA with 3-5 years of experience", skills: ["Python, SQL, Statistics", "Machine Learning libraries (scikit-learn, TensorFlow/PyTorch)", "Data visualization & storytelling", "Strong maths foundation (linear algebra, probability)"], howTo: ["Learn Python + SQL + Statistics fundamentals", "Do real projects with public datasets (Kaggle is a good start)", "Build a portfolio on GitHub showcasing your models", "Apply for Data Analyst roles first, then move to Data Science"], whereToApply: ["Tech companies & product startups", "Analytics/consulting firms (Deloitte, Accenture)", "E-commerce & fintech companies", "Freelance/contract data projects"] },
  "DevOps / Cloud Engineer": { salary: "₹5-10 LPA for freshers; ₹15-25+ LPA with experience and certifications", skills: ["Linux fundamentals", "Cloud platforms (AWS/Azure/GCP)", "CI/CD tools (Jenkins, GitHub Actions)", "Docker & Kubernetes"], howTo: ["Get a cloud certification (AWS Solutions Architect / Azure Fundamentals)", "Learn containerization (Docker) and orchestration (Kubernetes)", "Practice setting up CI/CD pipelines for personal projects", "Apply for Junior DevOps/Cloud Support roles"], whereToApply: ["IT services & cloud consulting firms", "Product companies with in-house infra teams", "Startups scaling their infrastructure"] },
  "Cybersecurity Analyst": { salary: "₹5-9 LPA for freshers; ₹15-25+ LPA with certifications and experience", skills: ["Networking fundamentals", "Security tools (Wireshark, Nmap, SIEM)", "Ethical hacking basics", "Certifications like CEH/Security+"], howTo: ["Learn networking (CCNA-level) and OS fundamentals", "Get a certification like CompTIA Security+ or CEH", "Practice on platforms like TryHackMe/HackTheBox", "Apply for SOC Analyst or Security Analyst entry roles"], whereToApply: ["Cybersecurity firms", "Banks & fintech companies", "IT services companies' security divisions"] },
  "Design Engineer": { salary: "₹3.5-6 LPA for freshers; ₹8-15+ LPA with experience", skills: ["CAD software (AutoCAD, SolidWorks, CATIA)", "Mechanical design principles", "Material science basics", "GD&T (Geometric Dimensioning & Tolerancing)"], howTo: ["Master at least one CAD tool during college", "Do an internship in a design/manufacturing firm", "Build a portfolio of design projects", "Apply through campus placements or design firm openings"], whereToApply: ["Automobile companies", "Manufacturing & product design firms", "Consulting engineering firms"] },
  "Production / Manufacturing Engineer": { salary: "₹3.5-6 LPA for freshers; ₹8-14+ LPA with experience", skills: ["Process planning & optimisation", "Lean manufacturing/Six Sigma basics", "Quality control methods", "Shop-floor supervision"], howTo: ["Get hands-on shop-floor exposure via internships", "Learn Lean/Six Sigma basics (Green Belt certification helps)", "Apply to core manufacturing companies through campus placement"], whereToApply: ["Automobile & manufacturing plants", "FMCG production units", "PSU manufacturing units (via GATE)"] },
  "Automobile Engineer": { salary: "₹3.5-6.5 LPA for freshers; ₹10-18+ LPA with experience", skills: ["Automotive systems knowledge (engines, transmission)", "CAD/CAE tools", "Testing & validation processes"], howTo: ["Specialise via electives/internships in automotive design or testing", "Learn CAD/CAE tools relevant to auto design", "Apply to automobile OEMs and ancillary companies"], whereToApply: ["Tata Motors, Maruti Suzuki, Mahindra", "Auto component manufacturers", "EV startups"] },
  "Quality / Maintenance Engineer": { salary: "₹3-5.5 LPA for freshers; ₹8-12+ LPA with experience", skills: ["Quality control tools (Six Sigma, SPC)", "Preventive maintenance planning", "Equipment troubleshooting"], howTo: ["Learn quality standards (ISO 9001) and Six Sigma basics", "Gain hands-on plant/maintenance exposure via internship", "Apply to manufacturing & process industries"], whereToApply: ["Manufacturing plants", "Process industries (steel, cement, FMCG)", "Automobile ancillary units"] },
  "Site / Structural Engineer": { salary: "₹3-6 LPA for freshers; ₹10-18+ LPA with experience", skills: ["Structural analysis software (STAAD Pro, ETABS)", "Construction materials & methods", "Site supervision & safety"], howTo: ["Learn structural design software during college", "Do a site internship to understand real construction", "Apply to construction & infra companies or consulting firms"], whereToApply: ["L&T, Shapoorji Pallonji, and other construction majors", "Structural consulting firms", "Real estate developers"] },
  "Project Manager": { salary: "₹8-15 LPA with a few years of experience; ₹20+ LPA for senior project managers", skills: ["Project planning tools (MS Project, Primavera)", "Budgeting & resource management", "Stakeholder communication"], howTo: ["Gain a few years of site/engineering experience first", "Consider a PMP certification or PG diploma in project management", "Move into project coordination and then management roles"], whereToApply: ["Construction & infrastructure companies", "Real estate developers", "Engineering consulting firms"] },
  "Urban Planner": { salary: "₹4-8 LPA for freshers; ₹12-20+ LPA in senior government/consulting roles", skills: ["GIS software (ArcGIS, QGIS)", "Urban design principles", "Policy & zoning knowledge"], howTo: ["Pursue a Master's in Urban/Town Planning after B.Arch/B.Planning", "Learn GIS tools for spatial analysis", "Apply to government town planning departments or private consultancies"], whereToApply: ["State Town Planning Departments", "Urban development authorities", "Private urban design consultancies"] },
  "Quantity Surveyor": { salary: "₹3.5-6 LPA for freshers; ₹10-15+ LPA with experience", skills: ["Cost estimation software", "Contract & tendering knowledge", "Material & labour costing"], howTo: ["Learn quantity estimation and costing software (CostX, etc.)", "Do an internship with a construction/consulting firm", "Apply to construction companies or QS consultancies"], whereToApply: ["Construction companies", "Quantity surveying consultancies", "Real estate developers"] },
  "Power / Electrical Engineer": { salary: "₹4-7 LPA for freshers; ₹10-18+ LPA in PSUs/senior roles", skills: ["Power systems fundamentals", "Electrical design software (ETAP)", "Safety & compliance standards"], howTo: ["Specialise in power systems/electrical design during electives", "Do an internship with a power company or PSU", "Apply through GATE-based PSU recruitment or campus placement"], whereToApply: ["NTPC, PGCIL, State Electricity Boards", "Private power & energy companies", "Electrical equipment manufacturers"] },
  "Control & Automation Engineer": { salary: "₹4-7 LPA for freshers; ₹12-20+ LPA with experience", skills: ["PLC & SCADA programming", "Industrial automation systems", "Instrumentation basics"], howTo: ["Learn PLC/SCADA programming (Siemens, Allen Bradley)", "Do a certification in industrial automation", "Apply to automation & process industries"], whereToApply: ["Industrial automation companies (Siemens, ABB, Honeywell)", "Manufacturing & process plants", "System integrators"] },
  "Renewable Energy Engineer": { salary: "₹4-8 LPA for freshers; ₹12-20+ LPA with experience", skills: ["Solar/wind system design", "Energy storage & grid integration", "Sustainability & policy awareness"], howTo: ["Take electives/certifications in renewable energy systems", "Intern with a solar/wind energy company", "Apply to renewable energy developers and EPC companies"], whereToApply: ["Solar & wind energy companies (Adani Green, Tata Power Solar)", "EPC & energy consulting firms", "Government renewable energy missions"] },
  "VLSI / Chip Design Engineer": { salary: "₹6-12 LPA for freshers; ₹20-40+ LPA with a few years of experience", skills: ["Verilog/VHDL", "Digital & analog circuit design", "EDA tools (Cadence, Synopsys)"], howTo: ["Learn Verilog/VHDL and digital design fundamentals deeply", "Do a VLSI certification course or M.Tech for a better entry", "Apply to semiconductor & chip design companies"], whereToApply: ["Semiconductor companies (Intel, Qualcomm, NVIDIA, Texas Instruments)", "Chip design startups", "EDA tool companies"] },
  "Embedded Systems Engineer": { salary: "₹4-8 LPA for freshers; ₹14-22+ LPA with experience", skills: ["C/C++ programming", "Microcontrollers (ARM, AVR)", "RTOS basics", "Hardware-software interfacing"], howTo: ["Build hands-on projects with microcontrollers (Arduino/Raspberry Pi)", "Learn embedded C and RTOS concepts", "Apply to electronics/IoT companies"], whereToApply: ["Electronics manufacturing companies", "IoT & consumer electronics startups", "Automotive embedded systems teams"] },
  "Telecom / IoT Engineer": { salary: "₹4-8 LPA for freshers; ₹14-22+ LPA with experience", skills: ["Networking & communication protocols", "IoT platforms (AWS IoT, Azure IoT)", "5G/wireless technology basics"], howTo: ["Learn networking fundamentals and IoT protocols (MQTT, CoAP)", "Build a small IoT project end-to-end", "Apply to telecom companies or IoT solution providers"], whereToApply: ["Telecom companies (Jio, Airtel, Vodafone Idea)", "IoT solution providers", "Networking equipment companies"] },
  "Process Engineer": { salary: "₹5-9 LPA for freshers; ₹15-25+ LPA in PSUs/senior roles", skills: ["Process simulation software (Aspen HYSYS)", "Chemical process design", "Safety & environmental compliance"], howTo: ["Learn process simulation tools during college", "Intern at a refinery/chemical plant", "Apply via GATE-based PSU recruitment or campus placement"], whereToApply: ["IOCL, ONGC, GAIL, HPCL (via GATE)", "Private petrochemical & refinery companies", "Chemical process consulting firms"] },
  "Plant Operations Engineer": { salary: "₹4-7 LPA for freshers; ₹12-18+ LPA with experience", skills: ["Plant operations & safety protocols", "Equipment monitoring & troubleshooting", "Process optimisation"], howTo: ["Gain shop-floor exposure through internships", "Learn plant safety standards (HAZOP, etc.)", "Apply to manufacturing/process plants"], whereToApply: ["Petrochemical & manufacturing plants", "FMCG production units", "PSU process industries"] },
  "Quality Control Chemist": { salary: "₹3-5.5 LPA for freshers; ₹8-14+ LPA with experience", skills: ["Analytical chemistry techniques (HPLC, GC)", "Quality standards (GMP, ISO)", "Lab safety & documentation"], howTo: ["Get strong hands-on lab experience during college", "Learn analytical instrumentation (HPLC/GC)", "Apply to pharma/FMCG/chemical company QC labs"], whereToApply: ["Pharmaceutical companies", "FMCG & chemical manufacturing companies", "Testing & certification labs"] },
  "Core Branch Engineer": { salary: "₹3.5-7 LPA for freshers; ₹10-18+ LPA with experience", skills: ["Core technical subjects of your branch", "Industry-specific software/tools", "Practical/internship exposure"], howTo: ["Focus on core subjects and do at least one relevant internship", "Build a small project applying your branch's fundamentals", "Apply through campus placement drives for core companies"], whereToApply: ["Core manufacturing & engineering companies", "PSUs (via GATE)", "Engineering consulting firms"] },
  "Higher Studies": { salary: "N/A during studies — a specialised M.Tech/MS typically boosts starting salary by 30-100% afterward", skills: ["Strong fundamentals in your branch", "Research aptitude", "GATE/GRE preparation"], howTo: ["Prepare for GATE (M.Tech in India) or GRE+TOEFL (MS abroad)", "Shortlist colleges and apply with a strong SOP & LORs", "Look for assistantships/scholarships to fund your studies"], whereToApply: ["IITs/NITs (via GATE)", "Foreign universities (via GRE/TOEFL)", "Research labs & PSU-sponsored programs"] },
  "Engineering": { salary: "Varies hugely by college & branch — ₹3-8 LPA average, ₹15-50+ LPA for top IIT branches", skills: ["Strong PCM fundamentals", "Problem-solving & logical thinking", "Basic coding exposure (helps in every branch now)"], howTo: ["Clear JEE Main (and Advanced for IITs) or a State CET", "Choose a branch aligned with your interest, not just trends", "Use internships every year to build real skills"], whereToApply: ["Any IIT/NIT/State engineering college", "Private engineering colleges with good placement records"] },
  "Architecture": { salary: "₹3-6 LPA for freshers; ₹12-20+ LPA for experienced/independent architects", skills: ["Design software (AutoCAD, SketchUp, Revit)", "Sketching & spatial visualization", "Building codes & sustainability principles"], howTo: ["Clear NATA or JEE Paper 2 for B.Arch admission", "Build a strong design portfolio through college projects", "Do internships with architecture firms during college"], whereToApply: ["Architecture & design studios", "Real estate & construction firms", "Government architecture departments"] },
  "Defence Forces": { salary: "Starting pay Level 10 (~₹56,100/month) plus allowances, rising steadily with rank", skills: ["Physical fitness", "Leadership & discipline", "SSB interview preparation (group tasks, psychology tests)"], howTo: ["Clear NDA (after 12th) or CDS (after graduation)", "Prepare physically well in advance for fitness tests", "Clear the SSB interview and medical examination"], whereToApply: ["Indian Army, Navy, Air Force (via NDA/CDS/AFCAT)"] },
  "Merchant Navy": { salary: "₹3-8+ LPA even at entry level, often tax-free on international waters", skills: ["Physical & medical fitness", "Basic engineering/nautical aptitude", "Discipline for long sea deployments"], howTo: ["Clear IMU-CET for a marine engineering/nautical science course", "Complete mandatory sea-time training", "Get certified by the Directorate General of Shipping"], whereToApply: ["Shipping companies (Indian & international)", "Maritime training institutes for placement"] },
  "Pilot Training": { salary: "₹8-15 LPA as a fresh First Officer; ₹40+ LPA as a senior Captain", skills: ["Strong PCM background", "Physical fitness & good eyesight", "Discipline and quick decision-making"], howTo: ["Clear Class 12 with PCM", "Enroll in a DGCA-approved flying school for a CPL", "Log required flying hours and clear DGCA exams"], whereToApply: ["Commercial airlines (IndiGo, Air India, etc.)", "Charter & cargo airlines"] },
  "Ethical Hacking / Programming": { salary: "₹4-9 LPA for freshers; ₹15-25+ LPA with experience and certifications", skills: ["Programming fundamentals", "Networking & security basics", "Certifications (CEH)"], howTo: ["Learn programming and networking basics alongside your degree", "Practice on platforms like TryHackMe/HackTheBox", "Get certified (CEH) and apply for junior security roles"], whereToApply: ["Cybersecurity firms", "IT companies' security teams", "Bug bounty platforms (freelance)"] },
  "Research Assistant": { salary: "₹2.5-5 LPA for freshers; higher with M.Sc/Ph.D and experience", skills: ["Subject-matter expertise", "Lab/research methodology", "Scientific writing"], howTo: ["Assist a professor/lab during your final year for hands-on experience", "Consider an M.Sc for deeper specialisation", "Apply to research institutes and university labs"], whereToApply: ["University research labs", "Government research institutes (CSIR, DRDO)", "Private R&D companies"] },
  "Data Analyst": { salary: "₹4-7 LPA for freshers; ₹10-18+ LPA with experience", skills: ["Excel & SQL", "Data visualization tools (Power BI, Tableau)", "Basic statistics"], howTo: ["Learn Excel, SQL and a visualization tool", "Practice on real datasets and build a small portfolio", "Apply for entry-level analyst roles across industries"], whereToApply: ["Analytics & consulting firms", "E-commerce & fintech companies", "Any large company with a data team"] },
  "Science Teacher": { salary: "₹3-6 LPA in private schools; ₹35,000-45,000/month in government schools (Pay Level 6-7)", skills: ["Subject expertise", "Communication & classroom management", "B.Ed (for formal teaching posts)"], howTo: ["Complete a B.Ed after your degree (2-year program)", "Clear CTET/State TET for government school eligibility", "Apply to schools or coaching institutes"], whereToApply: ["Government & private schools", "EdTech platforms", "Coaching institutes"] },
  "M.Sc / Higher Studies": { salary: "N/A during studies — opens doors to research, teaching (NET) or industry roles with better pay", skills: ["Strong undergraduate science foundation", "Research aptitude", "Entrance exam preparation (CUET PG, institute-specific)"], howTo: ["Prepare for your target M.Sc entrance exam", "Choose a specialisation aligned with career goals", "Look for assistantships or research opportunities during the program"], whereToApply: ["Central & state universities", "IISc/IITs (for science M.Sc programs)"] },
  "Architect": { salary: "₹3-6 LPA for freshers; ₹15-25+ LPA for senior/independent architects", skills: ["Design & drafting software", "Project management basics", "Client communication"], howTo: ["Complete B.Arch and register with the Council of Architecture", "Gain experience at a design studio for 2-3 years", "Consider starting independent practice or joining a larger firm"], whereToApply: ["Architecture firms", "Real estate developers", "Independent practice"] },
  "Interior Designer": { salary: "₹3-6 LPA for freshers; ₹12-20+ LPA with experience and a strong portfolio", skills: ["Space planning & design software", "Material & furnishing knowledge", "Client management"], howTo: ["Pursue a specialisation/certification in interior design", "Build a portfolio through internships or personal projects", "Apply to design studios or start freelancing"], whereToApply: ["Interior design studios", "Real estate & hospitality companies", "Freelance/independent practice"] },
  "Junior / Site Engineer": { salary: "₹2-4 LPA for freshers; ₹6-10+ LPA with experience", skills: ["Site supervision basics", "Reading engineering drawings", "Basic safety protocols"], howTo: ["Gain practical exposure via internships during the Diploma", "Apply for junior/site engineer roles in construction or manufacturing", "Consider lateral entry into B.Tech for further growth"], whereToApply: ["Construction companies", "Manufacturing units", "Infrastructure projects"] },
  "Lateral Entry B.Tech": { salary: "N/A — this is an academic pathway, not a job", skills: ["Strong Diploma-level fundamentals", "State lateral entry exam preparation"], howTo: ["Clear your state's lateral entry exam (if required) or apply via direct Diploma-quota admission", "Join directly into the 2nd year of a B.Tech program", "Use the remaining years to build skills/internships"], whereToApply: ["Engineering colleges offering lateral entry admission"] },
  "Explore cross-stream options": { salary: "Varies widely depending on the field chosen", skills: ["Adaptability", "Communication & business fundamentals", "Willingness to reskill"], howTo: ["Identify a cross-stream field of interest (management, analytics, government exams)", "Take a short certification or course to bridge the gap", "Apply for entry-level roles in the new field or prepare for relevant exams"], whereToApply: ["Varies by chosen field — business, analytics, or government sector"] },
  "Management / MBA route": { salary: "₹8-30+ LPA post-MBA depending on the institute and specialisation", skills: ["Analytical & leadership skills", "CAT/MBA entrance exam preparation", "Business fundamentals"], howTo: ["Gain 1-2 years of work experience (optional but helpful)", "Prepare for CAT/XAT/MAT and other MBA entrance exams", "Choose a specialisation (Finance, Marketing, Operations, etc.)"], whereToApply: ["IIMs and other top B-schools", "Corporate management trainee programs post-MBA"] },
  "Medicine (MBBS)": { salary: "₹6-10 LPA for a fresh MBBS doctor; ₹15-40+ LPA after specialisation (MD/MS)", skills: ["Strong PCB foundation", "Patience & empathy", "Long-term commitment to studying"], howTo: ["Clear NEET-UG with a strong rank", "Complete MBBS (5.5 years including internship)", "Register with the Medical Council and start practicing or pursue MD/MS"], whereToApply: ["Government & private hospitals", "Own clinic/private practice", "Further specialisation via NEET-PG"] },
  "Dentistry (BDS)": { salary: "₹4-8 LPA for freshers; ₹15-25+ LPA after MDS specialisation or with an established practice", skills: ["Strong PCB foundation", "Manual dexterity", "Patient communication"], howTo: ["Clear NEET-UG for BDS admission", "Complete BDS (5 years including internship)", "Register with the Dental Council and start practicing or pursue MDS"], whereToApply: ["Private dental clinics", "Hospitals with dental departments", "Own practice"] },
  "Pharmacy": { salary: "₹3-5 LPA for freshers; ₹10-18+ LPA with experience or M.Pharm specialisation", skills: ["Pharmaceutical sciences knowledge", "Regulatory awareness", "Attention to detail"], howTo: ["Complete B.Pharm (4 years)", "Register with the State Pharmacy Council", "Choose between retail pharmacy, hospital pharmacy, or pharma industry roles"], whereToApply: ["Pharma companies (Cipla, Sun Pharma)", "Retail pharmacy chains", "Hospitals"] },
  "Nursing": { salary: "₹2.5-5 LPA in India for freshers; significantly higher for international placements", skills: ["Clinical & patient care skills", "Emotional resilience", "Attention to detail"], howTo: ["Complete B.Sc Nursing (4 years)", "Register with the State Nursing Council", "Apply to hospitals or consider international nursing placements"], whereToApply: ["Government & private hospitals", "International healthcare systems (UK, Gulf countries)"] },
  "Biotechnology": { salary: "₹3-6 LPA for freshers; ₹10-18+ LPA with M.Sc/Ph.D and experience", skills: ["Lab techniques (PCR, gel electrophoresis)", "Research methodology", "Data analysis"], howTo: ["Complete a B.Sc/B.Tech in Biotechnology", "Gain lab experience via internships", "Pursue M.Sc for research roles or apply directly to biotech/pharma companies"], whereToApply: ["Biotech & pharma research companies", "Research institutes", "Academic labs"] },
  "Agriculture Sciences": { salary: "₹3-6 LPA for freshers; ₹10-15+ LPA with experience in agri-business roles", skills: ["Agronomy & soil science knowledge", "Sustainable farming practices", "Data-driven crop management"], howTo: ["Clear ICAR AIEEA for a B.Sc Agriculture admission", "Gain field exposure through internships", "Apply to agri-companies or government agriculture departments"], whereToApply: ["Government agriculture departments", "Agri-tech startups", "Fertilizer & seed companies"] },
  "Medical Officer": { salary: "₹6-10 LPA for freshers; ₹15-20+ LPA in senior government positions", skills: ["Clinical diagnosis & treatment skills", "Patient communication", "Emergency handling"], howTo: ["Complete MBBS and internship", "Register with the Medical Council", "Apply to government or private hospitals as a Medical Officer"], whereToApply: ["Government hospitals & PHCs", "Private hospitals", "Railways/Defence medical services"] },
  "Specialist Doctor": { salary: "₹15-40+ LPA depending on specialisation and experience", skills: ["Deep specialisation knowledge (via MD/MS)", "Advanced clinical skills", "Continuous learning"], howTo: ["Clear NEET-PG for your chosen specialisation", "Complete MD/MS (3 years)", "Practice independently or join a hospital in that specialty"], whereToApply: ["Super-specialty hospitals", "Private practice", "Teaching hospitals"] },
  "Medical Researcher": { salary: "₹6-12 LPA for freshers; ₹20+ LPA in senior pharma R&D roles", skills: ["Research methodology", "Scientific writing & publishing", "Statistical analysis"], howTo: ["Complete MBBS/relevant degree, then pursue research fellowships", "Publish papers and collaborate with research institutions", "Apply to ICMR/research hospitals or pharma R&D"], whereToApply: ["ICMR & government research institutes", "Pharma company R&D departments", "Academic research hospitals"] },
  "Dental Surgeon": { salary: "₹4-8 LPA for freshers; ₹15-25+ LPA with an established practice", skills: ["Clinical dental procedures", "Patient management", "Use of dental equipment"], howTo: ["Complete BDS and internship", "Register with the Dental Council", "Start practicing at a clinic or set up independent practice"], whereToApply: ["Private dental clinics", "Hospitals", "Independent practice"] },
  "Orthodontist / Specialist": { salary: "₹10-20+ LPA depending on specialisation and location", skills: ["Advanced dental specialisation skills", "Precision & detail-orientation"], howTo: ["Clear NEET-MDS for your chosen specialisation", "Complete MDS (3 years)", "Practice independently or join a specialty clinic"], whereToApply: ["Specialty dental clinics", "Hospitals with dental departments", "Independent practice"] },
  "Pharmacist": { salary: "₹2.5-4.5 LPA for freshers; ₹8-15+ LPA with experience or in pharma industry roles", skills: ["Drug knowledge & dispensing accuracy", "Regulatory compliance", "Customer service"], howTo: ["Complete B.Pharm and register with the State Pharmacy Council", "Gain experience at a retail or hospital pharmacy", "Consider further specialisation (M.Pharm) for R&D roles"], whereToApply: ["Retail pharmacy chains", "Hospital pharmacies", "Pharma companies"] },
  "Drug Inspector": { salary: "Pay Level 7-8 (~₹44,900-₹1,42,400/month) as a government officer", skills: ["Regulatory & compliance knowledge", "Attention to detail", "Documentation skills"], howTo: ["Complete B.Pharm/M.Pharm", "Clear the State Drug Inspector recruitment exam", "Join the state Drug Control department"], whereToApply: ["State Drug Control departments", "Central drug regulatory bodies"] },
  "Pharma R&D": { salary: "₹5-9 LPA for freshers with M.Pharm; ₹15-25+ LPA with experience", skills: ["Research methodology", "Drug formulation & analysis", "Regulatory knowledge"], howTo: ["Complete M.Pharm with a research focus", "Gain lab experience through internships/projects", "Apply to pharma company R&D divisions"], whereToApply: ["Pharma companies (Cipla, Sun Pharma, Dr. Reddy's)", "Contract research organisations"] },
  "Staff Nurse": { salary: "₹2.5-5 LPA in India; significantly higher for international placements", skills: ["Clinical nursing skills", "Patient care & empathy", "Emergency response"], howTo: ["Complete B.Sc Nursing and register with the State Nursing Council", "Gain hospital experience", "Apply to hospitals in India or pursue international placements"], whereToApply: ["Government & private hospitals", "International hospitals (UK, Gulf, etc.)"] },
  "Nurse Educator": { salary: "₹4-8 LPA depending on the institute and experience", skills: ["Clinical expertise", "Teaching & curriculum skills", "M.Sc Nursing qualification"], howTo: ["Gain a few years of clinical nursing experience", "Complete M.Sc Nursing", "Apply to nursing colleges as faculty"], whereToApply: ["Nursing colleges & institutes", "Hospital training departments"] },
  "Lab Technician / Researcher": { salary: "₹2.5-4.5 LPA for freshers; higher with M.Sc/Ph.D", skills: ["Lab techniques & instrumentation", "Data recording & analysis", "Attention to detail"], howTo: ["Complete B.Sc in the relevant science subject", "Gain hands-on lab experience via internships", "Apply to research labs or pursue M.Sc for advancement"], whereToApply: ["Research institutes & university labs", "Diagnostic & testing labs", "Biotech/pharma companies"] },
  "Biotechnologist": { salary: "₹4-7 LPA for freshers with M.Sc; ₹12-20+ LPA with experience", skills: ["Molecular biology techniques", "Research & data analysis", "Regulatory knowledge (for industry roles)"], howTo: ["Complete M.Sc Biotechnology after B.Sc", "Gain research experience through a thesis/internship", "Apply to biotech/pharma companies or research institutes"], whereToApply: ["Biotech & pharma companies", "Research institutes", "Academic labs"] },
  "Healthcare administration": { salary: "₹5-10 LPA for freshers with a specialised degree; ₹15-25+ LPA in senior roles", skills: ["Hospital operations knowledge", "Management & communication skills", "Healthcare policy awareness"], howTo: ["Consider an MBA/PG Diploma in Hospital Administration", "Gain experience in hospital operations or insurance", "Apply to hospital management or healthcare company roles"], whereToApply: ["Hospital chains", "Health insurance companies", "Health-tech startups"] },
  "Medical content / science writing": { salary: "₹3-6 LPA for freshers; ₹10-15+ LPA with experience", skills: ["Strong writing skills", "Ability to simplify complex science", "Research & fact-checking"], howTo: ["Build a portfolio of science/health articles (start a blog if needed)", "Learn SEO and content writing best practices", "Apply to health-tech, pharma, or media companies as a content writer"], whereToApply: ["Health-tech & pharma companies", "Medical journals & media houses", "Freelance content platforms"] },
  "Chartered Accountancy (CA)": { salary: "₹7-12 LPA for freshly qualified CAs; ₹25-70+ LPA via international campus placements at top firms", skills: ["Accounting fundamentals", "Analytical & numerical skills", "Discipline for a multi-year exam journey"], howTo: ["Register for CA Foundation after Class 12", "Clear Foundation → Intermediate → complete Articleship → clear Final", "Apply to CA firms or corporate finance teams after qualifying"], whereToApply: ["Big 4 & mid-size CA firms", "Corporate finance & audit departments", "Independent practice"] },
  "Company Secretary (CS)": { salary: "₹6-10 LPA for freshly qualified CS professionals; ₹15-25+ LPA with experience", skills: ["Corporate law knowledge", "Compliance & governance skills", "Attention to detail"], howTo: ["Register for CS Foundation after Class 12 (or direct entry for graduates)", "Clear Foundation → Executive → Professional + practical training", "Apply to corporate legal/compliance departments"], whereToApply: ["Corporate legal & compliance departments", "CS practice firms", "Listed companies (mandatory CS requirement)"] },
  "Cost & Management Accountant (CMA)": { salary: "₹6-9 LPA for freshly qualified CMAs; ₹15-20+ LPA with experience", skills: ["Cost accounting & analysis", "Financial management", "Strategic planning basics"], howTo: ["Register for CMA Foundation after Class 12", "Clear Foundation → Intermediate → Final + practical training", "Apply to manufacturing/finance companies for cost accounting roles"], whereToApply: ["Manufacturing companies", "Finance & consulting firms", "PSUs"] },
  "B.Com / BBA": { salary: "Varies widely by the path chosen after graduation", skills: ["Business & accounting fundamentals", "Communication skills", "Analytical thinking"], howTo: ["Complete B.Com or BBA (3 years)", "Do internships to gain practical business exposure", "Choose a specialisation path (CA/CS/CMA/MBA/banking) based on interest"], whereToApply: ["Various — depends on specialisation chosen after graduation"] },
  "Banking & Finance": { salary: "₹3-5 LPA for clerk-level roles; ₹8-12+ LPA for PO-level and above", skills: ["Basic finance & banking knowledge", "Customer service", "Numerical aptitude"], howTo: ["Clear a banking entrance exam (IBPS/SBI Clerk or PO)", "Complete required training/probation period", "Grow within the bank through internal promotions/exams"], whereToApply: ["Public & private sector banks", "NBFCs"] },
  "Accountant": { salary: "₹2.5-4.5 LPA for freshers; ₹8-12+ LPA with experience", skills: ["Accounting software (Tally, SAP)", "Taxation basics", "Attention to detail"], howTo: ["Complete B.Com and learn accounting software", "Consider a certification (Tally, GST) for added skills", "Apply to companies' finance/accounts departments"], whereToApply: ["Any company's finance/accounts team", "Accounting & auditing firms"] },
  "Financial Analyst": { salary: "₹4-8 LPA for freshers; ₹15-25+ LPA with CFA/experience", skills: ["Financial modelling (Excel)", "Valuation & analysis techniques", "Market awareness"], howTo: ["Learn financial modelling and valuation techniques", "Consider certifications like CFA for career growth", "Apply to banks, investment firms, or corporate finance teams"], whereToApply: ["Investment banks & financial services firms", "Corporate finance departments", "Equity research firms"] },
  "Tax Consultant": { salary: "₹3.5-6 LPA for freshers; ₹12-20+ LPA with experience/CA qualification", skills: ["Direct & indirect tax knowledge", "Compliance & documentation", "Analytical skills"], howTo: ["Complete B.Com and specialise in taxation (certification or CA)", "Gain experience with a tax consulting firm", "Build a client base or join a corporate tax team"], whereToApply: ["Tax consulting firms", "Corporate tax departments", "Independent practice"] },
  "MBA / Higher Studies": { salary: "₹8-30+ LPA post-MBA depending on institute and specialisation", skills: ["Analytical & leadership skills", "CAT/MBA entrance preparation", "Business fundamentals"], howTo: ["Prepare for CAT/XAT/MAT after graduation", "Choose a specialisation (Finance, Marketing, HR, Operations)", "Apply to management trainee programs post-MBA"], whereToApply: ["IIMs and other top B-schools", "Corporate management programs"] },
  "Management Trainee": { salary: "₹5-9 LPA for freshers; ₹15-25+ LPA post-MBA", skills: ["Leadership & communication", "Business acumen", "Adaptability across functions"], howTo: ["Complete BBA/MBA and apply to structured management trainee programs", "Rotate across functions to find your strength area", "Move into a specialised management role after the program"], whereToApply: ["Large corporates with MT programs (FMCG, banking, consulting)", "Startups (as an early generalist hire)"] },
  "Business Analyst": { salary: "₹5-8 LPA for freshers; ₹15-22+ LPA with experience", skills: ["Data analysis (Excel, SQL)", "Business process understanding", "Communication & documentation"], howTo: ["Learn Excel, SQL and basic data visualization", "Understand business processes through internships", "Apply to consulting firms or corporate strategy teams"], whereToApply: ["Consulting firms", "Corporate strategy/operations teams", "Tech companies"] },
  "MBA": { salary: "₹10-30+ LPA depending on the B-school tier", skills: ["Leadership & analytical skills", "CAT/MBA entrance preparation", "Networking & business fundamentals"], howTo: ["Clear CAT/XAT/MAT with a strong score", "Choose a B-school & specialisation aligned with your goals", "Leverage campus placements for your first post-MBA role"], whereToApply: ["Top B-schools (IIMs, ISB, etc.)", "Corporate leadership programs post-MBA"] },
  "Chartered Accountant": { salary: "₹8-15 LPA to start; ₹25-70+ LPA at top firms or with a strong client base in practice", skills: ["Advanced accounting & audit expertise", "Taxation & compliance mastery", "Client/stakeholder management"], howTo: ["Complete your CA Articleship and clear the Final exam", "Choose a specialisation (audit, tax, advisory)", "Join a firm or start independent practice"], whereToApply: ["Big 4 firms (Deloitte, EY, KPMG, PwC)", "Corporate finance & audit teams", "Independent practice"] },
  "CFO track": { salary: "₹50 LPA to ₹2+ crore/year at senior CFO level, depending on company size", skills: ["Strategic financial leadership", "Deep accounting/CA expertise", "Business & stakeholder management"], howTo: ["Build 10+ years of progressive finance experience post-CA/MBA", "Take on increasing P&L and leadership responsibility", "Move into VP Finance and then CFO roles"], whereToApply: ["Large corporates across all sectors"] },
  "Business roles across industries": { salary: "₹3-6 LPA for freshers; grows steadily with performance and experience", skills: ["Communication & sales aptitude", "Basic business/financial literacy", "Adaptability"], howTo: ["Identify a sector of interest (sales, operations, retail)", "Gain entry-level experience and build domain knowledge", "Move up through performance and additional certifications"], whereToApply: ["Retail & FMCG companies", "Sales & business development teams across industries"] },
  "Civil Services": { salary: "Starting pay Level 10 (~₹56,100/month), rising significantly with seniority", skills: ["General awareness across subjects", "Analytical & writing skills", "Discipline for long-term exam preparation"], howTo: ["Choose an optional subject and start UPSC CSE preparation early", "Clear Prelims → Mains → Interview (a 1-2 year journey typically)", "Alternatively, target State PSC exams for state-level services"], whereToApply: ["Central government (via UPSC)", "State government (via State PSC)"] },
  "Law": { salary: "₹5-10 LPA for freshers at good firms; ₹20+ LPA at top-tier corporate law firms", skills: ["Legal reasoning & research", "Strong reading/writing skills", "Argumentation & advocacy"], howTo: ["Clear CLAT for a 5-year integrated LLB, or do LLB after graduation", "Intern with law firms/advocates during your degree", "Choose litigation, corporate law, or judiciary as your path"], whereToApply: ["Law firms", "Corporate legal departments", "Independent litigation practice"] },
  "Journalism & Media": { salary: "₹3-6 LPA for freshers; ₹12-20+ LPA for senior journalists/editors", skills: ["Writing & storytelling", "Research & fact-checking", "Basic digital/video skills"], howTo: ["Build a portfolio through college publications, blogs or internships", "Consider a journalism/mass comm degree or certification", "Apply to media houses or start as a freelance/digital journalist"], whereToApply: ["News organisations & media houses", "Digital media & content platforms", "Freelance journalism"] },
  "Design": { salary: "₹3-6 LPA for freshers; ₹15-25+ LPA for senior designers/creative leads", skills: ["Design software (Adobe Suite, Figma)", "Creativity & visual sense", "Portfolio-building"], howTo: ["Pursue a design degree/diploma (NIFT/NID or private institutes)", "Build a strong portfolio through personal and client projects", "Apply to design studios or freelance"], whereToApply: ["Design & advertising agencies", "In-house design teams at companies", "Freelance/independent practice"] },
  "Psychology": { salary: "₹3-6 LPA for freshers; ₹10-20+ LPA with specialisation and experience", skills: ["Active listening & empathy", "Assessment & counselling techniques", "Further specialisation (Clinical/Organisational)"], howTo: ["Complete a Bachelor's + Master's in Psychology", "Specialise (Clinical, Counselling, or Organisational Psychology)", "Get licensed/certified where required and start practicing"], whereToApply: ["Hospitals & wellness centres", "Corporate HR/L&D teams", "Private counselling practice"] },
  "Teaching": { salary: "₹3-6 LPA in private schools; ₹35,000-45,000/month in government schools", skills: ["Subject expertise", "Communication & patience", "B.Ed qualification"], howTo: ["Complete a B.Ed after your degree", "Clear CTET/State TET for government eligibility", "Apply to schools or coaching institutes"], whereToApply: ["Government & private schools", "Coaching institutes", "EdTech platforms"] },
  "Civil Servant": { salary: "Starting pay Level 10 (~₹56,100/month), crossing ₹2,00,000+/month at senior levels", skills: ["Administrative & decision-making skills", "In-depth General Studies knowledge", "Leadership under pressure"], howTo: ["Clear UPSC CSE (Prelims, Mains, Interview)", "Complete training at the relevant academy (LBSNAA for IAS, etc.)", "Begin as an Assistant/Sub-Divisional officer and grow in seniority"], whereToApply: ["Central & state government administration"] },
  "Content Writer / Journalist": { salary: "₹2.5-5 LPA for freshers; ₹10-15+ LPA for senior content roles", skills: ["Strong writing across formats", "SEO basics (for digital roles)", "Research skills"], howTo: ["Build a writing portfolio/blog", "Learn SEO and content strategy basics", "Apply to media houses, agencies, or as a freelancer"], whereToApply: ["Media & publishing houses", "Content marketing agencies", "Freelance platforms"] },
  "HR / People roles": { salary: "₹3.5-6 LPA for freshers; ₹15-25+ LPA in senior HR roles", skills: ["Communication & interpersonal skills", "Recruitment & HR processes", "Conflict resolution"], howTo: ["Complete a degree + HR certification/MBA (HR specialisation helps)", "Start with recruitment or HR operations roles", "Grow into HR Business Partner or specialist roles"], whereToApply: ["Corporate HR departments across all industries", "HR consulting/staffing firms"] },
  "Teacher / Professor": { salary: "₹3-6 LPA (school); Assistant Professor pay starts around Level 10 (~₹57,700/month) at colleges", skills: ["Deep subject expertise", "Teaching & communication skills", "NET qualification (for college level)"], howTo: ["For school teaching: complete B.Ed + CTET/TET", "For college teaching: clear UGC-NET (or get a Ph.D)", "Apply to schools, colleges, or universities accordingly"], whereToApply: ["Schools (with B.Ed)", "Colleges & universities (with NET/Ph.D)"] },
  "Graphic / Visual Designer": { salary: "₹3-5.5 LPA for freshers; ₹12-20+ LPA for senior/lead designers", skills: ["Adobe Creative Suite (Photoshop, Illustrator)", "Typography & layout principles", "Brand/visual storytelling"], howTo: ["Build a strong design portfolio during your degree", "Freelance or intern to gain real client experience", "Apply to design/advertising agencies or in-house design teams"], whereToApply: ["Design & advertising agencies", "In-house brand/design teams", "Freelance platforms"] },
  "Illustrator / Animator": { salary: "₹3-6 LPA for freshers at studios; highly variable (₹2-20+ LPA) for freelancers", skills: ["Illustration & animation software (Procreate, After Effects, Blender)", "Storytelling through visuals", "Portfolio & style development"], howTo: ["Build a distinctive personal style/portfolio", "Learn industry-standard animation/illustration tools", "Freelance initially, then apply to studios as your portfolio grows"], whereToApply: ["Animation & gaming studios", "Publishing houses", "Freelance/independent projects"] },
  "Art Director": { salary: "₹12-25+ LPA depending on agency size and experience", skills: ["Creative leadership", "Strong design fundamentals", "Client & team management"], howTo: ["Build several years of experience as a designer first", "Develop a strong portfolio and leadership skills", "Move into art direction roles at agencies or in-house teams"], whereToApply: ["Advertising & design agencies", "Media & entertainment companies", "In-house creative teams"] },
  "Advocate": { salary: "₹3-8 LPA starting under a senior advocate; grows significantly with reputation and years of practice", skills: ["Legal research & argumentation", "Court procedure knowledge", "Client communication"], howTo: ["Complete LLB and enroll with the Bar Council", "Intern/work under a senior advocate to gain court experience", "Build your own practice or specialise (corporate, criminal, civil)"], whereToApply: ["Independent litigation practice", "Law firms", "Corporate legal teams"] },
  "Legal Advisor": { salary: "₹6-12 LPA for freshers at good firms; ₹20-35+ LPA as in-house counsel with experience", skills: ["Contract & compliance knowledge", "Risk assessment", "Business acumen"], howTo: ["Complete LLB (corporate law focus helps)", "Gain experience in a law firm's corporate practice", "Move in-house as a Legal Advisor/Counsel for a company"], whereToApply: ["Corporate legal departments", "Law firms (corporate practice)"] },
  "Judiciary": { salary: "Starting basic pay ₹77,840-₹1,36,520/month as per the latest judicial pay recommendations", skills: ["Deep knowledge of civil & criminal law", "Analytical & decision-making skills", "Judicial exam preparation"], howTo: ["Complete LLB and gain the required practice experience (varies by state)", "Clear the State Judicial Services Exam (Prelims, Mains, Interview)", "Begin as a Civil Judge/Munsif and progress in seniority"], whereToApply: ["State judicial services (District & Sessions Courts)"] },
  "Public sector & social roles": { salary: "₹2.5-5 LPA for freshers; ₹10-15+ LPA in senior NGO/policy roles", skills: ["Communication & empathy", "Program/project coordination", "Sector-specific knowledge (social work, policy)"], howTo: ["Consider a certification/PG diploma in social work or public policy", "Gain experience through internships with NGOs or government programs", "Apply to NGOs, government programs, or social enterprises"], whereToApply: ["NGOs & non-profits", "Government social welfare programs", "Social enterprises"] }
};

function openCareerModal(name) {
  const d = CAREER_DETAILS[name];
  const overlay = document.getElementById("examModal");
  const body = document.getElementById("modalBody");
  if (!d) {
    body.innerHTML = `<p class="modal-eyebrow">Career details</p><h3 class="modal-title">${name}</h3><p>Detailed information for this career is coming soon.</p>`;
  } else {
    body.innerHTML = `
      <p class="modal-eyebrow">Career details</p>
      <h3 class="modal-title">${name}</h3>
      <div class="modal-meta">
        <div class="meta-box pop" style="grid-column:1 / -1;"><div class="meta-label">Typical Salary</div><div class="meta-value">${d.salary}</div></div>
      </div>
      <div class="modal-section">
        <h4><span class="dot-flag dot-violet"></span>Skills You'll Need</h4>
        <ul>${d.skills.map(s => `<li>${s}</li>`).join("")}</ul>
      </div>
      <div class="modal-section">
        <h4><span class="dot-flag dot-mint"></span>How to Get Started</h4>
        <ul>${d.howTo.map(s => `<li>${s}</li>`).join("")}</ul>
      </div>
      <div class="modal-section">
        <h4><span class="dot-flag dot-amber"></span>Where to Apply</h4>
        <ul>${d.whereToApply.map(s => `<li>${s}</li>`).join("")}</ul>
      </div>`;
  }
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

document.getElementById("modalClose").addEventListener("click", closeExamModal);
document.getElementById("examModal").addEventListener("click", (e) => { if (e.target.id === "examModal") closeExamModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeExamModal(); });
function openPrivateModal(text) {
  const overlay = document.getElementById("examModal");
  const body = document.getElementById("modalBody");
  body.innerHTML = `
    <p class="modal-eyebrow">Private-sector path</p>
    <h3 class="modal-title">${text}</h3>
    <div class="modal-section">
      <h4><span class="dot-flag dot-amber"></span>How to get in</h4>
      <ul>
        <li>Search job portals like <strong>LinkedIn</strong> and <strong>Naukri</strong> using this as a keyword</li>
        <li>Check the careers page of specific companies in this space directly</li>
        <li>Ask seniors, alumni or your college placement cell for referrals here</li>
        <li>Tailor your resume/portfolio to highlight skills relevant to this opportunity</li>
      </ul>
    </div>`;
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

document.addEventListener("click", (e) => {
  const pill = e.target.closest(".exam-pill");
  if (pill) { openExamModal(pill.dataset.exam); return; }
  const career = e.target.closest(".career-item");
  if (career) { openCareerModal(career.dataset.career); return; }
  const priv = e.target.closest(".pill-static");
  if (priv) { openPrivateModal(priv.dataset.private); return; }
});

/* ---------------- 2. Government exam directory (reference content) ---------------- */

const EXAM_DIRECTORY = [
  { icon: "🏛️", title: "UPSC", exams: ["UPSC Civil Services Exam (CSE)", "CDS", "NDA", "UPSC Engineering Services Exam (ESE/IES)", "UPSC Combined Medical Services (CMS)", "UPSC Indian Forest Service (IFoS)", "CAPF AC", "EPFO Enforcement Officer"] },
  { icon: "📝", title: "SSC (Staff Selection Commission)", exams: ["SSC CGL", "SSC CHSL", "SSC MTS", "SSC GD Constable", "SSC JE", "SSC Stenographer", "SSC CPO"] },
  { icon: "🏦", title: "Banking & Insurance", exams: ["IBPS PO", "IBPS Clerk", "SBI PO", "SBI Clerk", "RBI Grade B", "RBI Assistant", "NABARD Grade A", "LIC AAO"] },
  { icon: "🚆", title: "Railways (RRB)", exams: ["RRB NTPC", "RRB Group D", "RRB JE", "RRB ALP"] },
  { icon: "🎖️", title: "Defence", exams: ["NDA", "CDS", "AFCAT", "Agniveer (Army/Navy/Air Force)", "Indian Coast Guard (Navik/Yantrik)"] },
  { icon: "⚙️", title: "Engineering & PSU", exams: ["GATE", "PSU Recruitment (via GATE)", "ISRO Scientist/Engineer", "DRDO Scientist Entry"] },
  { icon: "🎓", title: "Teaching", exams: ["CTET", "UGC NET", "DSSSB/KVS Teacher Recruitment"] },
  { icon: "🗺️", title: "State-Level", exams: ["State PSC", "State CET (Engineering/Medical)", "State Police Recruitment (SI/Constable)"] },
  { icon: "⚖️", title: "Law & Judiciary", exams: ["CLAT", "State Judicial Services Exam"] },
  { icon: "📊", title: "Professional / Commerce", exams: ["CA (Chartered Accountancy)", "CS (Company Secretary)", "CMA (Cost & Management Accountant)", "CAT (MBA Entrance)"] },
  { icon: "🔬", title: "Academic Entrance Exams", exams: ["JEE Main & Advanced", "NEET (UG)", "NATA", "NEET-PG", "NEET-MDS", "GPAT", "CSIR-NET", "ICAR AIEEA", "IMU-CET"] }
];

function renderAccordion() {
  const wrap = document.getElementById("examAccordion");
  wrap.innerHTML = EXAM_DIRECTORY.map((cat, i) => `
    <div class="acc-item reveal" data-index="${i}">
      <div class="acc-head">
        <span><span class="acc-icon">${cat.icon}</span>${cat.title}</span>
        <span class="acc-chevron">+</span>
      </div>
      <div class="acc-body">
        <div class="acc-inner">${cat.exams.map(e => examPill(e)).join("")}</div>
      </div>
    </div>
  `).join("");

  wrap.querySelectorAll(".acc-item").forEach(item => {
    revealObserver.observe(item);
    const head = item.querySelector(".acc-head");
    const body = item.querySelector(".acc-body");
    head.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      wrap.querySelectorAll(".acc-item.open").forEach(o => { o.classList.remove("open"); o.querySelector(".acc-body").style.maxHeight = null; });
      if (!isOpen) { item.classList.add("open"); body.style.maxHeight = body.scrollHeight + "px"; }
    });
  });
}
renderAccordion();

/* ---------------- 3. Career + branch recommendation data ---------------- */

const ENGINEERING_BRANCHES = ["Computer Science / IT", "Mechanical", "Civil", "Electrical", "Electronics & Communication", "Chemical", "Other Branch"];

const BRANCH_DATA = {
  "Computer Science / IT": {
    careers: [
      { title: "Software Developer", blurb: "Build web, mobile or backend systems." },
      { title: "Data Scientist / ML Engineer", blurb: "Turn data into models and predictions." },
      { title: "DevOps / Cloud Engineer", blurb: "Manage infrastructure, deployment and scaling." },
      { title: "Cybersecurity Analyst", blurb: "Protect systems and data from threats." }
    ],
    govtExams: ["GATE", "PSU Recruitment (via GATE)", "SSC JE", "ISRO Scientist/Engineer"],
    privateJobs: ["IT services & product companies", "Startups & unicorns", "Freelance / remote development", "Cybersecurity firms"]
  },
  "Mechanical": {
    careers: [
      { title: "Design Engineer", blurb: "Design machines, parts and systems using CAD." },
      { title: "Production / Manufacturing Engineer", blurb: "Run and optimise factory-floor processes." },
      { title: "Automobile Engineer", blurb: "Work on vehicle design, testing or production." },
      { title: "Quality / Maintenance Engineer", blurb: "Ensure equipment and output meet standards." }
    ],
    govtExams: ["GATE", "PSU Recruitment (via GATE)", "SSC JE", "RRB JE"],
    privateJobs: ["Automobile companies (Tata Motors, Maruti, Mahindra)", "Manufacturing & core industries", "Private oil & gas firms"]
  },
  "Civil": {
    careers: [
      { title: "Site / Structural Engineer", blurb: "Plan and supervise construction projects." },
      { title: "Project Manager", blurb: "Coordinate teams, budgets and timelines on-site." },
      { title: "Urban Planner", blurb: "Shape city layouts, zoning and infrastructure." },
      { title: "Quantity Surveyor", blurb: "Estimate and control project costs." }
    ],
    govtExams: ["GATE", "PSU Recruitment (via GATE)", "SSC JE", "RRB JE"],
    privateJobs: ["Construction & infra firms (L&T, Shapoorji Pallonji)", "Real estate developers", "Engineering consulting firms"]
  },
  "Electrical": {
    careers: [
      { title: "Power / Electrical Engineer", blurb: "Work on generation, transmission and distribution." },
      { title: "Control & Automation Engineer", blurb: "Design automated industrial control systems." },
      { title: "Renewable Energy Engineer", blurb: "Work on solar, wind or grid-storage projects." }
    ],
    govtExams: ["GATE", "PSU Recruitment (via GATE)", "SSC JE"],
    privateJobs: ["Power & energy companies", "Renewable energy firms", "Electrical equipment manufacturers"]
  },
  "Electronics & Communication": {
    careers: [
      { title: "VLSI / Chip Design Engineer", blurb: "Design integrated circuits and chips." },
      { title: "Embedded Systems Engineer", blurb: "Build hardware-software systems for devices." },
      { title: "Telecom / IoT Engineer", blurb: "Work on networks, 5G and connected devices." }
    ],
    govtExams: ["GATE", "PSU Recruitment (via GATE)", "ISRO Scientist/Engineer", "DRDO Scientist Entry"],
    privateJobs: ["Semiconductor & chip design companies", "Telecom companies (Jio, Airtel)", "Electronics manufacturing firms"]
  },
  "Chemical": {
    careers: [
      { title: "Process Engineer", blurb: "Design and optimise chemical manufacturing processes." },
      { title: "Plant Operations Engineer", blurb: "Run day-to-day operations at a production plant." },
      { title: "Quality Control Chemist", blurb: "Test and certify product quality and safety." }
    ],
    govtExams: ["GATE", "PSU Recruitment (via GATE)", "SSC JE"],
    privateJobs: ["Petrochemical & refinery companies", "FMCG manufacturing", "Pharmaceutical process roles"]
  },
  "Other Branch": {
    careers: [
      { title: "Software Developer", blurb: "Build applications, websites and systems." },
      { title: "Core Branch Engineer", blurb: "Industry roles specific to your branch." },
      { title: "Higher Studies", blurb: "M.Tech in India or MS abroad for specialisation." }
    ],
    govtExams: ["GATE", "PSU Recruitment (via GATE)", "SSC JE", "UPSC Engineering Services Exam (ESE/IES)"],
    privateJobs: ["IT services & product companies", "Core manufacturing companies", "Campus placement drives"]
  }
};

const STREAM_INFO = {
  PCM: {
    label: "Science (Physics, Chemistry, Maths)",
    afterSchool: {
      careers: [
        { title: "Engineering", blurb: "B.Tech/B.E in Computer Science, Mechanical, Civil, Electrical and more." },
        { title: "Architecture", blurb: "B.Arch — design buildings and spaces, needs NATA." },
        { title: "Defence Forces", blurb: "NDA lets you join the Army, Navy or Air Force straight after Class 12." },
        { title: "Merchant Navy", blurb: "Marine engineering and nautical science courses via IMU-CET." },
        { title: "Pilot Training", blurb: "Commercial Pilot Licence programs at flying schools." },
        { title: "Ethical Hacking / Programming", blurb: "Self-paced or bootcamp routes into software, parallel to a degree." }
      ],
      govtExams: ["JEE Main & Advanced", "NDA", "State CET (Engineering/Medical)", "NATA", "AFCAT", "IMU-CET"],
      privateJobs: ["Campus placement after a private engineering degree", "Coding bootcamp → Junior Developer", "Aviation ground staff / cabin crew training"]
    },
    gradOptions: ["B.Tech / B.E", "B.Sc (Science)", "B.Arch", "Diploma in Engineering", "Other"],
    gradData: {
      "B.Sc (Science)": {
        careers: [
          { title: "Research Assistant", blurb: "Support labs and research projects in physics, chemistry or maths." },
          { title: "Data Analyst", blurb: "Analytics roles using your strong maths/stats foundation." },
          { title: "Science Teacher", blurb: "Teach at school level, or pursue B.Ed for a formal path." },
          { title: "M.Sc / Higher Studies", blurb: "Specialise further and open doors to research or academia." }
        ],
        govtExams: ["CSIR-NET", "SSC CGL", "CTET", "CDS"],
        privateJobs: ["Lab technician / research support roles", "EdTech content & teaching roles", "Analytics support roles in private firms"]
      },
      "B.Arch": {
        careers: [
          { title: "Architect", blurb: "Design residential, commercial or public spaces." },
          { title: "Urban Planner", blurb: "Shape how cities and townships grow." },
          { title: "Interior Designer", blurb: "Specialise in interior spaces and experience design." }
        ],
        govtExams: ["State PSC", "State CET (Engineering/Medical)"],
        privateJobs: ["Architecture & design studios", "Real estate & construction firms", "Freelance design practice"]
      },
      "Diploma in Engineering": {
        careers: [
          { title: "Junior / Site Engineer", blurb: "Hands-on technical roles in industry or construction." },
          { title: "Lateral Entry B.Tech", blurb: "Join the 2nd year of a B.Tech degree directly." }
        ],
        govtExams: ["SSC JE", "RRB JE"],
        privateJobs: ["Manufacturing & production floor roles", "Private construction & infra companies"]
      },
      "Other": {
        careers: [
          { title: "Explore cross-stream options", blurb: "Your PCM base keeps analytical and management careers open too." },
          { title: "Management / MBA route", blurb: "Many PCM graduates pivot into business roles via an MBA." }
        ],
        govtExams: ["SSC CGL", "IBPS PO", "State PSC"],
        privateJobs: ["Analyst roles in private companies", "Sales & operations management trainee programs"]
      }
    }
  },
  PCB: {
    label: "Science (Physics, Chemistry, Biology)",
    afterSchool: {
      careers: [
        { title: "Medicine (MBBS)", blurb: "Become a doctor — long but respected path via NEET." },
        { title: "Dentistry (BDS)", blurb: "Dental surgery as a focused medical specialisation." },
        { title: "Pharmacy", blurb: "B.Pharm opens drug research, retail and regulatory roles." },
        { title: "Nursing", blurb: "B.Sc Nursing is in high demand in India and abroad." },
        { title: "Biotechnology", blurb: "Research-driven field bridging biology and technology." },
        { title: "Agriculture Sciences", blurb: "B.Sc Agriculture via ICAR, a growing government-backed field." }
      ],
      govtExams: ["NEET (UG)", "ICAR AIEEA", "State CET (Engineering/Medical)"],
      privateJobs: ["Private hospitals & diagnostic chains", "Pharma company trainee programs", "Private nursing homes & clinics"]
    },
    gradOptions: ["MBBS", "BDS", "B.Pharm", "B.Sc Nursing", "B.Sc (Biology)", "Other"],
    gradData: {
      "MBBS": {
        careers: [
          { title: "Medical Officer", blurb: "Practice as a doctor in a hospital or clinic." },
          { title: "Specialist Doctor", blurb: "Pursue MD/MS in a specialisation of your choice." },
          { title: "Medical Researcher", blurb: "Contribute to clinical research and public health." }
        ],
        govtExams: ["NEET-PG", "UPSC Combined Medical Services (CMS)"],
        privateJobs: ["Private hospitals & super-specialty chains", "Telemedicine platforms", "Own private practice"]
      },
      "BDS": {
        careers: [
          { title: "Dental Surgeon", blurb: "Independent practice or hospital-based dentistry." },
          { title: "Orthodontist / Specialist", blurb: "Pursue MDS for a dental specialisation." }
        ],
        govtExams: ["NEET-MDS", "State PSC"],
        privateJobs: ["Private dental clinics", "Dental equipment & pharma companies"]
      },
      "B.Pharm": {
        careers: [
          { title: "Pharmacist", blurb: "Retail, hospital or clinical pharmacy roles." },
          { title: "Drug Inspector", blurb: "Regulatory role ensuring drug safety and quality." },
          { title: "Pharma R&D", blurb: "Research roles in drug development, via M.Pharm." }
        ],
        govtExams: ["GPAT", "State PSC"],
        privateJobs: ["Pharma companies (Cipla, Sun Pharma, Dr. Reddy's...)", "Retail pharmacy chains", "Clinical research organisations"]
      },
      "B.Sc Nursing": {
        careers: [
          { title: "Staff Nurse", blurb: "Core hospital nursing role, in India or abroad." },
          { title: "Nurse Educator", blurb: "Teach at nursing colleges after experience/M.Sc." }
        ],
        govtExams: ["State PSC", "RRB NTPC"],
        privateJobs: ["Private hospitals", "International nursing placements", "Home healthcare services"]
      },
      "B.Sc (Biology)": {
        careers: [
          { title: "Lab Technician / Researcher", blurb: "Support biology or biotech research labs." },
          { title: "Biotechnologist", blurb: "Pursue M.Sc Biotech for research-focused roles." },
          { title: "Science Teacher", blurb: "Teach at school level with a B.Ed." }
        ],
        govtExams: ["CSIR-NET", "ICAR AIEEA", "CTET"],
        privateJobs: ["Biotech & pharma research support", "EdTech & school teaching roles"]
      },
      "Other": {
        careers: [
          { title: "Healthcare administration", blurb: "Hospital management roles using your science background." },
          { title: "Medical content / science writing", blurb: "Translate healthcare knowledge for the public." }
        ],
        govtExams: ["SSC CGL", "State PSC"],
        privateJobs: ["Health-tech startups", "Insurance & healthcare BPOs"]
      }
    }
  },
  Commerce: {
    label: "Commerce",
    afterSchool: {
      careers: [
        { title: "Chartered Accountancy (CA)", blurb: "One of the most respected finance qualifications in India." },
        { title: "Company Secretary (CS)", blurb: "Corporate governance and legal compliance expert." },
        { title: "Cost & Management Accountant (CMA)", blurb: "Specialist in cost control and management accounting." },
        { title: "B.Com / BBA", blurb: "Broad business foundation, keeps many doors open." },
        { title: "Banking & Finance", blurb: "Enter banking early via clerk-level exams, grow from within." }
      ],
      govtExams: ["CA (Chartered Accountancy)", "CS (Company Secretary)", "CMA (Cost & Management Accountant)", "IBPS Clerk"],
      privateJobs: ["Accounting firms & audit trainee roles", "Retail banking & NBFC entry roles", "Back-office finance roles"]
    },
    gradOptions: ["B.Com", "BBA", "CA (pursuing/qualified)", "Other"],
    gradData: {
      "B.Com": {
        careers: [
          { title: "Accountant", blurb: "Manage books, taxation and compliance for businesses." },
          { title: "Financial Analyst", blurb: "Analyse markets, companies or investment options." },
          { title: "Tax Consultant", blurb: "Specialise in direct or indirect taxation." },
          { title: "MBA / Higher Studies", blurb: "Move into management with a postgraduate degree." }
        ],
        govtExams: ["IBPS PO", "SBI PO", "SSC CGL", "RBI Grade B", "CAT (MBA Entrance)"],
        privateJobs: ["Big 4 & mid-size accounting firms", "Private banks & NBFCs", "Corporate finance departments"]
      },
      "BBA": {
        careers: [
          { title: "Management Trainee", blurb: "Entry-level leadership track in a company." },
          { title: "Business Analyst", blurb: "Bridge business needs and data-driven decisions." },
          { title: "MBA", blurb: "The natural next step to specialise and grow faster." }
        ],
        govtExams: ["CAT (MBA Entrance)", "SSC CGL", "IBPS PO"],
        privateJobs: ["Corporate management trainee programs", "Startups (operations / growth roles)", "Sales & marketing roles"]
      },
      "CA (pursuing/qualified)": {
        careers: [
          { title: "Chartered Accountant", blurb: "Audit, taxation, or financial advisory practice." },
          { title: "CFO track", blurb: "Long-term path to senior finance leadership." }
        ],
        govtExams: ["RBI Grade B", "NABARD Grade A"],
        privateJobs: ["Big 4 firms (Deloitte, EY, KPMG, PwC)", "Corporate finance & audit teams", "Independent practice"]
      },
      "Other": {
        careers: [{ title: "Business roles across industries", blurb: "Your commerce base fits sales, operations and admin roles." }],
        govtExams: ["SSC CGL", "IBPS Clerk", "State PSC"],
        privateJobs: ["Retail & operations roles", "Customer-facing business roles"]
      }
    }
  },
  Arts: {
    label: "Arts / Humanities",
    afterSchool: {
      careers: [
        { title: "Civil Services", blurb: "UPSC/State PSC — administration, policy and public service." },
        { title: "Law", blurb: "5-year integrated LLB via CLAT, or LLB after graduation." },
        { title: "Journalism & Media", blurb: "Reporting, editing, broadcast or digital media roles." },
        { title: "Design", blurb: "Fashion, graphic or UX design via specialised entrance exams." },
        { title: "Psychology", blurb: "Counselling, HR or clinical psychology with further study." },
        { title: "Teaching", blurb: "B.Ed after graduation opens school and college teaching." }
      ],
      govtExams: ["CLAT", "CTET", "SSC CHSL"],
      privateJobs: ["Media houses & digital content teams", "Design studios & agencies", "Retail & customer service roles"]
    },
    gradOptions: ["BA", "BFA", "LLB", "Other"],
    gradData: {
      "BA": {
        careers: [
          { title: "Civil Servant", blurb: "IAS/IPS/IFS and allied services via UPSC." },
          { title: "Content Writer / Journalist", blurb: "Craft stories, articles and reports for media or brands." },
          { title: "HR / People roles", blurb: "Manage hiring, culture and employee experience." },
          { title: "Teacher / Professor", blurb: "With B.Ed (school) or NET (college level)." }
        ],
        govtExams: ["UPSC Civil Services Exam (CSE)", "State PSC", "UGC NET", "SSC CGL"],
        privateJobs: ["Media & publishing houses", "Corporate HR departments", "NGOs & social sector roles"]
      },
      "BFA": {
        careers: [
          { title: "Graphic / Visual Designer", blurb: "Design for brands, media or digital products." },
          { title: "Illustrator / Animator", blurb: "Freelance or studio-based creative work." },
          { title: "Art Director", blurb: "Lead creative direction with experience." }
        ],
        govtExams: ["SSC CGL", "DSSSB/KVS Teacher Recruitment"],
        privateJobs: ["Design & advertising agencies", "Animation & gaming studios", "Freelance / independent practice"]
      },
      "LLB": {
        careers: [
          { title: "Advocate", blurb: "Practice in courts, or specialise in corporate law." },
          { title: "Legal Advisor", blurb: "In-house counsel for companies." },
          { title: "Judiciary", blurb: "State judicial services exams lead to becoming a judge." }
        ],
        govtExams: ["State Judicial Services Exam", "UPSC Civil Services Exam (CSE)"],
        privateJobs: ["Law firms", "Corporate legal departments", "Independent litigation practice"]
      },
      "Other": {
        careers: [{ title: "Public sector & social roles", blurb: "Your humanities background fits admin, education and media." }],
        govtExams: ["SSC CGL", "State PSC", "UGC NET"],
        privateJobs: ["NGOs", "Media & content roles", "Administrative support roles"]
      }
    }
  }
};

const TENTH_INTEREST_TO_STREAM = {
  "Maths & Science": "PCM",
  "Biology & Science": "PCB",
  "Business & Numbers": "Commerce",
  "Literature & Social Studies": "Arts"
};

function buildResult(answers) {
  const { name, level, stream, tenthInterest, gradStream, branch, interests } = answers;
  let effectiveStream = stream;
  let note = null;

  if (level === "10th") {
    effectiveStream = TENTH_INTEREST_TO_STREAM[tenthInterest] || "PCM";
    note = `Based on what you enjoy, ${STREAM_INFO[effectiveStream].label} could be a great stream to pick in Class 11. Here's what it can lead to.`;
  }

  const streamBlock = STREAM_INFO[effectiveStream];
  let careers, govtExams, privateJobs;

  if ((level === "Graduate" || level === "Post Graduate") && gradStream === "B.Tech / B.E" && branch && BRANCH_DATA[branch]) {
    const b = BRANCH_DATA[branch];
    careers = b.careers; govtExams = b.govtExams; privateJobs = b.privateJobs;
    note = `Here's your specialised path in ${branch} engineering.`;
  } else if ((level === "Graduate" || level === "Post Graduate") && gradStream && streamBlock.gradData[gradStream]) {
    const g = streamBlock.gradData[gradStream];
    careers = g.careers; govtExams = g.govtExams; privateJobs = g.privateJobs;
  } else {
    careers = streamBlock.afterSchool.careers;
    govtExams = streamBlock.afterSchool.govtExams;
    privateJobs = streamBlock.afterSchool.privateJobs;
  }

  const order = (interests || []).includes("Government Jobs")
    ? ["govt", "careers", "private"]
    : (interests || []).includes("Private Sector")
      ? ["private", "careers", "govt"]
      : ["careers", "govt", "private"];

  return { name: name || "there", streamLabel: streamBlock.label, note, careers, govtExams, privateJobs, order };
}

/* ---------------- 4. Quiz configuration ---------------- */

function getSteps(state) {
  const steps = [
    { key: "name", type: "text", label: "Question 1", title: "What's your name?", placeholder: "Type your full name" },
    { key: "age", type: "number", label: "Question 2", title: "How old are you?", placeholder: "Your age" },
    { key: "level", type: "single", label: "Question 3", title: "Which stage are you at right now?", options: ["10th", "12th", "Graduate", "Post Graduate"] }
  ];

  if (state.level === "10th") {
    steps.push({ key: "tenthInterest", type: "single", label: "Question 4", title: "Which subjects do you enjoy the most?", options: Object.keys(TENTH_INTEREST_TO_STREAM) });
  } else if (state.level) {
    steps.push({ key: "stream", type: "single", label: "Question 4", title: "Which stream did you take / are you in?", options: ["PCM", "PCB", "Commerce", "Arts"] });
    if ((state.level === "Graduate" || state.level === "Post Graduate") && state.stream) {
      steps.push({ key: "gradStream", type: "single", label: "Question 5", title: "What did you graduate in?", options: STREAM_INFO[state.stream].gradOptions });
      if (state.gradStream === "B.Tech / B.E") {
        steps.push({ key: "branch", type: "single", label: "Question 6", title: "Which engineering branch?", options: ENGINEERING_BRANCHES });
      }
    }
  }

  steps.push({ key: "interests", type: "multi", label: "Last question", title: "What matters most to you right now?", subtitle: "Pick any that apply — this helps us order your results.", options: ["Government Jobs", "Private Sector", "Higher Studies", "Creative / Freelance", "Not sure yet"] });

  return steps;
}

/* ---------------- 5. App state & DOM wiring ---------------- */

const state = {};
let stepIndex = 0;

document.getElementById("backBtn").addEventListener("click", () => {
  if (stepIndex === 0) return;
  stepIndex--;
  renderQuiz();
});
document.getElementById("nextBtn").addEventListener("click", handleNext);
document.getElementById("restartBtn").addEventListener("click", () => {
  Object.keys(state).forEach(k => delete state[k]);
  stepIndex = 0;
  document.getElementById("results").style.display = "none";
  document.getElementById("quiz").scrollIntoView({ behavior: "smooth" });
  renderQuiz();
});

function renderProgress(steps) {
  const wrap = document.getElementById("progressPath");
  wrap.innerHTML = "";
  steps.forEach((s, i) => {
    const dot = document.createElement("div");
    dot.className = "progress-dot" + (i < stepIndex ? " done" : i === stepIndex ? " current" : "");
    wrap.appendChild(dot);
    if (i < steps.length - 1) {
      const line = document.createElement("div");
      line.className = "progress-line";
      wrap.appendChild(line);
    }
  });
}

function renderQuiz() {
  const steps = getSteps(state);
  if (stepIndex >= steps.length) { finishQuiz(); return; }
  const step = steps[stepIndex];
  renderProgress(steps);

  const card = document.getElementById("quizCard");
  let inner = `<p class="q-label">${step.label}</p><h3 class="q-title">${step.title}</h3>`;
  if (step.subtitle) inner += `<p class="lead" style="margin-top:-14px;font-size:14px;">${step.subtitle}</p>`;

  if (step.type === "text" || step.type === "number") {
    const val = state[step.key] || "";
    inner += `<input class="q-input" id="fieldInput" type="${step.type}" placeholder="${step.placeholder}" value="${val}" />`;
  } else if (step.type === "single") {
    inner += `<div class="option-grid ${step.options.length > 4 ? "" : "single-col"}">` +
      step.options.map(o => `<div class="option-card${state[step.key] === o ? " selected" : ""}" data-value="${o}">${o}</div>`).join("") +
      `</div>`;
  } else if (step.type === "multi") {
    const chosen = state[step.key] || [];
    inner += `<div class="option-grid single-col">` +
      step.options.map(o => `<div class="option-card${chosen.includes(o) ? " selected" : ""}" data-value="${o}">${o}</div>`).join("") +
      `</div>`;
  }

  card.innerHTML = inner;

  if (step.type === "single") {
    card.querySelectorAll(".option-card").forEach(el => {
      el.addEventListener("click", () => {
        state[step.key] = el.dataset.value;
        card.querySelectorAll(".option-card").forEach(o => o.classList.remove("selected"));
        el.classList.add("selected");
        el.classList.remove("correct-pop"); void el.offsetWidth; el.classList.add("correct-pop");
      });
    });
  } else if (step.type === "multi") {
    card.querySelectorAll(".option-card").forEach(el => {
      el.addEventListener("click", () => {
        const list = state[step.key] || (state[step.key] = []);
        const v = el.dataset.value;
        const idx = list.indexOf(v);
        if (idx === -1) { list.push(v); el.classList.add("selected"); }
        else { list.splice(idx, 1); el.classList.remove("selected"); }
        el.classList.remove("correct-pop"); void el.offsetWidth; el.classList.add("correct-pop");
      });
    });
  }

  document.getElementById("backBtn").style.visibility = stepIndex === 0 ? "hidden" : "visible";
  document.getElementById("nextBtn").textContent = stepIndex === steps.length - 1 ? "See my results" : "Next";
}

function handleNext() {
  const steps = getSteps(state);
  const step = steps[stepIndex];

  if (step.type === "text" || step.type === "number") {
    const input = document.getElementById("fieldInput");
    if (!input.value.trim()) { input.focus(); input.style.borderColor = "#FF3DAE"; return; }
    state[step.key] = input.value.trim();
  } else if (step.type === "single" && !state[step.key]) {
    return;
  }

  playBurst();
  const card = document.getElementById("quizCard");
  card.classList.remove("pulse"); void card.offsetWidth; card.classList.add("pulse");

  if (step.key === "name") showGreeting(state.name);

  setTimeout(() => {
    stepIndex++;
    const freshSteps = getSteps(state);
    if (stepIndex >= freshSteps.length) { finishQuiz(); }
    else { renderQuiz(); }
  }, 280);
}

function playBurst() {
  const burst = document.getElementById("burst");
  const card = document.getElementById("quizCard");
  const rect = document.getElementById("nextBtn").getBoundingClientRect();
  const cardRect = card.getBoundingClientRect();
  const originX = rect.left - cardRect.left + rect.width / 2;
  const originY = -40;
  for (let i = 0; i < 12; i++) {
    const s = document.createElement("div");
    s.className = "spark";
    const angle = (Math.PI * 2 * i) / 12;
    const dist = 40 + Math.random() * 34;
    s.style.setProperty("--dx", Math.cos(angle) * dist + "px");
    s.style.setProperty("--dy", Math.sin(angle) * dist + "px");
    s.style.left = originX + "px";
    s.style.top = originY + "px";
    s.style.background = i % 3 === 0 ? "var(--neon-pink)" : i % 3 === 1 ? "var(--neon-violet)" : "var(--neon-green)";
    burst.appendChild(s);
    requestAnimationFrame(() => s.classList.add("go"));
    setTimeout(() => s.remove(), 750);
  }
  const check = document.createElement("div");
  check.className = "check-pop";
  check.textContent = "✓";
  card.appendChild(check);
  requestAnimationFrame(() => check.classList.add("go"));
  setTimeout(() => check.remove(), 700);
}

const FLOW_ICONS = { name: "👋", age: "🎂", level: "🎓", tenthInterest: "❤️", stream: "🧪", gradStream: "📚", branch: "⚙️", interests: "🎯" };
const FLOW_LABELS = { name: "Your name", age: "Age", level: "Current stage", tenthInterest: "What you enjoy", stream: "Stream", gradStream: "Graduated in", branch: "Engineering branch", interests: "What matters most" };

function showJourney(result) {
  const steps = getSteps(state);
  const wrap = document.getElementById("flowWrap");
  wrap.innerHTML = steps.map((s, i) => {
    let value = state[s.key];
    if (Array.isArray(value)) value = value.length ? value.join(", ") : "Still figuring it out — totally fine!";
    return `<div class="flow-node" style="animation-delay:${(i * 0.12).toFixed(2)}s">
      <div class="flow-dot">${FLOW_ICONS[s.key] || "✅"}</div>
      <div class="flow-body">
        <p class="flow-label">${FLOW_LABELS[s.key] || s.key}</p>
        <p class="flow-value">${value}</p>
      </div>
    </div>`;
  }).join("");

  document.getElementById("journeyHeading").innerHTML = `Nice work, <span style="color:var(--neon-violet)">${result.name}</span>! 🎉`;
  document.getElementById("journeySub").textContent = "You answered everything honestly — that's the hardest part. Here's a quick recap before we show you your path.";

  const journeySection = document.getElementById("journey");
  journeySection.style.display = "block";
  setTimeout(() => journeySection.scrollIntoView({ behavior: "smooth" }), 150);
}

function finishQuiz() {
  const result = buildResult(state);
  showJourney(result);
  document.getElementById("journeyContinueBtn").onclick = () => {
    document.getElementById("journey").style.display = "none";
    revealResults(result);
  };
}

function revealResults(result) {
  const resultsSection = document.getElementById("results");
  resultsSection.style.display = "block";
  document.getElementById("resultName").textContent = result.name;
  document.getElementById("resultStream").textContent = result.streamLabel;
  document.getElementById("resultNote").textContent = result.note || "Here's a personalised map of careers, government exams and private opportunities for you. Tap any career or exam to see its full details.";

  const sectionsHtml = {
    careers: `
      <div class="result-block" style="animation-delay:.05s">
        <h3><span class="dot-flag dot-violet"></span>Careers you can pursue <span style="font-weight:400;color:var(--muted);font-size:13px;">(tap a card for full details)</span></h3>
        <div class="career-grid">
          ${result.careers.map(c => `<div class="career-item" data-career="${c.title.replace(/"/g, "&quot;")}"><strong>${c.title}</strong><span>${c.blurb}</span><span class="career-arrow">View path →</span></div>`).join("")}
        </div>
      </div>`,
    govt: `
      <div class="result-block" style="animation-delay:.2s">
        <h3><span class="dot-flag dot-mint"></span>Government exams to consider <span style="font-weight:400;color:var(--muted);font-size:13px;">(tap for full details)</span></h3>
        <div class="tag-row">${result.govtExams.map(e => examPill(e, "mint")).join("")}</div>
      </div>`,
    private: `
      <div class="result-block" style="animation-delay:.35s">
        <h3><span class="dot-flag dot-amber"></span>Private-sector opportunities <span style="font-weight:400;color:var(--muted);font-size:13px;">(tap for how to apply)</span></h3>
        <div class="tag-row">${result.privateJobs.map(e => `<span class="pill-static" data-private="${e.replace(/"/g, "&quot;")}">${e}</span>`).join("")}</div>
      </div>`
  };

  document.getElementById("resultSections").innerHTML = result.order.map(k => sectionsHtml[k]).join("");
  setTimeout(() => resultsSection.scrollIntoView({ behavior: "smooth" }), 150);
}

renderQuiz();