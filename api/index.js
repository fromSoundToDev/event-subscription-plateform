import express  from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";



dotenv.config();
// connection with the db 
const mongo = process.env.MONGO_URI;
mongoose.connect(mongo)
.then(()=>{
    console.log("connected successfully to the db" );
})
.catch(Error=>{
    console.log(Error);
});
//creating extanciating express server

const app = express();
const port = process.env.PORT
app.listen(port,()=>{
    console.log(`server is running on port : ${port}`);
})