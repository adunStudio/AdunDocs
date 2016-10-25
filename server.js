'use strict';

var express = require('express');

var app = express();

app.set('view engine', 'html');
app.set('port', 3311);

// API
require("./api")(app);

// PUBLIC
app.use(express.static('./public'));

// 404 PAGE
app.use(function(req, res) {
    res.status(404);
    //res.render('404');
});

app.listen(app.get('port'), function() {
    console.log('express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
