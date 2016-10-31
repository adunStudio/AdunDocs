var converter = new showdown.Converter();

var AdunDocs = angular.module('AdunDocs', ['ngRoute', 'ngCookies', 'ngSanitize', 'ngMessages']);


AdunDocs.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/',        {templateUrl: 'views/intro.html'})
        .when('/about',   {templateUrl: 'views/about.html'})
        .when('/news',    {templateUrl: 'views/news.html',    controller: 'newsCtrl'})
        .when('/tips',    {templateUrl: 'views/tips.html'})
        .when('/blog',    {templateUrl: 'views/blog.html',    controller: 'blogCtrl'})
        .when('/blog/view/:postid',                  {templateUrl: 'views/blog/blog_view.html', controller: 'blogViewCtrl'})
        .when('/blog/edit/:postid',                  {templateUrl: 'views/blog/blog_edit.html', controller: 'blogEditCtrl'})
        .when('/write',   {templateUrl: 'views/write.html',   controller: 'writeCtrl'})
        .when('/edit/:dirName/:subName/:fileName',   {templateUrl: 'views/edit.html',   controller: 'editCtrl'})
        .when('/search/:dirName/:subName/:fileName', {templateUrl: 'views/view.html',   controller: 'searchCtrl'})
        .when('/:dirName',                           {templateUrl: 'views/dir.html',    controller: 'dirCtrl'})
        .when('/:dirName/:subName',                  {templateUrl: 'views/sub.html',    controller: 'subCtrl'})
        .when('/:dirName/:subName/:fileName',        {templateUrl: 'views/view.html',   controller: 'viewCtrl'})
        .otherwise({redirectTo: '/'});
}]);

AdunDocs.directive('ngRightClick', function($parse) {
    return function(scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            scope.$apply(function() {
                event.preventDefault();
                location.href = element.attr('href');
                fn(scope, {$event:event});
            });
        });
    };
});
