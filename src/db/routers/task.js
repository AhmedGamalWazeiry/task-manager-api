const express = require('express')
const router = new express.Router()
const auth = require('../middleware/auth')
const Task =require('../models/task')

router.post('/tasks',auth, async (req,res)=>{
    //const tasks = new Task(req.body)
        const task =new Task({
            ...req.body,
            owner: req.user._id
        })

    try{
    await task.save()
   res.send(task).status(200)
    }catch(e){
      res.status(400).send()
    }
})
router.get('/tasks', auth, async (req,res)=>{
    const match = {}
    const sort = {}
    if(req.query.completed){
        match.completed = req.query.completed == 'true'
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] == 'desc' ? -1 : 1
    }
    try{
     await req.user.populate({
         path:'tasks',
         match,
         options: {
             limit: parseInt(req.query.limit),
             skip: parseInt(req.query.skip),
             sort
        }
     }).execPopulate()
   res.send(req.user.tasks).status(200)
    }catch(e){
      res.status(400).send()
    }
})
router.get('/tasks/:id', async (req,res)=>{

    const _id = req.params.id
    try{
        const task = await Task.findById(_id)
        if(!task){
            return res.status(400).send()
        }
        await task.populate('owner').execPopulate()
        console.log(task.owner)
        res.send(task).status(200)
         }catch(e){
           res.status(404).send()
         }
    })


    router.delete('/tasks/:id',auth, async (req,res)=>{
        try{
            const task = await Task.findOneAndDelete({_id:req.params.id, owner: req.user._id })
            if(!task){
                return res.status(404).send()
            }
            res.status(200).send(task)
          
        }catch(e){
             res.status(400).send(e)
        }
    })


    router.patch('/tasks/:id', async (req,res)=>{

        const _id = req.params.id
        const updates = Object.keys(req.body)
        const allowedUpdate = ['description','completed']
        const isAllowed = updates.every((update)=>allowedUpdate.includes(update))
        if(!isAllowed){
            return res.status(400).send()
        } 
        try{
            const task = await Task.findById(_id)
            updates.forEach((update)=> task[update] = req.body[update])
            await task.save()

           // const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
            if(!task){
                return res.status(404).send()
            }
            res.send(task).status(200)

             }catch(e){
               res.status(400).send(e)
             }
        })

        module.exports = router