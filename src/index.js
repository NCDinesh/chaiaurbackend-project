// require('dotenv').config({path:'./env'})
import dotenv from "dotenv"
import express from "express";
import connectDB from "./db/index.js";

/* const app = express()
(async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
    app.on("error",(error)=> {
        console.log("Error:",error)
        throw error
    })

    app.listen(process.env.PORT, ()=>{
      console.log(`App is listening on port ${process.env.PORT}`)
    })
  } catch (error) {
    console.error("ERROR:", error);
  }
})();
*/

dotenv.config({
  path: './env'
})
connectDB()
.then(()=> {
  app.listen(process.env.PORT || 8000, ()=> {
    console.log(`server is running at port: ${process.env.PORT}`)
  })
})
.catch((error)=> {
  console.log("MONGO db connection failed!!",error)
})
