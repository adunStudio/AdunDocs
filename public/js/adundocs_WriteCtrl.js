var converter = converter || new showdown.Converter();

AdunDocs.controller('writeCtrl', ['$scope', '$http', '$routeParams', '$location', '$cookies', '$interval', function writeCtrl($scope, $http, $routeParams, $location, $cookies, $interval) {

    $scope.initStat();
    $scope.setName();

    var dirName = $routeParams.dirName || Object.keys($scope.docs)[0];
    var subName = $routeParams.subName || Object.keys($scope.docs[dirName])[0] ;

    $scope.inputDir    = dirName;
    $scope.inputSub    = subName;
    $scope.inputName   = null;
    $scope.inputSave = null;
    $scope.makeDirName = null;
    $scope.makeSubName = null;
    $scope.saveObject   = {};

    $scope.selectFirst = function() {
        $scope.inputSub = Object.keys($scope.docs[$scope.inputDir])[0];
    };


    $scope.getSave = function() {
        if( $scope.autoMode && $scope.isLocalStorage )
        {
            $scope.saveObject = {};
            var i, key, date, len = window.localStorage.length;

            for(i = len -1; i >= 0; --i) {
                key = localStorage.key(i);
                if( len > 30 && i  == 0)
                {
                    window.localStorage.removeItem(key);
                }
                else
                {
                    if( !$scope.saveObject[moment.unix(key).format("LLLL")] ) {
                        $scope.saveObject[moment.unix(key).format("LLLL")] = key;
                    }
                }
            }
        }
    };

    $scope.getSave();

    $scope.saveLoad = function() {
        if( $scope.inputSave != "" ) {
            var contents = window.localStorage.getItem($scope.inputSave);
            $scope.editor.insertValue(contents);
            $scope.inputSave = "";
        }
    };


    var editor = $scope.editor = editormd("contents", {
        path : "/editor.md/lib/",
        width: '100%',
        height: '36rem',
        tex: true,
        sequenceDiagram: true,
        watch: false,
        flowChart: true,
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
            if( $scope.autoMode && $scope.isLocalStorage )
            {
                var contents = editor.getMarkdown();
                // 오토세이브 기능
                $interval(function() {
                    var text = editor.getMarkdown();
                    if( contents != text) {
                        contents = text;
                        window.localStorage.setItem(moment().unix(), contents);
                        console.log('autosave');
                        $scope.getSave();
                        $scope.$save_noti.show(500).delay(1000).fadeOut('slow');
                    }
                }, 1000 * 60 * 3); // 3분마다 호출
                //}, 1000); // 1초마다 호출(테스트)
            }
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
    };



}]);