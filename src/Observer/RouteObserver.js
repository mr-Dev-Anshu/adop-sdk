// Observes route changes notified by HistoryManager.
// It does NOT interact with Browser History APIs directly.
class RouteObserver {
  constructor(onRouteChange) {
    // Callback executed whenever the application route changes.
    this.onRouteChange = onRouteChange;

    // Store the initial route so future changes can be compared.
    this.currentRoute = window.location.pathname;
  }

  // Reserved for future initialization if RouteObserver
  // requires its own setup.
  start() {}

  // Called by HistoryManager whenever the browser history changes.
  handleHistoryChange(data) {
    this.checkRoute(data.pathname);
  }

  // Checks whether the route actually changed.
  // If yes, updates the current route and notifies subscribers.
  checkRoute(pathname) {
    // Ignore duplicate route notifications.
    if (pathname === this.currentRoute) {
      return;
    }

    // Save previous route before updating.
    const previousPathname = this.currentRoute;

    // Update current route.
    this.currentRoute = pathname;

    // Notify SDK/Builder about the route transition.
    if (this.onRouteChange) {
      this.onRouteChange({
        pathname,
        previousPathname,
      });
    }

    console.log("[RouteObserver]", {
      pathname,
      previousPathname,
    });
  }

  // Reserved for future cleanup.
  destroy() {}
}

export default RouteObserver;