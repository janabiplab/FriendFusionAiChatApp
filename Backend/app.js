import dotenv from "dotenv"
dotenv.config()
import express  from "express"
import cors from 'cors'
import morgan from "morgan"
import connect from "./db/db.js"
connect();
import userRoutes from "./routers/user.route.js"

import cookieParser from "cookie-parser"


import projectRoutes from "./routers/project.routes.js"
import aiRoutes from  "./routers/ai.routes.js"







const app=express()

app.use(cors())
app.use(morgan('dev'))
app.use(express.json())

// middle ware for  Enable URL-encoded data parsing
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());

app.get('/',(req,res)=>{
    res.send("Backend is running");
})

app.use('/users',userRoutes)


app.use('/projects',projectRoutes)

app.use('/ai',aiRoutes)







export default app