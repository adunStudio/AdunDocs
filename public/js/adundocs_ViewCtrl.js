var converter = converter || new showdown.Converter();

AdunDocs.controller('viewCtrl', ['$scope', '$http', '$routeParams', '$timeout', function viewCtrl($scope, $http, $routeParams, $timeout) {
    var dirName  = $routeParams.dirName;
    var subName  = $routeParams.subName;
    var fileName = $routeParams.fileName;




    $scope.makeStat(fileName, $scope.docs[dirName][subName][fileName].stat);



    var url = $scope.toURL('/' + dirName + '/' + subName + '/' + fileName);

    $http.get('/article' + url).then(function (response) {
        var html = converter.makeHtml(response.data);
        $('#main').html(html);
    });

    $scope.setName(dirName, subName, fileName);

    var dirEl =  angular.element(document.getElementById('_' + dirName));
    var subEl =  angular.element(document.getElementById('_' + dirName + "_" + subName));
    var fileEl = angular.element(document.getElementById('_' + dirName + "_" + subName + "_" + fileName));

    $scope.toggleCheck(dirEl, subEl, fileEl);
}]);