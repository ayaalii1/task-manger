// const auth = async (req,res,next) =>{
//     console.log('Auth middelware')
//     next()
// }

const jwt = require('jsonwebtoken')
const User = require('../models/user')
const auth = async(req,res,next) =>{
    try{
        const token = req.header('Authorization').replace('Bearer ','')
        const decode = jwt.verify(token,process.env.JWT_SECRET)

        // 6232ee3e4325819b0542e8d7 T   UsA F
        const user = await User.findOne({_id:decode._id,tokens:token})
        if(!user){
            throw new Error()
        }
        req.user = user
        req.token = token
        next()
    }
    catch(e){
        res.status(401).send({error:'Please authenticate'})
    }
}
module.exports = auth