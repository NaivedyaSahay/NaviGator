const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../util/wrapAsync");
const passport=require("passport");
const { savedRedirectUrl } = require("../middleware.js");

router.get("/signup",(req,res)=>{
    res.render("listings/users/signup.ejs");
})

router.post("/signup",wrapAsync(async(req,res)=>{
    try{
        let{username,email,password}=req.body;
        const newUser=new User({email,username});
        const resgisteredUser=await User.register(newUser,password);
        console.log(resgisteredUser);
        req.login(resgisteredUser,(err)=>{
            if(err){
                return next(err);
            }
            else{
                req.flash("success",`Hello ${username}, Welcome to Navigator!`);
                res.redirect("/listings");
            }
        })
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}));

router.get("/login",(req,res)=>{
  res.render("listings/users/login.ejs");
});

router.post("/login",savedRedirectUrl,passport.authenticate("local",{failureRedirect:`/login`,failureflash:true}),async(req,res)=>{
 req.flash("success","Welcome back to Navigator,You are loged in");
 let redirectUrl=res.locals.redirectUrl || "/listings";
 res.redirect(redirectUrl);
});

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/listings");
    });
});

module.exports=router;