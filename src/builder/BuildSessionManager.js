class BuildSessionManager {
  constructor(buildSession) {
    this.buildSession = buildSession;
  }

  handleHistoryChange(data) {
    if (!this.buildSession) {
      return;
    }

    const updatedUrl = this.preserveBuildKey(data.url);

    if (updatedUrl !== window.location.pathname + window.location.search) {
      history.replaceState(history.state, "", updatedUrl);
    }
  }

  preserveBuildKey(url) {
    const nextUrl = new URL(url, window.location.origin);

    nextUrl.searchParams.set("buildKey", this.buildSession.buildKey);

    return nextUrl.pathname + nextUrl.search;
  }

  destroy() {
    this.buildSession = null;
  }
}

export default BuildSessionManager;
  