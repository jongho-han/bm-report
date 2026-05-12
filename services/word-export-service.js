/**
 * WordExportService - Word document generation
 */

import XmlUtils from '../utils/xml-utils.js';
import Formatters from '../utils/formatters.js';

export class WordExportService {
  /**
   * Generate complete Word document XML
   * @param {AnalysisData} data - Analysis data
   * @returns {string} Word document XML
   */
  static buildDocumentXml(data) {
    const period = Formatters.formatRange(data.dateStart, data.dateEnd);
    const topBankStr = data.topBank ? `${data.topBank} (${data.topBankPct}%)` : '-';
    const kwColorMap = { navy: '1F4E79', green: '375623', amber: '7F3F00', red: 'C00000', '': '000000' };

    // Cover page
    const cover = [
      XmlUtils.makePara(XmlUtils.makeRun('BM 영업일지 분석 보고서', { bold: true, size: 52, color: '1F4E79' }), { align: 'center', spaceBefore: 480, spaceAfter: 120 }),
      XmlUtils.makePara(XmlUtils.makeRun(period, { size: 24, color: '595959' }), { align: 'center', spaceBefore: 80, spaceAfter: 80 }),
      XmlUtils.makePara(XmlUtils.makeRun('관리자용 | iM라이프 방카슈랑스 영업본부', { size: 20, color: '7F7F7F' }), { align: 'center', spaceBefore: 40, spaceAfter: 480, borderBottom: true }),
    ].join('');

    // Section 1: Overview
    const sec1 = this.makeSummaryTable([
      { label: '총 영업 활동', value: `${data.total}건`, sub: Formatters.formatRange(data.dateStart, data.dateEnd) },
      { label: '영업 담당자', value: `${Object.keys(data.repCounts).length}명`, sub: 'iM뱅크 · KB국민' },
      { label: '주력 채널', value: data.topBank || '-', sub: topBankStr },
      { label: '경쟁사 언급', value: `${data.totalComp}건`, sub: '동양 · 하나생명 중심' },
    ]);

    // Section 2: Rep activity
    const repEntries = Object.entries(data.repCounts).sort((a, b) => b[1] - a[1]);
    const repRows = repEntries.map(([name, cnt], i) => [
      XmlUtils.makeDataCell(name, 'center'),
      XmlUtils.makeDataCell(`${cnt}건`, 'center', true, '1F4E79'),
      XmlUtils.makeDataCell(data.repBanks[name] || '-', 'center'),
      XmlUtils.makeDataCell(data.repBanks[name] || '-', 'center'),
      XmlUtils.makeDataCell(i === 0 ? '최다 활동' : '', 'center'),
    ]);
    const sec2 = XmlUtils.makeTable([1800, 1600, 2000, 1800, 1826], [
      [XmlUtils.makeHeaderCell('담당자'), XmlUtils.makeHeaderCell('활동 건수'), XmlUtils.makeHeaderCell('담당 채널'), XmlUtils.makeHeaderCell('담당 은행'), XmlUtils.makeHeaderCell('비고')],
      ...repRows
    ]);

    // Section 3: Keywords
    const kwRows = data.kwResults.slice(0, 11).map(kw => [
      XmlUtils.makeDataCell(kw.name, 'left'),
      XmlUtils.makeDataCell(`${kw.count}건`, 'center', true, kwColorMap[kw.color] || '000000'),
      XmlUtils.makeDataCell(kw.desc, 'left'),
    ]);
    const sec3 = XmlUtils.makeTable([3200, 1600, 4226], [
      [XmlUtils.makeHeaderCell('키워드'), XmlUtils.makeHeaderCell('언급 건수'), XmlUtils.makeHeaderCell('주요 내용')],
      ...kwRows
    ]);

    // Section 4: Insights
    const insDefs = [
      { key: 'danger', label: '■ 경쟁 환경', color: 'C00000' },
      { key: 'info', label: '■ 시장 분위기', color: '1F4E79' },
      { key: 'success', label: '■ 당사 강점 및 기회', color: '375623' },
      { key: 'warn', label: '■ 개선 과제', color: '7F3F00' },
    ];
    const insParas = insDefs.flatMap(({ key, label, color }) => {
      const items = data.insights[key];
      if (!items || !items.length) return [];
      return [XmlUtils.makeSubHead(label, color), ...items.map(t => XmlUtils.makeBullet(t, 1))];
    }).join('');

    // Section 5: Daily activity
    const dateEntries = Object.entries(data.dateCounts).sort((a, b) => a[0].localeCompare(b[0]));
    const dateRows = dateEntries.map(([date, cnt]) => {
      const label = Formatters.formatMonthDay(date);
      const raw = data.dateIssueSummary[date] || '-';
      const issueParagraphs = raw === '-'
        ? `<w:p><w:pPr><w:jc w:val="left"/></w:pPr>${XmlUtils.makeRun('-', { size: 20 })}</w:p>`
        : raw.split('\n').map(line =>
          `<w:p><w:pPr><w:jc w:val="left"/></w:pPr>${XmlUtils.makeRun('• ' + line, { size: 19 })}</w:p>`
        ).join('');
      const issueCell = `<w:tc><w:tcPr>
        <w:tcBorders><w:top w:val="single" w:sz="1" w:color="CCCCCC"/><w:left w:val="single" w:sz="1" w:color="CCCCCC"/><w:bottom w:val="single" w:sz="1" w:color="CCCCCC"/><w:right w:val="single" w:sz="1" w:color="CCCCCC"/></w:tcBorders>
        <w:shd w:val="clear" w:color="auto" w:fill="FFFFFF"/>
        <w:tcMar><w:top w:w="80" w:type="dxa"/><w:left w:w="120" w:type="dxa"/><w:bottom w:w="80" w:type="dxa"/><w:right w:w="120" w:type="dxa"/></w:tcMar>
        <w:vAlign w:val="top"/>
      </w:tcPr>${issueParagraphs}</w:tc>`;
      return [XmlUtils.makeDataCell(label, 'center'), XmlUtils.makeDataCell(`${cnt}건`, 'center'), issueCell];
    });
    const sec5 = XmlUtils.makeTable([2000, 1800, 5226], [
      [XmlUtils.makeHeaderCell('날짜'), XmlUtils.makeHeaderCell('활동 건수'), XmlUtils.makeHeaderCell('주요 이슈')],
      ...dateRows
    ]);

    // Section 6: Future plans
    const planShortRows = (data.plan.short || []).map((t, i) => [
      XmlUtils.makeDataCell(`${i + 1}`, 'center', true, '1F4E79'),
      XmlUtils.makeDataCell(t, 'left'),
    ]);
    const planMidRows = (data.plan.mid || []).map((t, i) => [
      XmlUtils.makeDataCell(`${i + 1}`, 'center', true, '7F3F00'),
      XmlUtils.makeDataCell(t, 'left'),
    ]);
    const sec6short = XmlUtils.makeTable([600, 8426], [
      [XmlUtils.makeHeaderCell('순번'), XmlUtils.makeHeaderCell('과제 내용')],
      ...planShortRows
    ]);
    const sec6mid = XmlUtils.makeTable([600, 8426], [
      [XmlUtils.makeHeaderCell('순번'), XmlUtils.makeHeaderCell('과제 내용')],
      ...planMidRows
    ]);

    // Build body
    const body = [
      cover,
      XmlUtils.makeSecHead('1. 활동 개요'), sec1, XmlUtils.makeSpacing(),
      XmlUtils.makeSecHead('2. 담당자별 활동 현황'), sec2, XmlUtils.makeSpacing(),
      XmlUtils.makeSecHead('3. 주요 상품·키워드 언급 빈도 (내용 분석)'), sec3, XmlUtils.makeSpacing(),
      XmlUtils.makeSecHead('4. 현장 영업 핵심 인사이트'), insParas, XmlUtils.makeSpacing(),
      XmlUtils.makeSecHead('5. 일자별 활동 현황'), sec5, XmlUtils.makeSpacing(),
      XmlUtils.makeSecHead('6. 향후 계획'),
      XmlUtils.makeSubHead('■ 단기 과제 (1개월 내)', '1F4E79'),
      sec6short, XmlUtils.makeSpacing(),
      XmlUtils.makeSubHead('■ 중기 과제 (분기 내)', '7F3F00'),
      sec6mid, XmlUtils.makeSpacing(240),
      XmlUtils.makePara(XmlUtils.makeRun('본 보고서는 BM영업일지 내용(J열) 자동 분석을 기반으로 작성되었습니다. | iM라이프 방카슈랑스팀', { size: 16, color: '7F7F7F' }), { align: 'right', spaceBefore: 120 }),
    ].join('');

    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:wpc="http://schemas.microsoft.com/office/word/2010/wordprocessingCanvas"
  xmlns:mc="http://schemas.openxmlformats.org/markup-compatibility/2006"
  xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"
  xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
  xmlns:w14="http://schemas.microsoft.com/office/word/2010/wordml"
  mc:Ignorable="w14">
  <w:body>
    ${body}
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="708" w:footer="708" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>`;
  }

  /**
   * Create summary card table
   * @param {array} cards - Card objects
   * @returns {string} XML string
   */
  static makeSummaryTable(cards) {
    const W = 9026;
    const colW = Math.floor(W / cards.length);
    const colWidths = cards.map((_, i) => i === cards.length - 1 ? W - colW * (cards.length - 1) : colW);
    const gridCols = colWidths.map(w => `<w:gridCol w:w="${w}"/>`).join('');
    const FONT = '맑은 고딕';
    const BG = '1F4E79';
    const noBorder = `w:val="none" w:sz="0" w:color="auto"`;

    const cardCell = (card, w) => {
      const labelRun = `<w:r><w:rPr><w:color w:val="BBCFE0"/><w:sz w:val="17"/><w:szCs w:val="17"/><w:rFonts w:ascii="${FONT}" w:eastAsia="${FONT}" w:hAnsi="${FONT}" w:cs="${FONT}"/></w:rPr><w:t xml:space="preserve">${Formatters.escapeXml(card.label)}</w:t></w:r>`;
      const valueRun = `<w:r><w:rPr><w:b/><w:color w:val="FFFFFF"/><w:sz w:val="36"/><w:szCs w:val="36"/><w:rFonts w:ascii="${FONT}" w:eastAsia="${FONT}" w:hAnsi="${FONT}" w:cs="${FONT}"/></w:rPr><w:t xml:space="preserve">${Formatters.escapeXml(card.value)}</w:t></w:r>`;
      const subRun = `<w:r><w:rPr><w:color w:val="99B8D0"/><w:sz w:val="16"/><w:szCs w:val="16"/><w:rFonts w:ascii="${FONT}" w:eastAsia="${FONT}" w:hAnsi="${FONT}" w:cs="${FONT}"/></w:rPr><w:t xml:space="preserve">${Formatters.escapeXml(card.sub)}</w:t></w:r>`;

      const labelPara = `<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:before="0" w:after="40" w:line="240" w:lineRule="auto"/></w:pPr>${labelRun}</w:p>`;
      const valuePara = `<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:before="0" w:after="40" w:line="240" w:lineRule="auto"/></w:pPr>${valueRun}</w:p>`;
      const subPara = `<w:p><w:pPr><w:jc w:val="center"/><w:spacing w:before="0" w:after="0" w:line="240" w:lineRule="auto"/></w:pPr>${subRun}</w:p>`;

      return `<w:tc><w:tcPr>
        <w:tcW w:w="${w}" w:type="dxa"/>
        <w:tcBorders>
          <w:top ${noBorder}/><w:left ${noBorder}/><w:bottom ${noBorder}/>
          <w:right w:val="single" w:sz="4" w:color="FFFFFF"/>
        </w:tcBorders>
        <w:shd w:val="clear" w:color="auto" w:fill="${BG}"/>
        <w:tcMar><w:top w:w="120" w:type="dxa"/><w:left w:w="140" w:type="dxa"/><w:bottom w:w="120" w:type="dxa"/><w:right w:w="140" w:type="dxa"/></w:tcMar>
        <w:vAlign w:val="center"/>
      </w:tcPr>${labelPara}${valuePara}${subPara}</w:tc>`;
    };

    const row = `<w:tr>${cards.map((c, i) => cardCell(c, colWidths[i])).join('')}</w:tr>`;
    return `<w:tbl>
      <w:tblPr>
        <w:tblW w:w="${W}" w:type="dxa"/>
        <w:tblBorders>
          <w:top ${noBorder}/><w:left ${noBorder}/><w:bottom ${noBorder}/><w:right ${noBorder}/>
          <w:insideH ${noBorder}/><w:insideV ${noBorder}/>
        </w:tblBorders>
        <w:tblCellSpacing w:w="80" w:type="dxa"/>
      </w:tblPr>
      <w:tblGrid>${gridCols}</w:tblGrid>
      ${row}
    </w:tbl>`;
  }

  /**
   * Generate complete DOCX ZIP
   * @param {AnalysisData} data - Analysis data
   * @param {string} fileName - Original file name
   * @returns {Promise<Blob>} DOCX blob
   */
  static async generateDocx(data, fileName) {
    const zip = new JSZip();

    const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default ContentType="application/vnd.openxmlformats-package.relationships+xml" Extension="rels"/>
  <Default ContentType="application/xml" Extension="xml"/>
  <Override ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml" PartName="/word/document.xml"/>
  <Override ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml" PartName="/word/styles.xml"/>
  <Override ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml" PartName="/word/numbering.xml"/>
  <Override ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.settings+xml" PartName="/word/settings.xml"/>
  <Override ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.fontTable+xml" PartName="/word/fontTable.xml"/>
</Types>`;

    const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

    const docRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
  <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/>
  <Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/settings" Target="settings.xml"/>
  <Relationship Id="rId4" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/fontTable" Target="fontTable.xml"/>
</Relationships>`;

    const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:docDefaults>
    <w:rPrDefault><w:rPr>
      <w:rFonts w:ascii="맑은 고딕" w:eastAsia="맑은 고딕" w:hAnsi="맑은 고딕" w:cs="맑은 고딕"/>
      <w:sz w:val="20"/><w:szCs w:val="20"/>
    </w:rPr></w:rPrDefault>
  </w:docDefaults>
  <w:style w:type="paragraph" w:styleId="Normal"><w:name w:val="Normal"/></w:style>
</w:styles>`;

    const numbering = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:abstractNum w:abstractNumId="0">
    <w:multiLevelType w:val="hybridMultilevel"/>
    <w:lvl w:ilvl="0">
      <w:start w:val="1"/>
      <w:numFmt w:val="bullet"/>
      <w:lvlText w:val="&#x25CF;"/>
      <w:lvlJc w:val="left"/>
      <w:pPr><w:ind w:left="560" w:hanging="280"/></w:pPr>
      <w:rPr>
        <w:rFonts w:ascii="맑은 고딕" w:eastAsia="맑은 고딕" w:hAnsi="맑은 고딕"/>
        <w:sz w:val="20"/><w:szCs w:val="20"/>
      </w:rPr>
    </w:lvl>
  </w:abstractNum>
  <w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num>
</w:numbering>`;

    const settings = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:settings xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:defaultTabStop w:val="720"/>
</w:settings>`;

    const fontTable = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:fonts xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:font w:name="맑은 고딕">
    <w:panose1 w:val="02110609070A0202020204"/>
    <w:charset w:val="81"/>
    <w:family w:val="swiss"/>
    <w:pitch w:val="variable"/>
  </w:font>
</w:fonts>`;

    const documentXml = this.buildDocumentXml(data);

    zip.file('[Content_Types].xml', contentTypes);
    zip.file('_rels/.rels', rels);
    zip.file('word/document.xml', documentXml);
    zip.file('word/_rels/document.xml.rels', docRels);
    zip.file('word/styles.xml', styles);
    zip.file('word/numbering.xml', numbering);
    zip.file('word/settings.xml', settings);
    zip.file('word/fontTable.xml', fontTable);

    return await zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  }

  /**
   * Download generated DOCX file
   * @param {Blob} blob - DOCX blob
   * @param {string} fileName - Original file name
   */
  static download(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const safeName = fileName.replace(/\.xlsx?$/i, '');
    a.download = `BM영업일지_분석보고서_${safeName}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export default WordExportService;
