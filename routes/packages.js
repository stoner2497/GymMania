const express = require("express");
const Packages = require("../models/Packages");
const { ensureAuthenticated } = require("../helpers/auth");
const multer = require("../config/multer");
const router = express.Router();

router.get("/packages", ensureAuthenticated, (req, res) => {
  Packages.find({ admin: req.user.id }).then(pack => {
    res.render("admin/packages", {
      pack: pack
    });
  });
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

// router.put("/edit/:id", ensureAuthenticated, (req, res) => {
//   Packages.findOneAndUpdate(
//     { _id: req.params.id },
//     {
//       $set: {
//         admin: req.user.id,

//         packageName: req.body.packageName,
//         description: req.body.description,
//         amount: req.body.amount,
//         period: req.body.period
//       }
//     }
//   ).then(package => {
//     console.log(package);
//   });
// });

router.delete("/packages/:id", ensureAuthenticated, (req, res) => {
  Packages.findOneAndDelete({ _id: req.params.id }).then(() => {
    res.render("admin/packages");
  });
});
module.exports = router;
