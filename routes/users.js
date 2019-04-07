const express = require("express");
const { ensureAuthenticated } = require("../helpers/auth");
const multer = require("../config/multer");
const cloudinary = require("cloudinary");
const router = express.Router();

require("../config/cloudinary");
const Trainer = require("../models/Trainer");
const Course = require("../models/Courses");
const User = require("../models/Userdetails");

router.get("/adduser", ensureAuthenticated, async (req, res) => {
  Course.find({ admin: req.user.id }).then(course => {
    User.find({ admin: req.user.id }).then(user => {
      Trainer.find({ admin: req.user.id }).then(trainer => {
        res.render("admin/adduser", {
          course: course,
          user: user,
          trainer: trainer
        });
      });
    });
  });
});

router.post(
  "/adduser",
  multer.single("image"),
  ensureAuthenticated,
  async (req, res) => {
    console.log(req.file);
    let errors = [];
    let alpha = /^[a-zA-Z]+$/;
    const regexcontact = /^\d{10}$/;
    if (alpha.test(req.body.UserName) === false) {
      errors.push({ text: "please enter correct name" });
    }
    if (alpha.test(req.body.city) === false) {
      errors.push({ text: "please enter corect city" });
    }
    if (regexcontact.test(req.body.contactNumber) === false) {
      errors.push({ text: "please enter correct contact" });
    }
    if (errors.length > 0) {
      res.render("admin/adduser", {
        errors: errors
      });
    } else {
      console.log(req.file);
      console.log(req.body);
      try {
        let result = await cloudinary.v2.uploader.upload(req.file.path);
        const newUser = new User({
          admin: req.user.id,
          image: result.secure_url,
          UserName: req.body.UserName,
          Email: req.body.Email,
          contactNumber: req.body.contactNumber,
          Gender: req.body.Gender,
          Address: req.body.Address,
          city: req.body.city,
          Course: req.body.Course,
          assignedTrainer: req.body.assignedTrainer,
          amount: req.body.amount,
          pendingAmount: req.body.pendingAmount
        });
        newUser
          .save()
          .then(() => {
            req.flash("success_msg", "successfully User added");
            res.redirect("admin/adduser");
          })
          .catch(err => console.log(err));
      } catch (err) {
        console.log(err);
      }
    }
  }
);
module.exports = router;
