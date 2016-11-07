var converter = converter || new showdown.Converter();

AdunDocs.controller('BlogViewCtrl', ['$scope', '$http', '$routeParams', '$timeout', '$location', function BlogViewCtrl($scope, $http, $routeParams, $timeout, $location) {
    if( !$scope.blogReady)
    {
        $location.url('/');
        return;
    }

    $scope.setDocStat();

    var check  =  $routeParams.check;
    var blogDirCategoryName  =  $routeParams.dirCategoryName;
    var blogSubCategoryName  =  $routeParams.subCategoryName;
    var blogTitle            =  $routeParams.title;

    var postid  = $scope.blogCategory[blogDirCategoryName][blogSubCategoryName][blogTitle]['postid'];

    $http.post('/tistory/post/' + postid).then(function (response) {

        var result = response.data;

        if( result.result )
        {
            var data = result.data;
            $('#main').html(data.description);

            $scope.setBlogStat(data.dateCreated, data.mt_keywords, data.permaLink, blogDirCategoryName, blogSubCategoryName, data.title, postid);

            $('img').on('error', function() {
                $(this).attr('src', "/img/tistory_404.png");
            });
        }
    });

    var dirEl =  angular.element(document.getElementById('blog_' + blogDirCategoryName));
    var subEl =  angular.element(document.getElementById('blog_' + blogDirCategoryName + "_" + blogSubCategoryName));
    var fileEl = angular.element(document.getElementById('blog_' + blogDirCategoryName + "_" + blogSubCategoryName + "_" + blogTitle));


    if( $scope.isToggleCheck == false || check) {
        $scope.toggleCheck(dirEl, subEl, fileEl);
    }

}]);