var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var axios = require('axios');

io.on('connection', function(socket){
  socket.on('add', function(msg){

    
  axios.get('https://www.googleapis.com/youtube/v3/videos', {
    params: {
      part: 'snippet',
      id: msg.id,
      key: process.env.G_KEY
    }
  })
  .then(function (response) {
    io.emit('add', {
      name: response.data.items[0].snippet.title,
      id: msg.id,
      img: response.data.items[0].snippet.thumbnails.default.url
    });
  });


    
  });
  socket.on('remove', function(msg){
    io.emit('remove', msg);
  });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = {app: app, server: server};
