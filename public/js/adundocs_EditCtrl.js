
AdunDocs.controller('editCtrl', ['$scope', '$http', '$routeParams', '$location', '$cookies', '$interval', function editCtrl($scope, $http, $routeParams, $location, $cookies, $interval) {

    var dirName  = $routeParams.dirName;
    var subName  = $routeParams.subName;
    var fileName = $routeParams.fileName;

    $scope.setName(dirName, subName, fileName);
    $scope.initStat(fileName, $scope.docs[dirName][subName][fileName].stat);

    $scope.originDirName  = dirName;
    $scope.originSubName  = subName;
    $scope.originFileName = fileName;

    $scope.inputDir    = dirName;
    $scope.inputSub    = subName;
    $scope.inputName   = fileName.substr(0, fileName.length -3);
    $scope.makeDirName = null;
    $scope.makeSubName = null;

    $scope.selectFirst = function() {
        $scope.inputSub = Object.keys($scope.docs[$scope.inputDir])[0];
    };

    var url = $scope.toURL('/' + dirName + '/' + subName + '/' + fileName);

    var editor = $scope.editor = editormd("contents", {
        path : "/editor.md/lib/",
        width: '100%',
        height: '36rem',
        tex: true,
        sequenceDiagram: true,
        flowChart: true,
        watch: false,
        placeholder: 'AdunDocs는 MarkDown을 지원합니다...',
        theme: $scope.theme == '/css/style_white.css' ? 'default' : 'dark',
        editorTheme : $scope.theme == '/css/style_white.css' ? 'default' : 'base16-dark',
        previewTheme : $scope.theme == '/css/style_white.css' ? 'default' : 'dark',
        imageUpload    : true,
        imageFormats   : ["jpg", "jpeg", "gif", "png", "bmp", "PNG"],
        imageUploadURL : "/article/upload",
        onfullscreen : function() {
            $scope.$container.css('z-index', '100');
        },
        onfullscreenExit : function() {
            $scope.$container.css('z-index', '1');
        },
        onload: function() {
            $http.get('/article' + url).then(function (response) {
                $scope.editor.insertValue(response.data);
            });

        }
    });




    $scope.$watch('theme', function() {
        editor.setTheme($scope.theme == '/css/style_white.css' ? 'default' : 'dark');
        editor.setEditorTheme($scope.theme == '/css/style_white.css' ? 'default' : 'base16-dark');
        editor.setPreviewTheme($scope.theme == '/css/style_white.css' ? 'default' : 'dark');
    });

    $scope.edit = function(event) {
        event.preventDefault();

        var contents = editor.getMarkdown();

        if( $scope.editForm.$valid && contents ) {
            $http({
                method  : 'POST',
                url     : '/article/edit',
                data    : {
                    dirName       : $scope.inputDir,
                    subName       : $scope.inputSub,
                    fileName      : $scope.inputName,
                    fileData      : contents,
                    originDirName : $scope.originDirName,
                    originSubName : $scope.originSubName,
                    originFileName: $scope.originFileName
                },
                headers : {'Content-Type': 'application/json'}
            }).then(function(response) {
                var result = response.data;
                if( result.result )
                {
                    $scope.getList(function() {
                        $location.url($scope.inputDir +'/' + $scope.inputSub + '/' + $scope.inputName + '.md?check=1');
                    });
                } else { alert(result.msg); }
            });
        } else { alert('꽉꽉 채우자'); }
    };

    // MODAL
    $('#dirModal,#subModal').on('show.bs.modal', function () {
        $scope.$container.css('z-index', '100');
    });
    $('#dirModal,#subModal').on('hide.bs.modal', function () {
        $scope.$container.css('z-index', '1');
        $scope.makeDirName = null;
        $scope.makeSubName = null;
    });


    $scope.makeDirectory = function() {
        if( $scope.makeDirForm.$valid ) {
            $http({
                method  : 'POST',
                url     : '/article/directory',
                data    : {
                    dirName: $scope.makeDirName
                },
                headers : {'Content-Type': 'application/json'}
            }).then(function(response) {
                var result = response.data;
                if( result.result )
                {
                    $scope.inputDir = $scope.makeDirName;
                    $scope.inputSub = null;
                    $scope.getList(function() {
                        $('#dirModal').modal('hide');
                    });
                } else { alert(result.msg); }
            });
        } else {
            $('#dirModal').effect('shake');
        }
    };

    $scope.makeSubDirectory = function() {
        if( $scope.makeSubForm.$valid ) {
            $http({
                method  : 'POST',
                url     : '/article/directory',
                data    : {
                    dirName: $scope.inputDir,
                    subName: $scope.makeSubName
                },
                headers : {'Content-Type': 'application/json'}
            }).then(function(response) {
                var result = response.data;
                if( result.result )
                {
                    $scope.inputSub = $scope.makeSubName;
                    $scope.getList(function() {
                        $('#subModal').modal('hide');
                    });
                } else { alert(result.msg); }
            });
        } else {
            $('#subModal').effect('shake');
        }
    }
}]);
