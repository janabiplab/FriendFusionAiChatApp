import mongoose from 'mongoose'
import "dotenv/config"


function connect(){
    mongoose.connect(process.env.MONGODB_URL)
      .then(()=>{
        console.log("Connected to MongoDB")
      })
      .catch((err)=>{
        console.log(err)
      })
}

export default connect