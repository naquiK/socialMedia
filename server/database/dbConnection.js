const mongoose = require('mongoose')

const dbConnection = async () =>{
    mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Database connected successfully")
    })
    .catch((err) => {
        console.log("Error connecting to database", err)
        process.exit(1)
    })
    
}
module.exports = dbConnection