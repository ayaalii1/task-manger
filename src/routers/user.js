const express = require('express')
const router = express.Router()
const User = require('../models/user')
const auth = require('../middelware/auth')
const multer = require('multer')
// post 
// get 
// patch
// delete

//SignUp
// router.post('/users',(req,res)=>{
//     // console.log(req.body)
//     const user = new User(req.body)
//     // userScehma.pre --> excute 
//     user.save().then(()=>{
//       res.status(200).send(user)
//     }).catch((e)=>{
//         res.status(400).send(e)
//     })
// })

router.post('/users',async(req,res)=>{
    try{
        const user = new User(req.body)
        const token = await user.generateToken()
        await user.save()
        res.status(200).send({user,token})
    }
    catch(e){
        res.status(400).send(e)
    }
})

///////////////////////////////////////////////////////////////////////

// login

router.post('/login',async(req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token  = await user.generateToken()
        res.status(200).send({user,token})
    }
    catch(e){
        res.status(400).send(e)
    }
})

//////////////////////////////////////////////////////////////////////////

router.get('/profile',auth,async(req,res)=>{
    res.status(200).send(req.user)
})

////////////////////////////////////////////////////////////////////////

// logout 

router.delete('/logout',auth,async(req,res)=>{
    try{
        // console.log(req.user)
        req.user.tokens = req.user.tokens.filter((el)=>{
            // 12   12!==123 T
            // 1   1!==123 T
            // 2   2!==123 T
            // 123   123!==123 F
            return el !== req.token
        })
        await req.user.save()
        res.send()
    }
    catch(e){
        res.status(500).send(e)
    }

})
///////////////////////////////////////////////////////////////////////////

router.delete('/logoutAll',auth,async(req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }
    catch(e){
        res.status(500).send(e)
    }
})
// get all users
router.get('/users',auth,(req,res)=>{
    User.find({}).then((users)=>{
        res.status(200).send(users)
    }).catch((e)=>{
        res.status(500).send(e)
    })
})
/////////////////////////////////////////////////////////////////////////

// get by id

router.get('/users/:id',auth,(req,res)=>{
    // console.log(req.params)
    const _id = req.params.id
    User.findById(_id).then((user)=>{
        if(!user){
           return res.status(404).send('Unable to find user')
        }
        res.status(200).send(user)
    }).catch((e)=>{
        res.status(500).send(e)
    })
})
//////////////////////////////////////////////////////////////////////

// router.patch('/users/:id',auth,async(req,res)=>{
//     try{
//         //array
//         const updates = Object.keys(req.body)
//         // console.log(updates)
//         const _id = req.params.id
//         const user = await User.findById(_id)
//         if(!user){
//             return res.status(404).send('No user is found')
//         }
//         /**
//          * ['age','password']
//          * user[age] = req.body[age]
//          * user.age = req.body.age
//          * user.password = req.body.password
//          * user.name = req.body.name
//          * 
//          * amr = ali
//          * user['age'] = req.body['age']
//          */
//         updates.forEach((update)=>(user[update]=req.body[update]))
//         await user.save()

//         res.status(200).send(user)
//     }
//     catch(error){
//         res.status(400).send(error)
//     }
// })

///////////////////////////////////////////////////////////////////////////////

router.patch('/users',auth,async(req,res)=>{
    try{
        //array
        // ['name','password']
        const updates = Object.keys(req.body)
        const allowedUpdates = ['name','age','avatar']
        // el --> name true
        // el --> password false
        const isValid = updates.every((el)=> allowedUpdates.includes(el))
        console.log(isValid)

        if(!isValid){
            return res.status(400).send("Can\'t update")
        }
        // console.log(updates)
        updates.forEach((update)=>(req.user[update]=req.body[update]))
        await req.user.save()

        res.status(200).send(req.user)
    }
    catch(error){
        res.status(400).send(error)
    }
})

// router.delete('/users/:id',auth,async(req,res)=>{
// try{
//     const _id = req.params.id
//     const user = await User.findByIdAndDelete(_id)
//     if(!user){
//        return res.status(404).send('Unable to find user')
//     }
//     res.status(200).send(user)
// }
// catch(e){
//     res.status(500).send(e)
// }
// })

// router.delete('/users',auth,async(req,res)=>{
//     try{
//       req.user.remove()
//         // await req.user.save()
//         res.status(200).send(req.user)
//     }
//     catch(e){
//         res.status(500).send(e.message)
//     }
//     })

///////////////////////////////////////////////////////////////////////

// npm i multer
const uploads = multer({
    // dest:'images',
    limits:{
        fileSize:1000000 // 1000000byte --> 1MG
    },
    fileFilter(req,file,cb){
        // flowers.exe
        // /\ match anything . after dot I should only match with one of thses 4 extentions
        if(!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)){
            return  cb(new Error('Please upload image'))

        }
        cb(null,true)

    }
})

// single('avatar') --> postman
router.post('/profile/avatar',auth,uploads.single('avatar'),async(req,res)=>{
    try{
        req.user.avatar = req.file.buffer
        await req.user.save()
        res.send()
    }
    catch(e){
        res.send(e)
    }
})
module.exports = router
