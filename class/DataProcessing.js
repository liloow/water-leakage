const Context = require('./Context');

class DataProdcessing extends Context {
  /* ========================================================================== */
  /*                                   QUANTI                                   */
  /* ========================================================================== */

  _computeQuanti() {
    this._prepareDataAndCalc();
  }

  _prepareDataAndCalc() {
    this._checkRefiner();
    if (this.refiner) this.refine(this.data);
    if (this.splitKey) {
      this.data = this._splitData(this.data, this.splitKey);
    } else this.data = [this.data];
    this.data.forEach(subset => {
      const dataSet = this._getRelevantDataProp(subset);
      this._calc(dataSet);
    });
  }

  _calc(data) {
    const cache = {};
    this.computed = [...this.computed, this.pattern(cache, ...data)];
    return this.computed;
  }

  /* ========================================================================== */
  /*                                    QUALI                                   */
  /* ========================================================================== */

  _computeQuali() {
    this._makeSubsetAndAnalyse();
  }

  _makeSubsetAndAnalyse() {
    if (this.refiner) this.refine(this.data);
    const dataSet = this._getRelevantDataProp(this.data);
    this.dataWithIndexOrig = dataSet.map((el, i) => ({data: el, indexOrig: i}));
    const filteredDataSet = this.dataWithIndexOrig.filter((el, i) => i % this.cycle === 0);
    this._analyse(filteredDataSet);
  }

  _analyse(data) {
    const cache = {};
    if (data.length === 1) {
      if (this.pattern(cache, data[0].data)) this.currentState.push(this.data[0]);
      else this.currentState = [];
    } else {
      data.forEach((el, i) => {
        if (this.pattern(cache, el.data)) {
          cache.indexes = [...(cache.indexes || []), i];
          cache.consecutive = cache.consecutive == null ? 1 : cache.consecutive + 1;
        } else {
          if (cache.consecutive >= this.treshold) {
            this.entriesMatchingPattern = [...this.entriesMatchingPattern, cache.indexes];
          }
          cache.indexes = [];
          cache.consecutive = 0;
        }
      });
      if (this.entriesMatchingPattern.length > 0) this.anomalyDetected = true;
      else this.anomalyDetected = false;
    }
  }
}

module.exports = DataProdcessing;
module.exports.default = DataProdcessing;
