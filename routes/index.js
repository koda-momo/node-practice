var express = require("express");
var router = express.Router();

/**
 * トップページ.
 */
router.get("/", (req, res, next) => {
  console.log("ボードに遷移");
  res.redirect("/boards/0");
});

module.exports = router;
