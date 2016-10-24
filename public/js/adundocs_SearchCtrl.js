var converter = converter || new showdown.Converter();

AdunDocs.controller('searchCtrl', ['$scope', '$http', '$routeParams', '$timeout', function searchCtrl($scope, $http, $routeParams, $timeout) {
    var dirName  = $routeParams.dirName;
    var subName  = $routeParams.subName;
    var fileName = $routeParams.fileName;


    var url = $scope.toURL('/' + dirName + '/' + subName + '/' + fileName);

    $http.get('/article' + url).then(function (response) {
        var html = converter.makeHtml(response.data);
        $('#main').html(html);
    });

    $scope.setName(dirName, subName, fileName);
}]);