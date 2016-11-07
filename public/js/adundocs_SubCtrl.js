
AdunDocs.controller('subCtrl', ['$scope', '$routeParams', function subCtrl($scope, $routeParams) {
    var dirName  =  $routeParams.dirName;
    var subName  =  $routeParams.subName;
    var check  =  $routeParams.check;


    $scope.setDocStat(dirName, subName);

    
    var dirEl =  angular.element(document.getElementById('_' + dirName));
    var subEl =  angular.element(document.getElementById('_' + dirName + "_" + subName));

    if( $scope.isToggleCheck == false || check ) {
        $scope.toggleCheck(dirEl, subEl);
    }
}]);