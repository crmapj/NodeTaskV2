require('../src/db/mongoose')
const User = require('../src/models/user')
const Task = require('../src/models/task')

// User.findByIdAndUpdate('5cf518e1030d4a5b48dfc8aa', { age: 1}).then((user) =>{
//     console.log(user)
//     return User.countDocuments({ age: 1})
// }).then((result) => {
//     console.log(result);
// }).catch((e) => {
//     console.log(e);   
// })


const updateAgeAndCount = async (id, age) => {
    const user = await User.findByIdAndUpdate(id, { age })
    const count = await User.countDocuments({ age })
    return count
}

const deleteTaskAndCount = async (id) => {
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({ completed: false })
    return count
}

updateAgeAndCount("5cf518e1030d4a5b48dfc8aa", 0).then((count) => {
    console.log(count);
}).catch((e) => {
    console.log(e);
    })

deleteTaskAndCount("5cf6f6d89ab10a11ec40c25e").then((count) => {
    console.log(count);
    
}).catch((e) => {
    console.log(e);
    
})