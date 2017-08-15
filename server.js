/**
 * Created by quanquan.sun on 2017/8/14.
 */
var express = require('express');
var path = require('path');
var ejs = require('ejs');
var bodyParser = require('body-parser');
var app = express();

var upload = require('./routes/upload');

app.set('views', __dirname + '/views');
app.engine('.html', ejs.__express);
app.set('view engine', 'html');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/upload',upload);

app.listen(3005,function(){
    console.log('port 3005 is running!');
});