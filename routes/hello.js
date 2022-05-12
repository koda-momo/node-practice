const express = require("express");
const router = express.Router();
const http = require("https");
const parseString = require("xml2js").parseString;

//DB1の設定
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

router.post("/add", (req, res, next) => {
  const name = req.body.name;
  const mail = req.body.mail;
  const age = Number(req.body.age);

  console.log(`登録データ:${name},${mail},${age}`);

  //???のところにname,mail,ageの値が入る
  db.serialize(() => {
    db.run(
      `INSERT INTO mydata (name, mail, age) VALUES ("${name}","${mail}",${age});`
    );
  });

  res.redirect("/hello");
});

module.exports = router;
