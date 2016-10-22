var converter = new showdown.Converter();

var AdunDocs = angular.module('AdunDocs', ['ngRoute']);


AdunDocs.config(function($routeProvider) {
    $routeProvider
        .when('/',      {templateUrl: 'views/intro.html', controller: 'DocsCtrl'})
        .when('/about', {templateUrl: 'views/about.html', controller: 'DocsCtrl'})
        .when('/news',  {templateUrl: 'views/news.html',  controller: 'DocsCtrl'})
        .when('/tips',  {templateUrl: 'views/tips.html' , controller: 'DocsCtrl'})
        .when('/:dirName/:subName/:fileName', {templateUrl: 'views/md.html', controller: 'DocsCtrl'})
        .otherwise({redirectTo: '/'});
});

AdunDocs.controller('DocsCtrl', function DocsCtrl($scope, $http, $routeParams) {

    $scope.active = $();
    $scope.focus  = $();
    $scope.isOpen = false;
    $scope.search = "";
    $scope.searchResult = [];
    $scope.docs = null;

    $scope.init = function() {
        if($scope.docs) {
            var dirName  = $scope.dirName  = $routeParams.dirName;
            var subName  = $scope.subName  = $routeParams.subName;
            var fileName = $scope.fileName = $routeParams.fileName;

            if( dirName && subName && fileName ) {


                var url = $scope.toURL('/' + dirName + '/' + subName + '/' + fileName);

                $http.get('/article' + url).then(function(response) {
                    var html = converter.makeHtml(response.data);
                    $('#main').html(html);

                });
            }
        } else {
            $http.get('/article.json').then(function(response) {
                $scope.docs = response.data;

                var dirName  = $scope.dirName  = $routeParams.dirName;
                var subName  = $scope.subName  = $routeParams.subName;
                var fileName = $scope.fileName = $routeParams.fileName;

                if( dirName && subName && fileName ) {


                    var url = $scope.toURL('/' + dirName + '/' + subName + '/' + fileName);

                    $http.get('/article' + url).then(function(response) {
                        var html = converter.makeHtml(response.data);
                        $('#main').html(html);

                    });
                }

            });
        }

    };

    $scope.init();





    $scope.toggleTheme = function(obj) {
        var white = '/css/style_white.css';
        var black = '/css/style_black.css';
        var current = $('#theme').attr('href');
        $('#theme').attr('href', current == white ? black : white);
    };

    $scope.getLength = function(obj) {
        if(!obj) {return;}
        return Object.keys(obj).length;
    };

    $scope.getDeepLength = function(obj) {
        if(!obj) {return;}

        var length = 0;

        angular.forEach(obj, function(value, key) {
            length += $scope.getLength(value);
        });

        return length;
    };

    $scope.toggleDir = function(event) {
        var element = angular.element(event.target);
        var $element = $(element);

        $scope.active.removeClass('active');
        $element.addClass('active');
        $scope.active = $element;

        if(element.hasClass('open')) {
            element.removeClass('open');
            $element.next().slideUp();
            $element.next().find('a').each(function(idx, el){ $(el).removeClass('open') });
            $element.next().find('._list-sub').each(function(idx, el){ $(el).slideUp(); });
        }
        else {
            element.addClass('open');
            $element.next().slideDown();
        }
    };

    $scope.toggleSub = function(event) {
        var element = angular.element(event.target);
        var $element = $(element);

        $scope.active.removeClass('active');
        $element.addClass('active');
        $scope.active = $element;

        if(element.hasClass('open')) {
            element.removeClass('open');
            $element.next().slideUp();
        }
        else {
            element.addClass('open');
            $element.next().slideDown();
        }
    };

    $scope.view = function(event, file) {
        var element = angular.element(event.target);
        var $element = $(element);

        if(!$scope.search) {
            $scope.focus.removeClass('focus');
            $element.addClass('focus');
            $scope.focus = $element;
        }

        $scope.active.removeClass('active');
        $element.addClass('active');
        $scope.active = $element;
    };

    $scope.replaceSpacing = function(str) {
        return str.replace(/\s/g, '_');
    };

    $scope.toURL = function(str) {
        //return encodeURI($scope.replaceSpacing(str));
        return encodeURI(str);
    };


    $scope.searchDoc = function() {
        var text = $scope.search;
        if( !text ) { return; }

        var result = [];

        angular.forEach($scope.docs, function(dir, dirName) {
            angular.forEach(dir, function(sub, subName) {
                angular.forEach(sub, function(file, fileName) {
                    if(fileName.toLowerCase().indexOf(text.toLowerCase()) >= 0) {
                        result.push({
                            dirName: dirName,
                            subName: subName,
                            name: fileName,
                            file: file,
                        });
                    }
                })
            })
        });

        $scope.searchResult = result;
    };
});