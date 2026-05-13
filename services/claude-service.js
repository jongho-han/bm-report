/**
 * ClaudeService - Formats analysis data into a Claude AI prompt and opens claude.ai
 */

export class ClaudeService {
  static buildPrompt(data, fileName) {
    const period = data.dateStart && data.dateEnd
      ? `${data.dateStart} ~ ${data.dateEnd}`
      : '기간 미상';

    const repLines = Object.entries(data.repCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, cnt]) => `  - ${name}: ${cnt}건 (담당 은행: ${data.repBanks[name] || '미상'})`)
      .join('\n');

    const bankLines = Object.entries(data.bankCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([bank, cnt]) => `  - ${bank}: ${cnt}건`)
      .join('\n');

    const kwLines = data.kwResults
      .map(kw => `  - ${kw.name}: ${kw.count}건 → ${kw.desc}`)
      .join('\n');

    const compLines = [
      data.kwResults.find(k => k.name.includes('동양생명')),
      data.kwResults.find(k => k.name.includes('하나생명')),
      data.kwResults.find(k => k.name.includes('흥국')),
      data.kwResults.find(k => k.name.includes('한화')),
    ]
      .filter(Boolean)
      .map(k => `  - ${k.name}: ${k.count}건`)
      .join('\n') || '  - 경쟁사 언급 없음';

    const insightLines = [
      ...data.insights.danger.map(i => `  [위험] ${i}`),
      ...data.insights.info.map(i => `  [정보] ${i}`),
      ...data.insights.success.map(i => `  [강점] ${i}`),
      ...data.insights.warn.map(i => `  [과제] ${i}`),
    ].join('\n') || '  - 없음';

    const dateLines = Object.entries(data.dateCounts)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, cnt]) => {
        const issues = data.dateIssueSummary[date] || '-';
        return `  [${date}] ${cnt}건\n    ${issues.replace(/\n/g, '\n    ')}`;
      })
      .join('\n');

    const shortPlanLines = (data.plan.short || []).map((t, i) => `  ${i + 1}. ${t}`).join('\n');
    const midPlanLines = (data.plan.mid || []).map((t, i) => `  ${i + 1}. ${t}`).join('\n');

    const rawSamples = (data.records || [])
      .filter(r => r.내용)
      .slice(0, 30)
      .map((r, i) => `  ${i + 1}. [${r.날짜 || '-'}] ${r.이름 || '-'} / ${r.은행 || '-'}: ${r.내용}`)
      .join('\n');

    return `당신은 방카슈랑스 영업 전문 분석가입니다. 아래는 iM라이프 영업담당자들의 실제 영업일지 데이터를 자동 분석한 결과입니다. 이 데이터를 바탕으로 심층 분석과 실행 가능한 전략을 제시해 주세요.

═══════════════════════════════════════
BM 영업일지 분석 데이터
파일: ${fileName || '영업일지.xlsx'}
분석 기간: ${period}
═══════════════════════════════════════

【1. 활동 개요】
- 총 영업 활동: ${data.total}건
- 담당자 수: ${Object.keys(data.repCounts).length}명
- 주력 채널: ${data.topBank || '-'} (${data.topBankPct || 0}%)
- 경쟁사 총 언급: ${data.totalComp}건

【2. 담당자별 활동 현황】
${repLines || '  - 데이터 없음'}

【3. 채널(은행)별 활동 현황】
${bankLines || '  - 데이터 없음'}

【4. 주요 키워드 분석】
${kwLines || '  - 데이터 없음'}

【5. 경쟁사 언급 현황】
${compLines}

【6. 자동 생성 인사이트】
${insightLines}

【7. 일자별 활동 및 이슈】
${dateLines || '  - 데이터 없음'}

【8. 기존 자동 생성 향후 계획】
▶ 단기 과제 (1개월 내):
${shortPlanLines || '  - 없음'}
▶ 중기 과제 (분기 내):
${midPlanLines || '  - 없음'}

【9. 실제 영업일지 원문 샘플 (최대 30건)】
${rawSamples || '  - 데이터 없음'}

═══════════════════════════════════════
📋 분석 요청 사항
═══════════════════════════════════════

위 데이터를 바탕으로 다음 항목을 분석해 주세요:

1. **경쟁 환경 심층 분석**: 동양생명·하나생명 위협 수준과 대응 전략
2. **핵심 영업 기회**: 데이터에서 포착되는 즉시 활용 가능한 기회
3. **담당자별 성과 패턴**: 활동량과 채널 특성 기반 코칭 포인트
4. **상품 포트폴리오 전략**: 현장 반응 기반 집중 상품 우선순위
5. **구체적 실행 계획**: 이번 주/이번 달/이번 분기별 액션 아이템
6. **주의해야 할 리스크**: 데이터에서 감지되는 위험 신호

한국어로 답변해 주시고, 실무자가 바로 활용할 수 있도록 구체적이고 실행 가능한 내용으로 작성해 주세요.`;
  }

  static async openWithPrompt(data, fileName) {
    const prompt = this.buildPrompt(data, fileName);

    try {
      await navigator.clipboard.writeText(prompt);
    } catch {
      // fallback: textarea 방식
      const ta = document.createElement('textarea');
      ta.value = prompt;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }

    window.open('https://claude.ai/new', '_blank');
    return true;
  }
}

export default ClaudeService;
