function isNotIncrementingOrNaN(arr) {
  const array = [...arr];
  if (array.some(el => isNaN(el))) return false;
  const diff = Math.abs(array[1] - array[0]);
  return array.some((el, i, arr) => {
    if (i === arr.length - 1) return Math.abs(arr[i - 1] - el) !== diff;
    return Math.abs(arr[i + 1] - el) !== diff;
  });
}

class AnomalyDetector {
  constructor(data, dataKeyToTest, pattern, treshold, cycle, start, end) {
    this.args = {};
    if ([...arguments].filter(Boolean).length === 1) {
      this.args = {dataKeyToTest, pattern, treshold, cycle, start, end, ...data};
    }
    if ([...arguments].filter(Boolean).length === 2) {
      this.args = {pattern, treshold, cycle, start, end, data, ...dataKeyToTest};
    }
    console.log(this.args.dataKeyToTest);
    // MANDATORY this.ARGS
    this.data = this.args.data || data;
    this.treshold = this.args.treshold || treshold;
    this.pattern = this.args.pattern || pattern;
    this.cycle = this.args.cycle || cycle || 1;
    // NON-MANDATORY this.ARGS
    this.sample = [];
    this.dataKeyToTest =
      this.args.dataKeyToTest || (typeof dataKeyToTest === 'string' ? dataKeyToTest : null);
    this.start = this.args.start || start || 0;
    this.end = this.args.end || end || data.length || null;
    this.entriesMatchingPattern = [];
    this.anomalyDetected = false;
  }

  checkMandatoryArgs() {
    console.log(this.dataKeyToTest);
    let missing = [this.data, this.treshold, this.pattern, this.cycle].filter(arg => arg == null);
    if (missing.length > 0)
      throw Error(
        `Some mandatory arguments are either missing or couldn't be parsed : <${[...missing]}>`
      );
  }

  _matcher(data) {
    // console.log(this.pattern);
    const cache = {};
    data.forEach((el, i) => {
      if (this.pattern(el.data)) {
        cache.indexes = [...(cache.indexes || []), i];
        cache.entries = [...(cache.entries || []), el];
        cache.consecutive = cache.consecutive == null ? 1 : cache.consecutive + 1;
      } else {
        if (cache.consecutive >= this.treshold) {
          this.entriesMatchingPattern = [...this.entriesMatchingPattern, cache.indexes];
        }
        Object.keys(cache).forEach(key => {
          cache[key] = null;
          return cache;
        });
      }
    });
  }

  _getRelevantDataProp() {
    console.log(this.dataKeyToTest);
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
      if (typeof this.data[0] === 'object') {
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

  _makeSubset() {
    const dataSet = this._getRelevantDataProp();
    // console.log(dataSet);
    this.sample = dataSet.map((el, i) => ({data: el, indexOrig: i}));
    const filteredDataSet = this.sample
      .slice(this.start, this.end || this.sample.length)
      .filter((el, i) => i % this.cycle === 0);
    return filteredDataSet;
  }

  _analyse() {
    const data = this._makeSubset();
    this._matcher(data);
    if (this.entriesMatchingPattern.length > 0) this.anomalyDetected = true;
    else this.anomalyDetected = false;
  }

  report() {
    try {
      this.checkMandatoryArgs();
      this._analyse();
      console.log(this.entriesMatchingPattern);
      if (this.anomalyDetected) {
        const troublesomeEntries = Array.from(this.entriesMatchingPattern, group =>
          group.map(
            index =>
              Array.isArray(this.data)
                ? this.data[index]
                : Object.keys(this.data).reduce((a, b) => {
                    a[b] = this.data[b][index];
                    return a;
                  }, {})
          )
        );
        // console.error('ANOMALIES DETECTED');
        // console.error(JSON.stringify(troublesomeEntries));
        return troublesomeEntries;
      }
      return 'Everything as it should be, you can take a nap';
    } catch (e) {
      console.error(
        '/* ========================================================================== */'
      );
      console.error(e);
      console.error(
        '/* ========================================================================== */'
      );
    }
  }
}

module.exports = AnomalyDetector;
