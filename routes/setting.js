const express = require("express");
const multer = require("../config/multer");
const cloudinary = require("cloudinary");
const { ensureAuthenticated } = require("../helpers/auth");
const router = express.Router();

const User = require("../models/Admin");

router.get("/profile/:email", ensureAuthenticated, async (req, res) => {
  User.findOne({ email: req.params.email }).then(user => {
    res.render("admin/profile", {
      user: user
    });
  });
});

module.exports = router;
