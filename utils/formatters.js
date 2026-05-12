/**
 * Formatters - Date and text formatting utilities
 */

export const Formatters = {
  /**
   * Parse and format date to Korean format
   * @param {string} d - Date string
   * @returns {string} Formatted date (e.g., "2026년 5월 12일")
   */
  formatDate(d) {
    if (!d) return '';
    const p = d.split(/[-\/T]/);
    return p.length >= 3 
      ? `${p[0]}년 ${parseInt(p[1])}월 ${parseInt(p[2])}일` 
      : d;
  },

  /**
   * Format date range
   * @param {string} start - Start date
   * @param {string} end - End date
   * @returns {string} Formatted range
   */
  formatRange(start, end) {
    if (!start) return '기간 미상';
    return start === end 
      ? this.formatDate(start) 
      : `${this.formatDate(start)} ~ ${this.formatDate(end)}`;
  },

  /**
   * Format simple month/day from date string
   * @param {string} date - Date string
   * @returns {string} Formatted month/day (e.g., "5월 12일")
   */
  formatMonthDay(date) {
    const p = date.split(/[-\/T]/);
    return p.length >= 3 
      ? `${parseInt(p[1])}월 ${parseInt(p[2])}일` 
      : date;
  },

  /**
   * Escape XML special characters
   * @param {string} s - String to escape
   * @returns {string} Escaped string
   */
  escapeXml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  },

  /**
   * Convert percentage
   * @param {number} value - Value
   * @param {number} total - Total
   * @returns {number} Percentage
   */
  toPercentage(value, total) {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  }
};

export default Formatters;
