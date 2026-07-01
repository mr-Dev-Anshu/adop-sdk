class BuilderStatusUI {
  constructor() {
    this.container = null;
  }

  create() {
    this.container = document.createElement("div");
    this.container.setAttribute("data-rastadikhao-status", "true");

    Object.assign(this.container.style, {
      position: "fixed",
      top: "24px",
      left: "24px",
      padding: "10px 18px",
      background: "#1a1a2e",
      color: "#e0e0e0",
      borderRadius: "10px",
      fontSize: "13px",
      fontFamily: "'Inter', -apple-system, sans-serif",
      zIndex: "999999",
      display: "none",
      border: "1px solid rgba(255, 255, 255, 0.06)",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
      backdropFilter: "blur(8px)",
      letterSpacing: "0.3px",
      userSelect: "none",
    });

    this.container.innerHTML = `
  <span style="display:flex;align-items:center;gap:12px;">
    <span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:#facc15;box-shadow:0 0 20px rgba(250,204,21,0.6);animation:pulse-dot 2s ease-in-out infinite;"></span>
    <span>Builder <span style="color:#94a3b8;font-weight:400;">Paused</span></span>
    <span style="color:#475569;margin:0 4px;">·</span>
    <span style="color:#94a3b8;font-size:11px;">Press</span>
    <span style="background:#2d2d44;padding:3px 10px;border-radius:5px;font-size:11px;color:#cbd5e1;font-weight:700;display:flex;align-items:center;gap:4px;">
      <span>Alt</span>
      <span style="color:#475569;">+</span>
      <span>B</span>
    </span>
    <span style="color:#94a3b8;font-size:11px;">to Resume</span>
  </span>
`;

    // Add pulse animation
    const style = document.createElement("style");
    style.textContent = `
      @keyframes pulse-dot {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.5; transform: scale(0.85); }
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(this.container);
  }

  show() {
    if (!this.container) return;
    this.container.style.display = "block";
  }

  hide() {
    if (!this.container) return;
    this.container.style.display = "none";
  }

  destroy() {
    if (!this.container) return;
    this.container.remove();
    this.container = null;
  }
}

export default BuilderStatusUI;
