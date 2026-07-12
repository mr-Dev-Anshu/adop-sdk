class SidebarRenderer {
  constructor() {
    this.container = null;
    this.onSaveCallback = null;
    this.onCancelCallback = null;
    this.currentData = null;
  }

  create() {
    if (this.container) return;

    this.container = document.createElement("div");
    this.container.setAttribute("data-rastadikhao-sidebar", "true");

    // Add styles to head
    const styleId = "rastadikhao-sidebar-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        @keyframes rastadikhao-slide-in {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        @keyframes rastadikhao-slide-out {
          from { transform: translateX(0); }
          to { transform: translateX(100%); }
        }
        .rastadikhao-sidebar-active {
          animation: rastadikhao-slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .rastadikhao-sidebar-inactive {
          animation: rastadikhao-slide-out 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .rastadikhao-btn {
          cursor: pointer;
          font-weight: 600;
          font-size: 13px;
          padding: 8px 16px;
          border-radius: 6px;
          transition: all 150ms ease;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .rastadikhao-btn-primary {
          background: #a855f7;
          color: white;
          box-shadow: 0 4px 12px rgba(168, 85, 247, 0.25);
        }
        .rastadikhao-btn-primary:hover:not(:disabled) {
          background: #c084fc;
          box-shadow: 0 4px 16px rgba(168, 85, 247, 0.4);
        }
        .rastadikhao-btn-secondary {
          background: rgba(255, 255, 255, 0.08);
          color: #e2e8f0;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .rastadikhao-btn-secondary:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.15);
        }
        .rastadikhao-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .rastadikhao-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 6px;
          padding: 10px 12px;
          color: white;
          font-size: 13px;
          font-family: inherit;
          transition: all 150ms ease;
          box-sizing: border-box;
        }
        .rastadikhao-input:focus {
          outline: none;
          border-color: #a855f7;
          background: rgba(255, 255, 255, 0.08);
          box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2);
        }
        .rastadikhao-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: white;
          animation: rastadikhao-spin 0.8s linear infinite;
        }
        @keyframes rastadikhao-spin {
          to { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }

    // Apply sidebar container base styling
    Object.assign(this.container.style, {
      position: "fixed",
      top: "0",
      right: "0",
      width: "360px",
      height: "100vh",
      background: "rgba(18, 18, 29, 0.95)",
      backdropFilter: "blur(20px)",
      borderLeft: "1px solid rgba(255, 255, 255, 0.08)",
      boxShadow: "-10px 0 40px rgba(0, 0, 0, 0.5)",
      color: "#e2e8f0",
      fontFamily: "'Inter', -apple-system, sans-serif",
      zIndex: "10000001",
      display: "none",
      flexDirection: "column",
      boxSizing: "border-box",
    });

    document.body.appendChild(this.container);
  }

  show(elementData, { onSave, onCancel }) {
    if (!this.container) {
      this.create();
    }

    this.currentData = elementData;
    this.onSaveCallback = onSave;
    this.onCancelCallback = onCancel;

    const selectorText = elementData.selector || "No selector generated";
    const tagDisplay = elementData.tagName ? elementData.tagName.toLowerCase() : "element";

    this.container.innerHTML = `
      <div style="padding: 24px 20px; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; align-items: center; justify-content: space-between;">
        <div style="display: flex; align-items: center; gap: 8px;">
          <span style="font-size: 16px;">🎯</span>
          <span style="font-weight: 700; font-size: 16px; letter-spacing: -0.3px; color: white;">RastaDikhao Builder</span>
        </div>
        <span style="background: rgba(168, 85, 247, 0.15); color: #c084fc; font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 4px; border: 1px solid rgba(168,85,247,0.2);">LOCKED</span>
      </div>

      <div style="flex: 1; overflow-y: auto; padding: 24px 20px; display: flex; flex-direction: column; gap: 20px;">
        
        <!-- Element Info Card -->
        <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 12px 14px;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
            <span style="font-size: 11px; font-weight: 600; color: #a855f7; text-transform: uppercase;">Selected &lt;${tagDisplay}&gt;</span>
          </div>
          <div style="font-family: 'SF Mono', 'Fira Code', monospace; font-size: 11px; color: #cbd5e1; word-break: break-all; background: rgba(0,0,0,0.2); padding: 8px; border-radius: 4px; max-height: 80px; overflow-y: auto; border: 1px solid rgba(255,255,255,0.02);">
            ${selectorText}
          </div>
        </div>

        <!-- Form fields -->
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <label style="font-size: 12px; font-weight: 600; color: #94a3b8;">Step Title</label>
          <input type="text" id="rd-step-title" class="rastadikhao-input" placeholder="e.g. Click here to begin!" value="Click here!" />
        </div>

        <div style="display: flex; flex-direction: column; gap: 6px;">
          <label style="font-size: 12px; font-weight: 600; color: #94a3b8;">Description</label>
          <textarea id="rd-step-description" class="rastadikhao-input" rows="4" style="resize: none;" placeholder="e.g. This action initiates the creation process.">This element is part of the adoption tour.</textarea>
        </div>

        <div style="display: flex; flex-direction: column; gap: 6px;">
          <label style="font-size: 12px; font-weight: 600; color: #94a3b8;">Button Text</label>
          <input type="text" id="rd-step-button" class="rastadikhao-input" placeholder="e.g. Next, Got it, Skip" value="Next" />
        </div>

        <div style="display: flex; flex-direction: column; gap: 6px;">
          <label style="font-size: 12px; font-weight: 600; color: #94a3b8;">Step Mode</label>
          <select id="rd-step-type" class="rastadikhao-input" style="background-color: #1a1a2e; color: #fff;">
            <option value="passive">Passive Mode (dim backdrop, tooltip has Next button)</option>
            <option value="interactive">Interactive Mode (clicks reach element directly)</option>
          </select>
        </div>

        <div id="rd-block-clicks-container" style="display: flex; align-items: center; gap: 8px;">
          <input type="checkbox" id="rd-step-block-others" style="cursor: pointer; width: 14px; height: 14px;" />
          <label for="rd-step-block-others" style="font-size: 12px; font-weight: 600; color: #94a3b8; cursor: pointer; user-select: none;">Block clicks on other elements</label>
        </div>

        <div id="rd-advance-trigger-container" style="display: flex; flex-direction: column; gap: 6px;">
          <label style="font-size: 12px; font-weight: 600; color: #94a3b8;">Advance Trigger</label>
          <select id="rd-step-advance-trigger" class="rastadikhao-input" style="background-color: #1a1a2e; color: #fff;">
            <option value="click">Click on target element</option>
            <option value="tooltip">Manual "Next" button on tooltip</option>
            <option value="input">Input change (typing in text field)</option>
          </select>
        </div>

        <div style="display: flex; flex-direction: column; gap: 6px;">
          <label style="font-size: 12px; font-weight: 600; color: #94a3b8;">If element is missing</label>
          <select id="rd-step-on-missing" class="rastadikhao-input" style="background-color: #1a1a2e; color: #fff;">
            <option value="skip">Auto-skip to next step</option>
            <option value="fallback">Show fallback centered tooltip</option>
          </select>
        </div>

      </div>

      <div style="padding: 20px; border-top: 1px solid rgba(255,255,255,0.06); background: rgba(0,0,0,0.1); display: flex; gap: 12px; justify-content: flex-end;">
        <button id="rd-btn-cancel" class="rastadikhao-btn rastadikhao-btn-secondary">Cancel</button>
        <button id="rd-btn-save" class="rastadikhao-btn rastadikhao-btn-primary">
          <span>Save Step</span>
        </button>
      </div>
    `;

    // Reset animations
    this.container.classList.remove("rastadikhao-sidebar-inactive");
    this.container.classList.add("rastadikhao-sidebar-active");
    this.container.style.display = "flex";

    // Setup event listeners
    this.container.querySelector("#rd-btn-cancel").addEventListener("click", () => {
      if (this.onCancelCallback) {
        this.onCancelCallback();
      }
    });

    this.container.querySelector("#rd-btn-save").addEventListener("click", () => {
      this.handleSave();
    });

    const typeSelect = this.container.querySelector("#rd-step-type");
    const blockContainer = this.container.querySelector("#rd-block-clicks-container");
    const advanceTriggerContainer = this.container.querySelector("#rd-advance-trigger-container");
    
    const updateBlockVisibility = () => {
      const isInteractive = typeSelect.value === "interactive";
      blockContainer.style.display = isInteractive ? "flex" : "none";
      advanceTriggerContainer.style.display = isInteractive ? "flex" : "none";
    };
    
    typeSelect.addEventListener("change", updateBlockVisibility);
    updateBlockVisibility(); // initial state
  }

  handleSave() {
    const titleInput = this.container.querySelector("#rd-step-title");
    const descInput = this.container.querySelector("#rd-step-description");
    const btnInput = this.container.querySelector("#rd-step-button");
    const typeSelect = this.container.querySelector("#rd-step-type");
    const blockCheckbox = this.container.querySelector("#rd-step-block-others");
    const missingSelect = this.container.querySelector("#rd-step-on-missing");
    const advanceSelect = this.container.querySelector("#rd-step-advance-trigger");

    const payload = {
      selector: this.currentData.selector,
      title: titleInput.value.trim(),
      description: descInput.value.trim(),
      buttonText: btnInput.value.trim(),
      type: typeSelect.value,
      blockOthers: typeSelect.value === "interactive" ? blockCheckbox.checked : false,
      onMissing: missingSelect.value,
      advanceTrigger: typeSelect.value === "interactive" ? advanceSelect.value : "tooltip",
    };

    if (this.onSaveCallback) {
      this.onSaveCallback(payload);
    }
  }

  setLoadingState(isLoading) {
    if (!this.container) return;

    const saveBtn = this.container.querySelector("#rd-btn-save");
    const cancelBtn = this.container.querySelector("#rd-btn-cancel");
    const inputs = this.container.querySelectorAll(".rastadikhao-input");

    if (isLoading) {
      saveBtn.disabled = true;
      cancelBtn.disabled = true;
      inputs.forEach(input => input.disabled = true);
      saveBtn.innerHTML = `<span class="rastadikhao-spinner"></span> <span>Saving...</span>`;
    } else {
      saveBtn.disabled = false;
      cancelBtn.disabled = false;
      inputs.forEach(input => input.disabled = false);
      saveBtn.innerHTML = `<span>Save Step</span>`;
    }
  }

  hide() {
    if (!this.container) return;

    this.container.classList.remove("rastadikhao-sidebar-active");
    this.container.classList.add("rastadikhao-sidebar-inactive");

    setTimeout(() => {
      this.container.style.display = "none";
    }, 300);
  }

  destroy() {
    if (!this.container) return;
    this.container.remove();
    this.container = null;
    this.onSaveCallback = null;
    this.onCancelCallback = null;
    this.currentData = null;
  }
}

export default SidebarRenderer;
