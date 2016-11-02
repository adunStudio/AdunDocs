var converter = converter || new showdown.Converter();

AdunDocs.controller('TrashCtrl', ['$scope', '$http', '$routeParams', '$timeout', function TrashCtrl($scope, $http, $routeParams, $timeout) {
    var subName  = $routeParams.subName;
    var fileName = $routeParams.fileName;
    var check  =  $routeParams.check;

    var url = $scope.toURL(subName + '/' + fileName);

    $http.get('/trash/' + url).then(function (response) {
        var html = converter.makeHtml(response.data);
        $('#main').html(html);
    });


    $scope.setName('휴지통', subName, fileName, true);

    $scope.initStat(fileName, $scope.trashs['휴지통'][subName][fileName].stat);


    var dirEl =  angular.element(document.getElementById('휴지통'));
    var subEl =  angular.element(document.getElementById('_휴지통_' + subName));
    var fileEl = angular.element(document.getElementById('_휴지통_' + subName + "_" + fileName));

    if( $scope.isToggleCheck == false || check) {
        $scope.toggleCheck(dirEl, subEl, fileEl);
    }

}]);