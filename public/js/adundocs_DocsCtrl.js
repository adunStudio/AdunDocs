var converter = converter || new showdown.Converter();


AdunDocs.controller('DocsCtrl', ['$scope', '$http', '$routeParams', function DocsCtrl($scope, $http, $routeParams) {

    $scope.theme = '';
    $scope.isLogin = false;

    $scope.init = function(fn) {

        $scope.active = $();
        $scope.focus  = $();
        $scope.search = "";
        $scope.searchResult = [];
        $scope.docs = null;
        $scope.stat = {};
        $scope.dirTree = null;
        $scope.fileArray = null;

        $scope.dirName = '';
        $scope.subName = '';
        $scope.fileName = '';

        $scope.isToggleCheck  = false;// <- 임시방편 ... 수정해야함 toggle에서 쓰임

        $http.get('/article.json').then(function(response) {
            $scope.docs = response.data;
            $scope.makeTreeAndArray();

            if( typeof fn === 'function') {
                fn();
            }

        });

    };

    $scope.init();

    $scope.makeTreeAndArray = function() {
        $scope.dirTree  = {};
        $scope.fileArray = [];

        angular.forEach($scope.docs, function(dir, dirName) {
            $scope.dirTree[dirName] = [];

            angular.forEach(dir, function(sub, subName) {
                $scope.dirTree[dirName].push(subName);

                angular.forEach(sub, function(file, fileName) {
                    file.dirName = dirName;
                    file.subName = subName;
                    file.name = fileName;

                    $scope.fileArray.push(file);
                });
            });
        });
    };

    $scope.setName = function(dirName, subName, fileName) {
        $scope.dirName  = dirName  || '';
        $scope.subName  = subName  || '';
        $scope.fileName = fileName || '';
    };


    $scope.toLocation = function(event) {
        var element = angular.element(event.target);
        var $element = $(element);
        $scope.search = '';
        location.href=  $element.data('link');
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

    $scope.toggleDir = function(event, el) {
        $scope.isToggleCheck = true;

        var element = el || angular.element(event.target);
        var $element = $(element);

        $scope.focus.removeClass('focus');
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

    $scope.toggleSub = function(event, el) {
        $scope.isToggleCheck = true;

        var element = el || angular.element(event.target);
        var $element = $(element);

        $scope.focus.removeClass('focus');
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

    $scope.toggleFile = function(event, el) {
        $scope.isToggleCheck = true;

        var element = el || angular.element(event.target);
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



    $scope.toggleCheck = function(dirEl, subEl, fileEl) {

        $scope.search = "";

        var $dirEl  = $(dirEl);
        var $subEl  = $(subEl);
        var $fileEl = $(fileEl);


        if( dirEl && !dirEl.hasClass('open') ) {
            dirEl.addClass('open');
            $(dirEl).next().slideDown();
        }

        if(!subEl) {
            var $dirElement = $(dirEl);
            $dirElement.addClass('active');
            $scope.focus.removeClass('focus');
            $scope.active.removeClass('active');
            $scope.active = $dirElement;
            return;
        }

        if( subEl && !subEl.hasClass('open') ) {
            subEl.addClass('open');
            $(subEl).next().slideDown();
        }

        if(!fileEl) {
            $scope.focus.removeClass('focus');
            $scope.active.removeClass('active');
            $subEl.addClass('active');
            $scope.active = $subEl;
            return;
        }

        if( fileEl && !fileEl.hasClass('active') ) {

            $fileEl.addClass('focus');
            $scope.focus = $fileEl;

            $scope.active.removeClass('active');
            $fileEl.addClass('active');
            $scope.active = $fileEl;
        }
    };


    $scope.searchToggle = function(event) {
        var element = angular.element(event.target);
        var $element = $(element);

        $scope.active.removeClass('active');
        $element.addClass('active');
        $scope.active = $element;
    };


    $scope.toURL = function(str) {
        return encodeURI(str);
    };

    $scope.initStat = function(name, stat) {
        $scope.stat.name = name || '';
        if(!stat) {
            $scope.stat = {};
            return;
        }
        $scope.stat.btime = stat.birthtime;
        $scope.stat.mtime = stat.mtime;
    };

    $scope.searchDoc = function() {
        var text = $scope.search;
        if( !text || !$scope.fileArray ) { return; }

        var result = [],
            i,
            len = $scope.fileArray.length;

        for(i = 0; i < len; ++i) {
            var file = $scope.fileArray[i];

            if( file.name.toLowerCase().indexOf(text.toLowerCase()) >= 0 ) {
                result.push(file);
            }
        }

        $scope.searchResult = result;
    };

    $scope.initialize = function() {
        $scope.init();
        $('#list').find('a').each(function(idx, el){ $(el).removeClass('open') });
        $('#list').find('._list-sub').each(function(idx, el){ $(el).slideUp(); });
    };

    $scope.setFileArray = function(arr) {
        $scope.fileArray = arr;
    };

    $scope.setTheme = function(theme) {
        $scope.theme = theme;
    };

    $scope.setLogin = function(login) {
        $scope.isLogin = login;
    };

    $scope.unLoginCheck = function() {
        return !$scope.isLogin;
    };

    var $login = $scope.$login = $("._login");
    $scope.login = function() {
        $login.is(':visible') ? $login.hide('slide', {direction: 'right'}, 500) : $login.show('slide', {direction: 'right'}, 500);
    };
}]);