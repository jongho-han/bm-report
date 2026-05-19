/**
 * PreviewWidget - Report preview display
 */

import Formatters from '../utils/formatters.js';

export class PreviewWidget {
  constructor(containerId, onDownload, onReset, onClaudeAnalyze) {
    this.container = document.getElementById(containerId);
    this.onDownload = onDownload;
    this.onReset = onReset;
    this.onClaudeAnalyze = onClaudeAnalyze;
    this.init();
  }

  init() {
    this.render();
  }

  render() {
    this.container.innerHTML = `
      <div class="preview-section" id="previewSection">
        <div class="preview-header">
          <div>
            <div class="preview-title">보고서 미리보기</div>
            <div class="preview-meta" id="previewMeta"></div>
          </div>
          <div class="btn-group">
            <button class="btn-reset" id="resetBtn">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="1,4 1,10 7,10"/>
                <path d="M3.51 15a9 9 0 1 0 .49-3.5"/>
              </svg>
              다시 업로드
            </button>
            <button class="btn-claude" id="claudeBtn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 8v4l3 3"/>
              </svg>
              Claude AI 심층 분석
            </button>
            <button class="btn-download" id="downloadBtn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7,10 12,15 17,10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Word 다운로드
            </button>
          </div>
        </div>
        <div class="report-doc" id="reportPreview"></div>
      </div>
    `;

    this.attachEventListeners();
  }

  attachEventListeners() {
    const downloadBtn = document.getElementById('downloadBtn');
    const resetBtn = document.getElementById('resetBtn');
    const claudeBtn = document.getElementById('claudeBtn');

    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => this.onDownload());
    }
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.onReset());
    }
    if (claudeBtn && this.onClaudeAnalyze) {
      claudeBtn.addEventListener('click', () => this.handleClaudeClick());
    }
  }

  async handleClaudeClick() {
    const claudeBtn = document.getElementById('claudeBtn');
    if (!claudeBtn) return;

    const original = claudeBtn.innerHTML;
    claudeBtn.disabled = true;
    claudeBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg> 준비 중...`;

    try {
      await this.onClaudeAnalyze();
      this.showClaudeToast();
    } finally {
      claudeBtn.disabled = false;
      claudeBtn.innerHTML = original;
    }
  }

  showClaudeToast() {
    const existing = document.getElementById('claudeToast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'claudeToast';
    toast.innerHTML = `
      <strong>Claude AI 준비 완료!</strong><br>
      프롬프트가 클립보드에 복사됐습니다.<br>
      새 탭에서 <kbd>⌘V</kbd> (또는 Ctrl+V)로 붙여넣기 하세요.
    `;
    toast.style.cssText = `
      position: fixed; bottom: 32px; right: 32px; z-index: 9999;
      background: #1F4E79; color: white; padding: 16px 20px;
      border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.25);
      font-size: 14px; line-height: 1.6; max-width: 300px;
      animation: slideIn 0.3s ease;
    `;
    document.head.insertAdjacentHTML('beforeend', `
      <style>@keyframes slideIn{from{transform:translateY(20px);opacity:0}to{transform:translateY(0);opacity:1}}</style>
    `);
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
  }

  renderReport(data) {
    const previewMeta = document.getElementById('previewMeta');
    const reportPreview = document.getElementById('reportPreview');

    previewMeta.textContent = `분석 기간: ${Formatters.formatRange(data.dateStart, data.dateEnd)} · 총 ${data.total}건`;

    // Build report HTML
    const repsRows = Object.entries(data.repCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, cnt]) => 
        `<tr><td>${name}</td><td class="td-bold c-navy">${cnt}건</td><td>${data.repBanks[name] || '-'}</td><td>${data.repBanks[name] || '-'}</td><td></td></tr>`
      )
      .join('');

    const kwColorMap = { navy: 'c-navy', green: 'c-green', red: 'c-red', amber: 'c-amber' };
    const kwRows = data.kwResults.slice(0, 11)
      .map(kw => {
        const cls = (kwColorMap[kw.color] || '') + ' td-bold';
        return `<tr><td class="td-left">${kw.name}</td><td class="${cls}">${kw.count}건</td><td class="td-left">${kw.desc}</td></tr>`;
      })
      .join('');

    const dateRows = Object.entries(data.dateCounts)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, cnt]) => {
        const label = Formatters.formatMonthDay(date);
        const raw = data.dateIssueSummary[date] || '-';
        const issueHtml = raw === '-' 
          ? '-' 
          : raw.split('\n').map(s => `<span style="display:block;padding:2px 0;font-size:12px">• ${s}</span>`).join('');
        return `<tr><td style="white-space:nowrap;vertical-align:top;padding-top:10px">${label}</td><td style="vertical-align:top;padding-top:10px">${cnt}건</td><td class="td-left" style="line-height:1.6;padding:8px 12px">${issueHtml}</td></tr>`;
      })
      .join('');

    const insSec = (label, cls, items) => {
      if (items.length === 0) return '';
      const title = { danger: '경쟁 환경', info: '시장 분위기', success: '당사 강점 및 기회', warn: '개선 과제' }[cls];
      return `<div class="insight-block">
        <div class="insight-label ${cls}">■ ${title}</div>
        <ul class="insight-bullets">${items.map(i => `<li>${i}</li>`).join('')}</ul>
      </div>`;
    };

    const planShortRows = (data.plan.short || [])
      .map((t, i) => `<tr><td style="width:28px;font-weight:600;color:var(--navy)">${i + 1}</td><td style="text-align:left">${t}</td></tr>`)
      .join('');

    const planMidRows = (data.plan.mid || [])
      .map((t, i) => `<tr><td style="width:28px;font-weight:600;color:var(--amber)">${i + 1}</td><td style="text-align:left">${t}</td></tr>`)
      .join('');

    reportPreview.innerHTML = `
      <div class="report-cover-title">BM 영업일지 분석 보고서</div>
      <div class="report-cover-period">${Formatters.formatRange(data.dateStart, data.dateEnd)}</div>
      <div class="report-cover-sub">관리자용 | iM라이프 방카슈랑스 영업본부</div>

      <div class="section-heading">1. 활동 개요</div>
      <div class="summary-grid">
        <div class="summary-card">
          <div class="summary-card-label">총 영업 활동</div>
          <div class="summary-card-value">${data.total}건</div>
          <div class="summary-card-sub">${Formatters.formatRange(data.dateStart, data.dateEnd)}</div>
        </div>
        <div class="summary-card">
          <div class="summary-card-label">영업 담당자</div>
          <div class="summary-card-value">${Object.keys(data.repCounts).length}명</div>
          <div class="summary-card-sub">iM뱅크·KB국민</div>
        </div>
        <div class="summary-card">
          <div class="summary-card-label">주력 채널</div>
          <div class="summary-card-value">${data.topBank || '-'}</div>
          <div class="summary-card-sub">${data.topBank ? data.topBank + ' (' + data.topBankPct + '%)' : '-'}</div>
        </div>
        <div class="summary-card">
          <div class="summary-card-label">경쟁사 언급</div>
          <div class="summary-card-value">${data.totalComp}건</div>
          <div class="summary-card-sub">동양·하나생명 중심</div>
        </div>
      </div>

      <div class="section-heading">2. 담당자별 활동 현황</div>
      <table class="data-table">
        <thead><tr><th>담당자</th><th>활동 건수</th><th>담당 채널</th><th>담당 은행</th><th>비고</th></tr></thead>
        <tbody>${repsRows}</tbody>
      </table>

      <div class="section-heading">3. 주요 상품·키워드 언급 빈도 (내용 분석)</div>
      <table class="data-table">
        <thead><tr><th style="text-align:left">키워드</th><th>언급 건수</th><th style="text-align:left">주요 내용</th></tr></thead>
        <tbody>${kwRows}</tbody>
      </table>

      <div class="section-heading">4. 현장 영업 핵심 인사이트</div>
      ${insSec('위험', 'danger', data.insights.danger)}
      ${insSec('정보', 'info', data.insights.info)}
      ${insSec('성공', 'success', data.insights.success)}
      ${insSec('경고', 'warn', data.insights.warn)}

      <div class="section-heading">5. 일자별 활동 현황</div>
      <table class="data-table">
        <thead><tr><th>날짜</th><th>활동 건수</th><th style="text-align:left">주요 이슈</th></tr></thead>
        <tbody>${dateRows}</tbody>
      </table>

      <div class="section-heading">6. 향후 계획</div>
      <div class="insight-label info" style="margin-bottom:8px">● 단기 과제 (1개월 내)</div>
      <table class="data-table" style="margin-bottom:20px">
        <tbody>${planShortRows}</tbody>
      </table>
      <div class="insight-label warn" style="margin-bottom:8px">● 중기 과제 (분기 내)</div>
      <table class="data-table">
        <tbody>${planMidRows}</tbody>
      </table>

      <div class="footer-note">본 보고서는 BM영업일지 내용(J열) 자동 분석을 기반으로 작성되었습니다. | iM라이프 방카슈랑스팀</div>
    `;
  }

  setDownloadButtonState(disabled, text) {
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
      downloadBtn.disabled = disabled;
      downloadBtn.textContent = text;
    }
  }

  show() {
    const previewSection = document.getElementById('previewSection');
    if (previewSection) previewSection.style.display = 'block';
  }

  hide() {
    const previewSection = document.getElementById('previewSection');
    if (previewSection) previewSection.style.display = 'none';
  }
}

export default PreviewWidget;
