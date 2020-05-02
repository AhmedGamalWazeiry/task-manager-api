const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')
const {sendWelcomeEmail , sendcancelationEmail } = require('../../emails/account')

const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req,file,cb){
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
      cb(new Error("Please upload an image"))
    }
    cb(undefined,true)

  }
})
router.post('/users/me/avatar', auth,upload.single('avatar') , async (req,res)=>{
      const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
      req.user.avatar = buffer
      await req.user.save()
      res.status(200).send()

},(error,req,res,next)=>{
  res.status(400).send({error:error.message})
})
router.delete('/users/me/avatar',auth, async (req,res)=>{
  req.user.avatar = undefined
  await req.user.save()
  res.status(200).send()
})
router.get('/users/:id/avatar', async (req,res)=>{
  
  try{
    const user = await User.findById(req.params.id)
    if(!user || !user.avatar ){
       throw new Error({error:'habben Mistake'})
    }
    res.set('Content-Type','image/png')
    res.send(user.avatar)

  }catch(e){
    res.status(404).send({message:e.message})
  }


})
router.patch('/users/me',auth, async (req,res)=>{
  const updates = Object.keys(req.body)
  const allowedUpdate = ['email','name','password','age']
  const isAllowed = updates.every((update)=>allowedUpdate.includes(update))
  if(!isAllowed){
      return res.status(400).send({error:'Invalid Update!'})
  } 
      try{
        updates.forEach((update)=>req.user[update] = req.body[update]) 
        await req.user.save()
        res.status(200).send(req.user)

      }catch(e){
        res.status(500).send()
      }
})


router.post('/users', async (req,res)=>{
    const user = new User(req.body)
    try{
       
        
        sendWelcomeEmail(user.email,user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    }catch(e){
      res.status(400).send({ message: e.message })
    }
  })

  router.get('/user/myprofile',auth,async (req,res)=>{
    try{
        await req.user.populate('tasks').execPopulate()
        res.status(200).send(req.user)
    }catch(e){
      res.status(400).send({ message: e.message })
    }
  })
  router.delete('/user/myprofile',auth,async (req,res)=>{
    try{
         await req.user.remove()
         sendcancelationEmail(req.user.email,req.user.name)
        res.status(200).send(req.user)
    }catch(e){
      res.status(400).send({ message: e.message })
    }
  })
  
  router.post('/users/logout',auth, async (req,res)=>{
    try{
           req.user.tokens = req.user.tokens.filter((token)=>{
             return token.token != req.token
           })   
           await req.user.save()
           res.status(200).send()
    }catch(e){
      res.status(500).send({error:'You already logout'})
    }
  })
  router.post('/users/logoutAll',auth, async (req,res)=>{
    try{
           req.user.tokens = []
           await req.user.save()
           res.status(200).send()
    }catch(e){
      res.status(500).send({error:'You already logout'})
    }
  })

  router.post('/users/login', async (req,res)=>{
    try{
        const user = await User.findbycredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({user,token})
    }catch(e){
      res.status(400).send({ message: e.message })
    }
  })
  module.exports = router