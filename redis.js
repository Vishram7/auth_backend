const redis = require("redis")
const dotenv = require("dotenv")
dotenv.config()

const client = redis.createClient({
    url:process.env.redis_url
})

client.on("connect", () => {
    console.log("connected to redis")
})

client.on("error", (err) => {
    console.log("error occured",err)
})



client.on("end", () => {
    console.log("redis connection ended")
})

client.on("SIGQUIT", () => {
    client.quit()
})

module.exports = client