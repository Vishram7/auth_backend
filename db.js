const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()


const connectDb= async () => {
    try{
        await mongoose.connect(process.env.Mongo_Url)
        console.log('connected to db')
    }catch(error){
        console.log(error)
    }
}

module.exports = connectDb