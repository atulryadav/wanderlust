// const express = require("express")
// const router = express.Router({mergeParams:true})
// const User = require("../models/user");
// const passport = require("passport");
// router.get("/signup",(req,res)=>{
//     res.render("users/signup.ejs")
// })
// router.post("/signup",async(req,res)=>{
//     let{username,email,password }=req.body
//     const newUser =new User({username,email})
//     const registeredUser =await User.register(newUser , password)
//     console.log(registeredUser)
//     req.login(registeredUser,(err)=>{
//         if(err){
//            return  next(err)
//         }
//         req.flash("success","wellcome to wanderlust")
//     res.redirect("/listings")
//       })
// })
//   catch (err) {
//     if (err.name === "UserExistsError") {
//       // 👇 yahan friendly message dikhao
//       req.flash("error", "User already registered. Please login.");
//       return res.redirect("/login");
//     }
//     console.error(err);
//     req.flash("error", "Something went wrong. Please try again.");
//     res.redirect("/signup");
//   }

// router.get("/login",(req,res)=>{
//     res.render("users/login.ejs")
// })
// router.post("/login",passport.authenticate("local",{
//     failureRedirect:"/login",
//     failureFlash:true,
// }),
// async (req,res)=>{
//     req.flash("success","logged in succefully!")
//     res.redirect("/listings")

// });
// router.get("/logout",(req,res,next)=>{
//     req.logout((err)=>{
//         if(err){
//             return next(err)
//         }
//         req.flash("success","you logged out successfully")
//         res.redirect("/listings")
//     })
// })
// module.exports=router
const express = require("express");
const router = express.Router({ mergeParams: true });
const User = require("../models/user");
const passport = require("passport");

// =================== SIGNUP ===================
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

router.post("/signup", async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email });

    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Wanderlust");
      res.redirect("/listings");
    });
  } catch (err) {
    if (err.name === "UserExistsError") {
      req.flash("error", "User already registered. Please login.");
      return res.redirect("/login");
    }
    console.error(err);
    req.flash("error", "Something went wrong. Please try again.");
    res.redirect("/signup");
  }
});

// =================== LOGIN ===================
router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Logged in successfully!");
    res.redirect("/listings");
  }
);

// =================== LOGOUT ===================
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "You logged out successfully");
    res.redirect("/listings");
  });
});

module.exports = router;
