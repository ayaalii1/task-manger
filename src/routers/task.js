const express = require('express')
const Task = require('../models/task')
const router = express.Router()
const auth = require('../middelware/auth')
const multer = require('multer')

// Version 1
// router.post('/tasks',auth,async(req,res)=>{
//     try{
//         const task = new Task(req.body)
//         await task.save()
//         res.status(200).send(task)
//     }
//     catch(e){
//         res.status(400).send(e.message)
//     }

// })

////////////////////////////////////////////////////////////////////////////////

// Version2

const uploads = multer({
    limits:{
        fileSize:1000000 // 1MB
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png|jfif)$/)){
            return cb(new Error('Please upload an image'))
        }
        cb(undefined,true)
    }
})
router.post('/tasks',auth,uploads.single('image'),async(req,res)=>{
    try{
        // ... spread operator copy data
        const task = new Task({...req.body,owner:req.user._id})
        task.img = req.file.buffer
        //console.log(task.img)
        await task.save()
        res.status(200).send(task)
    }
    catch(e){
        res.status(400).send(e)
    }

})

router.get('/tasks',auth,async(req,res)=>{
    try{
        // const tasks = await Task.find({})
        // res.status(200).send(tasks)
        await req.user.populate('tasks')
        res.status(200).send(req.user.tasks)
    }
    catch(e){
        res.status(500).send(e)
    }
})


router.get('/tasks/:id',auth,async(req,res)=>{
    try{
        // const task = await Task.findById(req.params.id)
        const _id = req.params.id
        // 62e  owner:1d3
        // 631 owner:1d3
        const task = await Task.findOne({_id,owner:req.user._id})
        console.log(task)
        if(!task){
          return  res.status(404).send('Unable to find task')
        }
        res.send(task)
    }
    catch(e){
        res.status(500).send(e)
    }
})

router.patch('/tasks/:id',auth,async(req,res)=>{
    try{
        const id = req.params.id
        const task = await Task.findOneAndUpdate({_id:id,owner:req.user._id},req.body,{
            new:true,
            runValidators:true
        })
        if(!task){
            return res.status(404).send('No task')
        }
        res.status(200).send(task)
    }
    catch(e){
        res.status(500).send(e)
    }
})


router.delete('/tasks/:id',auth,async(req,res)=>{
    try{
        const _id = req.params.id
        const task = await Task.findOneAndDelete({_id,owner:req.user._id})
        if(!task){
         return  res.status(404).send('No task is found')
        }
        res.status(200).send(task)
    }
    catch(e){
        res.status(500).send(e)
    }
})

router.get('/userTask/:id',auth,async(req,res)=>{
    try{
        const _id = req.params.id
        const task = await Task.findOne({_id,owner:req.user._id})
        if(!task){
            return res.status(404).send('No task')
        }
        await task.populate('owner') // refrence 
        res.status(200).send(task.owner)
    }
    catch(e){
        res.status(500).send(e)
    }
})

module.exports = router