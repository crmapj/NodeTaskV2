const express = require('express')
const multer = require('multer')
const bcrypt = require('bcrypt')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT


// DATABASE MAINTENANCE MODE TRUE/FALSE
const maintenance = false

// Maintenance middleware
app.use((req, res, next) => {
    if (maintenance === true) {
        res.status(503).send("Website is under maintenance")
    } else {
        next()
    }
})

app.use(express.json())
app.use(userRouter, taskRouter)


app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
