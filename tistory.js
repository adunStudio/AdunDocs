'use strict';

var bodyParser = require('body-parser');
var secret = require('./secret.js');
var request = require('request');
var MetaWeblog = require('./metaweblog');


var tistoryURL = "http://{0}.tistory.com/api";

module.exports = function(app) {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(require('cookie-parser')(secret.cookieSecret));
    app.use(require('express-session')({
        resave: false,
        saveUninitialized: true,
        secret: secret.cookieSecret
    }));

    // 로그인
    app.post('/tistory/login', function(req, res) {

        var tistoryNAME = req.body.tistoryNAME;
        var tistoryADDR = req.body.tistoryADDR;
        var tistoryID   = req.body.tistoryID;
        var tistoryKEY  = req.body.tistoryKEY;

        if( tistoryNAME && tistoryADDR && tistoryID && tistoryKEY )
        {
            var metaWeblog = new MetaWeblog(tistoryADDR);
            metaWeblog.getUsersBlogs(tistoryID, tistoryNAME, tistoryKEY, function(blogInfo) {

                req.session.tistoryADDR = tistoryADDR;
                req.session.tistoryID   = tistoryID;
                req.session.tistoryNAME = tistoryNAME;
                req.session.tistoryKEY  = tistoryKEY;

                res.send(JSON.stringify({result: true, data: blogInfo[0]}));
            }, function(err) {
                res.send(JSON.stringify({result: false, msg: '로그인 실패'}));
            });

        }
        else
        {
            res.send(JSON.stringify({result: false, msg: '파라미터 값이 부족합니다.'}));
        }
    });

    // 카테고리
    app.get('/tistory/category', function(req, res) {

        var tistoryNAME = req.session.tistoryNAME;
        var tistoryADDR = req.session.tistoryADDR;
        var tistoryID   = req.session.tistoryID;
        var tistoryKEY  = req.session.tistoryKEY;

        if( tistoryNAME && tistoryADDR && tistoryID && tistoryKEY )
        {
            var metaWeblog = new MetaWeblog(tistoryADDR);
            metaWeblog.getCategories(tistoryID, tistoryNAME, tistoryKEY, function(blogCategory) {
                res.send(JSON.stringify({result: true, data: blogCategory}));
            }, function(err) {
                res.send(JSON.stringify({result: false, msg: '카테고리 로드 실패'}));
            });
        }
        else
        {
            res.send(JSON.stringify({result: false, msg: '로그인을 해주시기 바랍니다.'}));
        }
    });

    // 최신글(= 전체글)
    app.get('/tistory/recentposts', function(req, res) {
        var tistoryNAME = req.session.tistoryNAME;
        var tistoryADDR = req.session.tistoryADDR;
        var tistoryID   = req.session.tistoryID;
        var tistoryKEY  = req.session.tistoryKEY;

        if( tistoryNAME && tistoryADDR && tistoryID && tistoryKEY )
        {
            var metaWeblog = new MetaWeblog(tistoryADDR);
            metaWeblog.getRecentPosts(tistoryID, tistoryNAME, tistoryKEY, 100, function(blogCategory) {
                res.send(JSON.stringify({result: true, data: blogCategory}));
            }, function(err) {
                res.send(JSON.stringify({result: false, msg: '최신글 로드 실패'}));
            });
        }
        else
        {
            res.send(JSON.stringify({result: false, msg: '로그인을 해주시기 바랍니다.'}));
        }
    });

    // 글 읽기
    app.get('/tistory/post/:postID', function(req, res) {
        var tistoryNAME = req.session.tistoryNAME;
        var tistoryADDR = req.session.tistoryADDR;
        var tistoryID   = req.session.tistoryID;
        var tistoryKEY  = req.session.tistoryKEY;
        var postID      = req.params.postID;

        if( tistoryNAME && tistoryADDR && tistoryID && tistoryKEY && postID )
        {
            var metaWeblog = new MetaWeblog(tistoryADDR);
            metaWeblog.getPost(postID, tistoryNAME, tistoryKEY, function(post) {
                res.send(JSON.stringify({result: true, data: post}));
            }, function(err) {
                res.send(JSON.stringify({result: false, msg: '최신글 로드 실패'}));
            });
        }
        else
        {
            res.send(JSON.stringify({result: false, msg: '로그인을 해주시기 바랍니다.'}));
        }
    });

};


String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
        var str =  arguments[i] || '';
        formatted = formatted.replace(regexp, str);
    }
    return formatted;
};

