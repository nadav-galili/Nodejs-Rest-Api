const Joi=require('joi');
const bcrypt=require('bcrypt');
const {User}=require ('../models/user');
const express=require('express');
const router=express.Router();

// login endpoint
router.post('/',async(req,res)=>{
    // check if thers an error
    const {error}=validate(req.body);
    if(error)return res.status(400).send(error.details[0].message);
    
// check if the email is in the DB...if not return an error
    let user =await User.findOne({email:req.body.email});
    if (!user) return res.status(400).send('Invalid email or pasword');

//if the email is correct, then we compare the password from
// the user is equal to the hash password in the DB
    const validPassword=await bcrypt.compare(req.body.password,user.password);
    if(!validPassword) return res.status(400).send('Invalid email or pasword');

// send back the token that was generated
    res.json({token:user.generateAuthToken()});

})

function validate(req){

    const schema=Joi.object({
        email:Joi.string().min(6).max(255).required().email(),
        password:Joi.string().min(6).max(1024).required()
    });

    return schema.validate(req)
}


module.exports=router;