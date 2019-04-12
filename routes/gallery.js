const express = require("express");
const multer = require("../config/multer");
const sizeof = require("image-size");
const cloudinary = require("cloudinary");
const { ensureAuthenticated } = require("../helpers/auth");
const router = express.Router();

require("../config/cloudinary");

const Gallery = require("../models/Gallery");
router.get("/addgallery", ensureAuthenticated, (req, res) => {
  res.render("admin/addgallery");
});

router.post(
  "/addgallery",
  ensureAuthenticated,
  multer.single("image"),
  async (req, res) => {
    let result = await cloudinary.v2.uploader.upload(req.file.path);
    const newimage = new Gallery({
      admin: req.user.id,
      image: result.secure_url
    });
    newimage.save().then(() => {
      res.redirect("admin/gallery");
    });
  }
);

router.get("/gallery", ensureAuthenticated, (req, res) => {
  Gallery.find({ admin: req.user.id }).then(pic => {
    res.render("admin/gallery", {
      pic: pic
    });
  });
});
module.exports = router;
