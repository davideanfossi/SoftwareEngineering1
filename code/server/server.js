 'use strict';

const express = require('express');
const usersRouter = require('./routers/userRouter');
const testRouter = require('./routers/testRouter');
const orderRouter = require('./routers/orderRouter');
const skuRouter = require('./routers/skuRouter');

const app = express();


app.use(express.json());
app.use('/api', usersRouter);
app.use('/api', testRouter);
app.use('/api', orderRouter);
app.use('/api', skuRouter);

const port = 3001;
module.exports = app; 

// activate the server

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app; 