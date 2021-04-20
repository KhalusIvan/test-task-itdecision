const {modelUser} = require('./server.js')
const jwt = require("jsonwebtoken");
const secretJWT = 'test-task'

//Авторизация юзера
//При успехе возвращаем роль и токен
exports.getUser = async function(req, res) {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString(); 
    });
    req.on('end', async() => {
        let objParams = body.split(",")
        let userObj = {
            nickname:objParams[0],
            password:objParams[1]
        }
        let users;
        await modelUser.find(userObj, {role:1}, function(err, docs){       
            if(err) {
                res.statusCode = 500;
                return console.log(err);
            }
            res.statusCode = 200;
            if (docs.length === 0) {
                users = "uncorrect"; 
            } else {
                const token = jwt.sign({role:docs[0].role}, secretJWT, {expiresIn: "2d"});
                users = {role:docs[0].role, token}
            }
            res.setHeader('Content-Type', 'Application/json');
            res.end(JSON.stringify(users))
        });
    }); 
    
}
