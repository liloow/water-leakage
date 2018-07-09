const Report = require('./Report');
const Slack = require('slack-node');
const colors = require('colors');

let slack = null;
if (process.env.SLACK_WEBHOOK) {
  slack = new Slack();
  slack.setWebhook(process.env.SLACK_WEBHOOK);
}

function sendSlack(channel, message, cb) {
  if (slack) {
    slack.webhook(
      {
        channel: channel,
        username: 'LEAK-WATCHER',
        text: message,
      },
      cb
    );
  } else {
    fakeSlack(config.channel, config.message);
    cb();
  }
}

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

  processStream(data, cb) {
    this.data = data;
    const result = this.report();
    if (result instanceof Error) return result;
    if (this.currentState.length >= this.treshold) {
      this.status = 'PROBLEM DETECTED';
      sendSlack('#leaks', this.status, (err, res) => {
        if (err) console.log('Error:', err);
        return cb(null, 'OK');
      });
    } else {
      if (this.currentState.length === this.treshold - 1) {
        this.status = 'WARNING';
        console.log(this.status);
      } else if (this.currentState.length > 1) this.status = 'Might be a glitch';
      else this.status = 'OK';
      return cb(null, 'OK');
    }
  }
}

module.exports = Watcher;
module.exports.default = Watcher;
