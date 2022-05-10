'use strict';
const express = require('express');
// init express
const controlUser = require('./modules/controlUser');
const db = new controlUser('EzWh');

const app = new express();
const port = 3001;

app.use(express.json());


// GET 

app.get('/api/users', async (req, res) => {
  try {
    const userlist = await db.getUsers();
    res.status(200).json(userlist);
  } catch (err) {
    res.status(404).end();
  }
});

app.get('/api/userinfo', async (req, res) => {
  let id = parseInt(req.query.id);

  if (id === undefined || id === '') {
    return res.status(422).json({ error: `Invalid id` });
  }

  try {
    const userInfo = await db.getUserInfo(id);
    res.status(200).json(userInfo);
  } catch (err) {
    res.status(500).end();
  }
});

app.get('/api/suppliers', async (req, res) => {
  try {
    const supplierlist = await db.getSuppliers();
    res.status(200).json(supplierlist);
  } catch (err) {
    res.status(500).end();
  }
});


// POST

app.post('/api/newUser', async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(422).json({ error: `Empty body request` });
  }
  let user = req.body.user;


  if (user === undefined || user.name === undefined || user.surname === undefined || user.username === undefined || user.type === undefined ||
    user.name == '' || user.surname == '' || user.username === '' || user.type === '') {
    return res.status(422).json({ error: `Invalid user data` });

  } else if (user.type === 'manager') {
    return res.status(422).json({ error: `validation of request body failed or attempt to create manager or administrator accounts` });
  }

  try {
    await db.checkUser(user)
  } catch (err) {
    return res.status(409).json({ error: `user with same mail and type already exists` });
  }

  try {

    await db.newTableUser();
    db.createUser(user);
    return res.status(201).end();

  } catch(err){
    res.status(500).end();
  }
});

app.post('/api/managerSessions', async (req, res) => {

  if (Object.keys(req.body).length === 0) {
    return res.status(422).json({ error: `Empty body request` });
  }

  let credentials = req.body.credentials;


  if (credentials === undefined ||  credentials.username === undefined || credentials.username === '' || 
      credentials.password === undefined || credentials.password === '') {
    return res.status(422).json({ error: `Invalid credentials data` });

  } 

  try {

    const info = await db.managerSession(credentials, 'manager');
    return res.status(200).json(info);

  } catch(err){
    if(err === 'data error')
      res.status(401).json({error: 'wrong username and/or password'});

    res.status(500).end();
  }
  
});



// DELETE

app.delete('/api/deleteTable', (req, res) => {
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