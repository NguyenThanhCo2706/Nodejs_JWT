const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
dotenv.config()
const app = express();

mongoose.connect('mongodb://localhost:27017/mydb2', () => {
    console.log("conected")
})

app.use(cors());
app.use(cookieParser());
app.use(express.json())

app.use('/auth', authRoute)
app.use('/user', userRoute)

app.listen(8000, () => {
    console.log("Server is runing")
})
