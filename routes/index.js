const express = require('express');
const router = express.Router(); // eslint-disable-line
const watcher = require('../index');

router.post('/', function(req, res, next) {
  console.log(req.body);
  const data = req.body;
  let result = watcher.processStream(data);
  return res.json(result);
});
router.get('/', function(req, res, next) {
  const status = watcher.currentStatus();
  res.json(status);
});

module.exports = router;
