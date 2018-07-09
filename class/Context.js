const DataExtractor = require('./DataExtractor');

class Context extends DataExtractor {
  constructor(...args) {
    super(...args);
    // PRIVATE VARS
    this.dataWithIndexOrig = [];
    this.entriesMatchingPattern = [];
    this.anomalyDetected = false;
    this.special = null;
    this.patternType = null;
    this.computed = [];
    this.splitKey = null;
    this.currentState = [];
  }

  _checkRefiner() {
    if (this.refiner == null) return null;
    this.splitKey = this.refiner.per;
  }

  dispatchToRightTree() {
    this.patterntype = typeof this.pattern({}, [10]);
    const tree = this.patterntype;
    if (tree === 'boolean') return this._computeQuali();
    if (tree === 'number' || Array.isArray(tree)) return this._computeQuanti();
    throw Error('Invalid Pattern');
  }

  checkMandatoryArgs() {
    let missing = ['data', 'pattern', 'treshold', 'cycle'].filter(key => this[key] == null);
    if (missing.length > 0) {
      throw Error(
        `Some mandatory arguments are either missing or couldn't be parsed : <${missing}>`
      );
    }
  }

  refine(data) {
    if (typeof this.refiner !== 'object') {
      throw Error(
        `The refiner must be an Object with properties mirroring the ones to refine on the data`
      );
    }
    for (let [key, value] of Object.entries(this.refiner)) {
      if (Array.isArray(value) && value.length === 2) {
        let isHour = false;
        let min = value[0];
        let max = value[1];
        let parser = input => input;
        if (
          String(value[0]).slice(-1) === String(value[1]).slice(-1) &&
          String(value[0]).slice(-1) === 'h'
        ) {
          isHour = true;
          parser = input => input % 24;
          min = Number(min.match(/[0-9]+(?=h)/g)[0]);
          max = Number(max.match(/[0-9]+(?=h)/g)[0]);
        }
        this.data = data.reduce((a, b, i) => {
          let value = parser(b[key]);
          if (isHour && (value >= min || value <= max)) a.push(b);
          else if (!isHour && value >= min && value <= max) a.push(b);
          return a;
        }, []);
      }
    }
  }
}

module.exports = Context;
module.exports.default = Context;
