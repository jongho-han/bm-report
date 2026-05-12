/**
 * AnalysisService - Data analysis and insights generation
 */

import FileService from './file-service.js';
import Formatters from '../utils/formatters.js';

export class AnalysisService {
  /**
   * Analyze Excel data and generate insights
   * @param {array} rows - Sheet rows
   * @returns {object} Analysis result
   */
  static analyze(rows) {
    // Validate
    if (!rows || rows.length < 2) throw new Error('데이터가 없습니다.');

    // Parse header and records
    const headerIdx = FileService.findHeaderIndex(rows);
    const headers = rows[headerIdx].map(h => String(h || '').trim());
    const ci = FileService.extractColumnIndices(headers);
    const records = FileService.parseRecords(rows, headerIdx, ci);

    if (!records.length) throw new Error('유효한 데이터 행이 없습니다.');

    // Aggregate data
    const dates = [...new Set(records.map(r => r.날짜).filter(Boolean))].sort();
    const repCounts = {}, repBanks = {}, bankCounts = {};
    
    records.forEach(r => {
      if (r.이름) {
        repCounts[r.이름] = (repCounts[r.이름] || 0) + 1;
        if (r.은행) repBanks[r.이름] = r.은행;
      }
      if (r.은행) bankCounts[r.은행] = (bankCounts[r.은행] || 0) + 1;
    });

    const topBank = Object.entries(bankCounts).sort((a, b) => b[1] - a[1])[0];
    const topBankPct = topBank ? Formatters.toPercentage(topBank[1], records.length) : 0;
    
    const contents = records.map(r => r.내용).filter(Boolean);
    const totalComp = Object.values({
      '동양생명': contents.filter(c => c.includes('동양')).length,
      '하나생명': contents.filter(c => c.includes('하나생명')).length,
      '흥국': contents.filter(c => c.includes('흥국')).length,
      '한화': contents.filter(c => c.includes('한화')).length,
    }).reduce((a, b) => a + b, 0);

    // Keyword analysis
    const kwResults = this.analyzeKeywords(contents);

    // Competitor analysis
    const compCounts = {
      '동양생명': contents.filter(c => c.includes('동양')).length,
      '하나생명': contents.filter(c => c.includes('하나생명')).length,
      '흥국': contents.filter(c => c.includes('흥국')).length,
      '한화': contents.filter(c => c.includes('한화')).length,
    };

    // Date-based analysis
    const dateCounts = {}, dateIssueTexts = {};
    records.forEach(r => {
      if (!r.날짜) return;
      dateCounts[r.날짜] = (dateCounts[r.날짜] || 0) + 1;
      if (!dateIssueTexts[r.날짜]) dateIssueTexts[r.날짜] = [];
      if (r.내용) dateIssueTexts[r.날짜].push(r.내용);
    });

    const dateIssueSummary = this.summarizeDateIssues(dateIssueTexts);

    // Generate insights
    const insights = this.generateInsights(contents, compCounts, bankCounts);
    const plan = this.generatePlan(insights, kwResults, compCounts);

    return {
      total: records.length,
      records,
      repCounts,
      repBanks,
      bankCounts,
      topBank: topBank ? topBank[0] : '',
      topBankPct,
      totalComp,
      dateStart: dates[0] || '',
      dateEnd: dates[dates.length - 1] || '',
      dates,
      dateCounts,
      dateIssueSummary,
      kwResults,
      insights,
      plan
    };
  }

  /**
   * Analyze keywords in content
   * @param {array} contents - Content texts
   * @returns {array} Keyword results
   */
  static analyzeKeywords(contents) {
    const kwDefs = [
      { name: '치매/저해지 상품', keys: ['치매', '저해지'], color: 'navy', desc: '8년차 환급률 강조 영업. 치매형 창구 활성화 시도' },
      { name: '수수료 강점', keys: ['수수료'], color: 'green', desc: '당사 핵심 경쟁력. 다수 지점 긍정 반응' },
      { name: '상해일반형', keys: ['상해 일반', '상해일반', '상해형', '안심상해'], color: 'green', desc: '5·7·20년납 비교 설명, 여성 피보험자 수수료 우위' },
      { name: '하이브리드/일시납', keys: ['하이브리드', '일시납'], color: 'amber', desc: '창구 선호 상품. 수수료 낮다는 의견 병존' },
      { name: '법인계약', keys: ['법인'], color: 'amber', desc: '대부계 실적 저조로 연계 판매 기회 감소' },
      { name: '대출연계 판매', keys: ['대출'], color: '', desc: '신규 대출 발생 감소로 연계 판매 어려움' },
      { name: '경쟁사: 동양생명', keys: ['동양'], color: 'red', desc: '4월 개정 이후 환급률 우위로 지점 선호 지속' },
      { name: '경쟁사: 하나생명', keys: ['하나생명'], color: 'red', desc: '가입한도·PB채널 선호. 강한 선호도 형성' },
      { name: '펀드', keys: ['펀드'], color: '', desc: '투자 관심 고객 증가로 보험 판매 어려움 가중' },
      { name: '신계약', keys: ['신계약'], color: '', desc: '감사 인사·사은품 전달 및 지속 관리 활동' },
      { name: '연금', keys: ['연금'], color: '', desc: '일시납 연금 중심 창구 판매 현황' },
    ];

    return kwDefs
      .map(kw => ({
        ...kw,
        count: contents.filter(c => kw.keys.some(k => c.includes(k))).length
      }))
      .filter(k => k.count > 0)
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Summarize issues by date
   * @param {object} dateIssueTexts - Map of date to issue texts
   * @returns {object} Summary map
   */
  static summarizeDateIssues(dateIssueTexts) {
    const issueRules = [
      { keys: ['동양'], neg: [], tag: '경쟁', tmpl: (n, c) => `동양생명 경쟁 ${n}건 — ${c.includes('환급률') ? '환급률 비교 이슈' : c.includes('선호') ? '판매인 선호도 높음' : '방문 지점서 언급됨'}` },
      { keys: ['하나생명'], neg: [], tag: '경쟁', tmpl: (n, c) => `하나생명 경쟁 ${n}건 — ${c.includes('한도') || c.includes('가입') ? '가입한도 우위 경쟁' : c.includes('PB') ? 'PB채널 선점' : '현장서 비교 요청'}` },
      { keys: ['흥국'], neg: [], tag: '경쟁', tmpl: (n, c) => `흥국생명 경쟁 ${n}건` },
      { keys: ['치매', '저해지'], neg: [], tag: '상품', tmpl: (n, c) => `치매·저해지 상품 홍보 ${n}건 — ${c.includes('8년') || c.includes('8년차') ? '8년차 환급률 강조' : c.includes('비과세') ? '비과세 컨셉 활용' : '창구 활성화 집중'}` },
      { keys: ['상해 일반', '상해일반', '안심상해', '상해형'], neg: [], tag: '상품', tmpl: (n, c) => `상해일반형 홍보 ${n}건 — ${c.includes('여성') || c.includes('여자') || c.includes('피보험자') ? '여성 피보험자 수수료 우위 화법' : c.includes('20년') ? '20년납 수수료 비교 설명' : '5·7·20년납 플랜 안내'}` },
      { keys: ['하이브리드', '일시납'], neg: [], tag: '상품', tmpl: (n, c) => `하이브리드·일시납 홍보 ${n}건 — ${c.includes('수수료') && (c.includes('낮') || c.includes('아쉽')) ? '수수료 낮다는 의견 병존' : c.includes('연금') ? '일시납 연금 연계 판매' : '창구 선호 상품으로 활용'}` },
      { keys: ['연금'], neg: ['하이브리드', '일시납'], tag: '상품', tmpl: (n, c) => `연금 상품 안내 ${n}건` },
      { keys: ['수수료'], neg: [], tag: '강점', tmpl: (n, c) => `수수료 강점 안내 ${n}건 — ${c.includes('좋') && !c.includes('낮') ? '판매인 긍정 반응' : c.includes('낮') || c.includes('아쉽') ? '수수료 열위 불만 병존' : '경쟁사 대비 우위 설명'}` },
    ];

    const dateIssueSummary = {};
    Object.entries(dateIssueTexts).forEach(([date, texts]) => {
      const combined = texts.join(' ');
      const issues = [];
      for (const rule of issueRules) {
        const matchTexts = texts.filter(t =>
          rule.keys.some(k => t.includes(k)) &&
          !rule.neg.some(n => t.includes(n))
        );
        if (matchTexts.length === 0) continue;
        const sample = matchTexts[0];
        issues.push({ tag: rule.tag, text: rule.tmpl(matchTexts.length, combined), score: matchTexts.length });
      }
      const seen = new Set();
      const top = issues
        .sort((a, b) => b.score - a.score)
        .filter(i => { if (seen.has(i.tag)) return false; seen.add(i.tag); return true; })
        .slice(0, 3);
      dateIssueSummary[date] = top.length > 0 ? top.map(i => i.text).join('\n') : '-';
    });

    return dateIssueSummary;
  }

  /**
   * Generate insights from analysis
   * @param {array} contents - Content texts
   * @param {object} compCounts - Competitor counts
   * @param {object} bankCounts - Bank counts
   * @returns {object} Insights by category
   */
  static generateInsights(contents, compCounts, bankCounts) {
    const total = contents.length || 1;
    const insights = { danger: [], info: [], success: [], warn: [] };

    // Competitive environment
    if (compCounts['동양생명'] > 0) {
      const refundMention = contents.filter(c => c.includes('동양') && c.includes('환급률')).length;
      insights.danger.push(`[동양생명] 총 ${compCounts['동양생명']}건 언급 (전체 대비 ${Formatters.toPercentage(compCounts['동양생명'], total)}%). 4월 상품 개정 이후 환급률 우위로 지점 선호도 상승. 환급률 직접 비교 언급 ${refundMention}건 확인`);
    }
    if (compCounts['하나생명'] > 0) {
      const limitMention = contents.filter(c => c.includes('하나생명') && (c.includes('한도') || c.includes('PB') || c.includes('가입'))).length;
      insights.danger.push(`[하나생명] 총 ${compCounts['하나생명']}건 언급. PB센터·VIP채널에서 높은 가입한도를 바탕으로 고액 계약 유치. 한도 관련 언급 ${limitMention}건`);
    }

    // Market atmosphere
    const fundCnt = contents.filter(c => c.includes('펀드')).length;
    const loanCnt = contents.filter(c => c.includes('대출')).length;
    const hardCnt = contents.filter(c => /어렵|힘들|주춤|못/.test(c)).length;
    
    if (fundCnt > 0) {
      insights.info.push(`[투자시장 쏠림] 펀드·투자상품 언급 ${fundCnt}건. 고객 관심 투자쪽으로 쏠림, 보장성보험 판매 어려움`);
    }
    if (loanCnt > 0) {
      const loanLowCnt = contents.filter(c => c.includes('대출') && (c.includes('없') || c.includes('저조'))).length;
      insights.info.push(`[대부계 실적 저조] 대출 관련 언급 ${loanCnt}건 중 부진 언급 ${loanLowCnt}건. 대부계 연계 판매 기회 감소`);
    }

    // Company strengths
    const feeCnt = contents.filter(c => c.includes('수수료')).length;
    const feePoseCnt = contents.filter(c => c.includes('수수료') && c.includes('좋') && !c.includes('낮')).length;
    const demCnt = contents.filter(c => c.includes('치매')).length;
    
    if (feeCnt > 0) {
      insights.success.push(`[수수료 우위] 수수료 관련 언급 ${feeCnt}건. 긍정 반응 ${feePoseCnt}건 — 당사 핵심 경쟁력`);
    }
    if (demCnt > 0) {
      insights.success.push(`[치매보장형 기회] 치매 관련 언급 ${demCnt}건. 8년차 환급률 우위 활용 가능`);
    }

    return insights;
  }

  /**
   * Generate action plan
   * @param {object} insights - Generated insights
   * @param {array} kwResults - Keyword results
   * @param {object} compCounts - Competitor counts
   * @returns {object} Short-term and mid-term plans
   */
  static generatePlan(insights, kwResults, compCounts) {
    const plan = { short: [], mid: [] };
    const allInsights = [...insights.danger, ...insights.info, ...insights.success, ...insights.warn];

    // Short-term tasks
    if (allInsights.some(i => i.includes('경쟁'))) {
      plan.short.push('경쟁사(동양·하나생명) 대비 상품 비교표 최신화 및 담당자 공유');
    }
    if (allInsights.some(i => i.includes('수수료'))) {
      plan.short.push('수수료 강조형 표준 영업 스크립트 및 화법 가이드 배포');
    }
    if (allInsights.some(i => i.includes('치매'))) {
      plan.short.push('고성과 지점 치매형 연수 모델 확산 — 미연수 지점 우선 방문');
    }

    // Mid-term tasks
    if (allInsights.some(i => i.includes('환급률'))) {
      plan.mid.push('저해지 상품 5년·8년·10년 구간별 환급률 개선안 상품팀 협의');
    }
    if (allInsights.some(i => i.includes('한도'))) {
      plan.mid.push('하나생명 대비 가입한도 상향 또는 PB채널 예외 심사 검토');
    }
    if (allInsights.some(i => i.includes('대부계'))) {
      plan.mid.push('대출 연계 의존도 낮추고 창구 자력 판매 역량 강화');
    }

    if (plan.short.length === 0) {
      plan.short.push('주요 경쟁사 상품 비교표 최신화 및 현장 배포');
    }
    if (plan.mid.length === 0) {
      plan.mid.push('저해지·상해 상품 환급률 경쟁력 개선 검토');
    }

    return plan;
  }
}

export default AnalysisService;
