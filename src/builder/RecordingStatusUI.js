class RecordingStatusUI {
  constructor() {
    this.container = null;
    this.messageEl = null;
    this.stopButton = null;
    this.onStop = null;
  }

  create(onStop) {
    this.onStop = onStop;
    this.container = document.createElement('div');
    this.container.setAttribute('data-rastadikhao-recording-status', 'true');

    Object.assign(this.container.style, {
      position: 'fixed',
      top: '24px',
      left: '24px',
      padding: '10px 18px',
      background: '#1a1a2e',
      color: '#e0e0e0',
      borderRadius: '10px',
      fontSize: '13px',
      fontFamily: "'Inter', -apple-system, sans-serif",
      zIndex: '999999',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      border: '1px solid rgba(255, 255, 255, 0.06)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      userSelect: 'none',
    });

    this.messageEl = document.createElement('span');
    this.messageEl.textContent = 'Recording... 0 steps captured';

    this.stopButton = document.createElement('button');
    this.stopButton.textContent = 'Stop Recording';
    Object.assign(this.stopButton.style, {
      background: '#ef4444',
      color: '#fff',
      border: 'none',
      borderRadius: '6px',
      padding: '6px 12px',
      fontSize: '12px',
      fontWeight: '700',
      cursor: 'pointer',
    });
    this.stopButton.addEventListener('click', () => {
      if (this.onStop) this.onStop();
    });

    this.container.appendChild(this.messageEl);
    this.container.appendChild(this.stopButton);
    document.body.appendChild(this.container);
  }

  updateStepCount(count) {
    if (!this.messageEl) return;
    this.messageEl.textContent = `Recording... ${count} step${count === 1 ? '' : 's'} captured`;
  }

  showProcessing() {
    if (!this.messageEl) return;
    this.messageEl.textContent = 'Processing your recording...';
    if (this.stopButton) this.stopButton.style.display = 'none';
  }

  showSuccess() {
    if (!this.messageEl) return;
    this.messageEl.textContent = 'Recording processed! Go back to the dashboard tab to review and save.';
  }

  showError(message) {
    if (!this.messageEl) return;
    this.messageEl.textContent = message;
    if (this.container) this.container.style.background = '#7f1d1d';
  }

  destroy() {
    if (!this.container) return;
    this.container.remove();
    this.container = null;
    this.messageEl = null;
    this.stopButton = null;
  }
}

export default RecordingStatusUI;
