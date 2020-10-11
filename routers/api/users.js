//@login & register
const express=require('express');
const User=require('../../models/User');
const gravatar=require('gravatar');
const jwt=require('jsonwebtoken');
const keys=require('../../config/keys');
const passport=require('passport');

const router=express.Router();


//$router   Get api/users/register
//@desc     return json
//@access public
router.post("/register",(req,res)=>{
// check if exist email
User.findOne({email:req.body.email})
    .then((user)=>{
        if(user){
            return res.status(400).json("email hase existed");
        }else{
            const avatar=gravatar.url(req.body.email,{s:'200',r:'pg',d:'mm'});
            const newUser=new User({
                name:req.body.name,
                email:req.body.email,
                avatar,
                password:req.body.password,
                identity:req.body.identity
            });

                newUser.save()
                            .then(user=>res.json(user))
                            .catch(err=>console.log(err));
            }
        });
    });

//$router   Get api/users/login
//@desc     return token jwt passport
//@access public
router.post("/login",(req,res)=>{
    const email=req.body.email;
    const password=req.body.password;

    User.findOne({email})
        .then(user=>{
            if(!user){
                return res.status(404).json("用户不存在!");
            }else{
                if(password==user.password){
                    const rule={
                        id:user.id,
                        name:user.name,
                        avatar:user.avatar,
                        identity:user.identity
                    };
                    jwt.sign(rule,keys.secretOrKey,{expiresIn:3600},(err,token)=>{
                       if(err) throw err;
                        res.json({
                            success:true,
                            token:"Bearer "+token
                        })
                    })
                }else{
                    return res.status(400).json("密码错误！");
                }
            }
        })
});

//$router   Get api/users/current
//@desc     return current user
//@access   Private
router.get('/current',passport.authenticate("jwt",{session:false}),(req,res)=>{
    res.json({
        id:req.user.id,
        email:req.user.email,
        name:req.user.name,
        identity:req.user.idnentity
    });
});

module.exports=router;