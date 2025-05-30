import jwt from "jsonwebtoken"
import redisClient from "../services/redis.service.js"


export const authUser=async(req,res,next)=>{
   
    try {
        let token = null;
      
        if (req.cookies?.token) {
          token = req.cookies.token;
        } else if (req.headers.authorization?.startsWith('Bearer ')) {
          token = req.headers.authorization.split(' ')[1];
        }
      
        if (!token) {
          return res.status(401).send({ error: "Unauthorized User - token missing" });
        }
      
        const isBlackListed = await redisClient.get(token);
        if (isBlackListed) {
          res.cookie('token', '');
          return res.status(401).send({ error: "Unauthorized User - token blacklisted" });
        }
      
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
      } catch (error) {
        console.log('JWT Error:', error.message);
        res.status(401).send({ error: "Unauthorized User - invalid token" });
      }
 }     