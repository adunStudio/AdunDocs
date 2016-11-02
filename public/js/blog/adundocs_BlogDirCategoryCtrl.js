
AdunDocs.controller('BlogDirCategoryCtrl', ['$scope', '$routeParams', '$location', function BlogDirCategoryCtrl($scope, $routeParams, $location) {

    if( !$scope.blogReady)
    {
        $location.url('/');
        return;
    }
    $scope.initStat();
    $scope.setName();
    var check  =  $routeParams.check;

    var blogDirCategoryName  =  $routeParams.dirCategoryName;
    $scope.blogStat.dirCategory = blogDirCategoryName;




    var dirEl =  angular.element(document.getElementById('blog_' + blogDirCategoryName));

    if( $scope.blogCategory && $scope.isToggleCheck == false || check ) {
        $scope.toggleCheck(dirEl);
    }
}]);