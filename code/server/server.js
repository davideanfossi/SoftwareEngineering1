'use strict';
const express = require('express');
// init express
const UserDAO = require('./modules/UserDAO');
const db = new UserDAO('EzWh');

const app = new express();
const port = 3001;

app.use(express.json());

//GET /api/test
app.get('/api/hello', (req,res)=>{
  let message = {
    message: 'Hello World!'
  }
  return res.status(200).json(message);
});


app.post('/api/testdb', async (req,res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(422).json({error: `Empty body request`});
  }
  let user = req.body.user;
  if (user === undefined || user.name === undefined || user.surname === undefined || user.username === undefined || user.type === undefined ||
              user.name == '' || user.surname == '' || user.username === undefined || user.type === undefined ) {

    return res.status(422).json({error: `Invalid user data`});
  }
  
  await db.newTableUser();
  db.storeUser(user);
  return res.status(201).end();
});

app.get('/api/testdb', async (req,res) => {
  try {
    const userlist = await db.getStoredUsers();
    res.status(200).json(userlist);
  } catch (err) {
    res.status(404).end();
  }
});

app.delete('/api/testdb', (req,res) => {
  try {
    db.dropTable();
    res.status(204).end();
  } catch (err) {
    res.status(500).end();
  }
});



// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;