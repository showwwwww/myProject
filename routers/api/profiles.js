//@login & register
const express=require('express');
const Profile=require('../../models/Profile');
const passport=require('passport');

const router=express.Router();


//$router   Get api/profiles/test
//@desc     return json
//@access public
router.get('/test',(req,res)=>{
    res.json({msg:'profile works'});
});

//$router   Post api/profiles/add
//@desc     create info interface
//@access   Private
router.post('/add',passport.authenticate("jwt",{session:false}),(req,res)=>{
    const profileFields={}

    if(req.body.type) profileFields.type=req.body.type;
    if(req.body.describe) profileFields.type=req.body.describe;
    if(req.body.income) profileFields.type=req.body.income;
    if(req.body.expend) profileFields.type=req.body.expend;
    if(req.body.cash) profileFields.type=req.body.cash;
    if(req.body.remark) profileFields.type=req.body.remark;

    new Profile(profileFields).save().then(profile=>{
        res.json(profile);
    });
});

//$router   Get api/profiles
//@desc     get all info
//@access   Private
router.get('/',passport.authenticate("jwt",{session:false}),(req,res)=>{
    Profile.find()
    .then(profile=>{
        if(!profile){
            return res.status(404).json("no result");
        }
        res.json(profile);
    })
    .catch(err=>res.status(404),json(err));
});

//$router   Get api/profiles/:id
//@desc     get single info
//@access   Private
router.get('/:id',passport.authenticate("jwt",{session:false}),(req,res)=>{
    Profile.findOne({_id:req.params.id})
    .then(profile=>{
        if(!profile){
            return res.status(404).json("no result");
        }
        res.json(profile);
    })
    .catch(err=>res.status(404),json(err));
});

//$router   Post api/profiles/edit:id
//@desc     edit info interface
//@access   Private
router.post('/edit:id',passport.authenticate("jwt",{session:false}),(req,res)=>{
    const profileFields={}

    if(req.body.type) profileFields.type=req.body.type;
    if(req.body.describe) profileFields.type=req.body.describe;
    if(req.body.income) profileFields.type=req.body.income;
    if(req.body.expend) profileFields.type=req.body.expend;
    if(req.body.cash) profileFields.type=req.body.cash;
    if(req.body.remark) profileFields.type=req.body.remark;

    Profile.findOneAndUpdate(
        {_id:req.params.id},
        {$set:profileFields},
        {new:true}
    ).then(profile=>res.json(profile));
});

//$router   Post api/profiles/delete:id
//@desc     remove info interface
//@access   Private
router.delete('/delete:id',passport.authenticate("jwt",{session:false}),(req,res)=>{
  Profile.findOneAndRemove({_id:req.params.id}).then(profile=>{
      profile.save().then(profile=>res.json(profile));
  })
  .catch(err=>res.status(404).json(err));
});


module.exports=router;