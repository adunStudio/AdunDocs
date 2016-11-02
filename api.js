'use strict';

var fs = require('fs');
var path = require('path');
var fsFileTree = require("fs-file-tree");
var formidable = require('formidable');
var bodyParser = require('body-parser');
var secret = require('./secret.js');
/**
secret = {
    pattern     : '...',

    admin       : '...',

    cookieSecret: '...'
};
**/

const ARTICLE_PATH = path.normalize('./article');
const ARTICLE_JSON = path.normalize('./public/article.json');
const TRASH_PATH = path.normalize('./trash');
const TRASH_JSON = path.normalize('./public/trash.json');
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
        req.session.destroy();
        res.clearCookie('sid');
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

    // 갱신 (RENEW)
    app.get('/article/renew', function(req, res) {
            try
            {
                var tree = fsFileTree.sync(ARTICLE_PATH);
                tree = naturalSortByKey(tree);
                var fd = fs.openSync(ARTICLE_JSON, 'w');
                fs.writeSync(fd, JSON.stringify(tree));
                fs.closeSync(fd);

                var tree2 = fsFileTree.sync(TRASH_PATH);
                tree2 = naturalSortByKey(tree2);
                var TREE = {};
                TREE['휴지통'] = tree2;
                var fd2 = fs.openSync(TRASH_JSON, 'w');
                fs.writeSync(fd2, JSON.stringify(TREE));
                fs.closeSync(fd2);

               res.send(JSON.stringify({result: true}));
            }
            catch(e)
            {
                res.send(JSON.stringify({result: false, msg: e.message}));
            }
    });

    // 이미지 업로드 (IMAGE UPLOAD)
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

                res.send(JSON.stringify({success: 1, message: 'success', url: "http://localhost:3311/upload/" +  now + '_' + fileName}));
            }
            catch(e)
            {
                res.send(JSON.stringify({success: 0, message: e.message}));
            }
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
            var path = makeFilePath(dirName, subName, fileName) + '.md';

            try
            {
                if( fs.existsSync(path) ) {
                    return res.send(JSON.stringify({result: false, msg: '존재하는 파일명입니다.'}));
                }

                var fd = fs.openSync(path, 'w');
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
        var path = makeFilePath(req.params.dir, req.params.sub, req.params.file);

        console.log('---------' + req.params.file + '-------');
        console.log(req.connection.remoteAddress);
        console.log('-------------------------------------');

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