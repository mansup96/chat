const express = require("express");
const cors = require("cors");
const fs = require("fs");

const bodyParser = require("body-parser");
const app = express();
const urlencodedParser = bodyParser.json();

app.use(cors());

const users = [];

app.post("/register", urlencodedParser, (req, res) => {
  const data = req.body;

  if (!data.login) {
    res.status(406).send("Нет логина");
  }

  if (!data.password) {
    res.status(406).send("Нет пароля");
  }

  if (!data.email) {
    res.status(406).send("Нет email");
  }

  if (!data.tel) {
    res.status(406).send("Нет телефона");
  }

  const foundUser = users.find(user => user.login === data.login);
  
  if (foundUser) {
    res.status(406).send({
      login: 'Логин занят'
    });
    
    
    return;
  }
  
  users.push(data);
  
  res.status(200).send("Успешно");
});

app.listen(3000, () => console.log("Server is running"));
