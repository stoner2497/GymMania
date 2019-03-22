const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const smtpTransport = require("nodemailer-smtp-transport");
const xoauth2 = require("xoauth2");
const urlCrypt = require("url-crypt")(
  '~{ry*I)==yU/]9<7DPk!Hj"R#:-/Z7(hTBnlRS=4CXF'
);
const passport = require("passport");
const { ensureAuthenticated } = require("../helpers/auth");

const regexemail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const regexpasswordNum = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
const regexpasswordspecial = /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;

const Admin = require("../models/Admin");
router.get("/login", async (req, res) => {
  res.render("admin/index");
});

router.post("/login", async (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "dashboard",
    failureRedirect: "login",
    failureFlash: true
  })(req, res, next);
});

router.get("/register", async (req, res) => {
  res.render("admin/register");
});

router.post("/register", async (req, res) => {
  const errors = {};
  Admin.findOne({ email: req.body.email }).then(admin => {
    if (admin) {
      req.flash("error_msg", "user exist");
      res.render("admin/register");
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
            req.flash("success_msg", "registerd successfully!!!");
            res.redirect("login");
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
      res.end();
    } else {
      const payload = {
        emai: admin.email
      };
      const base64 = urlCrypt.cryptObj(payload);
      const registrationUrl =
        "http://" + req.headers.host + "/admin/newpassword" + "  " + base64;
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
        html: "<a href=" + registrationUrl + ">That was easy!</a>"
      };

      transporter.sendMail(mailOptions, (err, res) => {
        if (err) throw err;
        console.log(`email sent ${res}`);
      });
      res.redirect("admin/index");
    }
  });
});

router.get("/newpassword", (req, res) => {
  res.render("admin/newpassword");
});

router.get("/dashboard", ensureAuthenticated, async (req, res) => {
  res.render("admin/dashboard");
});

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "you are logged out");
  res.redirect("login");
});

module.exports = router;
