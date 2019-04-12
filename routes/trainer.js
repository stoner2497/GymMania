const express = require("express");
const { ensureAuthenticated } = require("../helpers/auth");
const multer = require("../config/multer");
const cloudinary = require("cloudinary");
const router = express.Router();

const Trainer = require("../models/Trainer");

router.get("/trainer", ensureAuthenticated, (req, res) => {
  Trainer.find({ admin: req.user.id }).then(trainer => {
    res.render("admin/trainer", {
      trainer: trainer
    });
  });
});

router.post("/trainer", ensureAuthenticated, async (req, res) => {
  let errors = [];
  let alpha = /^[a-zA-Z]+$/;
  const regexcontact = /^\d{10}$/;
  let numbers = /^ [0 - 9] * $/;
  if (alpha.test(req.body.Name) === false) {
    errors.push({ text: "please enter correct name" });
  }
  if (req.body.contact.length > 10 || req.body.contact.length < 10) {
    errors.push({ text: "please enter correct Contact" });
  }
  if (regexcontact.test(req.body.contact) === false) {
    errors.push({ text: "your contact is not proper" });
  }
  if (errors.length > 0) {
    res.render("admin/trainer", {
      errors: errors
    });
  } else {
    const newTrainer = new Trainer({
      admin: req.user.id,
      Name: req.body.Name,
      Age: req.body.Age,
      salary: req.body.salary,
      TrainerType: req.body.TrainerType,
      contact: req.body.contact
    });
    newTrainer.save().then(() => {
      req.flash("success_msg", "trainer added successfully");
      res.redirect("admin/trainer");
    });
  }
});

router.delete("/trainer/:id", ensureAuthenticated, (req, res) => {
  Trainer.findOneAndDelete({ _id: req.params.id }).then(() => {
    res.redirect("trainer");
  });
});
module.exports = router;
