// src/components/InteractiveHero.client.js
export class InteractiveHeroClient {
  constructor(container) {
    this.container = container;
    this.mousePosition = { x: 0, y: 0 };
    this.currentRole = 0;
    this.typedText = "";
    this.isTyping = false;

    this.roles = [
      "Developer Advocate",
      "Software Engineer",
      "Cloud Enthusiast",
      "Tech Educator",
      "Problem Solver",
    ];

    this.init();
  }

  init() {
    this.render();
    this.setupEventListeners();
    this.startTypewriter();
    this.animateSkills();
  }

  render() {
    this.container.innerHTML = `
        <div class="relative z-10 flex items-center justify-center h-screen px-6">
          <!-- Interactive Background Elements -->
          <div class="interactive-bg-1 absolute w-96 h-96 bg-gradient-to-r from-pink-300/20 to-orange-300/20 rounded-full blur-3xl transition-all duration-1000 ease-out pointer-events-none"></div>
          <div class="interactive-bg-2 absolute w-64 h-64 bg-gradient-to-r from-blue-300/15 to-teal-300/15 rounded-full blur-2xl transition-all duration-700 ease-out pointer-events-none"></div>
          
          <div class="text-center max-w-4xl relative z-10">
            <!-- Interactive Name -->
            <h1 class="interactive-name display-text mb-6 cursor-pointer transition-all duration-300 hover-lift">
              <span class="rainbow-text">Peggie</span>
            </h1>
  
            <!-- Typewriter Role -->
            <div class="text-2xl text-muted mb-8 h-8 mono-text">
              <span class="typewriter-text border-r-2 border-accent animate-pulse"></span>
            </div>
  
            <!-- Interactive Skills Grid -->
            <div class="skills-grid grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-2xl mx-auto">
              ${["React", "Node.js", "Cloud", "DevOps"]
                .map(
                  (skill, index) => `
                <div class="skill-badge opacity-0 translate-y-4 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium border border-pink-200 hover:border-pink-400 transition-all duration-300 cursor-pointer hover-lift hover-tilt" data-delay="${
                  index * 100
                }">
                  ${skill}
                </div>
              `
                )
                .join("")}
            </div>
  
            <!-- Animated CTA Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/projects/" class="btn-primary animated-btn" data-primary="true">
                View Projects
              </a>
              <a href="/blog/" class="btn-secondary animated-btn hover-lift">
                Read Blog
              </a>
            </div>
          </div>
  
          <!-- Floating Code Elements -->
          <div class="floating-code absolute inset-0 pointer-events-none">
            ${this.generateFloatingCode()}
          </div>
        </div>
      `;
  }

  generateFloatingCode() {
    const codeSnippets = [
      "{ developer: true }",
      "npm run build",
      'git commit -m "✨"',
      "const magic = () => {}",
      "// Making things work",
      "export default Peggie",
      "useState(awesome)",
      'console.log("hello")',
    ];

    return codeSnippets
      .map(
        (code, index) => `
        <div class="floating-code-item absolute text-xs mono-text text-light opacity-40" 
             style="left: ${10 + index * 12}%; top: ${
          20 + index * 8
        }%; animation-delay: ${index * 2}s;">
          ${code}
        </div>
      `
      )
      .join("");
  }

  setupEventListeners() {
    // Mouse tracking for interactive background
    document.addEventListener("mousemove", (e) => {
      this.mousePosition = { x: e.clientX, y: e.clientY };
      this.updateBackgroundElements();
    });

    // Interactive name hover
    const interactiveName = this.container.querySelector(".interactive-name");
    if (interactiveName) {
      interactiveName.addEventListener("mouseenter", () => {
        interactiveName.style.transform = "scale(1.05) rotate(2deg)";
        interactiveName.style.filter =
          "drop-shadow(0 10px 20px rgba(255,107,107,0.3))";
      });

      interactiveName.addEventListener("mouseleave", () => {
        interactiveName.style.transform = "scale(1) rotate(0deg)";
        interactiveName.style.filter = "none";
      });
    }

    // Button ripple effects
    const animatedBtns = this.container.querySelectorAll(".animated-btn");
    animatedBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => this.createRipple(e, btn));
    });
  }

  updateBackgroundElements() {
    const bg1 = this.container.querySelector(".interactive-bg-1");
    const bg2 = this.container.querySelector(".interactive-bg-2");

    if (bg1) {
      bg1.style.left = `${this.mousePosition.x - 200}px`;
      bg1.style.top = `${this.mousePosition.y - 200}px`;
    }

    if (bg2) {
      bg2.style.left = `${this.mousePosition.x - 100}px`;
      bg2.style.top = `${this.mousePosition.y - 100}px`;
      bg2.style.transform = `rotate(${this.mousePosition.x * 0.1}deg)`;
    }
  }

  startTypewriter() {
    if (this.isTyping) return;

    const typewriterElement = this.container.querySelector(".typewriter-text");
    if (!typewriterElement) return;

    this.isTyping = true;
    const currentString = this.roles[this.currentRole];
    let index = 0;
    this.typedText = "";

    const type = () => {
      if (index < currentString.length) {
        this.typedText = currentString.slice(0, index + 1);
        typewriterElement.textContent = this.typedText;
        index++;
        setTimeout(type, 100);
      } else {
        setTimeout(() => {
          this.currentRole = (this.currentRole + 1) % this.roles.length;
          this.isTyping = false;
          this.startTypewriter();
        }, 2000);
      }
    };

    type();
  }

  animateSkills() {
    const skillBadges = this.container.querySelectorAll(".skill-badge");

    skillBadges.forEach((badge) => {
      const delay = parseInt(badge.dataset.delay);

      setTimeout(() => {
        badge.classList.remove("opacity-0", "translate-y-4");
        badge.classList.add("opacity-100", "translate-y-0");
      }, delay);
    });
  }

  createRipple(event, button) {
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement("span");

    ripple.style.position = "absolute";
    ripple.style.left = `${event.clientX - rect.left - 10}px`;
    ripple.style.top = `${event.clientY - rect.top - 10}px`;
    ripple.style.width = "20px";
    ripple.style.height = "20px";
    ripple.style.background = "rgba(255,255,255,0.3)";
    ripple.style.borderRadius = "50%";
    ripple.style.pointerEvents = "none";
    ripple.style.animation = "ripple 0.6s ease-out";

    button.style.position = "relative";
    button.style.overflow = "hidden";
    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }
}

// Add CSS animations
const style = document.createElement("style");
style.textContent = `
    @keyframes ripple {
      0% { transform: scale(0); opacity: 1; }
      100% { transform: scale(4); opacity: 0; }
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
      50% { transform: translateY(-20px) rotate(5deg); opacity: 0.3; }
    }
    
    .floating-code-item {
      animation: float 20s ease-in-out infinite;
    }
    
    .skill-badge {
      transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .hover-tilt:hover {
      transform: rotate(1deg) scale(1.02);
    }
  `;
document.head.appendChild(style);
