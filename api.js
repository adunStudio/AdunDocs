'use strict';

var fs = require('fs');
var path = require('path');
var fsFileTree = require("fs-file-tree");

const ARTICLE_PATH = path.normalize(__dirname + '/article');
const ARTICLE_JSON = path.normalize(__dirname + '/public/article.json');
const RESULT_TRUE = {result: true};
const RESULT_FALSE = {result: false};

module.exports = function(app) {

    /*----------------------------------------------------------------------------------------------------------------*/
    // CREATE
    app.post('/article/:dir/:sub/:file', function() {

    });
    /*----------------------------------------------------------------------------------------------------------------*/


    /*----------------------------------------------------------------------------------------------------------------*/
    // READ
    app.get('/article/:dir/:sub/:file', function(req, res) {
        var path = makeFilePath(req.params.dir, req.params.sub, req.params.file);

        fs.stat(path, function(err, stats) {
            if( err )
            {
                res.status(404);
                res.send(RESULT_TRUE);
                return;
            }
            if( stats.isFile() )
            {
                res.sendfile(path);
            }
        });
    });
    /*----------------------------------------------------------------------------------------------------------------*/



    /*----------------------------------------------------------------------------------------------------------------*/
    // UPDATE
    app.put('/article/:dir/:sub/:file', function() {
        var path = makeFilePath(req.params.dir, req.params.sub, req.params.file);

    });
    /*----------------------------------------------------------------------------------------------------------------*/



    /*----------------------------------------------------------------------------------------------------------------*/
    // DELETE
    app.delete('/article/:dir/:sub/:file', function() {
        var path = makeFilePath(req.params.dir, req.params.sub, req.params.file);

    });
    /*----------------------------------------------------------------------------------------------------------------*/

    app.get('/article/list', function(req, res) {
        var file = __dirname + '/public/article.json';
        fs.readFile(file, 'utf8', function(error, fd){
            if(error) {
                res.send(RESULT_FALSE);
                return;
            }
            res.send(fd);
        });
    });

    app.get('/article/renew', function(req, res) {
        fsFileTree(ARTICLE_PATH, function(err, tree) {
            fs.open(ARTICLE_JSON, 'w', function(err, fd) {
                if(err) {
                    res.send(RESULT_FALSE);
                }
                fs.writeFile(ARTICLE_JSON, JSON.stringify(tree), 'utf8', function(error){
                    res.send(RESULT_TRUE);
                });
            });
        });
    });
};


function makeFilePath(dir, sub, file) {
    return ARTICLE_PATH + '/' + dir + '/' + sub + '/' + file;
}

