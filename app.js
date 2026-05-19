/**
 * Main Application - Orchestrates widgets and services
 */

import FileService from './services/file-service.js';
import AnalysisService from './services/analysis-service.js';
import WordExportService from './services/word-export-service.js';
import ClaudeService from './services/claude-service.js';
import AnalysisData from './models/analysis-data.js';
import UploadWidget from './components/upload-widget.js';
import ProgressWidget from './components/progress-widget.js';
import PreviewWidget from './components/preview-widget.js';
import ErrorWidget from './components/error-widget.js';

class ReportApp {
  constructor() {
    this.analysisData = null;
    this.fileName = '';
    this.initializeWidgets();
  }

  initializeWidgets() {
    // Error widget
    this.errorWidget = new ErrorWidget('errorContainer');

    // Upload widget
    this.uploadWidget = new UploadWidget('uploadContainer', (file) => this.handleFileSelected(file));

    // Progress widget
    this.progressWidget = new ProgressWidget('progressContainer');

    // Preview widget
    this.previewWidget = new PreviewWidget(
      'previewContainer',
      () => this.handleDownload(),
      () => this.handleReset(),
      () => this.handleClaudeAnalyze()
    );
  }

  async handleFileSelected(file) {
    try {
      this.fileName = file.name;
      this.showProgress('파일을 읽는 중입니다...');

      // Read file
      const rows = await FileService.readFile(file);
      this.setProgressStep('데이터를 파싱하는 중입니다...');

      // Analyze data
      this.setProgressStep('영업 활동을 분석하는 중입니다...');
      const analysisResult = AnalysisService.analyze(rows);
      this.analysisData = AnalysisData.fromAnalysis(analysisResult);

      this.setProgressStep('보고서를 구성하는 중입니다...');
      
      // Show preview after short delay
      await this.delay(300);
      this.previewWidget.renderReport(this.analysisData);
      this.showPreview();
    } catch (error) {
      this.showError('파일 처리 오류: ' + error.message);
    }
  }

  async handleDownload() {
    if (!this.analysisData) return;

    const downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.disabled = true;
    downloadBtn.textContent = '생성 중...';

    try {
      const blob = await WordExportService.generateDocx(this.analysisData, this.fileName);
      WordExportService.download(blob, this.fileName);
    } catch (error) {
      alert('Word 파일 생성 오류: ' + error.message);
      console.error(error);
    }

    this.#restoreDownloadBtn(downloadBtn);
    downloadBtn.disabled = false;
  }

  async handleClaudeAnalyze() {
    if (!this.analysisData) return;
    await ClaudeService.openWithPrompt(this.analysisData, this.fileName);
  }

  #restoreDownloadBtn(btn) {
    btn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7,10 12,15 17,10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
      Word 다운로드
    `;
  }

  handleReset() {
    this.analysisData = null;
    this.fileName = '';
    this.uploadWidget.reset();
    this.previewWidget.hide();
    this.errorWidget.clear();
    this.uploadWidget.show();
  }

  showProgress(message) {
    this.uploadWidget.hide();
    this.errorWidget.hide();
    this.previewWidget.hide();
    this.progressWidget.setStep(message);
    this.progressWidget.show();
  }

  setProgressStep(message) {
    this.progressWidget.setStep(message);
  }

  showPreview() {
    this.progressWidget.hide();
    this.previewWidget.show();
  }

  showError(message) {
    this.progressWidget.hide();
    this.uploadWidget.show();
    this.errorWidget.show(message);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  start() {
    this.uploadWidget.show();
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new ReportApp();
  app.start();
});
