const express = require("express");
const Profile = require("../models/Gymprofile");
const regex = require("regex");
const { ensureAuthenticated } = require("../helpers/auth");
const router = express.Router();

const regexcontact = /^\(?\d{3}\)?-?\s*-?\d{4}$/;
const regexpincode = /^\d{6}$/;
const validurl = /(?:(?:https?|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/i;
const alphanumeric = /^[a-z\d\-_\s]+$/i;

router.get("/gymprofile", ensureAuthenticated, (req, res) => {
  console.log(Profile);
  Profile.find({ admin: req.user.id }).then(profile => {
    res.render("admin/gymprofile", {
      profile: profile
    });
    console.log(profile);
  });
});

router.post("/gymprofile", ensureAuthenticated, (req, res) => {
  let errors = [];
  if (!req.body.gymname) {
    errors.push({ text: "please fill gymname field" });
  }
  if (!req.body.contact) {
    errors.push({ text: "please add contact" });
  }
  if (regexcontact.test(req.body.contact) === false) {
    console.log("add valid comtact");
    errors.push({ text: "add valid contact" });
  }
  if (alphanumeric.test(req.body.gymname) === false) {
    errors.push({ text: "please eneter a valid gymname name" });
  }
  if (!req.body.website) {
    errors.push({ text: "please add a proper website" });
  }
  if (validurl.test(req.body.website) === false) {
    errors.push({ text: "please add a valid URL" });
  }
  if (regexpincode.test(req.body.pincode) === false) {
    console.log("add valid comtact");
    errors.push({ text: "add valid pincode" });
  }
  if (errors.length > 0) {
    res.render("admin/gymprofile", {
      errors: errors
    });
  } else {
    Profile.findOne({ gymname: req.body.gymname }).then(profile => {
      if (profile) {
        console.log("profile exist");
        req.flash("error_msg", "profile exist");
      } else {
        const newprofile = new Profile({
          admin: req.user.id,
          gymname: req.body.gymname,
          contact: req.body.contact,
          website: req.body.website,
          location: req.body.location,
          city: req.body.city,
          pincode: req.body.pincode,
          Terms: req.body.Terms,
          social: {
            twitter: req.body.twitter,
            facebook: req.body.facebook
          }
        });
        newprofile
          .save()
          .then(profile => {
            req.flash("success_msg", "added successfully");
            res.redirect("gymprofile");
            console.log(profile);
          })
          .catch(err => {
            req.flash("error_msg", "something went wrong");
            console.log(err);
          });
      }
    });
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
