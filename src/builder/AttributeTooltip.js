class AttributeTooltip {
  constructor() {
    this.tooltip = null;
  }

  create() {
    this.tooltip = document.createElement("div");
    this.tooltip.setAttribute("data-rastadikhao-tooltip", "true");

    Object.assign(this.tooltip.style, {
      position: "fixed",
      background: "#1e1e2f",
      color: "#cdd6f4",
      padding: "0",
      borderRadius: "8px",
      fontSize: "12px",
      fontFamily: "'SF Mono', 'Fira Code', 'JetBrains Mono', monospace",
      lineHeight: "1.5",
      zIndex: "1000000",
      pointerEvents: "none",
      border: "1px solid rgba(255,255,255,0.08)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)",
      maxWidth: "320px",
      width: "fit-content",
      display: "none",
      backdropFilter: "blur(12px)",
      background: "rgba(30, 30, 47, 0.92)",
      overflow: "hidden",
      transition: "opacity 150ms ease, transform 150ms ease",
    });

    document.body.appendChild(this.tooltip);
  }

  show(data, rect) {
    if (!this.tooltip) {
      throw new Error("Tooltip not created");
    }

    const width = Math.round(rect.width);
    const height = Math.round(rect.height);
    const tag = data.tagName.toLowerCase();

    // Build attribute rows dynamically
    const attributes = [
      { label: "id", value: data.id, color: "#f9e2af", icon: "#️⃣" },
      {
        label: "data-testid",
        value: data.testId,
        color: "#a6e3a1",
        icon: "🧪",
      },
      {
        label: "aria-label",
        value: data.ariaLabel,
        color: "#cba6f7",
        icon: "♿",
      },
      { label: "class", value: data.className, color: "#f38ba8", icon: "🎨" },
    ];

    const attrRows = attributes
      .filter((attr) => attr.value)
      .map(
        (attr) => `
        <div class="attr-row" style="
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 2px 0;
        ">
          <span style="
            color: ${attr.color};
            font-weight: 500;
            min-width: 14px;
            font-size: 11px;
            opacity: 0.7;
          ">${attr.icon}</span>
          <span style="
            color: #9399b2;
            font-size: 11px;
            min-width: 70px;
          ">${attr.label}</span>
          <span style="
            color: ${attr.color};
            font-weight: 400;
            word-break: break-all;
            font-size: 11.5px;
            background: rgba(255,255,255,0.04);
            padding: 0 6px;
            border-radius: 3px;
            border: 1px solid rgba(255,255,255,0.04);
          ">${attr.value}</span>
        </div>
      `,
      )
      .join("");

    this.tooltip.innerHTML = `
      <div style="
        padding: 10px 12px 8px 12px;
        border-bottom: 1px solid rgba(255,255,255,0.06);
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: rgba(255,255,255,0.02);
      ">
        <div style="
          display: flex;
          align-items: center;
          gap: 8px;
        ">
          <span style="
            background: #89b4fa;
            color: #1e1e2f;
            font-weight: 700;
            font-size: 10px;
            padding: 1px 8px;
            border-radius: 4px;
            letter-spacing: 0.3px;
          ">TAG</span>
          <span style="
            color: #89b4fa;
            font-weight: 600;
            font-size: 13px;
          ">&lt;${tag}&gt;</span>
        </div>
        <div style="
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(137, 180, 250, 0.12);
          padding: 1px 10px 1px 8px;
          border-radius: 12px;
          border: 1px solid rgba(137, 180, 250, 0.15);
        ">
          <span style="
            font-size: 10px;
            color: #89b4fa;
            font-weight: 500;
          ">📐</span>
          <span style="
            color: #89b4fa;
            font-weight: 500;
            font-size: 12px;
          ">${width}×${height}</span>
        </div>
      </div>
      <div style="
        padding: 8px 12px 10px 12px;
      ">
        ${
          attrRows ||
          `
          <div style="
            color: #6c7086;
            font-size: 11px;
            text-align: center;
            padding: 4px 0;
            font-style: italic;
          ">No additional attributes</div>
        `
        }
        <div style="
          margin-top: 6px;
          padding-top: 6px;
          border-top: 1px solid rgba(255,255,255,0.04);
          display: flex;
          gap: 10px;
          font-size: 10px;
          color: #6c7086;
        ">
          <span>🖱️ Click to select</span>
          <span>·</span>
          <span>⌨️ Escape to exit</span>
        </div>
      </div>
    `;

    this.tooltip.style.display = "block";

    // Position the tooltip
    const tooltipHeight = this.tooltip.offsetHeight;
    const tooltipWidth = this.tooltip.offsetWidth;

    // Try to position above, fallback below
    let top = rect.top - tooltipHeight - 12;
    if (top < 10) {
      top = rect.bottom + 12;
    }

    let left = rect.left + rect.width / 2 - tooltipWidth / 2;
    if (left < 10) left = 10;
    if (left + tooltipWidth > window.innerWidth - 10) {
      left = window.innerWidth - tooltipWidth - 10;
    }

    // Small arrow indicator
    const arrowDirection = top < rect.top ? "bottom" : "top";
    const arrowStyle =
      arrowDirection === "bottom"
        ? `
      position: absolute;
      bottom: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-top: 8px solid rgba(30, 30, 47, 0.92);
    `
        : `
      position: absolute;
      top: -8px;
      left: 50%;
      transform: translateX(-50%);
      width: 0;
      height: 0;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-bottom: 8px solid rgba(30, 30, 47, 0.92);
    `;

    // Add arrow
    const arrow = document.createElement("div");
    arrow.style.cssText = arrowStyle;
    this.tooltip.appendChild(arrow);

    Object.assign(this.tooltip.style, {
      top: `${top}px`,
      left: `${left}px`,
      opacity: "1",
      transform: "translateY(0)",
    });
  }

  hide() {
    if (!this.tooltip) return;

    // Remove any existing arrow
    const existingArrow = this.tooltip.querySelector(".tooltip-arrow");
    if (existingArrow) existingArrow.remove();

    this.tooltip.style.opacity = "0";
    this.tooltip.style.transform = "translateY(4px)";
    setTimeout(() => {
      this.tooltip.style.display = "none";
    }, 150);
  }

  destroy() {
    if (!this.tooltip) return;

    this.tooltip.remove();
    this.tooltip = null;
  }
}

export default AttributeTooltip;
