class InspectorEngine {
  constructor(overlayRenderer, selectorGenerator, attributeTooltip, sidebarRenderer) {
    this.overlayRenderer = overlayRenderer;
    this.selectorGenerator = selectorGenerator;
    this.attributeTooltip = attributeTooltip;
    this.sidebarRenderer = sidebarRenderer;
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleScrollOrResize = this.handleScrollOrResize.bind(this);
    this.locked = false;
    this.lockedElement = null;
    this.buildSession = null;
    this.apiKey = null;
  }

  start(buildSession, apiKey) {
    this.buildSession = buildSession;
    this.apiKey = apiKey;
    this.locked = false;
    this.lockedElement = null;
    document.addEventListener("mousemove", this.handleMouseMove, true);
    document.addEventListener("click", this.handleClick, true);
  }

  handleMouseMove(event) {
    if (this.locked) {
      return;
    }
    const element = event.target;
    if (
      element.closest("[data-rastadikhao-overlay]") ||
      element.closest("[data-rastadikhao-tooltip]") ||
      element.closest("[data-rastadikhao-sidebar]")
    ) {
      return;
    }
    const rect = element.getBoundingClientRect();
    this.overlayRenderer.show(rect);
    const data = this.selectorGenerator.generate(element);
    this.attributeTooltip.show(data, rect);
  }

  handleScrollOrResize() {
    if (this.locked && this.lockedElement) {
      const rect = this.lockedElement.getBoundingClientRect();
      this.overlayRenderer.show(rect);
      const data = this.selectorGenerator.generate(this.lockedElement);
      this.attributeTooltip.show(data, rect);
    }
  }

  handleClick(event) {
    const element = event.target;

    if (
      element.closest("[data-rastadikhao-overlay]") ||
      element.closest("[data-rastadikhao-tooltip]") ||
      element.closest("[data-rastadikhao-sidebar]")
    ) {
      return;
    }
    
    if (this.locked) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    this.locked = true;
    this.lockedElement = element;
    window.addEventListener("scroll", this.handleScrollOrResize, { passive: true });
    window.addEventListener("resize", this.handleScrollOrResize, { passive: true });

    const data = this.selectorGenerator.generate(element);

    this.sidebarRenderer.show(data, {
      onSave: (formData) => this.handleSaveStep(formData),
      onCancel: () => this.unlock()
    });
  }

  async handleSaveStep(formData) {
    if (!this.buildSession || !this.apiKey) {
      console.error("[RastaDikhao] SDK buildSession or apiKey not configured.");
      return;
    }

    const payload = {
      buildKey: this.buildSession.buildKey,
      selector: formData.selector,
      route: window.location.pathname,
      title: formData.title,
      description: formData.description,
      buttonText: formData.buttonText,
      type: formData.type || 'passive',
      blockOthers: !!formData.blockOthers,
      onMissing: formData.onMissing || 'skip',
      advanceTrigger: formData.advanceTrigger || 'tooltip'
    };

    try {
      this.sidebarRenderer.setLoadingState(true);
      const response = await fetch("https://hirehunt.sheryians.com/api/v1/flows/steps", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-tenant-id": this.apiKey
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const resData = await response.json();
      console.log("[RastaDikhao] Step saved successfully:", resData);
      
      this.unlock();
    } catch (error) {
      console.error("[RastaDikhao] Failed to save step:", error);
      alert("Failed to save step. Please check if the backend is running.");
    } finally {
      this.sidebarRenderer.setLoadingState(false);
    }
  }

  unlock() {
    this.locked = false;
    this.lockedElement = null;
    window.removeEventListener("scroll", this.handleScrollOrResize);
    window.removeEventListener("resize", this.handleScrollOrResize);
    this.sidebarRenderer.hide();
    this.overlayRenderer.hide();
    this.attributeTooltip.hide();
  }

  stop() {
    document.removeEventListener("mousemove", this.handleMouseMove, true);
    document.removeEventListener("click", this.handleClick, true);
    this.unlock();
  }
}

export default InspectorEngine;
