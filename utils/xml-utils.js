/**
 * XML Utilities - Helper functions for Word document XML generation
 */

import Formatters from './formatters.js';

export const XmlUtils = {
  /**
   * Create a run (formatted text) element
   * @param {string} text - Text content
   * @param {object} opts - Options (bold, size, color, font)
   * @returns {string} XML string
   */
  makeRun(text, opts = {}) {
    const { bold = false, size = 20, color = '000000', font = '맑은 고딕' } = opts;
    const boldTag = bold ? '<w:b/>' : '';
    return `<w:r><w:rPr>${boldTag}<w:color w:val="${color}"/><w:sz w:val="${size}"/><w:szCs w:val="${size}"/><w:rFonts w:ascii="${font}" w:eastAsia="${font}" w:hAnsi="${font}" w:cs="${font}"/></w:rPr><w:t xml:space="preserve">${Formatters.escapeXml(text)}</w:t></w:r>`;
  },

  /**
   * Create a paragraph element
   * @param {string} runs - Inner run elements
   * @param {object} opts - Options
   * @returns {string} XML string
   */
  makePara(runs, opts = {}) {
    const { align = 'center', spaceBefore = 0, spaceAfter = 0, borderBottom = false, numId = null, ilvl = 0 } = opts;
    let pPr = `<w:jc w:val="${align}"/>`;
    if (spaceBefore || spaceAfter) {
      pPr += `<w:spacing w:before="${spaceBefore}" w:after="${spaceAfter}"/>`;
    }
    if (borderBottom) {
      pPr += `<w:pBdr><w:bottom w:val="single" w:sz="12" w:color="1F4E79" w:space="1"/></w:pBdr>`;
    }
    if (numId !== null) {
      pPr = `<w:numPr><w:ilvl w:val="${ilvl}"/><w:numId w:val="${numId}"/></w:numPr>` + pPr;
    }
    return `<w:p><w:pPr>${pPr}</w:pPr>${runs}</w:p>`;
  },

  /**
   * Create a section heading
   * @param {string} text - Heading text
   * @returns {string} XML string
   */
  makeSecHead(text) {
    return this.makePara(
      this.makeRun(text, { bold: true, size: 28, color: '1F4E79' }),
      { align: 'left', spaceBefore: 300, spaceAfter: 120, borderBottom: true }
    );
  },

  /**
   * Create a sub-heading
   * @param {string} text - Heading text
   * @param {string} color - Color hex code
   * @returns {string} XML string
   */
  makeSubHead(text, color = '000000') {
    return this.makePara(
      this.makeRun(text, { bold: true, size: 22, color }),
      { align: 'left', spaceBefore: 100, spaceAfter: 40 }
    );
  },

  /**
   * Create a bullet point
   * @param {string} text - Bullet text
   * @param {number} numId - Numbering list ID
   * @returns {string} XML string
   */
  makeBullet(text, numId = 1) {
    return this.makePara(
      this.makeRun(text, { size: 20 }),
      { align: 'left', spaceBefore: 60, spaceAfter: 60, numId }
    );
  },

  /**
   * Create spacing paragraph
   * @param {number} before - Space before (default: 120)
   * @returns {string} XML string
   */
  makeSpacing(before = 120) {
    return `<w:p><w:pPr><w:spacing w:before="${before}"/></w:pPr></w:p>`;
  },

  /**
   * Create a table cell
   * @param {string} text - Cell content
   * @param {object} opts - Options
   * @returns {string} XML string
   */
  makeCell(text, opts = {}) {
    const { align = 'center', bold = false, color = '000000', bg = 'FFFFFF', isHeader = false } = opts;
    const font = '맑은 고딕';
    const fColor = isHeader ? 'FFFFFF' : color;
    const fBold = isHeader || bold;
    const fSize = 20;
    const borders = `<w:tcBorders><w:top w:val="single" w:sz="1" w:color="CCCCCC"/><w:left w:val="single" w:sz="1" w:color="CCCCCC"/><w:bottom w:val="single" w:sz="1" w:color="CCCCCC"/><w:right w:val="single" w:sz="1" w:color="CCCCCC"/></w:tcBorders>`;
    const shading = `<w:shd w:val="clear" w:color="auto" w:fill="${bg}"/>`;
    const margins = `<w:tcMar><w:top w:w="80" w:type="dxa"/><w:left w:w="120" w:type="dxa"/><w:bottom w:w="80" w:type="dxa"/><w:right w:w="120" w:type="dxa"/></w:tcMar>`;
    const vAlign = `<w:vAlign w:val="center"/>`;
    const para = `<w:p><w:pPr><w:jc w:val="${align}"/><w:spacing w:before="0" w:after="0" w:line="240" w:lineRule="auto"/></w:pPr>${this.makeRun(text, { bold: fBold, size: fSize, color: fColor, font })}</w:p>`;
    return `<w:tc><w:tcPr>${borders}${shading}${margins}${vAlign}</w:tcPr>${para}</w:tc>`;
  },

  /**
   * Create a header cell
   * @param {string} text - Cell text
   * @returns {string} XML string
   */
  makeHeaderCell(text) {
    return this.makeCell(text, { isHeader: true, bg: '1F4E79' });
  },

  /**
   * Create a data cell
   * @param {string} text - Cell text
   * @param {string} align - Alignment
   * @param {boolean} bold - Bold font
   * @param {string} color - Text color
   * @returns {string} XML string
   */
  makeDataCell(text, align = 'center', bold = false, color = '000000') {
    return this.makeCell(text, { align, bold, color, bg: 'FFFFFF' });
  },

  /**
   * Create a table
   * @param {array} colWidths - Column widths in twips
   * @param {array} rows - Array of row arrays (each row contains cells)
   * @returns {string} XML string
   */
  makeTable(colWidths, rows) {
    const totalW = colWidths.reduce((a, b) => a + b, 0);
    const gridCols = colWidths.map(w => `<w:gridCol w:w="${w}"/>`).join('');
    const tblRows = rows.map(cells => `<w:tr>${cells.join('')}</w:tr>`).join('');
    return `<w:tbl>
    <w:tblPr>
      <w:tblW w:w="${totalW}" w:type="dxa"/>
      <w:tblBorders>
        <w:top w:val="single" w:sz="1" w:color="CCCCCC"/>
        <w:left w:val="single" w:sz="1" w:color="CCCCCC"/>
        <w:bottom w:val="single" w:sz="1" w:color="CCCCCC"/>
        <w:right w:val="single" w:sz="1" w:color="CCCCCC"/>
        <w:insideH w:val="single" w:sz="1" w:color="CCCCCC"/>
        <w:insideV w:val="single" w:sz="1" w:color="CCCCCC"/>
      </w:tblBorders>
    </w:tblPr>
    <w:tblGrid>${gridCols}</w:tblGrid>
    ${tblRows}
  </w:tbl>`;
  }
};

export default XmlUtils;
