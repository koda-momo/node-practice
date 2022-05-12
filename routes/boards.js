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
  if (check(req, res)) {
    return;
  }

  //ページ番号(何故*1で整数になるのか)
  const pg = req.params.page * 1;

  console.dir("ログインまん" + JSON.stringify(req.session.login));

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

module.exports = router;
