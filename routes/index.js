const express = require('express');
const router = express.Router(); // eslint-disable-line
const watcher = require('../index');

router.post('/', function(req, res, next) {
  const data = req.body;
  watcher.processStream(data, (err, result) => res.json(result));
});

router.post('/', function(req, res, next) {
  const {treshold, cycle, limit} = req.body;
  const pattern = setSensibility(treshold, cycle, limit);
  return res.json(pattern);
});

router.get('/', function(req, res, next) {
  const status = watcher.currentStatus();
  res.json(status);
});

module.exports = router;
