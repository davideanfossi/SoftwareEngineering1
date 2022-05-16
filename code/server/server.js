'use strict';
const express = require('express');
// init express
const controlUser = require('./modules/controlUser');
const controlSku = require('./modules/controlSku');
const controlOrder = require('./modules/controlOrder')
const controlTest = require('./modules/controlTest')
const db = new controlUser('EzWh.db');
const db1 = new controlSku('EzWh.db');
const db2 = new controlOrder('EzWh.db');
const db3 = new controlTest('EzWh.db');

const app = new express();
const port = 3001;

app.use(express.json());

// <----------- CONTROL USER ----------->
// GET 

app.get('/api/users', async (req, res) => {
  try {
    const userlist = await db.getUsers();
    res.status(200).json(userlist);
  } catch (err) {
    res.status(404).end();
  }
});


// SOLO PER TEST
app.get('/api/all', async (req, res) => {
  try {
    const allList = await db.getAll();
    res.status(200).json(allList);
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
  let user = req.body;


  if (user === undefined || user.name === undefined || user.surname === undefined || user.username === undefined || user.type === undefined ||
    user.name == '' || user.surname == '' || user.username === '' || user.type === '') {
    return res.status(422).json({ error: `Invalid user data` });

  } else if (user.type === 'manager') {
    return res.status(422).json({ error: `validation of request body failed or attempt to create manager or administrator accounts` });
  }

  try {
    await db.newTableUser();
    await db.checkUser(user, 'newUser')
  } catch (err) {
    return res.status(409).json({ error: `user with same mail and type already exists` });
  }

  try {
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

    const info = await db.session(credentials, 'manager');
    return res.status(200).json(info);

  } catch(err){
    if(err === 'data error')
      res.status(401).json({error: 'wrong username and/or password'});

    res.status(500).end();
  }
  
});

app.post('/api/customerSessions', async (req, res) => {

  if (Object.keys(req.body).length === 0) {
    return res.status(422).json({ error: `Empty body request` });
  }

  let credentials = req.body.credentials;


  if (credentials === undefined ||  credentials.username === undefined || credentials.username === '' || 
      credentials.password === undefined || credentials.password === '') {
    return res.status(422).json({ error: `Invalid credentials data` });

  } 

  try {

    const info = await db.session(credentials, 'customer');
    return res.status(200).json(info);

  } catch(err){
    if(err === 'data error')
      res.status(401).json({error: 'wrong username and/or password'});

    res.status(500).end();
  }
  
});

app.post('/api/supplierSessions', async (req, res) => {

  if (Object.keys(req.body).length === 0) {
    return res.status(422).json({ error: `Empty body request` });
  }

  let credentials = req.body.credentials;


  if (credentials === undefined ||  credentials.username === undefined || credentials.username === '' || 
      credentials.password === undefined || credentials.password === '') {
    return res.status(422).json({ error: `Invalid credentials data` });

  } 

  try {

    const info = await db.session(credentials, 'supplier');
    return res.status(200).json(info);

  } catch(err){
    if(err === 'data error')
      res.status(401).json({error: 'wrong username and/or password'});

    res.status(500).end();
  }
  
});

app.post('/api/clerkSessions', async (req, res) => {

  if (Object.keys(req.body).length === 0) {
    return res.status(422).json({ error: `Empty body request` });
  }

  let credentials = req.body.credentials;


  if (credentials === undefined ||  credentials.username === undefined || credentials.username === '' || 
      credentials.password === undefined || credentials.password === '') {
    return res.status(422).json({ error: `Invalid credentials data` });

  } 

  try {

    const info = await db.session(credentials, 'clerk');
    return res.status(200).json(info);

  } catch(err){
    if(err === 'data error')
      res.status(401).json({error: 'wrong username and/or password'});

    res.status(500).end();
  }
  
});

app.post('/api/qualityEmployeeSessions', async (req, res) => {

  if (Object.keys(req.body).length === 0) {
    return res.status(422).json({ error: `Empty body request` });
  }

  let credentials = req.body.credentials;


  if (credentials === undefined ||  credentials.username === undefined || credentials.username === '' || 
      credentials.password === undefined || credentials.password === '') {
    return res.status(422).json({ error: `Invalid credentials data` });

  } 

  try {

    const info = await db.session(credentials, 'qualityEmployee');
    return res.status(200).json(info);

  } catch(err){
    if(err === 'data error')
      res.status(401).json({error: 'wrong username and/or password'});

    res.status(500).end();
  }
  
});

app.post('/api/deliveryEmployeeSessions', async (req, res) => {

  if (Object.keys(req.body).length === 0) {
    return res.status(422).json({ error: `Empty body request` });
  }

  let credentials = req.body.credentials;


  if (credentials === undefined ||  credentials.username === undefined || credentials.username === '' || 
      credentials.password === undefined || credentials.password === '') {
    return res.status(422).json({ error: `Invalid credentials data` });

  } 

  try {

    const info = await db.session(credentials, 'deliveryEmployee');
    return res.status(200).json(info);

  } catch(err){
    if(err === 'data error')
      res.status(401).json({error: 'wrong username and/or password'});

    res.status(500).end();
  }
  
});

// PUT

app.put('/api/users/:username', async (req, res) => {

  if (Object.keys(req.body).length === 0) {
    return res.status(422).json({ error: `Empty body request` });
  } 

  const rights = req.body;

  if (rights === undefined || rights.oldType === undefined || rights.newType === undefined || 
      rights.oldType === '' || rights.newType === '') {

    return res.status(422).json({ error: `Invalid data` });

  } else if (rights.oldType === 'manager') {
    return res.status(422).json({ error: `validation of request body or of username failed or attempt to modify rights to administrator or manager` });
  }

  try{
    db.modifyUserRights(req.params.username, rights);
    res.status(200).end()
  }catch(err){
    if(err = 'not found')
      res.status(404).json({error: `wrong username or oldType fields or user doesn't exists`})
    else
      res.status(503).end()
  }
})



// DELETE

app.delete('/api/deleteTable', (req, res) => {
  try {
    db.dropTable();
    res.status(204).end();
  } catch (err) {
    res.status(500).end();
  }
});

app.delete('/api/users/:username/:type', async (req, res) => {
  const p = req.params;

  if (p === undefined || p.type === undefined || p.username === undefined || 
      p.type === '' || p.username === '') {

    return res.status(422).json({ error: `Invalid data` });

  } else if (p.type === 'manager') {
    return res.status(422).json({ error: `validation of username or of type failed or attempt to delete a manager/administrator` });
  }

  try{
    await db.checkUser(p, 'deleteUser');
    await db.deleteUser(p.username, p.type);
    res.status(204).end()
  }catch(err){
    if(err === 'not found')
      res.status(404).json({error: `wrong username or type fields or user doesn't exists`})
    else
      res.status(503).end()
  }
})



// <----------- CONTROL ORDER ----------->

// GET

app.get('/api/restockOrders', async (req, res) => {
  try {
    const restockOrders = await db2.getRestockOrders();
    res.status(200).json(restockOrders);
  } catch (err) {
    res.status(500).end();
  }
});

app.get('/api/restockOrdersIssued', async (req, res) => {
  try {
    const issued = await db2.getIssuedRestockOrders();
    res.status(200).json(issued);
  } catch (err) { 
    res.status(500).end();
  }
});

app.get('/api/restockOrders/:id', async (req, res) => {

  const id = req.params.id;

  try {
    const order = await db2.getRestockOrder(id);
    res.status(200).json(order);
  } catch (err) {
    if (err.error === 'no restock order associated to id') {
      res.status(404).json(error);
    }
    res.status(500).end();
  }
});

app.get('/api/restockOrders/:id/returnItems', async (req, res) => {

  const id = req.params.id;

  try {
    await db2.getRestockOrder(id);
    const skuItems = await db2.getSkuItemsByRestockOrder(id);
    console.log(skuItems);
    res.status(200).json(skuItems);
  } catch (err) {
    if (err.error === 'no restock order associated to id') {
      res.status(404).json(error);
    }
    res.status(500).end();
  }
});

// POST

app.post('/api/restockOrder', async (req,res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(422).json({ error: `Empty body request` });
  }
  let body = req.body;

  if (body === undefined || body.issueDate === undefined || body.products === undefined || body.supplierId === undefined) {
    console.log(body)
    return res.status(422).json({ error: `Invalid body data` });
  }

  try {
    await db2.newTableRestockOrder();
    db2.newRestockOrder(body);
    return res.status(201).end();
  } catch(err){
    console.log(err)
    res.status(500).end();
  }
});

// PUT

app.put('/api/restockOrder/:id', async (req,res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(422).json({ error: `Empty body request` });
  }
  let body = req.body;

  if (body === undefined || body.newState === undefined) {
    return res.status(422).json({ error: `Invalid body data` });
  }

  let id = req.params.id;

  if(id === undefined || id<=0){
    return res.status(422).json({ error: `Invalid params` });
  }

  try{
    db2.modifyRestockOrderState(id, body.newState);
    res.status(200).end()
  }catch(err){
    if(err = 'no restock order associated to id')
      res.status(404).json({error: `wrong id or order doesn't exist`})
    else
      res.status(503).end()
  }
});

app.put('/api/restockOrder/:id/skuItems', async (req,res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(422).json({ error: `Empty body request` });
  }
  let body = req.body;

  if (body === undefined || body.skuItems === undefined) {
    return res.status(422).json({ error: `Invalid body data` });
  }

  let id = req.params.id;

  if(id === undefined || id<=0){
    return res.status(422).json({ error: `Invalid params` });
  }

  try{
    db2.modifyRestockOrderSKUs(id, body.skuItems);
    res.status(200).end()
  }catch(err){
    console.log(err)
    if(err = 'no restock order associated to id')
      res.status(404).json({error: `wrong id or order doesn't exist`})
    else
      res.status(503).end()
  }
});

app.put('/api/restockOrder/:id/transportNote', async (req,res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(422).json({ error: `Empty body request` });
  }
  let body = req.body;

  if (body === undefined || body.transportNote === undefined) {
    return res.status(422).json({ error: `Invalid body data` });
  }

  let id = req.params.id;

  if(id === undefined || id<=0){
    return res.status(422).json({ error: `Invalid params` });
  }

  try{
    db2.modifyRestockOrderNote(id, body.transportNote);
    res.status(200).end()
  }catch(err){
    if(err = 'no restock order associated to id')
      res.status(404).json({error: `wrong id or order doesn't exist`})
    else
      res.status(503).end()
  }
});

app.delete('/api/restockOrder/:id', (req,res)=>{
  try {
    let id = req.params.id;
    if(id === undefined || id<=0){
      return res.status(422).json({ error: `Invalid params` });
    }

    db2.deleteRestockOrder(id);
    res.status(204).end()

  } catch (err) {
    if(err = 'no restock order associated to id')
    res.status(404).json({error: `wrong id or order doesn't exist`})
  else
    res.status(503).end()
  }
});

// <----------------- RETURN ORDERS ----------------->

// GET
app.get('/api/returnOrders', async (req, res) => {
  try {
    const restockOrders = await db2.getReturnOrders();
    res.status(200).json(restockOrders);
  } catch (err) {
    res.status(500).end();
  }
});

app.get('/api/returnOrders/:id', async (req, res) => {

  const id = req.params.id;

  try {
    const order = await db2.getReturnOrder(id);
    res.status(200).json(order);
  } catch (err) {
    if (err.error === 'no return order associated to id') {
      res.status(404).json(error);
    }
    res.status(500).end();
  }
});

// POST

app.post('/api/returnOrder', async (req,res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(422).json({ error: `Empty body request` });
  }
  let body = req.body;

  if (body === undefined || body.returnDate === undefined || body.products === undefined || body.restockOrderId === undefined) {
    //console.log(body)
    return res.status(422).json({ error: `Invalid body data` });
  }

  try {
    await db2.newTableReturnOrder();
    db2.newReturnOrder(body);
    return res.status(201).end();
  } catch(err){
    console.log(err)
    res.status(500).end();
  }
});

// DELETE

app.delete('/api/returnOrder/:id', (req,res)=>{
  try {
    let id = req.params.id;
    if(id === undefined || id<=0){
      return res.status(422).json({ error: `Invalid params` });
    }
    db2.deleteReturnOrder(id);
    res.status(204).end()
  } catch (err) {
    if(err = 'no return order associated to id')
    res.status(404).json({error: `wrong id or order doesn't exist`})
  else
    res.status(503).end()
  }
});

//<----------------- INTERNAL ORDER ----------------------->

// GET

app.get('/api/internalOrders', async (req, res) => {
  try {
    const restockOrders = await db2.getInternalOrders();
    res.status(200).json(restockOrders);
  } catch (err) {
    res.status(500).end();
  }
});

app.get('/api/internalOrdersIssued', async (req, res) => {
  try {
    const restockOrders = await db2.getInternalOrdersIssued();
    res.status(200).json(restockOrders);
  } catch (err) {
    res.status(500).end();
  }
});

app.get('/api/internalOrdersAccepted', async (req, res) => {
  try {
    const restockOrders = await db2.getInternalOrdersAccepted();
    res.status(200).json(restockOrders);
  } catch (err) {
    res.status(500).end();
  }
});

app.get('/api/internalOrders/:id', async (req, res) => {

  const id = req.params.id;

  try {
    const order = await db2.getInternalOrder(id);
    res.status(200).json(order);
  } catch (err) {
    if (err.error === 'no internal order associated to id') {
      res.status(404).json(error);
    }
    res.status(500).end();
  }
});

// POST

app.post('/api/internalOrders', async (req,res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(422).json({ error: `Empty body request` });
  }
  let body = req.body;

  if (body === undefined || body.issueDate === undefined || body.products === undefined || body.customerId === undefined) {
    console.log(body)
    return res.status(422).json({ error: `Invalid body data` });
  }

  try {
    await db2.newTableInternalOrder();
    await db2.newInternalOrder(body);
    return res.status(201).end();
  } catch(err){
    console.log(err)
    res.status(500).end();
  }
});

// PUT 

app.put('/api/internalOrders/:id', async (req,res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(422).json({ error: `Empty body request` });
  }
  let body = req.body;

  if (body === undefined || body.newState === undefined) {
    return res.status(422).json({ error: `Invalid body data` });
  }
  console.log(body);
  let id = req.params.id;

  if(id === undefined || id<=0){
    return res.status(422).json({ error: `Invalid params` });
  }

  try{
    let products = []
    if(body.products!==undefined){
      products = body.products
    }
    db2.modifyInternalOrder(id, body.newState, products);
    res.status(200).end()
  }catch(err){
    if(err == 'no internal order associated to id')
      res.status(404).json({error: `wrong id or order doesn't exist`})
    else
      res.status(503).end()
  }
});

// DELETE

app.delete('/api/internalOrders/:id', (req,res)=>{
  try {
    let id = req.params.id;
    if(id === undefined || id<=0){
      return res.status(422).json({ error: `Invalid params` });
    }

    db2.deleteInternalOrder(id);
    res.status(204).end()

  } catch (err) {
    if(err = 'no internal order associated to id')
    res.status(404).json({error: `wrong id or order doesn't exist`})
  else
    res.status(503).end()
  }
});

// <----------- CONTROL TEST descriptor ----------->
// TODO manage permissions (managaer...) (401 Unauthorized)
// check idsku exists
// /api/skuitems/testResult why pass a rfid??
// sku link to testdescriptors TODO GET

app.get('/api/testDescriptors', async (req, res) => {
  try {
    const testDescriptorsList = await db3.getTestDescriptors();
    res.status(200).json(testDescriptorsList);
  } catch (err) {
    res.status(500).end();
  }
});

app.get('/api/testDescriptors/:id', async (req, res) => {

  if (!Number.isInteger(parseInt(req.params.id)))
    res.status(422).json({error : "id is not a number"}).end();

  try {
    const testDescriptor = await db3.getTestDescriptorById(req.params.id);
    res.status(200).json(testDescriptor);
  } catch (err) {
    if (err == "not found")
      res.status(404).json(err).end();
    else
    res.status(500).end();
  }
});

app.post('/api/testDescriptor', async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(422).json({ error: `Empty body request` });
  }
  let testDescriptor = req.body;
  
  if (testDescriptor === undefined || testDescriptor.name === undefined || testDescriptor.procedureDescription === undefined || testDescriptor.idSKU === undefined ||
    testDescriptor.name == '' || testDescriptor.procedureDescription == '' || testDescriptor.idSKU === '') {
    return res.status(422).json({ error: `Invalid testDescriptor data` });
  }

  try {
    await db3.newTableTestDescriptor();
    // is check name id_sku combo good??
    // await db3.checkTestDescriptor(testDescriptor, 'newTest');
  } catch (err) {
    return res.status(409).json({ error: `test with same name and id_sku already exists` });
  }

  // check also that id_sku exist!!!

  try {
    db3.createTestDescriptor(testDescriptor);
    return res.status(201).end();

  } catch(err){
    res.status(500).end();
  }
  
});

app.put('/api/testDescriptor/:id', async (req, res) => {

  if (Object.keys(req.body).length === 0) {
    return res.status(422).json({ error: `Empty body request` });
  } 

  if (!Number.isInteger(parseInt(req.params.id)))
  res.status(422).json({error : "id is not a number"}).end();

  const newTestDescriptor = req.body;

  if (newTestDescriptor === undefined || newTestDescriptor.newName === undefined || newTestDescriptor.newProcedureDescription === undefined || newTestDescriptor.newIdSKU === undefined || 
    newTestDescriptor.newName === '' || newTestDescriptor.newProcedureDescription === '' || newTestDescriptor.newIdSKU === '') {

    return res.status(422).json({ error: `Invalid data` });
  } 

  try{
    await db3.modifyTestDescriptor(req.params.id, newTestDescriptor);
    res.status(200).end()
  }catch(err){
    if(err = 'not found')
      //check also issku exist
      res.status(404).json({error: `wrong id`})
    else
      res.status(503).end()
  }
})

app.delete('/api/testDescriptor/:id', async (req, res) => {
  
  if (!Number.isInteger(parseInt(req.params.id)))
  res.status(422).json({error : "id is not a number"}).end();

  try{
    await db3.deleteTestDescriptor(req.params.id);
    res.status(204).end();
  }catch(err){
    if(err == "not found")
      res.status(422).json({error: "id not found"}).end();
    else
      res.status(503).end();
  }
})

// <----------- CONTROL TEST result ----------->

app.get('/api/skuitems/:rfid/testResults', async (req, res) => {
  if (!Number.isInteger(parseInt(req.params.rfid)))
  res.status(422).json({error : "rfid is not a number"}).end();

  try {
    const testResultsList = await db3.getTestResults(req.params.rfid);
    res.status(200).json(testResultsList);
  } catch (err) {
    if (err == "not found")
      res.status(404).json({error: "no test result with this sku"}).end();
    res.status(500).end();
  }
});

app.get('/api/skuitems/:rfid/testResults/:id', async (req, res) => {
  if (!Number.isInteger(parseInt(req.params.rfid)))
  res.status(422).json({error : "rfid is not a number"}).end();

  if (!Number.isInteger(parseInt(req.params.id)))
  res.status(422).json({error : "id is not a number"}).end();

  try {
    const testResult = await db3.getTestResultById(req.params.rfid, req.params.id);
    res.status(200).json(testResult);
  } catch (err) {
    if (err == "not found")
      res.status(404).json({error: "no test result with this sku or id"}).end();
    res.status(500).end();
  }
});

app.post('/api/skuitems/testResult', async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(422).json({ error: `Empty body request` });
  }
  let testResult = req.body;
  
  if (testResult === undefined || testResult.idTestDescriptor === undefined || testResult.Date === undefined || testResult.Result === undefined ||
    testResult.idTestDescriptor == '' || testResult.Date == '' || testResult.Result === '') {
    return res.status(422).json({ error: `Invalid testDescriptor data` });
  }

  try {
    await db3.newTableTestResults();
    // is check name id_sku combo good??
    await db3.checkTestResult(testResult, 'newTest');
  } catch (err) {
    return res.status(409).json({ error: `test with same name and id_sku already exists` });
  }

  // check also that id_sku exist!!!

  try {
    await db3.createTestResult(testResult);
    return res.status(201).end();
  } catch(err){
    res.status(500).end();
  }
  
});

app.put('/api/skuitems/:rfid/testResult/:id', async (req, res) => {
  if (!Number.isInteger(parseInt(req.params.rfid)))
  res.status(422).json({error : "rfid is not a number"}).end();

  if (!Number.isInteger(parseInt(req.params.id)))
  res.status(422).json({error : "id is not a number"}).end();

  if (Object.keys(req.body).length === 0) {
    return res.status(422).json({ error: `Empty body request` });
  }
  let testResult = req.body;
  
  if (testResult === undefined || testResult.newIdTestDescriptor === undefined || testResult.newDate === undefined || testResult.newResult === undefined ||
    testResult.newIdTestDescriptor == '' || testResult.newDate == '' || testResult.newResult === '') {
    return res.status(422).json({ error: `Invalid testResult data` });
  }

  // check also that id_sku exist!!!

  try{
    await db3.modifyTestResult(req.params.rfid, req.params.id, testResult);
    res.status(200).end()
  }catch(err){
    if(err = 'not found')
      //check also issku exist
      res.status(404).json({error: `wrong id or rfid`})
    else
      res.status(503).end()
  }
});

app.delete('/api/skuitems/:rfid/testResult/:id', async (req, res) => {
  if (!Number.isInteger(parseInt(req.params.rfid)))
  res.status(422).json({error : "rfid is not a number"}).end();
  
  if (!Number.isInteger(parseInt(req.params.id)))
  res.status(422).json({error : "id is not a number"}).end();

  try{
    await db3.deleteTestResult(req.params.rfid, req.params.id);
    res.status(204).end();
  }catch(err){
    if(err == "not found")
      res.status(422).json({error: "rfid or id not found"}).end();
    else
      res.status(503).end();
  }
})

// <----------- CONTROL SKU prime 6 ----------->

app.get('/api/skus', async (req, res) => {
  try {
    const skus = await db1.getSkus();
    res.status(200).json(skus);
  } catch (err) {
    console.log(err);
    res.status(500).end();
  }
})

app.get('/api/skus/:id', async (req, res) => {

  if (!Number.isInteger(parseInt(req.params.id)))
    res.status(422).json({error : "id is not a number"}).end();

  try {
    const skus = await db1.getSkuById(req.params.id);
    res.status(200).json(skus);
  } catch (err) {
    if (err == "not found")
      res.status(404).json(err).end();
    else
    res.status(500).end();
  }
});

app.get('/api/skuitems', async (req, res) => {                 
  try {
    const SKUItemsList = await db1.getSKUItems();
    res.status(200).json(SKUItemsList);
  } catch (err) {
    res.status(500).end();
  }
});

app.get('/api/positions', async (req, res) => {               
  try {
    const PositionsList = await db1.getPositions();
    res.status(200).json(PositionsList);
  } catch (err) {
    res.status(500).end();
  }
});

app.get('/api/items', async (req, res) => {               
  try {
    const ItemList = await db1.getItems();
    res.status(200).json(ItemList);
  } catch (err) {
    res.status(500).end();
  }
});

app.get('/api/skuitems/sku/:id', async (req, res) => {         
  if (id === undefined || id === '') {
    return res.status(422).json({ error: `Invalid SKUId` });    // non da invalid SKUId ma not found
  }

  try {
    const skuitems = await db1.getSKUItemsAvailable(id);
    res.status(200).json(skuitems);
    }catch(err){
      if(err = 'not found')
        res.status(404).json({error: `no SKU available associated to id`})
      else
        res.status(503).end()
    }
});

app.get('/api/skuitems/:rfid', async (req, res) => {      
  let rfid = req.params.rfid;
  if (rfid === undefined || rfid === '') {
    return res.status(422).json({ error: `Invalid RFID` });    // non da invalid SKUId ma not found
  }

  try {
    const skuitem = await db1.getSKUItem(rfid);
    res.status(200).json(skuitem);
    }catch(err){
      if(err = 'not found')
        res.status(404).json({error: `no SKUItem associated to RFID`})
      else
        res.status(503).end()
    }
});

app.get('/api/items/:id', async (req, res) => {          
  let id = parseInt(req.params.id);           // mi da gli item nonostante inserisca l'id

  if (id === undefined || id === '' || id === NaN) {
    return res.status(422).json({ error: `Invalid ID` });    // non da invalid ma not found
  }

  try {
    const item = await db1.getItem(id);
    res.status(200).json(item);
    }catch(err){
      if(err = 'not found')
        res.status(404).json({error: `no item associated to ID`})
      else
        res.status(503).end()
    }
});

//POST

app.post('/api/sku', async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(422).json({ error: `Empty body request` });
  }
  let sku = req.body;
  
  if (sku === undefined || sku.description === undefined || sku.weight === undefined || sku.volume === undefined || sku.notes === undefined || sku.price === undefined || sku.availableQuantity === undefined ||
    sku.description == '' || sku.weight == '' || sku.volume === '' || sku.notes == '' || sku.price == '' || sku.availableQuantity === '') {
    return res.status(422).json({ error: `Invalid sku data` });
  }

  try {
    await db1.newTableSku();
    await db1.createSku(sku);
    return res.status(201).end();
  } catch(err){
    console.log(err);
    res.status(500).end();
  }
  
});

app.post('/api/skuitem', async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(422).json({ error: `Empty body request` });
  }
  let SKUItem = req.body;

  if (SKUItem === undefined || SKUItem.RFID === undefined || SKUItem.SKUId === undefined || SKUItem.DateOfStock === undefined ||
    SKUItem.RIFD === '' || SKUItem.SKUId === '' || SKUItem.DateOfStock === '') {
    return res.status(422).json({ error: `Invalid SKUItem data` });  

  }
  try {
    await db1.newTableSKUItem();
    db1.createSKUItem(SKUItem);
    return res.status(201).end();

  } catch(err){
    res.status(503).end();
  }
});

app.post('/api/position', async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(422).json({ error: `Empty body request` });
  }
  let position = req.body;

  if (position === undefined || position.positionID === undefined || position.aisleID === undefined || position.row === undefined || position.col === undefined || position.maxWeight === undefined ||
    position.maxVolume === undefined || position.positionID === '' || position.aisleID === '' || position.row === '' || position.col === '' || position.maxWeight === '' || position.maxVolume === '') {
    return res.status(422).json({ error: `Invalid position data` });  

  }
  try {
    await db1.newTablePosition();
    db1.createPosition(position);
    return res.status(201).end();

  } catch(err){
    res.status(503).end();
  }
});

app.post('/api/item', async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(422).json({ error: `Empty body request` });
  }
  let Item = req.body;

  if (Item === undefined || Item.id === undefined || Item.description === undefined || Item.price === undefined ||
    Item.SKUId === undefined || Item.supplierId === undefined || Item.id === '' || Item.description === '' || Item.price === ''||
    Item.SKUId === '' || Item.supplierId === '') {
    return res.status(422).json({ error: `Invalid Item data` });  

  }
  try {
    await db1.newTableItem();
    db1.createItem(Item);
    return res.status(201).end();

  } catch(err){
    res.status(503).end();
  }
});

app.put('/api/sku/:id', async (req, res) => {
  if (!Number.isInteger(parseInt(req.params.id)))
    res.status(422).json({error : "id is not a number"}).end();

  if (Object.keys(req.body).length === 0) {
    return res.status(422).json({ error: `Empty body request` });
  }
  let sku = req.body;
  
  if (sku === undefined || sku.newDescription === undefined || sku.newWeight === undefined || sku.newVolume === undefined || sku.newNotes === undefined || sku.newPrice === undefined || sku.newAvailableQuantity === undefined ||
    sku.newDescription == '' || sku.newWeight == '' || sku.newVolume === '' || sku.newNotes == '' || sku.newPrice == '' || sku.newAvailableQuantity === '') {
    return res.status(422).json({ error: `Invalid sku data` });
  }

  try{
    await db1.modifySku(req.params.id, sku);
    //modify position occupied fileds
    res.status(200).end()
  }catch(err){
    if(err = 'not found')
      res.status(404).json({error: `wrong id`})
    else
      res.status(503).end()
  }
});

app.put('/api/sku/:id/position', async (req, res) => {
  if (!Number.isInteger(parseInt(req.params.id)))
  res.status(422).json({error : "id is not a number"}).end();

  if (Object.keys(req.body).length === 0) {
    return res.status(422).json({ error: `Empty body request` });
  }

  let position = req.body;
  
  if (position === undefined || position.position === undefined || position.position == '' ) {
    return res.status(422).json({ error: `Invalid position data` });
  }

  try{
    await db1.modifySkuPositon(req.params.id, position);
    //modify position occupied fileds
    res.status(200).end()
  }catch(err){
    if(err = 'not found')
      res.status(404).json({error: `wrong id`})
    else
      res.status(503).end()
  }
});

app.put('/api/skuitems/:rfid', async (req, res) => {

  if (Object.keys(req.body).length === 0) {
    return res.status(422).json({ error: `Empty body request` });
  } 

  const data = req.body;

  if (data === undefined || data.newRFID === undefined || data.newAvailable === undefined || data.newDateOfStock === undefined ||
    req.params.rfid === undefined || data.newRFID === '' || data.newAvailable === '' || data.newDateOfStock === '' || req.params.rfid === '') 
    return res.status(422).json({ error: `Invalid data` });

  try{
    await db1.modifySKUItem(req.params.rfid, data);
    res.status(200).end()
  }catch(err){
    if(err = 'not found')
      res.status(404).json({error: `no SKU Item associated to rfid`})
    else
      res.status(503).end()
  }
})

app.put('/api/position/:positionID', async (req, res) => {

  if (Object.keys(req.body).length === 0) {
    return res.status(422).json({ error: `Empty body request` });
  } 

  const data = req.body;
  if (data === undefined || data.newAisleID === undefined || data.newRow === undefined || data.newCol === undefined ||  data.newMaxWeight === undefined ||
    data.newMaxVolume === undefined || data.newOccupiedWeight === undefined || data.newOccupiedVolume === undefined || req.params.positionID === undefined || 
    data.newAisleID === '' || data.newRow === '' || data.newCol === '' || data.newMaxWeight === '' || data.newMaxVolume === '' || data.newOccupiedWeight === '' || 
    data.newOccupiedVolume === '' || req.params.positionID === '') 
    return res.status(422).json({ error: `Invalid data` });  

  try{
    await db1.modifyPosition(req.params.positionID, data);
    res.status(200).end()
  }catch(err){
    if(err = 'not found')
      res.status(404).json({error: `no position associated to positionID`})
    else
      res.status(503).end()
  }
})

app.put('/api/position/:positionID/changeID', async (req, res) => {

  if (Object.keys(req.body).length === 0) {
    return res.status(422).json({ error: `Empty body request` });
  } 

  const newPositionID = req.body.newPositionID;

  if (newPositionID === undefined || req.params.positionID === undefined || 
    newPositionID === '' ||  req.params.positionID === '') 
    return res.status(422).json({ error: `Invalid data` });   

  try{
    await db1.modifyPositionID(req.params.positionID, newPositionID);
    res.status(200).end()
  }catch(err){
    if(err = 'not found')
      res.status(404).json({error: `no position associated to positionID`})
    else
      res.status(503).end()
  }
})

app.put('/api/item/:id', async (req, res) => {

  if (Object.keys(req.body).length === 0) {
    return res.status(422).json({ error: `Empty body request` });
  } 

  const data = req.body;
  
  if (data === undefined || data.newDescription === undefined || data.newPrice === undefined || req.params.id === undefined || 
    data.newDescription === '' || data.newPrice === '' || req.params.id === '') 
    return res.status(422).json({ error: `Invalid data` });  

  try{
    await db1.modifyItem(req.params.id, data);
    res.status(200).end()
  }catch(err){
    if(err = 'not found')
      res.status(404).json({error: `no Item associated to id`})
    else
      res.status(503).end()
  }
})

app.delete('/api/skus/:id', async (req, res) => {
  
  if (!Number.isInteger(parseInt(req.params.id)))
  res.status(422).json({error : "id is not a number"}).end();

  try{
    await db1.deleteSku(req.params.id);
    res.status(204).end();
  }catch(err){
    if(err == "not found")
      res.status(422).json({error: "id not found"}).end();
    else
      res.status(503).end();
  }
})

app.delete('/api/deleteSKUItemTable', (req, res) => {
  try {
    db1.dropSKUItemTable();
    res.status(204).end();
  } catch (err) {
    res.status(500).end();
  }
})

app.delete('/api/deletePositionTable', (req, res) => {
  try {
    db1.dropPositionTable();
    res.status(204).end();
  } catch (err) {
    res.status(500).end();
  }
})

app.delete('/api/deleteItemTable', (req, res) => {
  try {
    db1.dropItemTable();
    res.status(204).end();
  } catch (err) {
    res.status(500).end();
  }
})

app.delete('/api/skuitems/:rfid', async (req, res) => {
  const rfid = req.params.rfid;
  if (rfid === undefined || rfid === '' ) 
    return res.status(422).json({ error: `Invalid data` });

  try{
    await db1.deleteSKUItem(rfid);
    res.status(204).end()
  }catch(err){                                 
      res.status(503).end()
  }
 })

 app.delete('/api/position/:positionID', async (req, res) => {
  const positionID = req.params.positionID;
  if (positionID === undefined || positionID === '' ) 
    return res.status(422).json({ error: `Invalid data` });

  try{
    await db1.deletePosition(positionID);
    res.status(204).end()
  }catch(err){                                 
      res.status(503).end()
  }
 })

 app.delete('/api/items/:id', async (req, res) => {
  const id = req.params.id;
  if (id === undefined || id === '' ) 
    return res.status(422).json({ error: `Invalid data` });

  try{
    await db1.deleteItem(id);
    res.status(204).end()
  }catch(err){                                 
      res.status(503).end()
  }
 })




// <------------------ ITEM ------------------->

// GET

// activate the server

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;