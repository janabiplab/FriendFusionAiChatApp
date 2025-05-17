import dotenv from "dotenv"
dotenv.config()
import http from 'http'

import app from "./app.js"
import {Server} from 'socket.io'
import mongoose from 'mongoose'
import projectModel from "./models/project.model.js"
import { generateResult } from "./services/ai.service.js"



import jwt from 'jsonwebtoken'

const server=http.createServer(app)
const port=process.env.PORT || 3000

const io = new Server(server,{
  cors:{
    origin:"*"
  }
});

io.use(async(socket,next)=>{

  try{
    const token=socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1]
    const projectId=socket.handshake.query.projectId
   
    if(!mongoose.Types.ObjectId.isValid(projectId)){
      return next(new Error('Invalid projectId'))
    }

    socket.project= await  projectModel.findById(projectId)


    if(!token){
      return next(new Error('Authentication error'))
    }

    const decoded=jwt.verify(token,process.env.JWT_SECRET)

    if(!decoded){
      return next(new Error('Authentication error'))
    }
   

    socket.user=decoded
    next()

  }catch(err){
      next(err)
  }
})

io.on("connection", (socket) => {
    console.log('a user connected ')
    socket.join(socket.project._id.toString())
   

    socket.on('project-message',async(data)=>{
      console.log(data)
     
      socket.broadcast.to(socket.project.id.toString()).emit('project-message',data)
      const message=data.message

      const aiIsPresentInMessage=message.includes('@ai')

      if(aiIsPresentInMessage){
        const prompt=message.replace('@ai','')
        const result= await generateResult(prompt)
        console.log(result)

        io.to(socket.project.id.toString()).emit('project-message',{
           message:result,
           sender:{_id:"ai",email:"AI@gmail.com"}
        })
      }

      
    })

    socket.on('disconnect',()=>{
      console.log('user disconnected')
      socket.leave(socket.project.id.toString())
    })
  });
  


server.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})




