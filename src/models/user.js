const mongoose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema =  mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true // '        omar     ' --> 'omar'
    },
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true, //'FARAH@GMAIL.COM' --> 'farah@gmaiil.com'
        unique:true,
       validate(value){
           if(!validator.isEmail(value)){
               throw new Error ('Email is invalid')
           }
       }
    },
    age:{
        type:Number,
        default:20,
       validate(value){
           if(value<=0){
               throw new Error('Age must be a postive number')
           }
       }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:6,
        validate(value){
            let password = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])");
            if(!password.test(value)){
                throw new Error('Password must include uppercase,lowercase,numbers,speical character')
            }
        }
    },
    tokens:[
        {
            type:String,
            required:true
        }
    ],
    avatar:{
        type:Buffer
    }
    // tasks:[
    //     {
    //         type:mongoose.Schema.Types.ObjectId,
    //         ref:'Task'
    //     }
    // ]
})

////////////////////////////////////////////////////////////////////////

// virtual relation
userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
    
})


///////////////////////////////////////////////////////////////////
// password
// npm i bcryptjs
userSchema.pre('save',async function(){
    // this --> document
    const user = this
    // console.log(user)
    // 123456 = udsgf743tr67456325ertwfte
    if(user.isModified('password'))
    user.password = await bcryptjs.hash(user.password,8)
})

////////////////////////////////////////////////////////////////////////

// login 
// stsatics --> allow u to use function on model
userSchema.statics.findByCredentials = async (em,password) =>{
    // email--> key
    // em --> value
    const user = await User.findOne({email:em})
    if(!user){
        throw new Error('Unable to login')
    }
    // console.log(user)
    // false
    const isMatch = await bcryptjs.compare(password,user.password)
    // console.log(isMatch)
    if(!isMatch){
        throw new Error('Unable to login')
    }
    return user
}
/////////////////////////////////////////////////////////////////////////////
// variable
// npm i jsonwebtoken
userSchema.methods.generateToken = async function(){
    const user = this
    const token = jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)
    user.tokens = user.tokens.concat(token)
    await user.save()
    return token
}
////////////////////////////////////////////////////////////////////////

// Hide private data
userSchema.methods.toJSON = function(){
    // document
    const user = this
    // toObject --> convert document to object
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    return userObject
}


const User = mongoose.model('User',userSchema)
module.exports = User