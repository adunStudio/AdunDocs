
AdunDocs.controller('newsCtrl', ['$scope', function newsCtrl($scope) {
    $scope.setDocStat();

    function date_sort(a, b) {
        return new Date(b.btime).getTime() - new Date(a.btime).getTime();
    }

    $scope.sortedFileArray = [];


    if( $scope.fileTree ) {
        $scope.sortedFileArray = $scope.fileTree.slice();
        $scope.sortedFileArray.sort(date_sort);
    }
}]);
