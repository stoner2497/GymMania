const express = require("express");
const Packages = require("../models/Packages");
const { ensureAuthenticated } = require("../helpers/auth");
const multer = require("../config/multer");
const router = express.Router();

const Schedule = require("../models/Schedule");

router.get("/courses", ensureAuthenticated, (req, res) => {
  res.render("admin/courses");
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
