const express = require("express");
const Packages = require("../models/Packages");
const { ensureAuthenticated } = require("../helpers/auth");
const multer = require("../config/multer");
const router = express.Router();

router.get("/courses", ensureAuthenticated, (req, res) => {
  // Packages.find({}).then(pack => {
  //     res.render("admin/packages", {
  //         pack: pack
  //     });
  // });
  res.render("admin/courses");
});

router.post("/packages", ensureAuthenticated, (req, res) => {
  let errors = [];
  let alph = /^[a-zA-Z]+$/;
  let period = req.body.period;
  if (alph.test(req.body.packageName) === false) {
    errors.push({ text: "please enter proper packageName" });
  }
  if (alph.test(req.body.description) === false) {
    errors.push({ text: "please enter correct description" });
  }
  if (errors.length > 0) {
    res.render("admin/packages", {
      errors: errors
    });
  } else {
    const packa = new Packages({
      admin: req.user.id,
      unique_code: req.body.unique_code,
      packageName: req.body.packageName,
      description: req.body.description,
      amount: req.body.amount,
      period: period
    });
    packa.save().then(() => {
      req.flash("success_msg", "package added succesfully");
      res.redirect("packages");
    });
  }
});

router.post("/edit", ensureAuthenticated, (req, res) => {
  Packages.findOneAndUpdate(
    { unique_code: req.unique_code },
    {
      $set: {
        admin: req.user.id,
        unique_code: req.body.unique_code,
        packageName: req.body.packageName,
        description: req.body.description,
        amount: req.body.amount,
        period: period
      }
    }
  ).then(package => {
    console.log(package);
  });
});

router.post("/delete", ensureAuthenticated, (req, res) => {
  Packages.findOneAndDelete({ admin: req.user.id }).then(() => {
    res.redirect("admin/packages");
  });
});
module.exports = router;
