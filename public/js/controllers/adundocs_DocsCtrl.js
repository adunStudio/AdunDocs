var converter = converter || new showdown.Converter();

AdunDocs.controller('DocsCtrl', ['$rootScope', '$scope', '$http', '$routeParams','$location', '$cookies', function DocsCtrl($rootScope, $scope, $http, $routeParams, $location, $cookies) {
    moment.locale('ko');
    $scope.historyB = [];
    $scope.historyF = [];
    $scope.$navigation = $('#navigation');
    $scope.$app = $('#app');
    $scope.$body = $('body');
    $scope.$container = $('._container');
    $scope.$content = $('#content');
    $scope.$save_noti = $('#save_noti');
    $scope.theme = $('#theme').attr('href');
    $scope.editorTheme = $cookies.get('editorTheme') || 'default';
    $scope.$login = $("._login");
    $scope.isLogin = false;
    $scope.save = false;
    $scope.docStat = {
        dirName: '',
        subName: '',
        fileName: '',
        btime: '',
        mtime: ''
    };
    $scope.naver = false;
    $scope.tistoryNAME = $cookies.get('blog_name');
    $scope.tistoryADDR = $cookies.get('blog_addr');
    $scope.tistoryID   = $cookies.get('blog_id');
    $scope.tistoryKEY  = $cookies.get('blog_key');
    if( typeof $scope.tistoryADDR =='string' && $scope.tistoryADDR.indexOf('naver') > 0 )
    {
        $scope.naver = true;
    }
    $scope.addrPattern = /^https:/;
    $scope.blogName = $cookies.get('blogName') || 'Blog';
    $scope.blogCategory = null;
    $scope.blogStat = {
        dateCreated : null,
        mt_keywords : null,
        permaLink   : null,
        dirCategory : null,
        subCategory : null,
        title       : null,
        postid      : null
    };
    $scope.htmlMode = $cookies.get('htmlmode') == 'true' ? true : false;
    $scope.autoMode = $cookies.get('automode') == 'true' ? true : false;
    $scope.settingMode = false;
    $scope.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent) ? true : false;

    $scope.nameRegExp = /^[^\\/:^\*\?"<>\|]+$/;
    $scope.dirRegExp  = /^[^\\/:.^\*\?"<>\|]+$/;
    $scope.isLocalStorage = window.localStorage ? true : false;

    $scope.init = function(fn) {
        $scope.active = $();
        $scope.focus  = $();
        $scope.search = "";
        $scope.searchResult = [];
        $scope.docs = null;
        $scope.dirTree = null;
        $scope.fileTree = null;
        $scope.trashs = null;
        $scope.docStat = {};
        $scope.isToggleCheck  = false;// <- 임시방편 ... 수정해야함 toggle에서 쓰임
        $scope.blogStat = {};
        $scope.getList(fn);
    };

    $scope.getList = function(fn) {

        $http.get('/article/list').then(function(response) {
            var article = response.data;


            $scope.docs = article.docs;
            $scope.dirTree = article.dirTree;
            $scope.fileTree = article.fileTree;
            if( typeof fn === 'function') {
                fn();
            }
            //$scope.trashs = {'휴지통': response.data.trash};

            $scope.$body.removeClass('_booting _loading');
        });
    };

    $scope.init();


    $scope.setDocStat = function(dirName, subName, fileName, btime, mtime, isTrash) {
        $scope.docStat.dirName  = dirName || '';
        $scope.docStat.subName  = subName || '';
        $scope.docStat.fileName = fileName || '';
        $scope.docStat.btime     = btime || '';
        $scope.docStat.mtime     = mtime || '';
        $scope.isTrash = isTrash || false;
        $scope.setBlogStat();
    };

    $scope.naviToggle = function() {
        if( $scope.$navigation.is(':visible') )
        {
            $scope.$navigation.slideUp();
            return;
        }

        $('body').stop().animate({
            scrollTop: 0,
        }, function() {
            $scope.$navigation.slideDown();
        });

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

        if( element.is('span') ) {
            element = element.parent();
        }


        $scope.focus.removeClass('focus');
        $scope.active.removeClass('active');
        element.addClass('active');
        element.addClass('focus');
        $scope.active = element;
        $scope.focus = element;

        if(element.hasClass('open')) {
            element.removeClass('open');
            element.removeClass('open-title');
            element.next().slideUp();
            element.next().find('a').each(function(idx, el){ $(el).removeClass('open'); $(el).removeClass('isdir'); });
            element.next().find('._list-sub').each(function(idx, el){ $(el).slideUp(); });
        }
        else {
            element.addClass('open');
            element.addClass('open-title');
            element.next().slideDown();
            element.next().find('.issub').each(function(idx, el){ $(el).addClass('isdir') });
        }
    };


    $scope.toggleSub = function(event, el) {
        $scope.isToggleCheck = true;

        var element = el || angular.element(event.target);

        if( element.is('span') ) {
            element = element.parent();
        }

        $scope.focus.removeClass('focus');
        $scope.active.removeClass('active');
        element.addClass('active');
        element.addClass('focus');
        $scope.active = element;
        $scope.focus = element;

        if(element.hasClass('open')) {
            element.removeClass('open');
            element.next().slideUp();
            element.next().find('a').each(function(idx, el){  $(el).removeClass('isdir'); });

        }
        else {
            element.addClass('open');
            element.next().slideDown();
            element.next().find('.isfile').each(function(idx, el){ $(el).addClass('isdir') });
        }



    };

    $scope.toggleFile = function(event, el) {
        $scope.isToggleCheck = true;

        var element = el || angular.element(event.target);

;
        if(!$scope.search) {
            $scope.focus.removeClass('focus');
            element.addClass('focus');
            $scope.focus = element;
        }

        $scope.active.removeClass('active');
        $scope.focus.removeClass('focus');
        element.addClass('focus');
        element.addClass('active');
        $scope.active = element;
        $scope.focus = element;

    };


    $scope.toggleCheck = function(dirEl, subEl, fileEl) {

        $scope.search = "";

        var $dirEl  = (dirEl);
        var $subEl  = (subEl);
        var $fileEl = (fileEl);


        if( dirEl && !dirEl.hasClass('open') ) {
            dirEl.addClass('open');
            $dirEl.next().slideDown();
            $dirEl.next().find('.issub').each(function(idx, el){ $(el).addClass('isdir') });
        }

        if(!subEl) {
            var $dirElement = $(dirEl);
            $dirElement.addClass('active');
            $scope.focus.removeClass('focus');
            $scope.active.removeClass('active');
            $scope.active = $dirElement;
            $scope.focus = $dirElement;
            return;
        }

        if( subEl && !subEl.hasClass('open') ) {
            subEl.addClass('open');
            $subEl.next().slideDown();
            $subEl.next().find('.isfile').each(function(idx, el){ $(el).addClass('isdir') });

        }

        if(!fileEl) {
            $scope.focus.removeClass('focus');
            $scope.active.removeClass('active');
            $subEl.addClass('active');
            $scope.active = $subEl;
            $scope.focus = $subEl;
            return;
        }

        if( fileEl && !fileEl.hasClass('active') ) {
            $scope.focus.removeClass('focus');
            $fileEl.addClass('focus');

            $scope.active.removeClass('active');
            $fileEl.addClass('active');
            $scope.active = $fileEl;
            $scope.focus = $fileEl;

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

    $scope.searchDoc = function() {
        var text = $scope.search;
        if( !text || !$scope.fileTree ) {
            if($scope.isMobile)
            {
                $scope.$navigation.slideUp();
            }
            return;
        }
        if(!$scope.$navigation.is(':visible'))
        {
            $scope.$navigation.slideDown();
        }

        var result = [],
            i,
            len = $scope.fileTree.length;

        for(i = 0; i < len; ++i) {
            var file = $scope.fileTree[i];

            if( file.fileName.toLowerCase().indexOf(text.toLowerCase()) >= 0 ) {
                result.push(file);
            }
        }

        $scope.searchResult = result;
    };

    $scope.initialize = function() {
        $scope.init();
        $scope.settingMode = false;
        $location.url('/');
        $('#list').find('a').each(function(idx, el){ $(el).removeClass('open'); $(el).removeClass('active'); $(el).removeClass('focus');});
        $('#list').find('._list-sub').each(function(idx, el){ $(el).slideUp(); $(el).removeClass('isdir'); });

        if($scope.blogName !== 'Blog') {
            $scope.setBlog();
        }
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

    $scope.login = function() {
        $scope.$login.is(':visible') ? $scope.$login.hide('slide', {direction: 'right'}, 500) : $scope.$login.show('slide', {direction: 'right'}, 500);
    };

    $scope.logout = function() {
        $cookies.remove("login");
        $http.get('/article/logout').then(function(response) {
            $scope.setLogin(false);
            $scope.init();
            $location.url('/');
        });
    };




    $scope.setBlogName = function(name) {
        $scope.blogName = name;
    };

    $scope.setBlogInfo = function(addr, id, name, key) {
        $scope.tistoryADDR = addr;
        $scope.tistoryID   = id;
        $scope.tistoryNAME = name;
        $scope.tistoryKEY  = key;
    };

    $scope.setBlogCategory = function(category) {
        $scope.blogCategory = category;
    };

    $scope.setPost = function(dir, sub, title, post) {
        console.log(dir)
        console.log(sub)
      $scope.blogCategory[dir][sub][title] = post;
    };

    $scope.setBlogStat = function(dateCreated , keywords, link, dirCategory, subCategory, title, postid) {
        $scope.blogStat.dateCreated = dateCreated || null;
        $scope.blogStat.mt_keywords = keywords    || null;
        $scope.blogStat.permaLink   = link        || null;
        $scope.blogStat.dirCategory = dirCategory || null;
        $scope.blogStat.subCategory = subCategory || null;
        $scope.blogStat.title       = title       || null;
        $scope.blogStat.postid      = postid      || null;
    };


    $scope.setBlog = function(fn) {
        $scope.getBlogCategory(function() {
            $scope.getPosts(fn);
        });
    };

    // 블로그 카테고리 가져온 후 -> set
    $scope.getBlogCategory = function(fn) {
        $.ajax({
            method  : 'POST',
            url     : 'http://www.oppacoding.com/adundocs/index.php',
            dataType: 'json',
            data    : {
                name: $scope.tistoryNAME,
                addr: $scope.tistoryADDR,
                id  : $scope.tistoryID,
                key : $scope.tistoryKEY,
                method: 'metaWeblog.getCategories'
            }
        }).done(function(response) {
            if( response.result && response.data )
            {
                var data = response.data;
                console.dir(data);
                var categorys = {};
                var name = '';
                angular.forEach(data, function(category) {
                    name = category.title;
                    if( $scope.naver )
                    {
                        categorys[name] = {};
                        categorys[name][name] = {};
                    }
                    else
                    {
                        if( name.indexOf('/') > 0 )
                        {
                            var splitArr = name.split('/');
                            if( !categorys[splitArr[0]] ) {
                                categorys[splitArr[0]] = {};
                            }
                            categorys[splitArr[0]][splitArr[1]] = {};
                        } else
                        {
                            if( !categorys[name] ) {
                                categorys[name] = {};
                            }
                        }
                    }

                });

                $scope.setBlogCategory(categorys);

                if( typeof fn == 'function') {
                    fn();
                }
            } else {
                alert('카테고리 로드 실패');
            }
        });
    };


    // 블로그 최신글 가져온 후 -> set
    $scope.getPosts = function(fn) {
        $.ajax({
            method  : 'POST',
            url     : 'http://www.oppacoding.com/adundocs/index.php',
            dataType: 'json',
            data    : {
                name: $scope.tistoryNAME,
                addr: $scope.tistoryADDR,
                id  : $scope.tistoryID,
                key : $scope.tistoryKEY,
                method: 'metaWeblog.getRecentPosts'
            }
        }).done(function(response) {
            if( response.result && response.data )
            {
                var data = response.data;
                var categoryName = '';
                angular.forEach(data, function(post) {
                    categoryName = post.categories[0];
                    if ( $scope.naver ) {
                        $scope.setPost(categoryName, categoryName, post.title, post);
                    }
                    else if( !categoryName )
                    {
                        if( !$scope.blogCategory['분류없음'] )
                        {
                            $scope.blogCategory['분류없음'] = {};
                            $scope.blogCategory['분류없음']['분류없음'] = {};
                        }
                        $scope.setPost('분류없음', '분류없음', post.title, post);
                    }
                    else if( categoryName.indexOf('/') > 0 )
                    {
                        var splitArr = categoryName.split('/');
                        $scope.setPost(splitArr[0], splitArr[1], post.title, post);
                    }
                    else
                    {
                        if( !$scope.blogCategory[categoryName]['분류없음'] ) {
                            $scope.blogCategory[categoryName]['분류없음'] = {};
                        }
                        $scope.setPost(categoryName, '분류없음', post.title, post);
                    }
                });
                $scope.blogReady = true;
                if(typeof fn == 'function') {
                    fn();
                }
                if (!$rootScope.$$phase) $rootScope.$apply();

            }
        }).fail(function() {
            $scope.contentShow(true);
        });
    };




    if($scope.blogName !== 'Blog') {
        $scope.setBlog();
    }

    $scope.setHtmlMode = function(bool) {
        $scope.htmlMode = bool;
    };

    $scope.setAutoMode = function(bool) {
        $scope.autoMode = bool;
    };

    $scope.settting  = function(bool) {
        $scope.settingMode = bool;
    };

    $scope.historyForward = function() {
        if( $scope.historyF.length > 0) {
            var nextUrl = $scope.historyF.pop();
            $location.path(nextUrl);
            if (!$rootScope.$$phase) $rootScope.$apply();
        }
    };



    $scope.historyBack = function() {
        var arr, prevUrl;

        if( $scope.historyB.length > 1) {
            arr = $scope.historyB.splice(-2);
            prevUrl = arr[0];
            $scope.historyF.push(arr[1]);
            $location.path(prevUrl);

            if (!$rootScope.$$phase) $rootScope.$apply();
        }
    };

    $scope.$on('$routeChangeSuccess', function() {
        $scope.historyB.push($location.$$path);
    });

    $scope.$on('beforeunload', function() {
        $scope.$broadcast('before');
    });

    $scope.bf =false;
    $scope.$watch('bf', function() {
        if($scope.bf == true) {
            var dirEl = $scope.docStat.dirName   ?  angular.element(document.getElementById('_' + $scope.docStat.dirName)) : null;
            var subEl = $scope.docStat.subName   ?  angular.element(document.getElementById('_' + $scope.docStat.dirName + "_" + $scope.docStat.subName)) : null;
            var fileEl = $scope.docStat.fileName ?  angular.element(document.getElementById('_' + $scope.docStat.dirName + "_" +$scope.docStat. subName + "_" + $scope.docStat.fileName)) : null;
            $scope.toggleCheck(dirEl, subEl, fileEl);
            $scope.bf = false;
        }
    });

    $scope.contentShow = function(show) {
        if( show ) {
            $scope.$content.find('div').fadeIn();
            $scope.$content.removeClass('_content-loading')
        }
        else {
            $scope.$content.find('div').fadeOut();
            $scope.$content.addClass('_content-loading');
        }
    };
}]);