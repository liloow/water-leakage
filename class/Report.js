const DataProcessing = require('./DataProcessing');

class Report extends DataProcessing {
  constructor(data, pattern, treshold, cycle, dataKeyToTest = null, refiner = null, ...args) {
    super(...args);
    this.args = {};
    if (!pattern) {
      this.args = {dataKeyToTest, pattern, treshold, cycle, refiner, ...data};
    } else if (typeof pattern === 'object') {
      this.args = {dataKeyToTest, pattern, treshold, cycle, refiner, data, ...pattern};
    }
    // MANDATORY this.ARGS
    this.dataInit = this.args.data || data;
    this.treshold = this.args.treshold || treshold;
    this.pattern = this.args.pattern || pattern;
    this.cycle = this.args.cycle || cycle;
    // NON-MANDATORY this.ARGS
    this.dataKeyToTest =
      this.args.dataKeyToTest || (typeof dataKeyToTest === 'string' ? dataKeyToTest : null);
    this.refiner = this.args.refiner || refiner;
    // DATA MIRROR
    this.data = this.dataInit;
  }

  report() {
    try {
      this.checkMandatoryArgs();
      this.dispatchToRightTree();
      if (this.anomalyDetected) {
        const troublesomeEntries = Array.from(this.entriesMatchingPattern, group =>
          group.map(index => {
            if (typeof this.data === 'string') return Number(this.data.split(',')[index]);
            return Array.isArray(this.special || this.data)
              ? this.special || this.data[index]
              : Object.keys(this.special || this.data).reduce((a, b) => {
                  if (this.special) a[b] = this.special[b][index];
                  else a[b] = Number(this.data[b][index]);
                  return a;
                }, {});
          })
        );
        console.warn('ANOMALIES DETECTED');
        return troublesomeEntries;
      }
      if (this.computed.length > 0) {
        if (this.computed.length === 1) return this.computed[0];
        return this.computed;
      }
      return 'Everything is ok';
    } catch (e) {
      console.error(e);
      return e;
    }
  }
}

module.exports = Report;
module.exports.default = Report;
