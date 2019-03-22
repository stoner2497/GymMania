const express = require("express");
const Package = require("../models/Packages");
const { ensureAuthenticated } = require("../helpers/auth");
const multer = require("../config/multer");
const router = express.Router();

router.get("/packages", ensureAuthenticated, (req, res) => {
  Package.findOne({ admin: req.user.id }).then(package => {
    if (package) {
      res.render("admin/packages", {
        package: package
      });
    }
    res.render("admin/packages");
  });
});

router.post("/packages", ensureAuthenticated, (req, res) => {
  let error = [];
  if (!req.body.packageName) {
    error.push({ text: "please add package name" });
  }
  if (!req.body.description & !req.body.amount) {
    error.push({ text: "please enter a decription or amount" });
  }
  if (error.length > 0) {
    res.render("admin/packages", {
      error: error
    });
    console.log(error);
  }
});
router.post("/edit", ensureAuthenticated, (req, res) => {
  Profile.findOneAndUpdate(
    { admin: req.user.id },
    {
      $set: {
        contact: req.body.contact,
        website: req.body.website,
        location: req.body.location,
        city: req.body.city,
        pincode: req.body.pincode,
        Terms: req.body.Terms,
        social: { youtube: req.body.youtube }
      }
    }
  )
    .then(profile => {
      console.log(profile);
      req.flash("success_msg", "updated succesfully");
      res.redirect("gymprofile");
    })
    .catch(err => {
      console.log(err);
    });
});
router.post("/delete", (req, res) => {
  Profile.findOneAndDelete({ admin: req.user.id }).then(() => {
    res.redirect("gymprofile");
  });
});
module.exports = router;
