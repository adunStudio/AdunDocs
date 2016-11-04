'use strict';

var express = require('express');

var app = express();

var handlebars = require('express-handlebars').create({
    layoutsDir: __dirname + 'public/'
});

app.set('views', __dirname + '/public/');
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 7711);

// API
require("./api")(app);

// TISTORY
require("./tistory")(app);

app.get('/', function(req, res) {

    res.render('index');
});

// PUBLIC
app.use(express.static('./public'));

// 404 PAGE
app.use(function(req, res) {
    console.log(404);
    console.log(req.originalUrl);
    res.status(404);
    res.send('404');
});

app.listen(app.get('port'), function() {
    console.log('express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
