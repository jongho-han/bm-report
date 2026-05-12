/**
 * FileService - File reading and parsing logic
 */

import Validators from '../utils/validators.js';

export class FileService {
  /**
   * Read and parse Excel file
   * @param {File} file - Excel file
   * @returns {Promise<array>} Array of rows
   */
  static async readFile(file) {
    const validation = Validators.validateFile(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const wb = XLSX.read(e.target.result, { type: 'binary', cellDates: true });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
          resolve(rows);
        } catch (err) {
          reject(new Error('엑셀 파일 파싱 오류: ' + err.message));
        }
      };
      reader.onerror = () => reject(new Error('파일을 읽을 수 없습니다.'));
      reader.readAsBinaryString(file);
    });
  }

  /**
   * Find header row index
   * @param {array} rows - Sheet rows
   * @returns {number} Header row index
   */
  static findHeaderIndex(rows) {
    for (let i = 0; i < Math.min(5, rows.length); i++) {
      if (rows[i] && rows[i].some(c => 
        String(c || '').includes('이름') || String(c || '').includes('내용')
      )) {
        return i;
      }
    }
    return 0;
  }

  /**
   * Extract column indices from headers
   * @param {array} headers - Header row
   * @returns {object} Column index map
   */
  static extractColumnIndices(headers) {
    return {
      이름: headers.findIndex(h => h.includes('이름')),
      날짜: headers.findIndex(h => h.includes('날짜')),
      은행: headers.findIndex(h => h.includes('은행')),
      방문지점: headers.findIndex(h => h.includes('방문지점') || h.includes('지점')),
      판매인: headers.findIndex(h => h.includes('판매인')),
      내용: headers.findIndex(h => h.includes('내용')),
    };
  }

  /**
   * Parse records from rows
   * @param {array} rows - Sheet rows
   * @param {number} headerIdx - Header row index
   * @param {object} ci - Column indices
   * @returns {array} Parsed records
   */
  static parseRecords(rows, headerIdx, ci) {
    const records = [];
    for (let i = headerIdx + 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.every(c => !c)) continue;

      const get = k => String(row[ci[k]] != null ? row[ci[k]] : '').trim();
      records.push({
        이름: get('이름'),
        날짜: get('날짜'),
        은행: get('은행'),
        방문지점: get('방문지점'),
        판매인: get('판매인'),
        내용: get('내용')
      });
    }
    return records;
  }
}

export default FileService;
