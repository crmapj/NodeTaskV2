require('../src/db/mongoose')
const Task = require('../src/models/task')

Task.findByIdAndDelete('5cf52133bfb6635bf8d7f694').then((task) =>{
    console.log(task)
    return Task.countDocuments({ completed: false})
}).then((result) => {
    console.log(result);
}).catch((e) => {
    console.log(e);   
})

