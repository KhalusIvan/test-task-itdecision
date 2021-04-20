const http = require('http');
const url = require('url');
module.exports.createdServer = http.createServer((req, res) => {
  var taskControl = require('./controllerTask.js');
  var userControl = require('./controllerUser.js');
  const reqUrl = url.parse(req.url, true);
  let splitPathname = reqUrl.pathname.split('/')
  splitPathname.shift()
  //Разрешаем cors()
  res.setHeader('Access-Control-Allow-Origin', '*');
  //Проверяем на тип запроса и URL и выполняем соответствующу задачу
  if (splitPathname.length === 1 && splitPathname[0] == "tasks" && req.method === 'GET') {
    taskControl.getTasks(req, res);
  } else if (splitPathname.length === 1 && splitPathname[0] == "tasks" && req.method === 'POST') {
    taskControl.setTask(req, res);
  } else if (splitPathname.length === 2 && splitPathname[0] == "tasks" && req.method === 'GET') {
    req.id = splitPathname[1]
    taskControl.getTaskById(req, res);
  } else if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'Application/json');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Allow', 'OPTIONS, PUT, GET, HEAD, POST');
    res.end();
  } else if (splitPathname.length === 2 && splitPathname[0] == "tasks" && req.method === 'POST') {
    req.id = splitPathname[1]
    taskControl.completeTask(req, res);
  } else if (splitPathname.length === 1 && splitPathname[0] == "users" && req.method === 'POST') {
    userControl.getUser(req, res);
  }
}
)