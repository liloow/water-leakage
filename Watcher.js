const Report = require('./Report');
const colors = require('colors');

function fakeSlack(channel, message) {
  console.log(colors.magenta(channel + ': ' + message));
}

class Watcher extends Report {
  constructor(...args) {
    super(...args);
    this.dataKeyToTest = 'consommation';
    this.limit = 15;
    this.treshold = 3;
    this.cycle = 1;
    this.pattern = (c, x) => x > this.limit;
    this.status = 'OK';
  }
  currentStatus() {
    return this.status;
  }

  refreshPattern() {
    this.pattern = (c, x) => x > this.limit;
  }

  setSensibility(treshold, cycle, limit = this.limit) {
    this.treshold = treshold;
    this.cycle = cycle;
    this.limit = limit;
    this.refreshPattern();
    return this.pattern.toString();
  }

  processStream(data) {
    this.data = data;
    const result = this.report();
    if (this.currentState.length >= this.treshold) {
      this.status = 'PROBLEM DETECTED';
      fakeSlack('#LEAKS', this.status);
    } else if (this.currentState.length === this.treshold - 1) {
      this.status = 'WARNING';
      console.log(this.status);
    } else if (this.currentState.length > 1) this.status = 'Might be a glitch';
    else this.status = 'OK';
    if (result instanceof Error) result;
    return 'OK';
  }
}

module.exports = Watcher;
module.exports.default = Watcher;
