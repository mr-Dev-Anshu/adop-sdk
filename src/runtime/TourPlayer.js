class TourPlayer {
  constructor() {
    this.flow = null;
    this.currentStepIndex = -1;
    this.overlay = null;
    this.tooltip = null;
    this.active = false;
    this.pollInterval = null;
  }

  start(flow) {
    if (this.active) {
      this.cleanup();
    }
    this.flow = flow;
    this.currentStepIndex = 0;
    this.active = true;

    // Create DOM elements
    this.createElements();

    // Render the first step
    this.renderCurrentStep();
  }

  createElements() {
    // 1. Highlight Overlay
    this.overlay = document.createElement("div");
    this.overlay.setAttribute("data-rastadikhao-runtime-overlay", "true");
    Object.assign(this.overlay.style, {
      position: "fixed",
      border: "2px solid #a855f7",
      backgroundColor: "rgba(168, 85, 247, 0.12)",
      boxShadow: "0 0 0 9999px rgba(0, 0, 0, 0.5)", // Darken the rest of the screen
      pointerEvents: "none",
      zIndex: "9999998",
      transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      display: "none",
      borderRadius: "6px",
    });
    document.body.appendChild(this.overlay);

    // 2. Tooltip Popover
    this.tooltip = document.createElement("div");
    this.tooltip.setAttribute("data-rastadikhao-runtime-tooltip", "true");
    Object.assign(this.tooltip.style, {
      position: "fixed",
      background: "rgba(18, 18, 29, 0.95)",
      backdropFilter: "blur(20px)",
      color: "#e2e8f0",
      padding: "16px",
      borderRadius: "10px",
      fontSize: "13px",
      fontFamily: "'Inter', -apple-system, sans-serif",
      lineHeight: "1.5",
      zIndex: "9999999",
      width: "280px",
      border: "1px solid rgba(255, 255, 255, 0.08)",
      boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
      display: "none",
      flexDirection: "column",
      gap: "12px",
      transition: "opacity 0.2s ease, transform 0.2s ease",
    });
    document.body.appendChild(this.tooltip);

    // Add CSS transitions styles to head
    const styleId = "rastadikhao-runtime-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .rd-runtime-btn {
          cursor: pointer;
          font-weight: 600;
          font-size: 12px;
          padding: 6px 12px;
          border-radius: 5px;
          border: none;
          transition: all 150ms ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .rd-runtime-btn-primary {
          background: #a855f7;
          color: white;
        }
        .rd-runtime-btn-primary:hover {
          background: #c084fc;
        }
        .rd-runtime-btn-secondary {
          background: transparent;
          color: #94a3b8;
        }
        .rd-runtime-btn-secondary:hover {
          color: white;
        }
      `;
      document.head.appendChild(style);
    }
  }

  async renderCurrentStep() {
    if (!this.active || !this.flow || this.currentStepIndex < 0 || this.currentStepIndex >= this.flow.steps.length) {
      this.cleanup();
      return;
    }

    const step = this.flow.steps[this.currentStepIndex];

    // Check if the current step requires a different route
    if (step.route !== window.location.pathname) {
      console.log(`[RastaDikhao] Step targets different route "${step.route}". Waiting for navigation...`);
      this.hideUI();
      return;
    }

    // Try finding the element with retries (polling the DOM)
    try {
      const element = await this.waitForElement(step.selector);
      this.showStepUI(element, step);
    } catch (error) {
      console.warn(`[RastaDikhao] Target element "${step.selector}" not found on page. Triggering fallback...`);
      
      // Dispatch target_not_found event
      const event = new CustomEvent("rastadikhao:target_not_found", {
        detail: { 
          flowId: this.flow.id, 
          stepIndex: this.currentStepIndex, 
          selector: step.selector 
        }
      });
      window.dispatchEvent(event);

      if (step.onMissing === "fallback") {
        this.showFallbackUI(step);
      } else {
        console.log("[RastaDikhao] Auto-skipping missing step.");
        this.next();
      }
    }
  }

  waitForElement(selector, maxRetries = 30, intervalMs = 100) {
    return new Promise((resolve, reject) => {
      let retries = 0;
      
      if (this.pollInterval) clearInterval(this.pollInterval);

      this.pollInterval = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
          clearInterval(this.pollInterval);
          this.pollInterval = null;
          resolve(element);
        } else {
          retries++;
          if (retries >= maxRetries) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
            reject(new Error(`Element not found: ${selector}`));
          }
        }
      }, intervalMs);
    });
  }

  showStepUI(element, step) {
    if (!this.overlay || !this.tooltip) return;

    this.currentElement = element;
    this.currentStep = step;

    // Reset fallback translation if any
    this.tooltip.style.transform = "none";

    // Clean up prior interactive click/input listeners if any
    if (this.handleInteractiveClick) {
      document.removeEventListener("click", this.handleInteractiveClick, true);
      this.handleInteractiveClick = null;
    }
    if (this.handleInteractiveInput && this.currentElement) {
      this.currentElement.removeEventListener("change", this.handleInteractiveInput);
      this.currentElement.removeEventListener("blur", this.handleInteractiveInput);
      this.handleInteractiveInput = null;
    }

    // Scroll element into view smoothly if not fully in viewport bounds
    const rect = element.getBoundingClientRect();
    if (rect.top < 0 || rect.bottom > window.innerHeight || rect.left < 0 || rect.right > window.innerWidth) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    const stepCount = this.flow.steps.length;
    const isLastStep = this.currentStepIndex === stepCount - 1;
    const nextBtnLabel = step.buttonText || (isLastStep ? "Finish" : "Next");

    // Interactive Mode vs Passive Mode UI layout
    const isInteractive = step.type === "interactive";
    const trigger = step.advanceTrigger || "click";
    const showNextBtn = !isInteractive || trigger === "tooltip";
    const nextBtnHtml = showNextBtn
      ? `<button id="rd-tour-next" class="rd-runtime-btn rd-runtime-btn-primary">${nextBtnLabel}</button>`
      : "";

    this.tooltip.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-weight: 700; font-size: 14px; color: white;">${step.title}</span>
        <span style="font-size: 11px; color: #94a3b8; font-weight: 500;">Step ${this.currentStepIndex + 1} of ${stepCount}</span>
      </div>
      <div style="color: #cbd5e1; font-size: 12.5px;">${step.description}</div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
        <button id="rd-tour-skip" class="rd-runtime-btn rd-runtime-btn-secondary">Skip Tour</button>
        ${nextBtnHtml}
      </div>
    `;

    this.tooltip.style.display = "flex";
    this.overlay.style.display = "block";

    // Passive Mode blocks clicks on target using overlay auto pointerEvents,
    // Interactive Mode lets clicks pass through overlay using none pointerEvents.
    if (isInteractive) {
      this.overlay.style.pointerEvents = "none";
      
      // Capture document clicks to advance when target is clicked,
      // and optionally block clicks on other elements.
      this.handleInteractiveClick = (e) => {
        const isTarget = element.contains(e.target) || e.target === element;
        const isTooltip = this.tooltip && this.tooltip.contains(e.target);

        if (isTarget && trigger === "click") {
          // Advancing on target action click
          setTimeout(() => this.next(), 150);
          return;
        }

        if (isTooltip) {
          return;
        }

        if (step.blockOthers) {
          e.preventDefault();
          e.stopPropagation();
        }
      };
      document.addEventListener("click", this.handleInteractiveClick, true);

      // Setup input trigger if applicable
      if (trigger === "input") {
        this.handleInteractiveInput = () => {
          setTimeout(() => this.next(), 250);
        };
        element.addEventListener("change", this.handleInteractiveInput, { once: true });
        element.addEventListener("blur", this.handleInteractiveInput, { once: true });
      }
    } else {
      this.overlay.style.pointerEvents = "auto";
    }

    // Attach listeners
    this.tooltip.querySelector("#rd-tour-skip").addEventListener("click", () => this.cleanup());
    
    const nextBtn = this.tooltip.querySelector("#rd-tour-next");
    if (nextBtn) {
      nextBtn.addEventListener("click", () => this.next());
    }

    // Setup active listeners for position synchronization
    if (!this.handleScrollOrResize) {
      this.handleScrollOrResize = () => {
        this.updateUIPosition();
      };
      window.addEventListener("scroll", this.handleScrollOrResize, { passive: true });
      window.addEventListener("resize", this.handleScrollOrResize, { passive: true });
    }

    // Position popover and overlay
    this.updateUIPosition();
  }

  showFallbackUI(step) {
    if (!this.tooltip || !this.overlay) return;

    this.currentElement = null;
    this.currentStep = step;

    // Clean up interactive listeners
    if (this.handleInteractiveClick) {
      document.removeEventListener("click", this.handleInteractiveClick, true);
      this.handleInteractiveClick = null;
    }

    // Hide highlight overlay
    this.overlay.style.display = "none";

    const stepCount = this.flow.steps.length;
    const isLastStep = this.currentStepIndex === stepCount - 1;
    const nextBtnLabel = step.buttonText || (isLastStep ? "Finish" : "Next");

    this.tooltip.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-weight: 700; font-size: 14px; color: white;">${step.title}</span>
        <span style="font-size: 11px; color: #94a3b8; font-weight: 500;">Step ${this.currentStepIndex + 1} of ${stepCount}</span>
      </div>
      <div style="color: #cbd5e1; font-size: 12.5px;">${step.description}</div>
      <div style="color: #f87171; font-size: 11px; margin-top: 4px; font-style: italic; font-family: sans-serif;">
        Note: The target element was not found on this page.
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
        <button id="rd-tour-skip" class="rd-runtime-btn rd-runtime-btn-secondary">Skip Tour</button>
        <button id="rd-tour-next" class="rd-runtime-btn rd-runtime-btn-primary">${nextBtnLabel}</button>
      </div>
    `;

    this.tooltip.style.display = "flex";

    this.tooltip.querySelector("#rd-tour-skip").addEventListener("click", () => this.cleanup());
    this.tooltip.querySelector("#rd-tour-next").addEventListener("click", () => this.next());

    // Center tooltip in the screen
    Object.assign(this.tooltip.style, {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    });
  }

  updateUIPosition() {
    if (!this.active || !this.currentElement || !this.overlay || !this.tooltip) return;

    const rect = this.currentElement.getBoundingClientRect();

    // 1. Position Overlay
    Object.assign(this.overlay.style, {
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
    });

    // 2. Position Tooltip relative to element
    const tooltipWidth = this.tooltip.offsetWidth || 280;
    const tooltipHeight = this.tooltip.offsetHeight || 120;

    let top = rect.bottom + 12; // default: place below
    let left = rect.left + rect.width / 2 - tooltipWidth / 2;

    // Boundary validation: place above if it overflows bottom
    if (top + tooltipHeight > window.innerHeight - 10) {
      top = rect.top - tooltipHeight - 12;
    }
    if (top < 10) top = 10;
    if (left < 10) left = 10;
    if (left + tooltipWidth > window.innerWidth - 10) {
      left = window.innerWidth - tooltipWidth - 10;
    }

    Object.assign(this.tooltip.style, {
      top: `${top}px`,
      left: `${left}px`,
    });
  }

  next() {
    this.currentStepIndex++;
    if (this.currentStepIndex >= this.flow.steps.length) {
      this.cleanup();
    } else {
      const currentRoute = window.location.pathname;
      const nextStep = this.flow.steps[this.currentStepIndex];

      if (nextStep.route !== currentRoute) {
        this.hideUI();
      } else {
        this.renderCurrentStep();
      }
    }
  }

  handleRouteChange(pathname) {
    if (!this.active || !this.flow) return;

    console.log(`[RastaDikhao] Route changed to "${pathname}". Checking if tour matches...`);
    this.renderCurrentStep();
  }

  hideUI() {
    if (this.overlay) this.overlay.style.display = "none";
    if (this.tooltip) this.tooltip.style.display = "none";
    
    if (this.handleInteractiveClick) {
      document.removeEventListener("click", this.handleInteractiveClick, true);
      this.handleInteractiveClick = null;
    }

    if (this.handleInteractiveInput && this.currentElement) {
      this.currentElement.removeEventListener("change", this.handleInteractiveInput);
      this.currentElement.removeEventListener("blur", this.handleInteractiveInput);
      this.handleInteractiveInput = null;
    }
  }

  cleanup() {
    this.active = false;
    this.currentStepIndex = -1;
    this.flow = null;

    if (this.handleInteractiveClick) {
      document.removeEventListener("click", this.handleInteractiveClick, true);
      this.handleInteractiveClick = null;
    }

    if (this.handleInteractiveInput && this.currentElement) {
      this.currentElement.removeEventListener("change", this.handleInteractiveInput);
      this.currentElement.removeEventListener("blur", this.handleInteractiveInput);
      this.handleInteractiveInput = null;
    }

    this.currentElement = null;
    this.currentStep = null;

    if (this.handleScrollOrResize) {
      window.removeEventListener("scroll", this.handleScrollOrResize);
      window.removeEventListener("resize", this.handleScrollOrResize);
      this.handleScrollOrResize = null;
    }

    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }

    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }
    if (this.tooltip) {
      this.tooltip.remove();
      this.tooltip = null;
    }
  }
}

export default TourPlayer;
