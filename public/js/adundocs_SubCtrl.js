
AdunDocs.controller('subCtrl', ['$scope', '$routeParams', function subCtrl($scope, $routeParams) {
    var dirName  =  $routeParams.dirName;
    var subName  =  $routeParams.subName;

    $scope.setName(dirName, subName);

    var dirEl =  angular.element(document.getElementById('_' + dirName));
    var subEl =  angular.element(document.getElementById('_' + dirName + "_" + subName));

    if( $scope.isToggleCheck == false ) {
        $scope.toggleCheck(dirEl, subEl);
    }
}]);