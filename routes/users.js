const express = require("express");
const router = express.Router();
const db = require("../models/index");

const { Op } = require("sequelize");

/**
 * 一覧画面.
 */
router.get("/", (req, res, next) => {
  //idをURLから取得
  const id = req.query.id;
  const name = req.query.name;
  const mail = req.query.mail;

  //DBから取得(クエリがあれば検索して表示、無ければ全件表示)
  if (id || name || mail) {
    db.User.findAll({
      where: {
        [Op.or]: [
          { id: { [Op.lte]: id } },
          { name: { [Op.like]: `%${name}%` } },
          { mail: { [Op.like]: `%${mail}%` } },
        ],
      },
    }).then((users) => {
      const data = {
        title: "Users/Index",
        content: users,
      };
      res.render("users/index", data);
    });
  } else {
    db.User.findAll().then((users) => {
      const data = {
        title: "Users/Index",
        content: users,
      };
      res.render("users/index", data);
    });
  }
});

/**
 * 新規登録画面.
 */
router.get("/add", (req, res, next) => {
  const data = {
    title: "Users/Add",
    content: "会員新規登録",
  };
  res.render("users/add", data);
});

/**
 * 新規登録.
 */
router.post("/add", (req, res, next) => {
  db.sequelize
    //他のところからもアクセスがあった際に問題が起こらないようにするメソッド(sync)
    .sync()
    .then(() =>
      //createでDBにデータ新規作成
      db.User.create({
        name: req.body.name,
        mail: req.body.mail,
        pass: req.body.pass,
        age: req.body.age,
      })
    )
    .then(() => {
      res.redirect("/users");
    });
});

/**
 * 編集画面.
 */
router.get("/edit", (req, res, next) => {
  //URLからID取得→1件データを取得(userに代入)
  db.User.findByPk(req.query.id).then((user) => {
    const data = {
      title: "Users/Edit",
      form: user,
    };
    res.render("users/edit", data);
  });
});

/**
 * 編集.
 */
router.post("/edit", (req, res, next) => {
  //対象のデータ取得
  db.User.findByPk(req.body.id).then((user) => {
    //データを入力値に上書き
    user.name = req.body.name;
    user.mail = req.body.mail;
    user.pass = req.body.pass;
    user.age = req.body.age;
    user.updatedAt = new Date();

    //更新保存
    user.save().then(() => {
      res.redirect("/users");
    });
  });
});

/**
 * 削除画面.
 */
router.get("/delete", (req, res, next) => {
  //URLからID取得→1件データを取得(userに代入)
  db.User.findByPk(req.query.id).then((user) => {
    const data = {
      title: "Users/Edit",
      form: user,
    };
    res.render("users/delete", data);
  });
});

/**
 * 削除.
 */
router.post("/delete", (req, res, next) => {
  db.sequelize
    //他のところからもアクセスがあった際に問題が起こらないようにするメソッド(sync)
    .sync()
    .then(() =>
      //destroyでDBのデータ削除
      db.User.destroy({ where: { id: req.body.id } })
    )
    .then(() => {
      res.redirect("/users");
    });
});

module.exports = router;
