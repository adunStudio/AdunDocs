AdunDocs.controller('BlogWriteCtrl', ['$scope', '$http', '$routeParams', '$timeout', '$location', function BlogWriteCtrl($scope, $http, $routeParams, $timeout, $location) {
    if( !$scope.blogReady)
    {
        $location.url('/');
        return;
    }

    $scope.nameRegExp = /^[^\\/:^\*\?"<>\|]+$/;

    $scope.setName(null, null, null);
    $scope.initStat(null, null, null);

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

        }
    });

   $scope.blogWrite = function() {
       var contents = editor.getHTML();
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