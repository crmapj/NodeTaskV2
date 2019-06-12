const express = require('express')
const bcrypt = require('bcrypt')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(userRouter, taskRouter)


app.listen(port, () => {
    console.log('Server is up on port ' + port)
})



const myFunction = async () => {
    const password = 'red12345!'
    const hashedPassword = await bcrypt.hash(password, 8)

    console.log(password);
    console.log(hashedPassword);

    const isMatch = await bcrypt.compare('red123845!', hashedPassword)
    console.log(isMatch);
    
    
}

myFunction()