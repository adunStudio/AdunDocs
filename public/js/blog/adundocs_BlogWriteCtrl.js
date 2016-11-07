AdunDocs.controller('BlogWriteCtrl', ['$scope', '$http', '$routeParams', '$timeout', '$location', function BlogWriteCtrl($scope, $http, $routeParams, $timeout, $location) {
    if( !$scope.blogReady)
    {
        $location.url('/');
        return;
    }

    $scope.setDocStat();


    $scope.inputDirCategory = $routeParams.dirCategoryName;
    $scope.inputSubCategory = $routeParams.subCategoryName || Object.keys($scope.blogCategory[$scope.inputDirCategory])[0];
    $scope.inputTitle       = "";

    $scope.blogStat.dirCategory = $routeParams.dirCategoryName;
    $scope.blogStat.subCategory = $routeParams.subCategoryName || '';

    $scope.selectFirst = function() {
        if($scope.blogStat.dirCategory != '분류없음' && $scope.inputDirCategory == '분류없음') {
            $scope.inputDirCategory = $scope.blogStat.dirCategory;
            $scope.inputSubCategory = $scope.blogStat.subCategory || Object.keys($scope.blogCategory[$scope.inputDirCategory])[0];
            return;
        }
        $scope.inputSubCategory = Object.keys($scope.blogCategory[$scope.inputDirCategory])[0];

    };


    $scope.mode = ($scope.htmlMode == true ? "HTML" : "MarkDown");
    var editor = null;

    if( $scope.mode == "MarkDown" )
    {
        editor = $scope.editor = editormd("contents", {
            saveHTMLToTextarea : true,
            path : "/editor.md/lib/",
            width: '100%',
            height: '36rem',
            tex: true,
            watch: false,
            sequenceDiagram: true,
            flowChart: true,
            placeholder: 'AdunDocs는 MarkDown을 지원합니다...',
            theme: $scope.theme == '/css/style_white.css' ? 'default' : 'dark',
            editorTheme : $scope.theme == '/css/style_white.css' ? 'default' : 'base16-dark',
            previewTheme : $scope.theme == '/css/style_white.css' ? 'default' : 'dark',
            imageUpload    : true,
            imageFormats   : ["jpg", "jpeg", "gif", "png", "bmp", "PNG"],
            imageUploadURL : "/tistory/media",
            onfullscreen : function() {
                $scope.$container.css('z-index', '100');
            },
            onfullscreenExit : function() {
                $scope.$container.css('z-index', '1');
            },
            onchange: function() {
                $('img').on('error', function() {
                    $(this).attr('src', "/img/tistory_404.png");
                });
            }
        });

        $scope.$watch('theme', function() {
            editor.setTheme($scope.theme == '/css/style_white.css' ? 'default' : 'dark');
            editor.setEditorTheme($scope.theme == '/css/style_white.css' ? 'default' : 'base16-dark');
            editor.setPreviewTheme($scope.theme == '/css/style_white.css' ? 'default' : 'dark');
        });
    }
    else
    {
        editor = $('#summernote');
        editor.summernote({
            height: 500,                 // set editor height
            minHeight: null,             // set minimum height of editor
            maxHeight: null,             // set maximum height of editor
            focus: true,                  // set focus to editable area after initializing summernote
            lang: 'ko-KR',
            callbacks: {
                onImageUpload: function(files) {
                    sendFile(files[0]);
                }
            }
        });
        $('.modal').on('show.bs.modal', function () {
            $scope.$container.css('z-index', '100');
        });
        $('.modal').on('hide.bs.modal', function () {
            $scope.$container.css('z-index', '1');
        });
    }

    function sendFile(file) {
        console.dir(file);
        data = new FormData();
        data.append("editormd-image-file", file);
        $.ajax({
            data: data,
            type: "POST",
            url: "/tistory/media",
            cache: false,
            contentType: false,
            processData: false,
            dataType: "json",
            success: function(result) {
                if(result.success) {
                    editor.summernote('insertImage', result.url,'ddd');
                } else {
                    alert(result.message);
                }
            }
        });
    }

   $scope.blogWrite = function() {
       var contents = $scope.mode == "HTML" ? editor.summernote('code') : editor.getHTML();

       if( $scope.blogWriteForm.$valid && contents)
       {
           $http({
               method  : 'POST',
               url     : '/tistory/write',
               data    : {
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
                   $scope.setBlog(function() {
                       $location.url('blog/' + $scope.inputDirCategory +'/' + $scope.inputSubCategory + '/' + $scope.inputTitle + '?check=1');
                   });
               }
               else
               {
                   alert('글쓰기 실패');
               }
           });
       }
       else
       {
           alert(1);
       }
   };


}]);