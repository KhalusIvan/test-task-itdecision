const {modelTask} = require('./server.js')
const jwt = require("jsonwebtoken");
const secretJWT = 'test-task'


//Список заданий (только категория и название)
exports.getTasks = async function(req, res) {
    await modelTask.find({isDone:false}, {isDone:0, time:0, description:0}, function(err, docs){       
        if(err) {
            res.statusCode = 200;
            res.end(JSON.stringify("error"))
            return;
        } 
        res.statusCode = 200;
        res.setHeader('Content-Type', 'Application/json');
        res.end(JSON.stringify(docs))
    });
}

//Полное задание по id
exports.getTaskById = async function(req, res) {
    await modelTask.findById(req.id, function(err, docs){       
        if(err) {
            res.statusCode = 200;
            res.end(JSON.stringify("error"))
            return;
        } 
        res.statusCode = 200;
        res.setHeader('Content-Type', 'Application/json');
        res.end(JSON.stringify(docs))
    });
}

//Проверка на роль админ
function checkTokenAdmin(req, res) {
    const authHeader = req.headers.authorization;
    let currentUser;
    try {
        currentUser = jwt.verify(authHeader, secretJWT);
    } catch (e) {
        if (e instanceof jwt.JsonWebTokenError) {
            return "Invalid token";
        }
    }
    return currentUser.role;
}

//Добавляем задание
exports.setTask = function(req, res) {
    let role = checkTokenAdmin(req, res)
    if (role === 'admin') {
        let body = '';
        //Считываем тело
        req.on('data', chunk => {
            body += chunk.toString(); 
        });
        req.on('end', async() => {
            let txt = body.trim();
            //Разбиваем текст на масив, если есть лишнее значение удаляем, чистим от лишних пробелов и символов переноса
            let splitPrev = txt.split(';')
            if(splitPrev.length % 2 === 1) {
                splitPrev.pop()
            }
            let split = splitPrev.map(el => {
                el.replace(/\r?\n|\r/,'')
                return el.trim()
            })   
            //Удаляем дубликаты
            let checkObj = {}
            let arrayOfObjects = []
            for (let i = 0; i < split.length / 2; i++) {
                let indI = i * 2;
                for(let j = i + 1;  j < split.length / 2; j++) {
                    let indJ = j * 2;
                    if (split[indI] === split[indJ] && split[indI+1] === split[indJ+1]) {
                        split.splice(indJ, 2)
                        j--;
                    }
                }          
            }
            //Создаем масив объектов заданий (без дубликатов)
            for (let i = 0; i < split.length / 2; i++) {
                let ind = i * 2;
                let split2 = split[ind].split(' ', 2)
                split[ind]=split[ind].replace(split2[0], "")
                split[ind]=split[ind].replace(split2[1], "")
                split[ind] = split[ind].trim()
                split[ind+1] = split[ind+1].trim() 
                checkObj = {
                    category: split2[0],
                    time: new Date(split2[1]),
                    title: split[ind],
                    description: split[ind+1],
                } 
                arrayOfObjects.push(checkObj)
            }
            let addedTodos = []
            //Проверяем есть ли объект уже в базе, если он уникален то добавляем
            for (let el of arrayOfObjects) {
                try {
                    const docs = await modelTask.find(el);
                    if (docs.length === 0) {
                        let task = new modelTask(el)
                        let saveTask = await task.save();
                        addedTodos.push(saveTask)
                        res.status(200);
                    }  
                } catch (err) {
                    res.status(500);
                }                
            } 
            res.setHeader('Content-Type', 'Application/json');
            //Возвращаем масив доданых елементов
            res.end(JSON.stringify(addedTodos))            
        }); 
    } else {
        res.setHeader('Content-Type', 'Application/json');
        res.end(JSON.stringify("Not admin"))
    }   
}

//Помечаем задание как выполненое
exports.completeTask = async function(req, res) {
    await modelTask.findByIdAndUpdate(req.id, {isDone: true}, function(err, task){
        if(err) {
            res.statusCode = 500;
        };
        res.statusCode = 200;
        res.setHeader('Content-Type', 'Application/json');
        res.end(JSON.stringify("success")) 
    });
 
}