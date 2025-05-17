
import * as projectService from '../services/project.service.js'
import {validationResult} from 'express-validator'
import userModel from '../models/user.model.js'

export const CreateProject=async(req,res)=>{
   
   const errors=validationResult(req)

   if (!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()})
   }

   try{
      const {name}=req.body
      const loggedUser= await userModel.findOne({email:req.user.email})

      const userId=loggedUser._id
      const newProject=await projectService.createProject({name,userId})
      res.status(201).json(newProject)
   }catch(err){
    console.log(err)
    res.status(400).send(err.message)
   }

}

export const getAllProjects=async(req,res)=>{
   const errors=validationResult(req)
   if (!errors.isEmpty()){
      return res.status(400).json({errors:errors.array()})
   }
   try{
       const loggedUser=await userModel.findOne({
         email:req.user.email
       })

       const allUsersProject=await projectService.getAllProjectByUserId({
         userId:loggedUser
       })
       return res.status(200).json({projects:allUsersProject})

       
   }
   catch(err){
      console.log(err)
      res.status(400).send(err.message)
   }
}

export const addUsers=async(req,res)=>{
   const errors=validationResult(req)
   if (!errors.isEmpty()){
      return res.status(400).json({errors:errors.array()})
   }
   try{
       
      const {projectId,users}=req.body

      const loggedUser=await userModel.findOne({
         email:req.user.email
      })

      const project=await projectService.addUserToProject({
         projectId,
         users,
         userId:loggedUser
      })


      return res.status(200).json({project})
   }
   catch(err){
      res.status(400).send(err.message)
   }
}

export const getProjectById=async(req,res)=>{
   const {projectId}=req.params
   try{
      const project=await projectService.getProject({projectId})
      return res.status(200).json({ project })
   }
   catch(err){
      console.log(err)
      res.status(401).send(err.message)
   }
}


