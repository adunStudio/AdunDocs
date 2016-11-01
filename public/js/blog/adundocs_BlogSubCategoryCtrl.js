
AdunDocs.controller('BlogSubCategoryCtrl', ['$scope', '$routeParams', '$location', function BlogSubCategoryCtrl($scope, $routeParams, $location) {
    if( !$scope.blogReady)
    {
        $location.url('/');
    }

    $scope.initStat();
    $scope.setName();
    var check  =  $routeParams.check;

    var blogDirCategoryName  =  $routeParams.dirCategoryName;
    var blogSubCategoryName  =  $routeParams.subCategoryName;
    $scope.blogStat.dirCategory = blogDirCategoryName;
    $scope.blogStat.subCategory = blogSubCategoryName;

    var dirEl =  angular.element(document.getElementById('blog_' + blogDirCategoryName));
    var subEl =  angular.element(document.getElementById('blog_' + blogDirCategoryName + "_" + blogSubCategoryName));


    if( $scope.isToggleCheck == false || check) {
        $scope.toggleCheck(dirEl, subEl);
    }
}]);