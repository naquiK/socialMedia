const express = require('express')
const dbConnection = require('./database/dbConnection')
require('dotenv').config()
const app = express()
const authRouter = require('./routes/authrouter')
const removedUnverifiedData = require('./authomation/removedUnverifiedData')


app.use(express.json())
app.use('/api/v1/', authRouter)
dbConnection()
removedUnverifiedData()
const port = process.env.PORT || 5000   
app.listen(port , () => {
    console.log(`server is running on port ${port}`)
})

