var converter = converter || new showdown.Converter();

AdunDocs.controller('blogEditCtrl', ['$scope', '$http', '$routeParams', '$timeout', function blogEditCtrl($scope, $http, $routeParams, $timeout) {
    var postid  = $routeParams.postid;

    $scope.nameRegExp = /^[^\\/:^\*\?"<>\|]+$/;

    $scope.setName(null, null, null);
    $scope.initStat(null, null, null);

    $scope.inputDirCateogry = "";
    $scope.inputSubCateogry = "";
    $scope.inputTitle       = "";

    var editor = $scope.editor = editormd("contents", {
        saveHTMLToTextarea : true,
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
        },
        onload: function() {

            $http.post('/tistory/post/' + postid).then(function (response) {

                var result = response.data;

                if( result.result )
                {
                    var data = result.data;

                    if( data.categories[0].indexOf('/') > 0 )
                    {
                        var splitCategory = data.categories[0].split('/');
                        $scope.setBlogStat(data.dateCreated, data.mt_keywords, data.permaLink, splitCategory[0], splitCategory[1], data.title, postid);
                        $scope.inputDirCategory = splitCategory[0];
                        $scope.inputSubCategory = splitCategory[1];
                        $scope.inputTitle       = data.title;
                        $scope.editor.insertValue(md(data.description));
                    }
                }
            });
        }
    });

    $scope.blogEdit = function(event) {
        event.preventDefault();

        var contents = editor.getHTML();

        if( $scope.blogEditForm.$valid && contents )
        {
            $http({
                method  : 'POST',
                url     : '/tistory/edit',
                data    : {
                    postid: postid,
                    dirCategory: $scope.inputDirCategory,
                    subCategory: $scope.inputSubCategory,
                    title: $scope.inputTitle,
                    contents: contents
                },
                headers : {'Content-Type': 'application/json'}
            }).then(function(response) {
                var result = response.data;
                if( result )
                {
                    alert('수정 완료');
                }
                else
                {
                    alert('수정 실패');
                }
                /*if( result.result )
                {
                    $http.get('/article/renew').then(function(response) {
                        $scope.init(function() {
                            $location.url($scope.inputDir +'/' + $scope.inputSub + '/' + $scope.inputName + '.md?check=1');
                        });
                    });
                } else { alert(result.msg); }*/
            });
        }
        else
        {
            alert('꽉꽉 채우자.');
        }

    };


}]);