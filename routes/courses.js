const express = require("express");
const Packages = require("../models/Packages");
const { ensureAuthenticated } = require("../helpers/auth");
const multer = require("../config/multer");
const router = express.Router();

const Schedule = require("../models/Schedule");
const Courses = require("../models/Courses");

let alpha = /^[a-zA-Z]+$/;
let alphanum = /^[a-z\d\-_\s]+$/i;
router.get("/courses", ensureAuthenticated, (req, res) => {
  Courses.find({ admin: req.user.id }).then(courses => {
    res.render("admin/course", {
      courses: courses
    });
  });
});

router.post("/courses", ensureAuthenticated, (req, res) => {
  let errors = [];
  if (alpha.test(req.body.name) === false) {
    errors.push({ text: "please enter correct Course Name" });
  }
  if (alphanum.test(req.body.Description) === false) {
    errors.push({ text: "please enter correct Description" });
  }
  if (errors.length > 0) {
    res.render("admin/course", {
      errors: errors
    });
  } else {
    const newcourse = new Courses({
      admin: req.user.id,
      Number: req.body.Number,
      name: req.body.name,
      duration: req.body.duration,
      Price: req.body.Price,
      Description: req.body.Description
    });

    newcourse.save().then(err => {
      req.flash("success_msg", "course added successfully");
      res.redirect("courses");
    });
  }
});

router.get("/schedule", ensureAuthenticated, (req, res) => {
  res.render("admin/coursesschedule");
});

router.post("/schedule", ensureAuthenticated, (req, res) => {
  const sched = new Schedule({
    Day: req.body.Day,
    from: req.body.from,
    to: req.body.to,
    Courses: req.body.Courses,
    Room: req.body.Room,
    Trainers: req.body.Trainers,
    description: req.body.description
  });
  console.log(sched);
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
