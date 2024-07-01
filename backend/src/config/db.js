const {mongoose} = require("mongoose")

const mondbUrl = "mongodb+srv://shahkhushi3107:yQepqC7HS5FMQg4e@cluster0.tuffxwb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const connectDb = ()=>{
    return mongoose.connect(mondbUrl)
}

module.exports = {connectDb}