function isNotIncrementingOrNaN(arr) {
  const array = [...arr];
  if (array.some(el => isNaN(el))) return false;
  const diff = Math.abs(array[1] - array[0]);
  return array.some((el, i, arr) => {
    if (i === arr.length - 1) return Math.abs(arr[i - 1] - el) !== diff;
    return Math.abs(arr[i + 1] - el) !== diff;
  });
}

function isNotIncrementingOrNaNTranslated(arr) {
  const cache = {couldMatch: [], all: {}};
  for (let i = 0; i < arr[0].length; i++) {
    let array = arr.map(el => Number(el[i]));
    if (isNotIncrementingOrNaN(arr)) cache.couldMatch.push(array);
    cache.all[i] = array;
  }
  return cache;
}

class ActionRouter {
  constructor(
    data,
    pattern,
    treshold,
    cycle,
    dataKeyToTest = null,
    refiner = null,
    subset = null,
    ...args
  ) {
    this.args = {};
    if (!pattern) {
      this.args = {dataKeyToTest, pattern, treshold, cycle, refiner, subset, ...data};
    } else if (typeof pattern === 'object') {
      this.args = {dataKeyToTest, pattern, treshold, cycle, refiner, subset, data, ...pattern};
    }
    // MANDATORY this.ARGS
    this.dataInit = this.args.data || data;
    this.treshold = this.args.treshold || treshold;
    this.pattern = this.args.pattern || pattern;
    this.cycle = this.args.cycle || cycle;
    // NON-MANDATORY this.ARGS
    this.dataKeyToTest =
      this.args.dataKeyToTest || (typeof dataKeyToTest === 'string' ? dataKeyToTest : null);
    this.refiner = this.args.refiner || refiner || 0;
    this.subset = this.args.subset || subset;
    // DATA MIRROR
    this.data = this.dataInit;
    // PRIVATE VARS
    this.dataWithIndexOrig = [];
    this.entriesMatchingPattern = [];
    this.anomalyDetected = false;
    this.special = null;
    this.patternType = null;
    this.computed = null;
  }
}

class AnomalyDetector extends ActionRouter {
  /* ========================================================================== */
  /*                                 CONTEXT                                    */
  /* ========================================================================== */

  dispatchToRightTree() {
    this.patterntype = typeof this.pattern(null, 10);
    const tree = this.patterntype;
    if (tree === 'boolean') return this._analyse();
    if (tree === 'number' || tree === 'object') return this._compute();
    throw Error('Invalid Pattern');
  }

  checkMandatoryArgs() {
    let missing = ['data', 'pattern', 'treshold', 'cycle'].filter(li => this[li] == null);
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
        let min = value[0];
        let max = value[1];
        let parser = input => input;
        if (value[0].slice(-1) === value[1].slice(-1) && value[0].slice(-1) === 'h') {
          parser = input => input % 24;
          min = Number(min.match(/[0-9]+(?=h)/g)[0]);
          max = Number(max.match(/[0-9]+(?=h)/g)[0]);
        }
        this.data = data.reduce((a, b, i) => {
          let hour = parser(b[key]);
          if (hour > min || hour < max) a.push(b);
          return a;
        }, []);
      }
    }
  }

  /* ========================================================================== */
  /*                                   QUANTI                                   */
  /* ========================================================================== */

  _compute() {
    const data = this._prepareData();
    this._calc(data);
  }

  _prepareData() {
    if (this.refiner) this.refine(this.data);
    if (this.subset && this.subset.end) this.data.slice(this.subset.start, this.subset.end);
    const dataSet = this._getRelevantDataProp();
    return dataSet;
  }

  _calc(data) {
    const cache = {};
    this.computed = this.pattern(cache, ...data);
    return this.computed;
  }

  /* ========================================================================== */
  /*                                    QUALI                                   */
  /* ========================================================================== */

  _analyse() {
    const data = this._makeSubset();
    this._matcher(data);
    if (this.entriesMatchingPattern.length > 0) this.anomalyDetected = true;
    else this.anomalyDetected = false;
  }

  _makeSubset() {
    if (this.refiner) this.refine(this.data);
    const dataSet = this._getRelevantDataProp();
    this.dataWithIndexOrig = dataSet.map((el, i) => ({data: el, indexOrig: i}));
    const filteredDataSet = this.dataWithIndexOrig
      .slice(this.refiner, this.end || this.dataWithIndexOrig.length)
      .filter((el, i) => i % this.cycle === 0);
    return filteredDataSet;
  }

  _matcher(data) {
    const cache = {};
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
  }

  /* ========================================================================== */
  /*                                    QUALI                                   */
  /* ========================================================================== */

  // TODO : REFACTOR THIS MONSTER
  _getRelevantDataProp() {
    // console.log(this.dataKeyToTest);
    const temp = [];
    if (typeof this.data === 'string' && this.data.split(',').every(el => !isNaN(Number(el)))) {
      return this.data.split(',');
    }
    if (Array.isArray(this.data)) {
      if (this.data.length === 0) return [];
      if (this.data.every(el => typeof el === 'number')) return this.data;
      if (typeof this.data[0] === 'string' && !this.data.some(el => isNaN(Number(el)))) {
        return this.data.map(el => Number(el));
      }
      if (!Array.isArray(this.data[0]) && typeof this.data[0] === 'object') {
        if (this.dataKeyToTest) return this.data.map(el => el[this.dataKeyToTest]);
        for (let key of Object.keys(this.data)) {
          if (Array.isArray(this.data[key]) && isNotIncrementingOrNaN(new Set(this.data[key]))) {
            temp.push(key);
          }
          if (
            typeof this.data[key] === 'string' &&
            this.data[key].split(',').every(el => !isNaN(Number(el)))
          ) {
            this.data[key] = this.data[key].split(',');
            temp.push(key);
          }
        }
      }
      if (Array.isArray(this.data[0])) {
        if (
          this.data[0].every(el => typeof el === 'string') &&
          this.data
            .slice(1)
            .reduce((a, b) => {
              a = [...a, ...b];
              return a;
            }, [])
            .every(entry => !isNaN(Number(entry)))
        ) {
          const result = isNotIncrementingOrNaNTranslated(this.data.slice(1));
          this.special = this.data[0].reduce((a, b, i) => {
            a[b] = result.all[i];
            return a;
          }, {});
          if (this.dataKeyToTest) {
            const dataIndex = this.data[0].indexOf(this.dataKeyToTest);
            return this.data.slice(1).map(el => el[dataIndex]);
          }
          if (result.couldMatch.length === 1) {
            return result[0];
          }
        }
      }
    }
    if (typeof this.data === 'object') {
      if (this.dataKeyToTest) return this.data[this.dataKeyToTest];
      for (let key of Object.keys(this.data)) {
        if (Array.isArray(this.data[key]) && isNotIncrementingOrNaN(new Set(this.data[key]))) {
          temp.push(key);
        }
        if (
          typeof this.data[key] === 'string' &&
          this.data[key].split(',').every(el => !isNaN(Number(el)))
        ) {
          this.data[key] = this.data[key].split(',');
          temp.push(key);
        }
      }
    }
    // console.log(temp);
    if (temp.length === 1) return [...this.data[temp[0]]];
    throw Error(
      `We couldn't find a processable data set in < ${this.data} >, please refine the input data`
    );
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
                  else a[b] = this.data[b][index];
                  return a;
                }, {});
          })
        );
        console.warn('ANOMALIES DETECTED');
        return troublesomeEntries;
      }
      if (this.computed) return this.computed;
      return 'Everything as it should be, you can take a nap';
    } catch (e) {
      // console.error(
      //   '/* ========================================================================== */'
      // );
      console.error(e);
      // console.error(
      //   '/* ========================================================================== */'
      // );
      return e;
    }
  }
}

module.exports = AnomalyDetector;
