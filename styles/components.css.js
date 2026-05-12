/**
 * Component Styles - Styles for individual widgets
 */

export const ComponentStyles = `
/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: var(--navy);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon svg {
  width: 20px;
  height: 20px;
}

.logo-text {
  font-size: 16px;
  font-weight: 700;
  color: var(--navy);
  letter-spacing: -0.3px;
}

.logo-sub {
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 300;
}

.header-badge {
  font-size: 12px;
  background: var(--navy-pale);
  color: var(--navy);
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: 500;
}

/* Upload Section */
.upload-section {
  background: var(--white);
  border-radius: 16px;
  padding: 48px;
  text-align: center;
  border: 2px dashed var(--border);
  transition: all 0.2s;
  cursor: pointer;
}

.upload-section.drag-over {
  border-color: var(--navy);
  background: var(--navy-pale);
}

.upload-section:hover {
  border-color: var(--navy-light);
}

.upload-icon {
  width: 64px;
  height: 64px;
  background: var(--navy-pale);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.upload-icon svg {
  width: 32px;
  height: 32px;
  color: var(--navy);
}

.upload-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--navy);
  margin-bottom: 8px;
}

.upload-desc {
  font-size: 14px;
  color: var(--text-muted);
  margin-bottom: 24px;
  line-height: 1.6;
}

.upload-hint {
  margin-top: 16px;
  font-size: 12px;
  color: #AAA;
}

#fileInput {
  display: none;
}

/* Progress Section */
.progress-section {
  display: none;
  background: var(--white);
  border-radius: 16px;
  padding: 40px;
  text-align: center;
}

.progress-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid var(--navy-pale);
  border-top-color: var(--navy);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.progress-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--navy);
  margin-bottom: 8px;
}

.progress-step {
  font-size: 13px;
  color: var(--text-muted);
}

/* Preview Section */
.preview-section {
  display: none;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
}

.preview-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--navy);
}

.preview-meta {
  font-size: 13px;
  color: var(--text-muted);
  margin-top: 4px;
}

.btn-group {
  display: flex;
  gap: 10px;
}

/* Buttons */
.upload-btn,
.btn-reset,
.btn-download {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  font-family: 'Noto Sans KR', sans-serif;
  transition: all 0.15s;
}

.upload-btn {
  background: var(--navy);
  color: white;
  border: none;
  padding: 12px 28px;
}

.upload-btn:hover {
  background: var(--navy-light);
}

.btn-reset {
  background: var(--white);
  color: var(--gray);
  border: 1px solid var(--border);
  padding: 10px 20px;
  font-size: 13px;
}

.btn-reset:hover {
  border-color: var(--navy);
  color: var(--navy);
}

.btn-download {
  background: var(--navy);
  color: white;
  border: none;
  padding: 10px 24px;
  font-weight: 600;
}

.btn-download:hover {
  background: var(--navy-light);
}

.btn-download:disabled {
  background: #aaa;
  cursor: not-allowed;
}

/* Report Preview */
.report-doc {
  background: var(--white);
  border-radius: 16px;
  padding: 48px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
}

.report-cover-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--navy);
  text-align: center;
  margin-bottom: 8px;
}

.report-cover-period {
  text-align: center;
  font-size: 15px;
  color: var(--gray);
  margin-bottom: 6px;
}

.report-cover-sub {
  text-align: center;
  font-size: 13px;
  color: #AAA;
  padding-bottom: 24px;
  border-bottom: 3px solid var(--navy);
  margin-bottom: 32px;
}

/* Sections */
.section-heading {
  font-size: 16px;
  font-weight: 700;
  color: var(--navy);
  padding-bottom: 8px;
  border-bottom: 2px solid var(--navy);
  margin: 28px 0 16px;
}

/* Summary Cards */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 8px;
}

.summary-card {
  background: var(--navy);
  border-radius: 8px;
  padding: 14px;
  text-align: center;
}

.summary-card-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 6px;
}

.summary-card-value {
  font-size: 18px;
  font-weight: 700;
  color: white;
}

.summary-card-sub {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.6);
  margin-top: 3px;
}

/* Tables */
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  margin-bottom: 8px;
}

.data-table th {
  background: var(--navy);
  color: white;
  padding: 10px 12px;
  text-align: center;
  font-weight: 600;
  font-size: 12px;
}

.data-table td {
  padding: 9px 12px;
  border-bottom: 1px solid var(--border);
  text-align: center;
}

.data-table tr:last-child td {
  border-bottom: none;
}

.data-table tr:hover td {
  background: var(--gray-light);
}

.td-left {
  text-align: left !important;
}

.td-bold {
  font-weight: 600;
}

/* Insights */
.insight-block {
  margin-bottom: 16px;
}

.insight-label {
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.insight-label::before {
  content: '';
  display: inline-block;
  width: 4px;
  height: 16px;
  border-radius: 2px;
  flex-shrink: 0;
}

.insight-label.danger {
  color: var(--red);
}

.insight-label.danger::before {
  background: var(--red);
}

.insight-label.info {
  color: var(--navy);
}

.insight-label.info::before {
  background: var(--navy);
}

.insight-label.success {
  color: var(--green);
}

.insight-label.success::before {
  background: var(--green);
}

.insight-label.warn {
  color: var(--amber);
}

.insight-label.warn::before {
  background: var(--amber);
}

.insight-bullets {
  list-style: none;
  padding-left: 12px;
}

.insight-bullets li {
  font-size: 13px;
  line-height: 1.7;
  color: var(--text);
  padding: 3px 0 3px 14px;
  position: relative;
}

.insight-bullets li::before {
  content: '●';
  position: absolute;
  left: 0;
  font-size: 8px;
  top: 6px;
  color: var(--navy);
}

/* Footer */
.footer-note {
  border-top: 1px solid var(--border);
  margin-top: 32px;
  padding-top: 12px;
  text-align: right;
  font-size: 11px;
  color: #AAA;
}

/* Error Box */
.error-box {
  display: none;
  background: #FFF5F5;
  border: 1px solid #FFCCCC;
  border-radius: 8px;
  padding: 16px 20px;
  color: var(--red);
  font-size: 13px;
  margin-top: 16px;
}
`;

export default ComponentStyles;
