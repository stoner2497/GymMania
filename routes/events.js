const express = require("express");
const cloudinary = require("cloudinary");
const { ensureAuthenticated } = require("../helpers/auth");
const multer = require("../config/multer");
const router = express.Router();
require("../config/cloudinary");

const Events = require("../models/Events");

router.get("/events", ensureAuthenticated, (req, res) => {
  Events.find({ admin: req.user.id }).then(events => {
    res.render("admin/events", {
      events: events
    });
  });
});

router.post(
  "/events",
  ensureAuthenticated,
  multer.single("image"),
  async (req, res) => {
    let errors = [];
    let alph = /^[a-zA-Z]+$/;
    let date = Date.now() - 1;
    let dash = /^[a-z\d\-_\s]+$/i;
    if (dash.test(req.body.Description) === false) {
      errors.push({ text: "please enter proper description" });
    }
    if (dash.test(req.body.eventtitle) === false) {
      errors.push({ text: "please enter correct title" });
    }
    if (date === true) {
      errors.push({ text: "please eneter correct Date" });
    }
    if (errors.length > 0) {
      console.log(errors);
      req.flash(errors);
      res.render("admin/events", {
        errros: errors
      });
    } else {
      let result = await cloudinary.v2.uploader.upload(req.file.path);
      const events = new Events({
        admin: req.user.id,
        eventtitle: req.body.eventtitle,
        from: req.body.from,
        to: req.body.to,
        image: result.secure_url,
        Price: req.body.Price,
        Description: req.body.Description
      });
      events
        .save()
        .then(err => {
          if (err) throw err;
          req.flash("success_msg", "event added succesfully");
          res.redirect("/events");
        })
        .catch(err => console.log(err));
    }
  }
);

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

router.delete("/events/:id", ensureAuthenticated, (req, res) => {
  Events.findOneAndDelete({ _id: req.params.id }).then(() => {
    res.render("admin/events");
  });
});
module.exports = router;
