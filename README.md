# PhishShield 🛡️👥

PhishShield is an interactive, modern web-based **Phishing Awareness Training Academy** built to empower users to recognize, analyze, and defend against sophisticated social engineering threats. Featuring a step-by-step modular guide, a side-by-side interactive email sandbox, and an assessment engine, PhishShield transforms the "human firewall" into an organization's strongest line of defense.

---

## 🚀 Features

*   **7-Step Learning Journey:** A progression flow that guides users smoothly from baseline cyber security metrics to certification.
*   **Domain Typosquatting Analyzer:** Visual breakdown of malicious URL structures, script swaps (e.g., swapping `l` for `I`), and subdomain spoofing tricks.
*   **Interactive "Spot the Phish" Sandbox:** A side-by-side live comparison ecosystem matching verified corporate communications against simulated phishing attempts. Users can click pulsing hotspots to uncover critical hidden vectors.
*   **Psychological Tactic Analysis:** Explains the psychological triggers used by hackers, including Pretexting, Baiting, Spear Phishing, and Scareware.
*   **Assessment Engine (Quiz):** A multi-question interactive examination requiring an 80% passing standard to prove conceptual proficiency[cite: 1].
*   **Custom Certificate Generator:** Dynamically creates a downloadable, beautifully optimized print/PDF certificate featuring live name updates upon successful assessment[cite: 1].
*   **Modern Cyberpunk UI/UX:** Dark mode design utilizing Tailwind CSS, Lucide Icons, glassmorphism panels, and canvas confetti bursts for accomplishments[cite: 1].

---

## 🛠️ Technology Stack

*   **Frontend Structure:** HTML5 (Semantic and fully responsive)[cite: 1]
*   **Styling & Themes:** [Tailwind CSS](https://tailwindcss.com) (CDN-powered custom cyberpunk color palette configuration)[cite: 1]
*   **Icons:** [Lucide Icons](https://lucide.dev)[cite: 1]
*   **Interactivity & Effects:** Vanilla JavaScript (`app.js`), [Canvas Confetti API](https://www.npmjs.com/package/canvas-confetti)[cite: 1]

---

## 📂 Project Structure

```text
├── index.html         # Main workspace layout, modules, sandbox, and certificate screens
├── styles.css         # Custom animations, background grids, and print utility overrides
└── app.js             # State management, slide navigation, quiz logic, and certification generators
