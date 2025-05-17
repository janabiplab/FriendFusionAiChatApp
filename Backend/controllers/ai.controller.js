import * as aiServices from "../services/ai.service.js"

export const getResult=async(req,res)=>{
    try{
        const {prompt}=req.query
        const result=await aiServices.generateResult(prompt)
        res.send(result)
    }
    catch(err){
        console.log(err)
        res.status(500).send({message:err.message})
    }
}