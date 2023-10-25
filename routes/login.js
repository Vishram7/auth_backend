const express = require("express")
const { AuthenticateUser } = require("../controller/login")
const router = express.Router()
const client = require('../redis')


client.connect()
.then(()=>{
    console.log("connected to redis")
})
.catch((e) =>{
    console.log(e, "error")
})




router.post('/', async(req, res) => {
    try{
        const {email, password } = await req.body
        var loginCredentials = await AuthenticateUser(email, password)
        console.log(loginCredentials)

        if(loginCredentials === "Invalid User name or Password"){
            res.status(200). send("Invalid User name or Password")
        }
        else if(loginCredentials === "Server Busy"){
            res.status(200).send("Server Busy")
        }
        else{
            res.status(200).json({token: loginCredentials.token})
        }

    }catch(error){
        console.log(error)
    }
})

module.exports= router