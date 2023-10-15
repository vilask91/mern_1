var express = require('express');
const cors = require('cors');
var dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.json()); // todo test later
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(process.env.DB_URL, {
 useNewUrlParser: true,
 useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB...');
    let port = process.env.PORT;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    }).on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`Port ${port} is already in use.`);
        } else if (err.code === 'EACCES') {
            console.log(`Port ${port} requires elevated privileges.`);
        } else {
            console.log(err);
        }
    });
})
.catch((error) => console.error('Could not connect to MongoDB...', error));




app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
