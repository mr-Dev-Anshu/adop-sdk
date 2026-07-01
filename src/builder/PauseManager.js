class PauseManager {
  constructor(inspectorEngine, overlayRenderer, attributeTooltip) {
    // store references

    this.inspectorEngine = inspectorEngine;

    this.overlayRenderer = overlayRenderer;

    this.attributeTooltip = attributeTooltip;

    this.paused = false;
  }
}

export default PauseManager;
