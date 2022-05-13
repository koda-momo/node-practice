const express = require("express");
const router = express.Router();
const db = require("../models/index");
const { Op } = require("sequelize");

//1ページでの表示数
const ONEPAGE_BOARD_COUNT = 10;

/**
 * ログインチェッカー.
 */
function check(req, res) {
  //ストレージにログイン情報がなかった場合
  if (!req.session.login) {
    //req.session.backにboardsのURL代入
    req.session.back = "/boards";
    //ログインページに遷移する
    res.redirect("/users/login");
    return true;
  } else {
    return false;
  }
}

/**
 * ボード1ページ1ページ.
 */
router.get("/:page", (req, res, next) => {
  //ログインチェック
  if (check(req, res)) {
    return;
  }

  //ページ番号(何故*1で整数になるのか)
  const pg = req.params.page * 1;

  //掲示板データ取得
  db.Board.findAll({
    //値を取り出し始める位置
    offset: pg * ONEPAGE_BOARD_COUNT,
    //取り出す個数(1ページあたりの表示数)
    limit: ONEPAGE_BOARD_COUNT,
    //並び替え設定
    order: [["createdAt", "DESC"]],
    //関連している他のモデルの読み込み
    include: [{ model: db.User, required: true }],
  }).then((boards) => {
    const data = {
      title: "Boards",
      login: req.session.login,
      content: boards,
      page: pg,
    };
    res.render("boards/index", data);
  });
});

/**
 * メッセージフォームの送信処理.
 */
router.post("/add", (req, res, next) => {
  //ログインチェック
  if (check(req, res)) {
    return;
  }

  //DBにメッセージ追加
  db.sequelize
    .sync()
    .then(() =>
      db.Board.create({
        userId: req.session.login.id,
        message: req.body.message,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    )
    .then(() => {
      res.redirect("/boards/0");
    });
});

/**
 * 利用者のホーム画面.
 */
router.get("/home/:user/:id/:page", (req, res, next) => {
  //ログインチェック
  if (check(req, res)) {
    return;
  }
  const id = req.params.id * 1;
  const page = req.params.page * 1;
  db.Board.findAll({
    where: {
      userId: id,
    },
    offset: page * ONEPAGE_BOARD_COUNT,
    limit: ONEPAGE_BOARD_COUNT,
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: db.User,
        required: true,
      },
    ],
  }).then((boards) => {
    const data = {
      title: "Boards",
      login: req.session.login,
      userId: id,
      userName: req.params.user,
      content: boards,
      page: page,
    };
    res.render("boards/home", data);
  });
});

module.exports = router;
