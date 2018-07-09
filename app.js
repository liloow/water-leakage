const express = require('express');
const logger = require('morgan');

const api = require('./routes/index');

const app = express();

app.use(logger('dev'));
app.use(express.json());

app.use('/', api);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  // return the error message only in development mode
  res.json({
    message: err.message,
    error:
      req.app.get('env') === 'development'
        ? err.message
        : {
            message: 'Something went wrong with your request',
          },
  });
});

module.exports = app;
