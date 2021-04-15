const jwt=require('jsonwebtoken')
const Model=require('../models/user')
const userModel=Model.User


let verifyToken=async function(req,res,next){
     console.log(req.headers)
    console.log(res.headers)
        try{ 
        if (!req.headers.authorization && !req.body.token) throw new Error('not here')
        else if(!req.headers.authorization && req.body.token){
            req.headers.authorization='Bearer '+req.body.token
        }
        let auth= req.header('Authorization')
        let token=((req.header('Authorization')).split(' '))[1]
        let userId=jwt.verify(token,'secret')
        let user=await userModel.findOne({_id:userId})
        console.log(user)
        if(!user) throw new Error('unauthorized')
        req.user=user
        req.token=token
        next()
    }
    catch(e){
        res.status(401).render('error', {error:e.message})
    }
    }
    

    module.exports=verifyToken