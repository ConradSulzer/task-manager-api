const express = require('express');
require('./db/mongoose')
const userRouter = require('./routers/users.router');
const taskRouter = require('./routers/tasks.router');

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

module.exports = app