const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config/config");
require("dotenv").config();


const url="mongodb://127.0.0.1:27017/website";
let server;

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Create Mongo connection and get the express app to listen on config.port

mongoose
.connect(config.mongoose.url, config.mongoose.options)
.then(()=> console.log("Connected to DB"))
.catch((e)=> console.log("Failed to connect to db",e));

app.listen(config.port,()=>{
    console.log(`Server is running on port ${config.port}`)
})
