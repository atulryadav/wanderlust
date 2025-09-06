const express = require("express")
const router = express.Router()
const wrapAsync = require("../utils/wrapAsync.js") ;
const ExpressError = require("../utils/ExpressError.js")
const Listing = require("../models/listing");
const{isLoggedIn, isOwner} = require("../middleware.js")
const multer = require('multer')
const{storage}=require("../cloudConfig.js")
const upload = multer({storage})
const { cloudinary } = require("../cloudConfig")
router.get("/",wrapAsync(async (req,res)=>{
    const allListing = await Listing.find({})
    res.render("listings/index.ejs" , {allListing})

}))
router.get("/new",isLoggedIn,( req ,res) => {
    res.render("listings/new.ejs")
})
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id} = req.params
    const listing = await Listing.findById(id).populate({path:"reviews",populate:{
        path:"author",},
    }).populate("owner")
    res.render("listings/show.ejs",{listing})
}))

router.post("/",upload.single('listing[image]'),wrapAsync( async (req,res)=>{
        console.log("FILE:", req.file);   // 👈 check this
    console.log("BODY:", req.body);

    const newListing = new Listing(req.body.listing)
    newListing.owner = req.user._id
    if (req.file) {
  newListing.image = {
    url: req.file.secure_url,     // use secure_url, not path
    filename: req.file.public_id, // Cloudinary's public_id
  };
}
await newListing.save()
    req.flash('success', "New listing added!")
    res.redirect("/listings")
}))
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async(req,res)=>{
     let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs",{listing} )
}))

router.put(
  "/:id",
  upload.single("listing[image]"),
  wrapAsync(async (req, res) => {
    const { id } = req.params;

    // Find the listing first
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    // Update text fields
    listing.set(req.body.listing);

    // If a new image is uploaded
    if (req.file) {
      // Delete old image from Cloudinary if it exists
      if (listing.image && listing.image.filename) {
        await cloudinary.uploader.destroy(listing.image.filename);
      }

      // Save new 
      listing.image = {
        url: req.file.path || req.file.secure_url,
        filename: req.file.filename || req.file.public_id,
      };
    }

    await listing.save();
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
  })
);

router.delete("/:id",isLoggedIn,isOwner,wrapAsync(async (req, res) => {
    let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
   req.flash('success', "listing deleted!")
  res.redirect("/listings");
})); 
module.exports = router