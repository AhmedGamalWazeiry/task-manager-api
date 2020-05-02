const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect(process.env.DB_URL,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
})

// const User = mongoose.model('User',{
//     name: {
//         type: String,
//         trim: true,
//         required: true
//     },
//     email: {
//         type: String,
//         trim: true,
//        required: true,
//         validate(value){
//             if(!validator.isEmail(value)){
//                 throw new Error('Enter Correct Email')
//             }
//         }

//     },
//     password: {
//         type: String,
//         required: true,
//         trim: true,
//         minlength: 7,
//         validate(value){
//             if(value.toLowerCase().includes('password')){
//                 throw new Error("The password must not be contain substring password ")
//             }
//         }
//     },
//     age: {
//         type: Number
//     }
// })

// const me = new User({
//     name: 'Ahmed',
//    email: 'ahmedgamal1452@gmail.com',
//    password: 'zzzpasswod'
// })

// me.save().then(()=>{
//     console.log(me)
// }).catch((error)=>{
//     console.log(error)
// })
// const Task = mongoose.model('Task',{
//     description: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//     completed: {
//         type:Boolean,
//         default: false
//     }
// })

// const myTask = new Task({
//     description: '  NodeJsVideoCh  allange  ',
//     completed: true
// })

// myTask.save().then(()=>{
//     console.log(myTask)
// }).catch((error)=>{
//     console.log(error)
// })