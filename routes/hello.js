const express = require("express");
const router = express.Router();
const http = require("https");
const parseString = require("xml2js").parseString;

//DBの設定
const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("mydb.sqlite3");

/**
 * ホーム画面の表示.
 */
router.get("/", (req, res, next) => {
  db.serialize(() => {
    db.all("SELECT * FROM mydata;", (error, rows) => {
      if (!error) {
        const data = {
          title: "Hello!",
          content: rows,
        };
        res.render("hello/index", data);
      }
    });
  });
});

/**
 * 会員登録画面の表示.
 */
router.get("/add", (req, res, next) => {
  const data = {
    title: "Hello/Add",
    content: "会員登録",
  };
  res.render("hello/add", data);
});

/**
 * 会員新規登録.
 */
router.post("/add", (req, res, next) => {
  const name = req.body.name;
  const mail = req.body.mail;
  const age = Number(req.body.age);

  //DBに登録
  db.serialize(() => {
    db.run(
      `INSERT INTO mydata (name, mail, age) VALUES ("${name}","${mail}",${age});`
    );
  });

  res.redirect("/hello");
});

/**
 * 1人の情報画面.
 */
router.get("/show", (req, res, next) => {
  //URLからIDの取得
  const id = Number(req.query.id);
  //SQL文
  const query = `SELECT * FROM mydata WHERE id = ${id};`;

  //DBから取得したデータをHTMLに渡す
  db.serialize(() => {
    db.get(query, (err, row) => {
      if (!err) {
        const data = {
          title: "Hello/show",
          content: `id=${id}のレコード`,
          mydata: row,
        };
        res.render("hello/show", data);
      }
    });
  });
});

/**
 * 会員情報編集画面の情報取得.
 */
router.get("/edit", (req, res, next) => {
  //URLからIDの取得
  const id = Number(req.query.id);
  //SQL文
  const query = `SELECT * FROM mydata WHERE id = ${id};`;

  //DBから取得したデータをHTMLに渡す
  db.serialize(() => {
    db.get(query, (err, row) => {
      if (!err) {
        const data = {
          title: "Hello/edit",
          content: `id=${id}のレコードを編集`,
          mydata: row,
        };
        res.render("hello/edit", data);
      }
    });
  });
});

/**
 * 会員情報編集.
 */
router.post("/edit", (req, res, next) => {
  const id = Number(req.body.id);
  const name = req.body.name;
  const mail = req.body.mail;
  const age = Number(req.body.age);

  //DBを更新
  db.serialize(() => {
    db.run(
      `UPDATE mydata SET name="${name}",mail="${mail}",age=${age} WHERE id=${id};`
    );
  });

  res.redirect("/hello");
});

module.exports = router;
