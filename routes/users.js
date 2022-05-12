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
    .sync()
    .then(() =>
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

module.exports = router;
