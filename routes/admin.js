const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const xoauth2 = require("xoauth2");
router.get("/login", async (req, res) => {
  res.render("admin/index");
});

router.post("/login", async (req, res) => {
  const errors = {};
  const email = req.body.email;
  const password = req.body.password;

  Admin.findOne({ email }).then(admin => {
    if (!admin) {
      errors.userexist = " user not matched";
      res.render("admin/index", {
        errors: errors
      });
      console.log(errors);
    } else {
      bcrypt.compare(password, admin.password).then(isMatch => {
        if (isMatch) {
          res.render("admin/dashboard", {
            admin: admin.name
          });
          console.log(admin);
        } else {
          errors.password = "password not matched";
          res.render("admin/index", {
            errors: errors
          });
          console.log(errors);
        }
      });
    }
  });
});

router.get("/register", async (req, res) => {
  res.render("admin/register");
});

router.post("/register", async (req, res) => {
  const errors = {};
  Admin.findOne({ email: req.body.email }).then(admin => {
    if (admin) {
      errors.userexist = "user exist";
      res.render("admin/register", {
        errors: errors
      });
    } else {
      const newAdmin = new Admin({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newAdmin.password, salt, (err, hash) => {
          if (err) throw err;
          newAdmin.password = hash;
          newAdmin.save().then(admin => {
            res.render("admin/index", {
              admin: admin
            });
          });
        });
      });
    }
  });
});

router.get("/forgetpassword", async (req, res) => {
  res.render("admin/forgetpassword");
});

router.post("/forgetpassword", async (req, res) => {
  const errors = {};
  Admin.findOne({ email: req.body.email }).then(admin => {
    if (!admin) {
      errors.adminnotfound = "admin doesent exist";
      console.log(errors);
    } else {
      const transporter = nodemailer.createTransport(
        smtpTransport({
          service: "gmail",
          host: "smtp.gmail.com",
          auth: {
            xoauth2: xoauth2.createXOAuth2Generator({
              user: "sahilshah22269@gmail.com",
              clientId:
                "870725568586-mlulucu27lksoef40h2pq7u08kk6jk7j.apps.googleusercontent.com",
              clientSecret: "dn2j9FXeHolPamji2ODnUTkq",
              refreshToken: "1/GqGWmcwDxu3q1Sn-TnZPHEcecPpi4FGrYxO4VpMpqzg"
            })
          }
        })
      );
      const mailOptions = {
        from: "gymmania <sahilshah22269@gmail.com>",
        to: admin.email,
        subject: "gymmania",
        text: "hello world"
      };

      transporter.sendMail(mailOptions, (err, res) => {
        if (err) throw err;
        console.log(`email sent ${res}`);
      });
      res.render("admin/index");
    }
  });
});

router.get("/newpassword", (req, res) => {
  res.render("admin/newpassword");
});

router.post("/newpassword", (req, res) => {
  const errors = {};
  Admin.findOneAndUpdate({ email: req.body.email }).then(admin => {
    if (!admin) {
      errors.adminnotexist = "admin not exist";
      console.log("admin exist");
    }
    const newpassword = new Admin({
      password: req.body.password
    });
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newpassword.password, salt, (err, hash) => {
        if (err) throw err;
        newpassword.password = hash;
        newpassword.save().then(admin => {
          res.render("admin/index");
        });
      });
    });
  });
});

router.get("/dashboard", async (req, res) => {
  res.render("admin/dashboard");
});

module.exports = router;
