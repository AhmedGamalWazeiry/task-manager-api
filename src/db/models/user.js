const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const Task = require('./task')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
       required: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Enter Correct Email')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error("The password must not be contain substring password ")
            }
        }
    },
    age: {
        type: Number
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type:Buffer
    }
},{
    timestamps: true
})

userSchema.virtual('tasks',{
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.generateAuthToken = async function(){

    const user = this
    const token = jwt.sign({_id: user._id },process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}
userSchema.methods.toJSON = function (){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject


}
userSchema.statics.findbycredentials = async (email,password)=>{

    const user = await User.findOne({email})
    if(!user){
      throw new Error ('Unable to find user')
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error ('Unable to find user')
    }
    return user
}

userSchema.pre('save', async function(next){
    
    const user = this 
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})

userSchema.pre('remove', async function(next){
    
    const user = this 
    await Task.deleteMany({owner: user._id})
    next()
})

const User = mongoose.model('User',userSchema)

module.exports = User