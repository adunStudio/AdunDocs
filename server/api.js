'use strict';

var fs = require('fs');
var path = require('path');
var fsFileTree = require("fs-file-tree");
var formidable = require('formidable');
var bodyParser = require('body-parser');
var secret = require('./secret.js');
var _ = require('underscore');

//https://github.com/louischatriot/nedb

var Datastore = require('nedb');
var db = {};
db.directory = new Datastore({filename: './directory.db', autoload: true});
db.docs      = new Datastore({filename: './docs.db',      autoload: true});

/*var doc = {
    dirName: 'codesafer',
    subName: [
        'C++ 에서 전역변수 사용의 득과 실',
        'C++ 초보를 위한 강좌',
        '개념글',
        '개소리',
        '댓글',
        '뻘소리',
        '알아보자',
        '초보를 위한 강좌',
        '코딩 모범에 관한 코멘터리',
        '헛소리'
    ]
};

var doc2 = {
    dirName: 'AdunDocs',
    subName: [
        'About'
    ]
};



db.directory.insert(doc, function (err, newDoc) {   // Callback is optional

});
db.directory.insert(doc2, function (err, newDoc) {   // Callback is optional

});*/

/*var date = new Date();
var doc = {
    dirName : 'codesafer',
    subName : '댓글',
    fileName: 'test',
    fileData: '## 안녕',
    btime   : date,
    mtime   : date
};

db.docs.insert(doc, function (err, newDoc) {   // Callback is optional

});*/

const RESULT_TRUE  = JSON.stringify({result: true});
const RESULT_FALSE = JSON.stringify({result: false});


module.exports = function(app) {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(require('cookie-parser')(secret.cookieSecret));
    app.use(require('express-session')({
        resave: false,
        saveUninitialized: true,
        secret: secret.cookieSecret
    }));

    app.get('/article/list', function(req, res) {
        var article = {
            docs    : {},
            dirTree : {},
            fileTree: []
        };

        db.directory.find({}).sort({dirName: 1, subName: 1}).exec(function(err, directorys) {
            _.each(directorys, function(directory) {
                article.docs[directory.dirName] = {};
                article.dirTree[directory.dirName] = [];
                _.each(directory.subName, function(subName) {
                    article.docs[directory.dirName][subName] = {};
                    article.dirTree[directory.dirName].push(subName);
                });
            });

            db.docs.find({}).sort({fileName: 1}).exec(function(err, docs) {
                _.each(docs, function(doc) {
                    article.docs[doc.dirName][doc.subName][doc.fileName] = doc;
                });

                article.fileTree = docs;

                res.send(article);
            });
        });

    });

    // 로그인 (LOG-IN)
    app.post('/article/login', function(req, res) {
        var pattern = req.body.pattern;

        if( pattern == secret.pattern ) {
            req.session.admin = secret.admin;
            res.send(RESULT_TRUE)
        } else {
            res.send(RESULT_FALSE);
        }
    });

    // 로그아웃 (LOG-OUT)
    app.get('/article/logout', function(req, res) {
        req.session.admin = '';

        res.send(RESULT_TRUE);
    });

    // 디렉토리 생성 (MAKE DIRECTORY)
    app.post('/article/directory', function(req, res) {
        if( req.session.admin != secret.admin ) {
            return res.send(JSON.stringify({result: false, msg: '관리자가 아닙니다.'}));
        }

        var dirName  = req.body.dirName;
        var subName  = req.body.subName;



        if( dirName )
        {
            try
            {
                var dirPath = makeDirPath(dirName);

                fs.existsSync(dirPath) || fs.mkdirSync(dirPath);

                if( subName ) {

                    var subPath = makeDirPath(dirName, subName);

                    fs.existsSync(subPath) || fs.mkdirSync(subPath);

                    return res.send(JSON.stringify({result: true, msg: subName}));
                }
                return res.send(JSON.stringify({result: true, msg: dirName}));
            }
            catch (e)
            {
                return res.send(JSON.stringify({result: true, msg: e.message}));
            }
        }

        return res.send(JSON.stringify({result: false, msg: '디렉토리명이 없습니다.'}));
    });


    // 이미지 업로드 (IMAGE UPLOAD) // editormd
    app.post('/article/upload', function(req, res) {
        res.setHeader('Content-Type', 'application/json');

        if( req.session.admin != secret.admin ) {
            return res.send(JSON.stringify({success: 0, message: '관리자가 아닙니다.'}));
        }

        var form = new formidable.IncomingForm(),
            now = String(Date.now()).slice(-4),
            dir = "public/upload/";

        fs.existsSync(dir) || fs.mkdirSync(dir);

        form.parse(req, function(e, fields, files) {

            if( e ) {
                return res.send(JSON.stringify({success: 0, message: e.message}));
            }

            var tmpPath = files['editormd-image-file'].path,
                fileName = files['editormd-image-file'].name,
                dest = dir + now + "_" + fileName;

            try
            {
                var bf = fs.readFileSync(tmpPath);
                fs.writeFileSync(dest, bf);

                res.send(JSON.stringify({success: 1, message: 'success', url: "/upload/" +  now + '_' + fileName}));
            }
            catch(e)
            {
                res.send(JSON.stringify({success: 0, message: e.message}));
            }
        });
    });

    // 이미지 업로드 (IMAGE UPLOAD) // ckeditor
    app.post('/article/uploadck', function(req, res) {
        res.setHeader('Content-Type', 'application/json');

        if( req.session.admin != secret.admin ) {
            return res.send(JSON.stringify({success: 0, message: '관리자가 아닙니다.'}));
        }

        var dest, fileName, tmpPath;

        var now = new Date();
        var dateDir =  "public/upload/";
        var date = "/" +  now.getFullYear() + "-" + (now.getMonth() + 1) + "-" +  now.getDate() +"/";
        var uploadDir = dateDir + date;
        fs.existsSync(dateDir) || fs.mkdirSync(dateDir);
        fs.existsSync(uploadDir) || fs.mkdirSync(uploadDir);

        var formidable = require('formidable');
        var form = new formidable.IncomingForm();
        form.parse(req, function(err, fields, files) {
            form.uploadDir = "public/uploads";
            tmpPath = files.upload.path;
            fileName = Date.now() + "_" +files.upload.name;
            dest = uploadDir + fileName;
            fs.readFile(files.upload.path, function(err, data) {
                if (err) {
                    console.log(err);
                    return;
                }
                fs.writeFile(dest, data, function(err) {
                    var html;
                    if (err) {
                        console.log(err);
                        return;
                    }

                    html = "";
                    html += "<script type='text/javascript'>";
                    html += "    var funcNum = " + req.query.CKEditorFuncNum + ";";
                    html += "    var url     = \"/uploads"+ date + fileName + "\";";
                    html += "    var message = \"업로드 성공!\";";
                    html += "";
                    html += "    window.parent.CKEDITOR.tools.callFunction(funcNum, url, message);";
                    html += "</script>";

                    res.send(html);
                });
            });
        });

    });

    // 글 쓰기 (CREATE)
    app.post('/article/write', function(req, res) {
        if( req.session.admin != secret.admin ) {
            return res.send(JSON.stringify({result: false, msg: '관리자가 아닙니다.'}));
        }

        var dirName  = req.body.dirName,
            subName  = req.body.subName,
            fileName = req.body.fileName,
            fileData = req.body.fileData;

        if( dirName && subName && fileName && fileData )
        {
            var date = new Date();
            var doc = {
                dirName : dirName,
                subName : subName,
                fileName: fileName,
                fileData: fileData,
                btime   : date,
                mtime   : date
            };

            db.docs.insert(doc, function (err, newDoc) {
                console.log(newDoc);
                if( err )
                {
                    res.send(JSON.stringify({result: false, msg: err}));

                }
                res.send(JSON.stringify({result: true}));
            });
        }
        else
        {
            res.send(JSON.stringify({result: false, msg: '파라미터 값이 부족합니다.'}));
        }
    });

    // 글 수정 (EDIT)
    app.post('/article/edit', function(req, res) {
        if( req.session.admin != secret.admin ) {
            return res.send(JSON.stringify({result: false, msg: '관리자가 아닙니다.'}));
        }

        var dirName        = req.body.dirName,
            subName        = req.body.subName,
            fileName       = req.body.fileName,
            fileData       = req.body.fileData,
            originDirName  = req.body.originDirName,
            originSubName  = req.body.originSubName,
            originFileName = req.body.originFileName;

        if( dirName && subName && fileName && fileData && originDirName && originFileName && originFileName )
        {
            var oldPath = makeFilePath(originDirName, originSubName, originFileName);
            var newPath = makeFilePath(dirName, subName, fileName) + ".md";

            try
            {
                if( oldPath != newPath && fs.existsSync(newPath) ) {
                    return res.send(JSON.stringify({result: false, msg: '존재하는 파일명입니다.'}));
                }

                fs.renameSync(oldPath, newPath);
                var fd = fs.openSync(newPath, 'w');
                fs.writeSync(fd, fileData);
                fs.closeSync(fd);

                res.send(JSON.stringify({result: true}));
            }
            catch(e)
            {
                res.send(JSON.stringify({result: false, msg: e.message}));
            }
        }
        else
        {
            res.send(JSON.stringify({result: false, msg: '파라미터 값이 부족합니다.'}));
        }

    });

    // 글 이름 수정(RE NAME)
    app.post('/article/rename', function(req, res) {
        if( req.session.admin != secret.admin ) {
            return res.send(JSON.stringify({result: false, msg: '관리자가 아닙니다.'}));
        }

        var dirName        = req.body.dirName,
            subName        = req.body.subName,
            fileName       = req.body.fileName,
            newName        = req.body.newName;

        if( dirName && subName && fileName && newName )
        {
            var oldPath = makeFilePath(dirName, subName, fileName);
            var newPath = makeFilePath(dirName, subName, newName) + ".md";

            try
            {
                if( oldPath != newPath && fs.existsSync(newPath) ) {
                    return res.send(JSON.stringify({result: false, msg: '존재하는 파일명입니다.'}));
                }

                fs.renameSync(oldPath, newPath);

                res.send(JSON.stringify({result: true}));
            }
            catch(e)
            {
                res.send(JSON.stringify({result: false, msg: e.message}));
            }
        }
        else
        {
            res.send(JSON.stringify({result: false, msg: '파라미터 값이 부족합니다.'}));
        }
    });

    // 글 삭제 (DELETE)
    app.post('/article/delete', function(req, res) {
        if( req.session.admin != secret.admin ) {
            return res.send(JSON.stringify({result: false, msg: '관리자가 아닙니다.'}));
        }

        var dirName        = req.body.dirName,
            subName        = req.body.subName,
            fileName       = req.body.fileName,
            trashName      = req.body.trashName;

        if( dirName && subName && fileName && fileName == trashName )
        {


            var path      = makeFilePath(dirName, subName, fileName);
            var subPath   = makeTrashSubPath(yyyymmdd());
            fs.existsSync(subPath) || fs.mkdirSync(subPath);
            var trashPath = subPath + "/" + String(Date.now()).slice(-6) + "_" + fileName;

            try
            {
                fs.renameSync(path, trashPath);

                res.send(JSON.stringify({result: true}));
            }
            catch(e)
            {
                res.send(JSON.stringify({result: false, msg: e.message}));
            }
        }
        else
        {
            res.send(JSON.stringify({result: false, msg: '파라미터 값이 부족합니다.'}));
        }
    });


    // 글 읽기 (READ)
    app.get('/article/:dir/:sub/:file', function(req, res) {
        db.docs.findOne({dirName: req.params.dir, subName: req.params.sub, fileName: req.params.file}, function(err, doc) {
            res.send(doc);
        });
    });

    // 휴지통 읽기 (READ)
    app.get('/trash/:sub/:file', function(req, res) {
        var path = makeTrashPath(req.params.sub, req.params.file);
        try
        {
            if( fs.statSync(path).isFile() )
            {
                res.sendFile(path);
            }
        }
        catch(e)
        {
            res.status(404);
            res.send(RESULT_TRUE);
        }
    });


    /*----------------------------------------------------------------------------------------------------------------*/

    /*----------------------------------------------------------------------------------------------------------------*/



    /*----------------------------------------------------------------------------------------------------------------*/
    // DELETE
    app.delete('/article/:dir/:sub/:file', function() {
        var path = makeFilePath(req.params.dir, req.params.sub, req.params.file);

    });
    /*----------------------------------------------------------------------------------------------------------------*/






};


function makeFilePath(dir, sub, file) {
    return __dirname + '/article/' + dir + '/' + sub + '/' + file;
}

function makeDirPath(dir, sub) {
    if(dir && !sub) {
        return __dirname + '/article/' + dir;
    }
    if(dir && sub) {
        return __dirname + '/article/' + dir + '/' + sub;
    }
}

function makeTrashPath(sub, file) {
    return __dirname + '/trash/' + sub + '/' + file;
}

function makeTrashSubPath(name) {
    return __dirname + '/trash/' + name;
}


function naturalSortByKey(obj) {
    var sortedObj = {};
    var keys      = Object.keys(obj);
    var key, index;

    keys.sort(naturalSort);

    for(index in keys) {

        key = keys[index];

        if( typeof obj[key] == 'object' && !(obj[key] instanceof Array) && key != 'stat')
        {
            sortedObj[key] = naturalSortByKey(obj[key]);
        }
        else
        {
            sortedObj[key] = obj[key];
        }
    }

    return sortedObj;
}

function naturalSort (a, b) {
    "use strict";
    var re = /(^([+\-]?(?:0|[1-9]\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?)?$|^0x[0-9a-f]+$|\d+)/gi,
        sre = /(^[ ]*|[ ]*$)/g,
        dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
        hre = /^0x[0-9a-f]+$/i,
        ore = /^0/,
        i = function(s) { return naturalSort.insensitive && ('' + s).toLowerCase() || '' + s; },
    // convert all to strings strip whitespace
        x = i(a).replace(sre, '') || '',
        y = i(b).replace(sre, '') || '',
    // chunk/tokenize
        xN = x.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
        yN = y.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
    // numeric, hex or date detection
        xD = parseInt(x.match(hre), 16) || (xN.length !== 1 && x.match(dre) && Date.parse(x)),
        yD = parseInt(y.match(hre), 16) || xD && y.match(dre) && Date.parse(y) || null,
        oFxNcL, oFyNcL;
    // first try and sort Hex codes or Dates
    if (yD) {
        if ( xD < yD ) { return -1; }
        else if ( xD > yD ) { return 1; }
    }
    // natural sorting through split numeric strings and default strings
    for(var cLoc=0, numS=Math.max(xN.length, yN.length); cLoc < numS; cLoc++) {
        // find floats not starting with '0', string or 0 if not defined (Clint Priest)
        oFxNcL = !(xN[cLoc] || '').match(ore) && parseFloat(xN[cLoc]) || xN[cLoc] || 0;
        oFyNcL = !(yN[cLoc] || '').match(ore) && parseFloat(yN[cLoc]) || yN[cLoc] || 0;
        // handle numeric vs string comparison - number < string - (Kyle Adams)
        if (isNaN(oFxNcL) !== isNaN(oFyNcL)) { return (isNaN(oFxNcL)) ? 1 : -1; }
        // rely on string comparison if different types - i.e. '02' < 2 != '02' < '2'
        else if (typeof oFxNcL !== typeof oFyNcL) {
            oFxNcL += '';
            oFyNcL += '';
        }
        if (oFxNcL < oFyNcL) { return -1; }
        if (oFxNcL > oFyNcL) { return 1; }
    }
    return 0;
}
function yyyymmdd() {
    var dateIn = new Date();
    var yyyy = dateIn.getFullYear();
    var mm = dateIn.getMonth()+1   ;
    var dd  = dateIn.getDate()< 10 ? '0' + dateIn.getDate() : dateIn.getDate();
    return String(yyyy +"-" +  mm + "-" +dd);
}