// Application State
let currentSlideIndex = 0;
const totalSlides = 7; // Slides 0 to 6

// Hotspot Sandbox State
const discoveredHotspots = new Set();
const totalHotspots = 5;

const hotspotData = {
  1: {
    title: "Lookalike Sender Envelope",
    category: "DOMAIN SPOOFING",
    description: "The display name says 'Microsoft Security Alert' but the real email address envelope is <code class='text-xs bg-slate-950 text-rose-400 px-1 py-0.5 border border-slate-900 rounded font-mono'>security-alert-noreply@microsoft-security-auth.net</code>. Genuine Microsoft notifications originate from domains ending in <code class='text-xs bg-slate-950 text-emerald-400 px-1 py-0.5 border border-slate-900 rounded font-mono'>accountprotection.microsoft.com</code>. The attacker registered a custom domain to bypass automated spam filters and mimic trust."
  },
  2: {
    title: "Psychological Coercion",
    category: "URGENT THREAT",
    description: "The subject line contains <code class='text-xs bg-slate-950 text-rose-400 px-1 py-0.5 border border-slate-900 rounded font-mono'>CRITICAL ALERT: ... ACT IMMEDIATELY</code>. Attackers use artificial urgency to trigger adrenaline and panic, causing you to overlook warning signs in sender headers and link safety. Corporate IT notices typically avoid alarmist deadlines."
  },
  3: {
    title: "Generic Salutation",
    category: "PRETEXTING LURE",
    description: "The email addresses you as <code class='text-xs bg-slate-950 text-rose-400 px-1 py-0.5 border border-slate-900 rounded font-mono'>Dear Customer</code> rather than your actual name. While some automated systems use generic greetings, high-security notifications from systems you use daily will typically address you by your registered first name."
  },
  4: {
    title: "Consequence Scareware",
    category: "SCAREWARE PRESSURE",
    description: "The email body threatens total account suspension and loss of communications within 24 hours. Critical corporate systems do not issue warnings that result in immediate suspension without formal procedures. Scareware aims to induce quick click-throughs out of concern for work disruptions."
  },
  5: {
    title: "Hidden Hyperlink Redirection",
    category: "TYPOSQUATTING LINK",
    description: "The visible link reads <code class='text-xs bg-slate-950 text-emerald-400 px-1 py-0.5 border border-slate-900 rounded font-mono'>account.microsoft.com/reset</code>, but hovering over the link reveals the actual destination URL: <code class='text-xs bg-slate-950 text-rose-400 px-1 py-0.5 border border-slate-900 rounded font-mono'>http://microsoft-auth-verify.com/login.php</code>. This unencrypted HTTP page is hosted on a spoofed external server designed to capture credentials."
  }
};

// Quiz Engine State
let currentQuestionIndex = 0;
let selectedOptionIndex = null;
let quizSubmitted = false;
let quizScore = 0;

const quizQuestions = [
  {
    question: "Which of the following sender addresses is a legitimate corporate email from Microsoft?",
    options: [
      "account-security-noreply@accountprotection.microsoft.com",
      "microsoft-support@secure-microsoft-login.com",
      "security-team@microsoft-support.net",
      "account-alert@microsoft-security-envelope.com"
    ],
    correctAnswer: 0,
    explanation: "Microsoft's official notifications regarding security alerts, password resets, and account activity are sent from the domain @accountprotection.microsoft.com. Other domains are registered by third-parties to mimic Microsoft."
  },
  {
    question: "You receive an email from the 'IT Helpdesk' claiming your account will be deleted in 4 hours unless you click a link to verify your login. What psychological trigger is being used?",
    options: [
      "Greed / Financial Reward",
      "Urgency / Fear",
      "Authority / Compliance",
      "Social Proof"
    ],
    correctAnswer: 1,
    explanation: "The attacker is using extreme time constraints (4 hours) and severe consequences (account deletion) to panic you into acting before thinking. Legitimate corporate IT departments do not delete accounts on such short notice without official warning channels."
  },
  {
    question: "If you receive a suspicious email from your vendor asking to update their bank routing details for outstanding invoices, what is the safest action?",
    options: [
      "Reply to the email requesting confirmation of the details.",
      "Call the vendor's billing contact using the phone number listed in the email.",
      "Verify the request by calling a known, trusted phone number from past contracts or contact them via Microsoft Teams.",
      "Ignore the email and delete it immediately."
    ],
    correctAnswer: 2,
    explanation: "Never use contact details provided in a suspicious email itself (since the attacker controls them). Use an established 'out-of-band' verification method—a known phone number from your official corporate directory or secure internal chat—to confirm financial changes."
  },
  {
    question: "What does the protocol prefix 'http://' in a login link indicate compared to 'https://'?",
    options: [
      "The HTTP connection is secured and encrypted.",
      "The HTTP connection is unencrypted, and credentials sent over it can be intercepted in transit.",
      "HTTP is faster and safer for corporate logins.",
      "HTTP indicates a confirmed secure corporate server."
    ],
    correctAnswer: 1,
    explanation: "HTTP stands for HyperText Transfer Protocol, which transmits data in plain text. HTTPS adds 'Secure' (using TLS/SSL encryption). You should never enter login credentials or personal details on an unencrypted http:// page."
  },
  {
    question: "Why is Multi-Factor Authentication (MFA) considered an essential defense against phishing?",
    options: [
      "It automatically deletes phishing emails from your inbox.",
      "It prevents users from clicking malicious hyperlinks.",
      "Even if an attacker steals your password via phishing, they cannot gain access without your secondary security token.",
      "It encrypts your local files against ransomware."
    ],
    correctAnswer: 2,
    explanation: "MFA requires two or more verification factors to gain access. If you fall victim to a phishing site and enter your password, the attacker still cannot access your account because they lack access to your physical phone or authentication app."
  }
];

// Initialize on Load
window.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  
  // Set up certificate name input listener
  const nameInput = document.getElementById('student-name-input');
  if (nameInput) {
    nameInput.addEventListener('input', (e) => {
      const name = e.target.value.trim() || "Jane Doe";
      document.getElementById('cert-student-name').innerText = name;
      document.getElementById('print-cert-student-name').innerText = name;
    });
  }

  // Set up initial slide
  navigateTo(0);
});

// SLIDE NAVIGATION CONTROLS
function navigateTo(index) {
  if (index < 0 || index >= totalSlides) return;
  
  // Check if moving past slide 4 (Sandbox) without finding all hotspots
  if (currentSlideIndex === 4 && index > 4 && discoveredHotspots.size < totalHotspots) {
    alert("Please discover all 5 security indicators in the Phishing Sandbox before moving forward!");
    return;
  }

  // Update current index
  currentSlideIndex = index;

  // Toggle active states on the slide panels
  for (let i = 0; i < totalSlides; i++) {
    const pane = document.getElementById(`slide-${i}`);
    if (pane) {
      if (i === currentSlideIndex) {
        pane.classList.remove('hidden');
        // Trigger small scale transition effect
        pane.classList.add('slide-enter');
        requestAnimationFrame(() => {
          pane.classList.add('slide-enter-active');
        });
      } else {
        pane.classList.add('hidden');
        pane.classList.remove('slide-enter', 'slide-enter-active');
      }
    }
  }

  // Update header step dots
  const stepDots = document.querySelectorAll('.step-dot');
  stepDots.forEach((dot, idx) => {
    if (idx === currentSlideIndex) {
      dot.classList.add('bg-slate-800/80', 'border-cyan-500/50', 'text-cyan-400', 'glow-cyan');
      dot.classList.remove('bg-slate-900/50', 'border-transparent', 'text-slate-300');
    } else if (idx < currentSlideIndex) {
      dot.classList.add('bg-slate-900/80', 'border-slate-800', 'text-slate-400');
      dot.classList.remove('bg-slate-800/80', 'border-cyan-500/50', 'text-cyan-400', 'glow-cyan');
    } else {
      dot.classList.add('bg-slate-900/50', 'border-transparent');
      dot.classList.remove('bg-slate-800/80', 'border-cyan-500/50', 'text-cyan-400', 'glow-cyan', 'bg-slate-900/80', 'border-slate-800', 'text-slate-400');
    }
  });

  // Update Progress Bar
  const progressPercent = ((currentSlideIndex + 1) / totalSlides) * 100;
  document.getElementById('progress-bar').style.width = `${progressPercent}%`;

  // Update Footer buttons and slide count text
  document.getElementById('slide-indicators-text').innerText = `SLIDE ${currentSlideIndex + 1} OF ${totalSlides}`;
  
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');

  // Prev Button state
  if (currentSlideIndex === 0) {
    prevBtn.disabled = true;
    prevBtn.classList.add('opacity-40', 'cursor-not-allowed');
  } else {
    prevBtn.disabled = false;
    prevBtn.classList.remove('opacity-40', 'cursor-not-allowed');
  }

  // Next Button state / context
  if (currentSlideIndex === totalSlides - 1) {
    // On Certificate slide, next button is hidden or restarts
    nextBtn.classList.add('hidden');
  } else {
    nextBtn.classList.remove('hidden');
    
    // Disable next button if on Sandbox and not complete
    if (currentSlideIndex === 4 && discoveredHotspots.size < totalHotspots) {
      nextBtn.disabled = true;
      nextBtn.classList.add('opacity-40', 'cursor-not-allowed');
    } else {
      nextBtn.disabled = false;
      nextBtn.classList.remove('opacity-40', 'cursor-not-allowed');
    }
  }

  // Handle specific slide entries
  if (currentSlideIndex === 4) {
    updateSandboxHeader();
  } else if (currentSlideIndex === 5) {
    // Enter Quiz
    initQuiz();
  } else if (currentSlideIndex === 6) {
    // Enter Certificate/Result
    showCertificateScreen();
  }
}

function nextSlide() {
  navigateTo(currentSlideIndex + 1);
}

function prevSlide() {
  navigateTo(currentSlideIndex - 1);
}


// INTERACTIVE SANDBOX CODE
function revealHotspot(id) {
  if (discoveredHotspots.has(id)) {
    // Just show detail panel again
    showHotspotDetails(id);
    return;
  }

  // Add to set
  discoveredHotspots.add(id);

  // Update UI button to mark as discovered
  const btn = document.getElementById(`hotspot-btn-${id}`);
  if (btn) {
    btn.classList.remove('pulse-hotspot-rose', 'bg-rose-600');
    btn.classList.add('bg-emerald-600', 'pulse-hotspot-cyan');
    btn.innerHTML = `<i data-lucide="check" class="w-3 h-3 text-white"></i>`;
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  // Update counter
  updateSandboxHeader();
  
  // Show detail card
  showHotspotDetails(id);

  // Check if all found
  if (discoveredHotspots.size === totalHotspots) {
    const nextBtn = document.getElementById('next-btn');
    nextBtn.disabled = false;
    nextBtn.classList.remove('opacity-40', 'cursor-not-allowed');
    
    const msg = document.getElementById('sandbox-progress-message');
    msg.innerText = "All indicators discovered! Click Next to proceed to assessment.";
    msg.classList.remove('text-rose-400');
    msg.classList.add('text-emerald-400');
  }
}

function updateSandboxHeader() {
  const counter = document.getElementById('sandbox-indicator-counter');
  if (counter) {
    counter.innerText = `${discoveredHotspots.size} / ${totalHotspots}`;
  }
}

function showHotspotDetails(id) {
  const panel = document.getElementById('hotspot-details-panel');
  const badge = document.getElementById('hotspot-badge-container');
  const title = document.getElementById('hotspot-detail-title');
  const desc = document.getElementById('hotspot-detail-desc');

  const data = hotspotData[id];
  if (!data) return;

  panel.classList.remove('hidden');
  badge.innerText = data.category;
  title.innerText = data.title;
  desc.innerHTML = data.description;
  
  // Custom glowing boundary depending on ID
  panel.className = "glass-panel bg-slate-900/90 rounded-2xl p-6 transition duration-300 border-2 glow-rose border-rose-500/40";
}

function closeHotspotPanel() {
  const panel = document.getElementById('hotspot-details-panel');
  if (panel) {
    panel.classList.add('hidden');
  }
}


// QUIZ ENGINE CODE
function initQuiz() {
  currentQuestionIndex = 0;
  quizScore = 0;
  quizSubmitted = false;
  loadQuestion(0);
}

function loadQuestion(index) {
  selectedOptionIndex = null;
  quizSubmitted = false;
  
  const questionData = quizQuestions[index];
  
  // Update numbers
  document.getElementById('quiz-question-number').innerText = `${index + 1} / ${quizQuestions.length}`;
  document.getElementById('quiz-question-text').innerText = questionData.question;
  document.getElementById('quiz-tracker-text').innerText = `Completed: ${index}/${quizQuestions.length}`;

  // Reset explanation panel
  const expPanel = document.getElementById('quiz-explanation-panel');
  expPanel.classList.add('hidden');

  // Reset quiz action button
  const actionBtn = document.getElementById('quiz-action-btn');
  actionBtn.disabled = true;
  actionBtn.innerHTML = `<span>Submit Answer</span><i data-lucide="arrow-right" class="w-4 h-4 text-slate-900"></i>`;
  if (typeof lucide !== 'undefined') lucide.createIcons();

  // Populate options
  const optionsContainer = document.getElementById('quiz-options-container');
  optionsContainer.innerHTML = '';

  questionData.options.forEach((optionText, idx) => {
    const btn = document.createElement('button');
    btn.className = "w-full text-left p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-cyan-500/50 hover:bg-slate-800/40 transition duration-200 text-sm font-medium text-slate-300 flex items-center justify-between focus:outline-none";
    btn.onclick = () => selectOption(idx);
    
    btn.innerHTML = `
      <span>${optionText}</span>
      <span class="option-icon-container"><i data-lucide="circle" class="w-5 h-5 text-slate-600 flex-shrink-0"></i></span>
    `;

    optionsContainer.appendChild(btn);
  });

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function selectOption(optionIndex) {
  if (quizSubmitted) return;

  selectedOptionIndex = optionIndex;

  // Highlight selection
  const optionsContainer = document.getElementById('quiz-options-container');
  const optionButtons = optionsContainer.querySelectorAll('button');

  optionButtons.forEach((btn, idx) => {
    const iconContainer = btn.querySelector('.option-icon-container');
    if (idx === optionIndex) {
      btn.className = "w-full text-left p-4 bg-cyan-950/20 border-2 border-cyan-500 rounded-xl transition duration-200 text-sm font-semibold text-cyan-300 flex items-center justify-between focus:outline-none";
      iconContainer.innerHTML = `<i data-lucide="check-circle" class="w-5 h-5 text-cyan-400 flex-shrink-0"></i>`;
    } else {
      btn.className = "w-full text-left p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-cyan-500/50 hover:bg-slate-800/40 transition duration-200 text-sm font-medium text-slate-300 flex items-center justify-between focus:outline-none";
      iconContainer.innerHTML = `<i data-lucide="circle" class="w-5 h-5 text-slate-600 flex-shrink-0"></i>`;
    }
  });

  if (typeof lucide !== 'undefined') lucide.createIcons();

  // Enable Submit
  document.getElementById('quiz-action-btn').disabled = false;
}

// Hook up main button inside the quiz card
document.getElementById('quiz-action-btn').onclick = handleQuizAction;

function handleQuizAction() {
  if (!quizSubmitted) {
    submitAnswer();
  } else {
    // Move to next or complete
    if (currentQuestionIndex < quizQuestions.length - 1) {
      currentQuestionIndex++;
      loadQuestion(currentQuestionIndex);
    } else {
      // Completed last question, navigate to certificate/results slide
      navigateTo(6);
    }
  }
}

function submitAnswer() {
  quizSubmitted = true;
  const questionData = quizQuestions[currentQuestionIndex];
  const isCorrect = selectedOptionIndex === questionData.correctAnswer;

  if (isCorrect) {
    quizScore++;
  }

  // Color options
  const optionsContainer = document.getElementById('quiz-options-container');
  const optionButtons = optionsContainer.querySelectorAll('button');

  optionButtons.forEach((btn, idx) => {
    const iconContainer = btn.querySelector('.option-icon-container');
    btn.disabled = true; // disable choices

    if (idx === questionData.correctAnswer) {
      // Show correct in green
      btn.className = "w-full text-left p-4 bg-emerald-950/20 border-2 border-emerald-500 rounded-xl text-sm font-semibold text-emerald-300 flex items-center justify-between focus:outline-none";
      iconContainer.innerHTML = `<i data-lucide="check-circle" class="w-5 h-5 text-emerald-400 flex-shrink-0"></i>`;
    } else if (idx === selectedOptionIndex) {
      // Wrong choice selected
      btn.className = "w-full text-left p-4 bg-rose-950/20 border-2 border-rose-500 rounded-xl text-sm font-semibold text-rose-300 flex items-center justify-between focus:outline-none";
      iconContainer.innerHTML = `<i data-lucide="x-circle" class="w-5 h-5 text-rose-400 flex-shrink-0"></i>`;
    } else {
      // Dim standard options
      btn.className = "w-full text-left p-4 bg-slate-900/30 border border-slate-800/50 rounded-xl text-sm font-medium text-slate-500 flex items-center justify-between focus:outline-none opacity-55";
    }
  });

  // Reveal Explanation
  const expPanel = document.getElementById('quiz-explanation-panel');
  const expIcon = document.getElementById('quiz-explanation-icon');
  const expTitle = document.getElementById('quiz-explanation-title');
  const expText = document.getElementById('quiz-explanation-text');

  expPanel.classList.remove('hidden');
  expText.innerHTML = questionData.explanation;

  if (isCorrect) {
    expPanel.className = "p-5 rounded-2xl flex flex-col space-y-2 bg-emerald-950/30 border border-emerald-800/40 transition duration-300";
    expIcon.innerHTML = `<i data-lucide="check-circle-2" class="w-5 h-5 text-emerald-400"></i>`;
    expTitle.innerText = "CORRECT ACTION";
    expTitle.className = "font-bold text-emerald-400 font-mono text-sm";
  } else {
    expPanel.className = "p-5 rounded-2xl flex flex-col space-y-2 bg-rose-950/30 border border-rose-800/40 transition duration-300";
    expIcon.innerHTML = `<i data-lucide="alert-octagon" class="w-5 h-5 text-rose-400"></i>`;
    expTitle.innerText = "INCORRECT ACTION";
    expTitle.className = "font-bold text-rose-400 font-mono text-sm";
  }

  // Update Action Button to say Next Question or Complete
  const actionBtn = document.getElementById('quiz-action-btn');
  if (currentQuestionIndex < quizQuestions.length - 1) {
    actionBtn.innerHTML = `<span>Next Question</span><i data-lucide="arrow-right" class="w-4 h-4 text-slate-900"></i>`;
  } else {
    actionBtn.innerHTML = `<span>View Results</span><i data-lucide="award" class="w-4 h-4 text-slate-900"></i>`;
  }

  // Re-verify quiz progress text
  document.getElementById('quiz-tracker-text').innerText = `Completed: ${currentQuestionIndex + 1}/${quizQuestions.length}`;

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function restartQuiz() {
  initQuiz();
  navigateTo(5);
}


// CERTIFICATE LOGIC CODE
function showCertificateScreen() {
  const passingScore = 4; // 80% out of 5
  const percentage = (quizScore / quizQuestions.length) * 100;
  
  const successView = document.getElementById('cert-success-view');
  const failView = document.getElementById('cert-fail-view');

  if (quizScore >= passingScore) {
    // Pass
    successView.classList.remove('hidden');
    failView.classList.add('hidden');

    // Populate Date
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    document.getElementById('cert-date').innerText = dateStr;
    document.getElementById('print-cert-date').innerText = dateStr;

    // Generate random credential id
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const randomChars = Math.random().toString(36).substring(2, 5).toUpperCase();
    const credId = `PS-${randomNum}-${randomChars}`;
    document.getElementById('cert-credential-id').innerText = credId;
    document.getElementById('print-cert-credential-id').innerText = credId;

    // Update names
    const currentName = document.getElementById('student-name-input').value.trim() || "Jane Doe";
    document.getElementById('cert-student-name').innerText = currentName;
    document.getElementById('print-cert-student-name').innerText = currentName;

    // Trigger Canvas Confetti
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.65 }
      });
      // Fire double bursts
      setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { x: 0.3, y: 0.6 }
        });
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { x: 0.7, y: 0.6 }
        });
      }, 350);
    }
  } else {
    // Fail
    successView.classList.add('hidden');
    failView.classList.remove('hidden');
    document.getElementById('fail-score-text').innerText = `${percentage}% (${quizScore} / ${quizQuestions.length} correct)`;
  }
}

// Print Certificate Action
function printCertificate() {
  // Sync names first
  const name = document.getElementById('student-name-input').value.trim() || "Jane Doe";
  document.getElementById('print-cert-student-name').innerText = name;
  
  // Call browser print
  window.print();
}

// Global Training Resets
function restartTraining() {
  // Clear Sandbox state
  discoveredHotspots.clear();
  for (let i = 1; i <= totalHotspots; i++) {
    const btn = document.getElementById(`hotspot-btn-${i}`);
    if (btn) {
      btn.className = "absolute top-3 right-3 w-5 h-5 bg-rose-600 rounded-full flex items-center justify-center pulse-hotspot-rose text-white focus:outline-none transition hover:scale-110 z-10";
      // Adjust relative placements
      if (i === 1) btn.className = "absolute top-3 right-3 w-5 h-5 bg-rose-600 rounded-full flex items-center justify-center pulse-hotspot-rose text-white focus:outline-none transition hover:scale-110 z-10";
      if (i === 2) btn.className = "absolute top-0.5 right-3 w-5 h-5 bg-rose-600 rounded-full flex items-center justify-center pulse-hotspot-rose text-white focus:outline-none transition hover:scale-110 z-10";
      if (i === 3) btn.className = "absolute top-0.5 right-3 w-5 h-5 bg-rose-600 rounded-full flex items-center justify-center pulse-hotspot-rose text-white focus:outline-none transition hover:scale-110 z-10";
      if (i === 4) btn.className = "absolute top-0.5 right-3 w-5 h-5 bg-rose-600 rounded-full flex items-center justify-center pulse-hotspot-rose text-white focus:outline-none transition hover:scale-110 z-10";
      if (i === 5) btn.className = "absolute top-2 right-3 w-5 h-5 bg-rose-600 rounded-full flex items-center justify-center pulse-hotspot-rose text-white focus:outline-none transition hover:scale-110 z-10";
      btn.innerHTML = `<span class="text-xs font-bold font-mono">?</span>`;
    }
  }

  // Clear details card
  const panel = document.getElementById('hotspot-details-panel');
  if (panel) panel.classList.add('hidden');

  // Reset sandbox messages
  const msg = document.getElementById('sandbox-progress-message');
  if (msg) {
    msg.innerText = "Find all indicators to proceed!";
    msg.className = "text-xs text-rose-400 font-medium";
  }

  // Reset score
  quizScore = 0;
  currentQuestionIndex = 0;
  
  // Navigate to Slide 0
  navigateTo(0);
}
