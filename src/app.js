// CRUD operations
const express = require('express')
// conncection of backend --> frontend
// npm i cors
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT

require('./db/mongoose')
app.use(cors())
// parse automatic
app.use(express.json())

const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const Task = require('./models/task')
app.use(userRouter)
app.use(taskRouter)

/**
 * Collection 
 * Model --> title (string/required/trim)
 * description (string/required/trim)
 * completed (boolean/default false)
 * 
 * CRUD opertions (async& await)
 * app.js
 * 
 */
// bcryptjs
// const bcryptjs = require('bcryptjs')
// const passwordFunction = async() =>{
//     const password = 'R123456'
//     // hash --> hashing password
//     const hashedPassword = await bcryptjs.hash(password,8)
//     console.log(password)
//     console.log(hashedPassword)

//     //compare
//     const compare = await bcryptjs.compare('R123456',hashedPassword)
//     console.log(compare)
// }

// passwordFunction()
//////////////////////////////////////////////////////////////////////////

// token 
// const jwt = require('jsonwebtoken')

// const myToken = () =>{
    // sign --> create token 
// const token = jwt.sign({_id:'123'},'nodecourse')
// console.log(token)

// // verify
// const tokenVerify = jwt.verify(token,'nodecourse')
// console.log(tokenVerify)


// }
// myToken()
////////////////////////////////////////////////////////////////////////

/**
 * Express middelware
 * Without express middelware
 * new request--> run toute handler
 * 
 * Express middelware
 * new request --> do sth (check token) --> run route handler
 */
////////////////////////////////////////////////////////////////////////

// populate
// const relationfun = async() =>{
//     const task = await Task.findById('6236d740522484a6d88fb62b')
//     await task.populate('owner')
//     console.log(task.owner)
// }
// relationfun()
/////////////////////////////////////////////////////////////////////
// multer

// const multer = require('multer')
// const uploads = multer({
//     dest:'images',
//     limits:{
//         fileSize:1000000 // 1000000byte --> 1MG
//     },
//     fileFilter(req,file,cb){
//         // flowers.exe
//         // /\ match anything . after dot I should only match with one of thses 4 extentions
//         if(!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)){
//             return  cb(new Error('Please upload image'))

//         }
//         cb(null,true)

//     }
// })

// app.post('/image',uploads.single('test'),(req,res)=>{
//     res.send('Success')
// })
app.listen(port,()=>{console.log('Server is running ' + port)})