class HistoryManager {
  constructor() {
    this.listeners = new Set();
    this.handlePopState = this.handlePopState.bind(this);
  }

  start() {
    if (this.started) {
      return;
    }
    this.originalPushState = history.pushState;
    this.originalReplaceState = history.replaceState;

    history.pushState = (...args) => {
      this.originalPushState.apply(history, args);

      this.notify({
        type: "pushState",
        url: window.location.href,
        pathname: window.location.pathname,
      });
    };

    history.replaceState = (...args) => {
      this.originalReplaceState.apply(history, args);

      this.notify({
        type: "replaceState",
        url: window.location.href,
        pathname: window.location.pathname,
      });
    };
    window.addEventListener("popstate", this.handlePopState);
  }

  handlePopState() {
    this.notify({
      type: "popstate",
      url: window.location.href,
      pathname: window.location.pathname,
    });
  }

  stop() {
    history.pushState = this.originalPushState;

    history.replaceState = this.originalReplaceState;
    window.removeEventListener("popstate", this.handlePopState);
  }

  subscribe(listener) {
    this.listeners.add(listener);
  }

  unsubscribe(listener) {
    this.listeners.delete(listener);
  }

  notify(data) {
    for (const listener of this.listeners) {
      try {
        if (typeof listener.handleHistoryChange === "function") {
          listener.handleHistoryChange(data);
        }
      } catch (error) {
        console.error("[HistoryManager]", error);
      }
    }
  }
}

export default HistoryManager;
