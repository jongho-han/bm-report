/**
 * Validators - Input and data validation utilities
 */

export const Validators = {
  /**
   * Validate Excel file
   * @param {File} file - File object
   * @returns {object} { valid: boolean, error: string }
   */
  validateFile(file) {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const validTypes = ['.xlsx', '.xls'];
    
    if (!file) {
      return { valid: false, error: '파일을 선택하세요.' };
    }

    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    if (!validTypes.includes(ext)) {
      return { valid: false, error: '지원하는 형식: .xlsx, .xls만 가능합니다.' };
    }

    if (file.size > maxSize) {
      return { valid: false, error: '파일 크기는 10MB 이하여야 합니다.' };
    }

    return { valid: true, error: '' };
  },

  /**
   * Validate data rows
   * @param {array} rows - Sheet rows
   * @returns {object} { valid: boolean, error: string }
   */
  validateData(rows) {
    if (!rows || rows.length < 2) {
      return { valid: false, error: '데이터가 없습니다.' };
    }
    return { valid: true, error: '' };
  }
};

export default Validators;
