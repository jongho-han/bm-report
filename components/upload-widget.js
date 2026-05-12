/**
 * UploadWidget - File upload component
 */

export class UploadWidget {
  constructor(containerId, onFileSelected) {
    this.container = document.getElementById(containerId);
    this.onFileSelected = onFileSelected;
    this.fileInput = null;
    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    this.container.innerHTML = `
      <div class="upload-section" id="uploadSection">
        <div class="upload-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17,8 12,3 7,8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
        </div>
        <div class="upload-title">엑셀 파일을 업로드하세요</div>
        <div class="upload-desc">BM영업일지 xlsx 파일을 드래그하거나<br>아래 버튼을 클릭하여 선택하세요</div>
        <button class="upload-btn" id="uploadBtn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17,8 12,3 7,8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          파일 선택
        </button>
        <div class="upload-hint">지원 형식: .xlsx · 최대 10MB</div>
        <input type="file" id="fileInput" accept=".xlsx,.xls">
      </div>
    `;
    this.fileInput = document.getElementById('fileInput');
  }

  attachEventListeners() {
    const uploadSection = document.getElementById('uploadSection');
    const uploadBtn = document.getElementById('uploadBtn');

    // Drag and drop
    uploadSection.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadSection.classList.add('drag-over');
    });

    uploadSection.addEventListener('dragleave', () => {
      uploadSection.classList.remove('drag-over');
    });

    uploadSection.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadSection.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file) this.onFileSelected(file);
    });

    // Button click
    uploadBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.fileInput.click();
    });

    // File input change
    this.fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) this.onFileSelected(file);
    });

    // Direct click on section
    uploadSection.addEventListener('click', (e) => {
      if (e.target.closest('#uploadBtn')) return;
      this.fileInput.click();
    });
  }

  show() {
    this.container.style.display = 'block';
  }

  hide() {
    this.container.style.display = 'none';
  }

  reset() {
    this.fileInput.value = '';
  }
}

export default UploadWidget;
