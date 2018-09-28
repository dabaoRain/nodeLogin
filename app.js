var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


var app = express();


var session = require("express-session");
var  MongoStore  = require("connect-mongo")(session);

//配置中间件
app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
	//cookie: { secure: true }   /*secure https这样的情况才可以访问cookie*/
	store:new MongoStore({
			url: 'mongodb://127.0.0.1:27017/myClass',  //数据库的地址
			touchAfter: 24 * 3600   //time period in seconds  通过这样做，设置touchAfter:24 * 3600，您在24小时内只更新一次会话，不管有多少请求(除了在会话数据上更改某些内容的除外)
	})
}));

app.use(function(req, res, next) {
    res.locals.user = req.session.user;
    var err = req.session.error;
    delete req.session.error;
    res.locals.message = '';
    if (err) {
        res.locals.message = '<div class="alert alert-warning">' + err + '</div>';
    }
    next();
});


// view engine setup
/* app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs'); */
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login',indexRouter);
app.use('/logout', indexRouter);
app.use('/home', indexRouter);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});





module.exports = app;
