var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}


var indexRouter = require('./routes/index');

var app = express();

app.use(cors(corsOptions)) // Use this after the variable declaration

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/', indexRouter);

app.use('/images', express.static(path.join(__dirname + '/images')))

app.listen(5000)

app.use((req,res,next)=>{
    const exception = new Error('Not found')
    exception.statusCode = 404
    next(exception)
})

app.use((err,req,res,next)=>{
    res.status(err.statusCode).send(err.message)
})



module.exports = app;
