/**
 * ProgressWidget - Loading progress indicator
 */

export class ProgressWidget {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.stepElement = null;
    this.init();
  }

  init() {
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="progress-section" id="progressSection">
        <div class="progress-spinner"></div>
        <div class="progress-title">보고서 분석 중...</div>
        <div class="progress-step" id="progressStep">파일을 읽는 중입니다</div>
      </div>
    `;
    this.stepElement = document.getElementById('progressStep');
  }

  setStep(message) {
    if (this.stepElement) {
      this.stepElement.textContent = message;
    }
  }

  show() {
    const progressSection = document.getElementById('progressSection');
    if (progressSection) progressSection.style.display = 'block';
  }

  hide() {
    const progressSection = document.getElementById('progressSection');
    if (progressSection) progressSection.style.display = 'none';
  }
}

export default ProgressWidget;
