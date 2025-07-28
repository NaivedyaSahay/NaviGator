const express=require("express");
const router=express.Router({mergeParams:true});

const wrapAsync=require("../util/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const {reviewSchema}=require("../schema.js");
const ExpressError=require("../util/ExpressError.js");


const validateReview=(req,res,next)=>{
  let{error}=reviewSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
  }else{
    next();
  }
}


//POST REVIEW ROUTES
router.post("" ,validateReview,wrapAsync(async(req,res)=>{
  const listing=await Listing.findById(req.params.id);
  let newReview=new Review(req.body.review);

  listing.reviews.push(newReview);
 
  await newReview.save();
  await listing.save();
  req.flash("success","New Review Created!");
  res.redirect(`/listings/${listing._id}`);
}));

//DELETE REVIEW ROUTES
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
  let{id,reviewId}=req.params;
  await Listing.findByIdAndUpdate(id,{$pull:{reviews  :reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash("success","Review Deleted!");
  res.redirect(`/listings/${id}`); 
}));

module.exports=router;