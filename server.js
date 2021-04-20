const {createdServer} = require('./routes.js')
let server = createdServer

const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
const Schema = mongoose.Schema;

const taskScheme = new Schema({
    category: String,
    time: Date,
    title: String,
    description: String,
    isDone: {
        type: Boolean,
        default: false
    }
}, { versionKey: false }
);

const userScheme = new Schema({
    nickname: String,
    password: String,
    role: String,
}, { versionKey: false }
);

  
// подключение
mongoose.connect("mongodb+srv://vania:Hfqyscf10f@todo.p1gfk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", { useUnifiedTopology: true, useNewUrlParser: true });
  
const Task = mongoose.model("Task", taskScheme);
module.exports.modelTask = Task;
const User = mongoose.model("User", userScheme);
module.exports.modelUser = User;

server.listen(5000, ()=>{
    console.log("Server start")
})