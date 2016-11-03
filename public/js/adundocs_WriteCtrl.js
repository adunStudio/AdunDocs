var converter = converter || new showdown.Converter();

AdunDocs.controller('writeCtrl', ['$scope', '$http', '$routeParams', '$location', '$cookies', '$interval', function writeCtrl($scope, $http, $routeParams, $location, $cookies, $interval) {

    $scope.initStat();
    $scope.setName();

    var dirName = $routeParams.dirName || Object.keys($scope.docs)[0];
    var subName = $routeParams.subName || Object.keys($scope.docs[dirName])[0] ;

    $scope.nameRegExp = /^[^\\/:^\*\?"<>\|]+$/;
    $scope.dirRegExp  = /^[^\\/:.^\*\?"<>\|]+$/;

    $scope.inputDir    = dirName;
    $scope.inputSub    = subName;
    $scope.inputName   = null;
    $scope.makeDirName = null;
    $scope.makeSubName = null;

    $scope.selectFirst = function() {
        $scope.inputSub = Object.keys($scope.docs[$scope.inputDir])[0];
    };

    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 3);

    $interval(function() {
        var contents = editor.getMarkdown();
    }, 1000 * 60 * 10);

    var editor = editormd("contents", {
        path : "/editor.md/lib/",
        width: '100%',
        height: '36rem',
        tex: true,
        sequenceDiagram: true,
        flowChart: true,
        placeholder: 'AdunDocs는 MarkDown을 지원합니다...',
        theme: $scope.theme == '/css/style_white.css' ? 'default' : 'dark',
        editorTheme : $scope.theme == '/css/style_white.css' ? 'default' : 'base16-dark',
        previewTheme : $scope.theme == '/css/style_white.css' ? 'default' : 'dark',
        imageUpload    : true,
        imageFormats   : ["jpg", "jpeg", "gif", "png", "bmp", "PNG"],
        imageUploadURL : "/article/upload",
        onfullscreen : function() {
            $('._container').css('z-index', '100');
        },
        onfullscreenExit : function() {
            $('._container').css('z-index', '1');
        }
    });

    $scope.$watch('theme', function() {
        editor.setTheme($scope.theme == '/css/style_white.css' ? 'default' : 'dark');
        editor.setEditorTheme($scope.theme == '/css/style_white.css' ? 'default' : 'base16-dark');
        editor.setPreviewTheme($scope.theme == '/css/style_white.css' ? 'default' : 'dark');
    });

    $scope.write = function(event) {
        event.preventDefault();

        var contents = editor.getMarkdown();

        //if( $scope.inputDir && $scope.inputSub && $scope.inputName && contents ) {
        if( $scope.writeForm.$valid && contents ) {
            $http({
                method  : 'POST',
                url     : '/article/write',
                data    : {
                    dirName: $scope.inputDir,
                    subName: $scope.inputSub,
                    fileName: $scope.inputName,
                    fileData: contents
                },
                headers : {'Content-Type': 'application/json'}
            }).then(function(response) {
                var result = response.data;
                if( result.result )
                {
                    $http.get('/article/renew').then(function(response) {
                        $scope.init(function() {
                            $location.url($scope.inputDir +'/' + $scope.inputSub + '/' + $scope.inputName + '.md?check=1');
                        });
                    });
                } else { alert(result.msg); }
            });
        } else { alert('꽉꽉 채우자'); }
    };

    // MODAL
    $('#dirModal,#subModal').on('show.bs.modal', function () {
        $('._container').css('z-index', '100');
    });
    $('#dirModal,#subModal').on('hide.bs.modal', function () {
        $('._container').css('z-index', '1');
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
                    $http.get('/article/renew').then(function(response) {
                        $scope.initTreeAndArray();
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
                    $http.get('/article/renew').then(function(response) {
                        $scope.initTreeAndArray();
                        $('#subModal').modal('hide');
                    });
                } else { alert(result.msg); }
            });
        } else {
            $('#subModal').effect('shake');
        }
    }

}]);