// creates overlay and render on screen
class OverlayRenderer {
  constructor() {
    this.overlay = null;
  }

  create() {
    this.overlay = document.createElement("div");
    this.overlay.setAttribute("data-rastadikhao-overlay", "true");

    Object.assign(this.overlay.style, {
      position: "fixed",
      border: "2px solid #ea3bf6",
      backgroundColor: "rgba(59, 130, 246, 0.18)", // blue transparent fill
      boxShadow: "0 0 0 1px rgba(255,255,255,0.3) inset",
      pointerEvents: "none",
      zIndex: "999999",
      transition: "all 80ms ease-out",
    });

    document.body.appendChild(this.overlay);
  }

  show(rect) {
    if (!this.overlay) {
      return;
    }
    this.overlay.style.display = "block";
    Object.assign(this.overlay.style, {
      top: `${rect.top}px`,
      left: `${rect.left}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
    });
  }

  hide() {
    if (!this.overlay) return;

    Object.assign(this.overlay.style, {
      display: "none",
      width: "0px",
      height: "0px",
    });
  }

  destroy() {
    if (!this.overlay) return;

    this.overlay.remove();
    this.overlay = null;
  }
}

export default OverlayRenderer;
