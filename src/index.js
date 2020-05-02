const express = require('express')
const app = express()
const port = process.env.PORT
require('./db/mongoose')
const User = require('./db/models/user')
const Task = require('./db/models/task')
const taskRouter = require('./db/routers/task')
const userRouter = require('./db/routers/user')
app.use(express.json())

// app.use((req,res,next)=>{
   
//     if(req.method == 'POST'){
//         res.status(503).send({error:'The Server under maintenance',Path: req.path})
//     }
//     else{
//         next()
//     }
   
// })
app.use(userRouter)
app.use(taskRouter)




app.listen(port,()=>{
    console.log("Server is up on Port " + port)
})
