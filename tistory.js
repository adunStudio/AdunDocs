'use strict';

var bodyParser = require('body-parser');
var secret = require('./secret.js');
var request = require('request');
var MetaWeblog = require('./metaweblog');
var formidable = require('formidable');
var fs = require('fs');


module.exports = function(app) {

    app.use(bodyParser.json({limit: '50mb'}));
    app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
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
    /*app.post("/tistory/!*", function (req, res, next) {
        var tistoryNAME = req.session.tistoryNAME;
        var tistoryADDR = req.session.tistoryADDR;
        var tistoryID   = req.session.tistoryID;
        var tistoryKEY  = req.session.tistoryKEY;

        if(tistoryNAME && tistoryADDR && tistoryID && tistoryKEY) {
            next();
        } else {
            res.send(JSON.stringify({result: false, msg: '로그인을 해주시기 바랍니다.'}));
        }
    });*/

    // 카테고리
    app.post('/tistory/category', function(req, res) {

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
    app.post('/tistory/recentposts', function(req, res) {
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
    app.post('/tistory/post/:postID', function(req, res) {
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

    // 글 수정
    app.post('/tistory/edit', function(req, res) {
        var tistoryNAME = req.session.tistoryNAME;
        var tistoryADDR = req.session.tistoryADDR;
        var tistoryID   = req.session.tistoryID;
        var tistoryKEY  = req.session.tistoryKEY;
        var postID      = req.body.postid;
        var contents    = req.body.contents;
        var dirCategory = req.body.dirCategory;
        var subCategory = req.body.subCategory;
        var title       = req.body.title;


        if( tistoryNAME && tistoryADDR && tistoryID && tistoryKEY && postID && contents && dirCategory && subCategory && title )
        {
            var metaWeblog = new MetaWeblog(tistoryADDR);

            var categories;

            if(dirCategory == '분류없음' && subCategory == '분류없음') {
                categories = [undefined];
            } else if (subCategory == '분류없음') {
                categories = [dirCategory];
            } else {
                categories = [dirCategory + "/" + subCategory];
            }
            var post =  {
                title: title,
                categories: categories,
                description: contents
            };


            metaWeblog.editPost(postID, tistoryNAME, tistoryKEY, post, true, function(result) {
                if( result ) {
                    return res.send(JSON.stringify({result: true, data: result}));
                } else {
                    return res.send(JSON.stringify({result: false, data: result}));
                }
            }, function(err) {
                res.send(JSON.stringify({result: false, msg: '최신글 로드 실패'}));
            });
        }
        else
        {
            res.send(JSON.stringify({result: false, msg: '파라미터가 부족하거나 로그인을 해주시기 바랍니다.'}));
        }
    });

    // 글 제목 수정
    app.post('/tistory/rename', function(req, res) {
        var tistoryNAME = req.session.tistoryNAME;
        var tistoryADDR = req.session.tistoryADDR;
        var tistoryID   = req.session.tistoryID;
        var tistoryKEY  = req.session.tistoryKEY;
        var postID      = req.body.postid;
        var newTitle       = req.body.title;

        if( tistoryNAME && tistoryADDR && tistoryID && tistoryKEY && postID && newTitle )
        {
            var metaWeblog = new MetaWeblog(tistoryADDR);
            metaWeblog.getPost(postID, tistoryNAME, tistoryKEY, function(post) {
                var description = post.description;
                var categories = post.categories[0];

                var post =  {
                    title: newTitle,
                    categories: categories,
                    description: description
                };

                metaWeblog.editPost(postID, tistoryNAME, tistoryKEY, post, true, function(result) {
                    if( result ) {
                        return res.send(JSON.stringify({result: true, data: result}));
                    } else {
                        return res.send(JSON.stringify({result: false, data: result}));
                    }
                }, function(err) {
                    res.send(JSON.stringify({result: false, msg: err}));
                });

            }, function(err) {
                res.send(JSON.stringify({result: false, msg: err}));
            });
        }
        else
        {
            res.send(JSON.stringify({result: false, msg: '파라미터가 부족하거나 로그인을 해주시기 바랍니다.'}));
        }


    });

    // 글 쓰기
    app.post('/tistory/write', function(req, res) {
        var tistoryNAME = req.session.tistoryNAME;
        var tistoryADDR = req.session.tistoryADDR;
        var tistoryID   = req.session.tistoryID;
        var tistoryKEY  = req.session.tistoryKEY;
        var contents    = req.body.contents;
        var dirCategory = req.body.dirCategory;
        var subCategory = req.body.subCategory;
        var title       = req.body.title;


        if( tistoryNAME && tistoryADDR && tistoryID && tistoryKEY && contents && dirCategory && subCategory && title )
        {
            var metaWeblog = new MetaWeblog(tistoryADDR);

            var categories;

            if (subCategory == '분류없음') {
                categories = [dirCategory];
            } else {
                categories = [dirCategory + "/" + subCategory];
            }

            var post =  {
                title: title,
                categories: categories,
                description: contents
            };


            metaWeblog.newPost(tistoryID, tistoryNAME, tistoryKEY, post, true, function(result) {
                if( result ) {
                    return res.send(JSON.stringify({result: true, data: result}));
                } else {
                    return res.send(JSON.stringify({result: false, data: result}));
                }
            }, function(err) {
                res.send(JSON.stringify({result: false, msg: '최신글 로드 실패'}));
            });
        }
        else
        {
            res.send(JSON.stringify({result: false, msg: '파라미터가 부족하거나 로그인을 해주시기 바랍니다.'}));
        }
    });

    // 이미지 업로드
    app.post('/tistory/media', function(req, res) {
        var tistoryNAME = req.session.tistoryNAME;
        var tistoryADDR = req.session.tistoryADDR;
        var tistoryID   = req.session.tistoryID;
        var tistoryKEY  = req.session.tistoryKEY;

        var form = new formidable.IncomingForm();


        form.parse(req, function(e, fields, files) {
            console.log(files);

            if( e ) {
                return res.send(JSON.stringify({success: 0, message: e.message}));
            }

            var tmpPath = files['editormd-image-file'].path,
                fileName = files['editormd-image-file'].name,
                fileType = files['editormd-image-file'].type;

            if( tistoryNAME && tistoryADDR && tistoryID && tistoryKEY && tmpPath )
            {
                var bf = fs.readFileSync(tmpPath);

                var media = {};
                media.name = fileName;
                media.type = fileType;
                media.bits = bf;

                var metaWeblog = new MetaWeblog(tistoryADDR);

                metaWeblog.newMediaObject(tistoryID, tistoryNAME, tistoryKEY, media, function(result) {
                    if( result ) {
                        return res.send(JSON.stringify({success: 1, message: result, url: result.url}));
                    } else {
                        return res.send(JSON.stringify({success: 0, message: result, url: result.url}));
                    }
                }, function(err) {
                    return res.send(JSON.stringify({success: 0, message: err, url: err}));
                });
            }
            else
            {
                return res.send(JSON.stringify({success: 0, message: '파라미터가 부족하거나 로그인을 해주시기 바랍니다.', url: result}));
            }
        });

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

