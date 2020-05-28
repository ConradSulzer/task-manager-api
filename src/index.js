const express = require('express');
require('./db/mongoose')
const userRouter = require('./routers/users.router');
const taskRouter = require('./routers/tasks.router');

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
});