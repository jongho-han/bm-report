/**
 * ErrorWidget - Error message display
 */

export class ErrorWidget {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.init();
  }

  init() {
    this.render();
  }

  render() {
    this.container.innerHTML = `<div class="error-box" id="errorBox"></div>`;
  }

  show(message) {
    const errorBox = document.getElementById('errorBox');
    if (errorBox) {
      errorBox.style.display = 'block';
      errorBox.textContent = message;
    }
  }

  hide() {
    const errorBox = document.getElementById('errorBox');
    if (errorBox) {
      errorBox.style.display = 'none';
    }
  }

  clear() {
    this.hide();
  }
}

export default ErrorWidget;
