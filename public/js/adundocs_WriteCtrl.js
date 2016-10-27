var converter = converter || new showdown.Converter();

AdunDocs.controller('writeCtrl', ['$scope', '$http', '$routeParams', '$location', '$cookies', '$interval', function writeCtrl($scope, $http, $routeParams, $location, $cookies, $interval) {
    if($scope.unLoginCheck()) {
        $location.url('/#');
    }

    $scope.initStat();
    $scope.setName();

    $scope.nameRegExp = /^[^\\/:^\*\?"<>\|]+$/;


    var editor = editormd("contents", {
        path : "/editor.md/lib/",

        width: '100%',
        height: '43rem',

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


    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 3);

    $interval(function() {
        var contents = editor.getMarkdown();
    }, 1000 * 60 * 10);


    $scope.$watch('theme', function() {
        editor.setTheme($scope.theme == '/css/style_white.css' ? 'default' : 'dark');
        editor.setEditorTheme($scope.theme == '/css/style_white.css' ? 'default' : 'base16-dark');
        editor.setPreviewTheme($scope.theme == '/css/style_white.css' ? 'default' : 'dark');
    });

    $scope.inputDir = "";
    $scope.inputSub = "";
    $scope.inputName = "";

    $scope.write = function(event) {
        event.preventDefault();

        var contents = editor.getMarkdown();


        if( $scope.inputDir && $scope.inputSub && $scope.inputName && contents ) {
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
                }
                else
                {
                    alert(result.msg);
                }
            })
        } else {
            alert('꽉꽉 채우자');
        }

    }


}]);