const User= require("../models/User")
const {sendMail} = require("./SendMail")
const bcrypt = require("bcrypt")
const mongoose = require("mongoose")
const dotenv = require("dotenv")
var jwt = require('jsonwebtoken')
const verifyUser = require("../models/verifyUser")
dotenv.config()


async function InsertVerifyUser(name, email, password){
    try{
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const token = generateToken(email)

        const newUser = new verifyUser({
            name:name,
            email: email,
            password: hashedPassword,
            token: token
        })

        const activationLink = `https://auth-backend-iu28.onrender.com/signin/${token}`
        const content = `<h4> hi, there </h4>
        <h5> welcome to the app </h5>
        <p> thank you for signing up. Click on the below link to activate</p>
        <a href = "${activationLink}">click here</a>
        <p>regards</p>
        <p>team</p>`

        await newUser.save()
        sendMail(newUser.email, "VerifyUser", content)

    }catch(e){
        console.log(e)
    }
}


function generateToken(email) {
    const token = jwt.sign(email, process.env.signup_secret_token)
    return token
}



async function InserSignUser(token) {
    try{
        const userVerify = await verifyUser.findOne({token:token})
    if(userVerify){
        const newUser = User({
            name: userVerify.name,
            email: userVerify.email,
            password: userVerify.password,
            forgetPassword:{}
        })
        await newUser.save()
        await userVerify.deleteOne({token:token})
        const loginlink = 'https://vishram-authentication.netlify.app/login'
        const content = `<h4> Registration successfull</h4>
        <h5> welcome to the app </h5>
        <p> You are successfully registered</p>
        <a href="${loginlink}">go to login</a>
        <h1>testing</h1>
        <p>Regards</p>
        <p>Team</p>`

        sendMail(newUser.email, "Registration Successfull", content)

        return `<h4> Hi, there</h4>
        <h5> welcome to the app </h5>
        <p> You are successfully registered</p>
        <a href="${loginlink}">go to login</a>
        <h1>testing</h1>
        <p>Regards</p>
        <p>Team</p>`
    }

    return `<h4> Registration failed</h4>
    <p>Link expired.......</p>
    <p>Regards</p>
    <p>Team</p>`

    }catch(error){
        console,log(error)
        return `
        <html>
        <body>
        <h4> Registration failed</h4>
        <p>Unexpected error occured</p>
        <p>Regards</p>
        <p>Team</p>
        </body>
        </html>`

    }
}

module.exports= {InsertVerifyUser, InserSignUser}
