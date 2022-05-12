//HTTPエラーの対処を行うもの
var createError = require("http-errors");

//HTTPリクエストのログ出力に必要
var logger = require("morgan");

//express
var express = require("express");
var app = express();

//path
var path = require("path");

//cookie
var cookieParser = require("cookie-parser");

//セッションに保存するために使用
const session = require("express-session");

//ページのインポート
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const helloRouter = require("./routes/hello");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//基本設定
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const session_opt = {
  //秘密鍵となるテキスト
  secret: "keyboad cat",
  //セッションstoreに値を保存するか？
  resave: false,
  //初期化されていない値も保存するか？
  saveUninitialized: false,
  //cookieにセッションIDを保存する→保存期間は1時間
  cookie: { maxAge: 60 * 60 * 1000 },
};
app.use(session(session_opt));

//特定のURLにアクセスした際、発動するメソッドの設定
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/hello", helloRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
