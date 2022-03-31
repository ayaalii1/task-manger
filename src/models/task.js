const mongoose = require('mongoose')


const taskScehma = mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    completed:{
        type:Boolean,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User' //Model
    },
    img:{
        type:Buffer
    }
})

taskScehma.methods.toJSON = function(){
    const task = this
    const taskObject = task.toObject()
    return taskObject
}

const Task = mongoose.model('Task',taskScehma)
module.exports = Task