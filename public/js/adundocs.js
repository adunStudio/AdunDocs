var converter = new showdown.Converter();

var AdunDocs = angular.module('AdunDocs', ['ngRoute']);


AdunDocs.config(function($routeProvider) {
    $routeProvider
        .when('/',      {templateUrl: 'views/intro.html'})
        .when('/about', {templateUrl: 'views/about.html'})
        .when('/news',  {templateUrl: 'views/news.html'})
        .when('/tips',  {templateUrl: 'views/tips.html'})
        .when('/:dirName', {templateUrl: 'views/md.html'})
        .when('/:dirName/:subName', {templateUrl: 'views/md.html'})
        .when('/:dirName/:subName/:fileName', {templateUrl: 'views/md.html', controller: 'viewCtrl'})
        .when('/search/:dirName/:subName/:fileName', {templateUrl: 'views/md.html', controller: 'viewCtrl'})
        .otherwise({redirectTo: '/'});
});

AdunDocs.controller('viewCtrl', ['$scope', '$http', '$routeParams', '$timeout', function viewCtrl($scope, $http, $routeParams, $timeout) {
    var dirName = $scope.dirName = $routeParams.dirName;
    var subName = $scope.subName = $routeParams.subName;
    var fileName = $scope.fileName = $routeParams.fileName;

    if (dirName && subName && fileName) {
        var url = $scope.toURL('/' + dirName + '/' + subName + '/' + fileName);

        $http.get('/article' + url).then(function (response) {
            var html = converter.makeHtml(response.data);
            $('#main').html(html);
        });
    }
    $timeout(function() {
        var dirEl =  angular.element(document.getElementById('dir_' + dirName));
        var subEl =  angular.element(document.getElementById('sub_' + subName));
        var fileEl = angular.element(document.getElementById('file_' + fileName));

        $scope.parentFocus = $scope.focus;
        $scope.parentActive = $scope.active;

        if(!dirEl.hasClass('open') && !subEl.hasClass('open')) {
                dirEl.addClass('open');
                $(dirEl).next().slideDown();
                subEl.addClass('open');
                $(subEl).next().slideDown();
                var $element = $(fileEl);
                $element.addClass('focus');
                $scope.parentFocus = $element;
                $element.addClass('active');
                $scope.parentActive = $element;
        }


    })



}]);

