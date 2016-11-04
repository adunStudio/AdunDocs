
AdunDocs.controller('newsCtrl', ['$scope', function newsCtrl($scope) {

    function date_sort(a, b) {
        return new Date(b.stat.birthtime).getTime() - new Date(a.stat.birthtime).getTime();
    }

    $scope.sortedFileArray = [];


    if( $scope.fileTree ) {
        $scope.sortedFileArray = $scope.fileTree.slice();

        $scope.sortedFileArray.sort(date_sort);
    }
}]);
