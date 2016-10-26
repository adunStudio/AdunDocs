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
    console.log(404);
    console.log(req.originalUrl);
    res.status(404);
    res.send('404');
});

app.listen(app.get('port'), function() {
    console.log('express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
