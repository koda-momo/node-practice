const express = require("express");
const router = express.Router();
const db = require("../models/index");

/* GET users listing. */
router.get("/", (req, res, next) => {
  db.User.findAll().then((users) => {
    console.dir(JSON.stringify(db.User.findAll()));
    const data = {
      title: "Users/Index",
      content: users,
    };
    res.render("users/index", data);
  });
});

module.exports = router;
