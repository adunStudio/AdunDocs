'use strict';

var express = require('express');

var handlebars = require('express3-handlebars').create({
    defaultLayout: 'main'
});
var app = express();
app.set('port', 3311);

// API
require("./api")(app);

// PUBLIC
app.use(express.static(__dirname + '/public'));

// 404 PAGE
app.use(function(req, res) {
    res.status(404);
    res.render('404');
});

app.listen(app.get('port'), function() {
    console.log('express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
