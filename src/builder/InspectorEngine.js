class InspectorEngine {
  constructor(overlayRenderer, selectorGenerator, attributeTooltip) {
    this.overlayRenderer = overlayRenderer;
    this.selectorGenerator = selectorGenerator;
    this.attributeTooltip = attributeTooltip;
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  start() {
    document.addEventListener("mousemove", this.handleMouseMove, true);
    document.addEventListener("click", this.handleClick, true);
  }

  handleMouseMove(event) {
    const element = event.target;
    if (element.closest("[data-rastadikhao-overlay]")) {
      return;
    }
    const rect = element.getBoundingClientRect();
    this.overlayRenderer.show(rect);
    const data = this.selectorGenerator.generate(element);
    this.attributeTooltip.show(data, rect);
  }

  handleClick(event) {
    const element = event.target;

    if (
      element.closest("[data-rastadikhao-overlay]") ||
      element.closest("[data-rastadikhao-tooltip]")
    ) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();

    const selector = this.selectorGenerator.generate(element);

    console.log(selector);
  }

  stop() {
    document.removeEventListener("mousemove", this.handleMouseMove, true);
    document.removeEventListener("click", this.handleClick, true);
  }
}

export default InspectorEngine;
