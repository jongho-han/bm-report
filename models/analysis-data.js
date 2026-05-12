/**
 * AnalysisData Model - Main data structure for analysis results
 */

export class AnalysisData {
  constructor() {
    this.total = 0;
    this.records = [];
    this.repCounts = {};
    this.repBanks = {};
    this.bankCounts = {};
    this.topBank = '';
    this.topBankPct = 0;
    this.totalComp = 0;
    this.dateStart = '';
    this.dateEnd = '';
    this.dates = [];
    this.dateCounts = {};
    this.dateIssueSummary = {};
    this.kwResults = [];
    this.insights = {
      danger: [],
      info: [],
      success: [],
      warn: []
    };
    this.plan = {
      short: [],
      mid: []
    };
  }

  /**
   * Create instance from analysis result object
   * @param {object} data - Analysis result
   * @returns {AnalysisData} New instance
   */
  static fromAnalysis(data) {
    const instance = new AnalysisData();
    Object.assign(instance, data);
    return instance;
  }
}

export default AnalysisData;
