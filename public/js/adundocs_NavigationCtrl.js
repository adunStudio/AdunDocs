
AdunDocs.controller('navigationCtrl', ['$rootScope', '$scope', '$http', '$routeParams', '$location', '$cookies', function navigationCtrl($rootScope, $scope, $http, $routeParams, $location, $cookies) {

    $scope.$changeNameModal = $('#changeNameModal');
    $scope.$trashModal      = $('#trashModal');
    $scope.$changePostNameModal = $('#changePostNameModal');
    $scope.$trashPostModal      = $('#trashPostModal');

    $scope.nameRegExp = /^[^\\/:^\*\?"<>\|]+$/;
    $scope.dirRegExp  = /^[^\\/:.^\*\?"<>\|]+$/;

    $scope.editorThemes =  ["default", "3024-day", "3024-night", "ambiance", "ambiance-mobile", "base16-light", "blackboard", "cobalt", "eclipse", "elegant", "erlang-dark", "lesser-dark", "mbo", "mdn-like", "midnight", "monokai", "neat", "neo", "night", "paraiso-dark", "paraiso-light", "pastel-on-dark", "rubyblue", "solarized", "the-matrix", "tomorrow-night-eighties", "twilight", "vibrant-ink", "xq-dark", "xq-light"];

    $scope.trashName   = "";
    $scope.changeName  = "";
    $scope.tranhPostName ="";
    $scope.changePostName ="";

    $scope.$watch('docStat.fileName', function() {
        if( !$scope.docStat.fileName ) {return;}
        $scope.changeName = $scope.docStat.fileName.substr(0, $scope.docStat.fileName.length - 3);

    });

    $scope.$watch('blogStat.title', function() {
        $scope.changePostName = $scope.blogStat.title;
    });


    $scope.settingButton = function() {
        $scope.settting($scope.settingMode ? false : true);
    };

    $scope.setting_htmlButton = function() {
        var expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 300);
        var mode = $scope.htmlMode = ($scope.htmlMode == true ? true : false);
        $scope.setHtmlMode(mode);
        $cookies.put('htmlmode', mode, {'expires': expireDate});
    };

    $scope.setting_autoButton = function() {
        var expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 300);
        var mode = $scope.autoMode = ($scope.autoMode == true ? true : false);
        $scope.setAutoMode(mode);
        $cookies.put('automode', mode, {'expires': expireDate});
    };

    $scope.changeEditorTheme = function() {
        var expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 300);
        $cookies.put('editorTheme', $scope.editorTheme, {'expires': expireDate});
    };

    $.contextMenu({
        selector: '._-file-_',
        callback: function(key, options) {
            switch(key) {
                case 'edit':
                    location.href = $(this).data('edit');
                    break;
                case 'trash':
                    $scope.$trashModal.modal();
                    break;
                case 'name':
                    $scope.$changeNameModal.modal();
                    break;
            }
        },
        items: {
            "edit": {name: "Edit", icon: "fa-edit"},
            "sep1": "---------",
            "name": {name: 'Name', icon: "fa-tags"},
            "sep2": "---------",
            "trash": {name: "Trash", icon: "fa-trash"},
            "sep3": "---------",
            "quit": {name: "Quit", icon: "fa-times"}
        },
        events:{
            show: function() {
                return  $scope.$parent.isLogin;
            }
        }
    });
    $.contextMenu({
        selector: '._-dir-_, ._-sub-_',
        callback: function(key, options) {

            switch(key) {
                case 'write':
                    location.href = $(this).data('write');
                    break;
            }
        },
        items: {
            "write": {name: "Write", icon: "fa-pencil"},
            "sep1": "---------",
            "quit": {name: "Quit", icon: "fa-times"}
        },
        events:{
            show: function() {
                return  $scope.$parent.isLogin;
            }
        }
    });


    $('#changeNameModal,#trashModal,#changePostName,#trashPostModal').on('hide.bs.modal', function () {
        $scope.changeName = $scope.docStat.fileName.substr(0, $scope.docStat.fileName.length - 3);
        $scope.trashName  = null;
        $scope.changePostName = null;
        $scope.trashPostName = null;
    });

    $.contextMenu({
        selector: '._-blog-_',
        callback: function(key, options) {
            var nameArr = $(this).attr('id').split('_');

            switch(key) {
                case 'edit':
                    location.href = $(this).data('edit');
                    break;
                case 'trash':
                    $scope.$trashPostModal.modal();
                    break;
                case 'name':
                    $scope.$changePostNameModal.modal();
                    break;
            }
        },
        items: {
            "edit": {name: "Edit", icon: "fa-edit"},
            "sep1": "---------",
            "name": {name: 'Name', icon: "fa-tags"},
            "sep2": "---------",
            "trash": {name: "Trash", icon: "fa-trash"},
            "sep3": "---------",
            "quit": {name: "Quit", icon: "fa-times"}
        }
    });


    $scope.reName = function() {
        if( $scope.changeNameForm.$valid ) {
            $http({
                method  : 'POST',
                url     : '/article/rename',
                data    : {
                    dirName : $scope.docStat.dirName,
                    subName : $scope.docStat.subName,
                    fileName: $scope.docStat.fileName,
                    newName : $scope.changeName
                },
                headers : {'Content-Type': 'application/json'}
            }).then(function(response) {
                var result = response.data;
                if( result.result )
                {
                    var dirName    = $scope.docStat.dirName;
                    var subName    = $scope.docStat.subName;
                    var changeName = $scope.changeName;

                    $scope.$changeNameModal.modal('hide');
                    $scope.getList(function() {
                        $location.url(dirName +'/' + subName + '/' + changeName + '.md?check=1');
                    });
                } else { alert(result.msg); }
            });

        } else {
            $scope.$changeNameModal.effect('shake');
        }
    };


    $scope.trash = function() {
        if( $scope.trashForm.$valid && $scope.fileName == $scope.trashName ) {
            $http({
                method  : 'POST',
                url     : '/article/delete',
                data    : {
                    dirName   : $scope.docStat.dirName,
                    subName   : $scope.docStat.subName,
                    fileName  : $scope.docStat.fileName,
                    trashName : $scope.trashName
                },
                headers : {'Content-Type': 'application/json'}
            }).then(function(response) {
                var result = response.data;
                if( result.result )
                {
                    $scope.$trashModal.modal('hide');
                    $scope.trashName   = "";

                    $scope.getList(function() {
                        $scope.setDocStat();
                        $location.url('/#');
                    });
                } else { alert(result.msg); }
            });
        } else {
            $scope.$trashModal.effect('shake');
        }
    };

    $scope.reNamePost = function() {
        if( $scope.changePostNameForm.$valid ) {
            $http({
                method  : 'POST',
                url     : '/tistory/rename',
                data    : {
                    postid: $scope.blogStat.postid,
                    title: $scope.changePostName
                },
                headers : {'Content-Type': 'application/json'}
            }).then(function(response) {
                var result = response.data;
                if( result )
                {
                    $scope.$changePostNameModal.modal('hide');
                    $scope.setBlog(function() {
                        $location.url('blog/' + $scope.blogStat.dirCategory +'/' + $scope.blogStat.subCategory + '/' + $scope.changePostName + '?check=1');
                    });
                }
                else
                {
                    alert('수정 실패');
                }
            });

        } else {
            $scope.$changePostNameModal.effect('shake');
        }
    };



    $.contextMenu({
        selector: '._-blog_dir-_, ._-blog_sub-_',
        callback: function(key, options) {
            switch(key) {
                case 'newPost':
                    location.href = $(this).data('newpost');
                    break;
            }
        },
        items: {
            "newPost": {name: "New Post", icon: "fa-pencil"},
            "sep1": "---------",
            "quit": {name: "Quit", icon: "fa-times"}
        }
    });


    $scope.$on('$locationChangeSuccess', function(event) {
        $scope.editMode = ($location.path().indexOf('write') > -1 || $location.path().indexOf('edit') > - 1) ? true : false;
        // dirEq =  $scope.$parent.focus.length != 0 ? $('.isdir').index($scope.$parent.focus) : -1;
    });

    var dirEq = -1;

    Mousetrap.bind(['up', 'w'], function(e) {
        e.preventDefault() ? r.preventDefault() : e.returnValue = false;

        if( $scope.$parent.focus.length != 0 )
        {
            dirEq = $('.isdir').index($scope.$parent.focus);
        } else {dirEq = -1;}

        dirEq--;
        if($('.isdir').length == -1) {
            dirEq = $('.isdir').length;
        }
        $scope.$parent.focus.removeClass('focus');
        $scope.$parent.focus = $('.isdir').eq(dirEq);
        $scope.$parent.focus.addClass('focus');
    });

    Mousetrap.bind(['down', 's'], function(e) {
        e.preventDefault() ? r.preventDefault() : e.returnValue = false;

        if( $scope.$parent.focus.length != 0 )
        {
            dirEq = $('.isdir').index($scope.$parent.focus);
        } else {dirEq = -1;}
        dirEq++;
        if($('.isdir').length == dirEq) {
            dirEq = 0;
        }
        $scope.$parent.focus.removeClass('focus');
        $scope.$parent.focus = $('.isdir').eq(dirEq);
        $scope.$parent.focus.addClass('focus');
    });

    Mousetrap.bind(['left', 'a'], function() {

        if( $scope.$parent.focus.hasClass('open') )
        {
            $scope.$parent.focus.removeClass('open');
            $scope.$parent.focus.removeClass('open-title');
            $scope.$parent.focus.next().slideUp();
            $scope.$parent.focus.next().find('a').each(function(idx, el){ $(el).removeClass('open');  $(el).removeClass('isdir'); });
            $scope.$parent.focus.next().find('._list-sub').each(function(idx, el){ $(el).slideUp(); });
        }
    });

    Mousetrap.bind(['right', 'd'], function() {

        if( !$scope.$parent.focus.hasClass('open') )
        {
            $scope.$parent.focus.addClass('open');
            $scope.$parent.focus.addClass('open-title');
            $scope.$parent.focus.next().slideDown();
            $scope.$parent.focus.next().find('.issub').each(function(idx, el){ $(el).addClass('isdir') });
            if( $scope.$parent.focus.hasClass('issub') )
            {
                $scope.$parent.focus.next().find('.isfile').each(function(idx, el){ $(el).addClass('isdir') });
            }
        }
    });
    Mousetrap.bind(['ctrl+up', 'r'], function() {
        $scope.$content.stop().animate({
            scrollTop: $scope.$content.scrollTop() - 130
        }, 'fast');
    });
    Mousetrap.bind(['ctrl+down' , 'f'], function() {
        $scope.$content.stop().animate({
            scrollTop: $scope.$content.scrollTop() + 130
        }, 'fast');
    });

    Mousetrap.bind(['enter', 'space'], function(e) {
        e.preventDefault() ? r.preventDefault() : e.returnValue = false;
        $scope.focus.trigger('click');
    });
    Mousetrap.bind('esc', function(e) {
        $scope.initialize();

    });
    Mousetrap.bind('shift+enter', function(e) {

        var url = $scope.$parent.focus.attr('href');
        window.open(url,'_blank');
    });


    Mousetrap.bind(['shift+up', 'shift+r'], function() {
        $scope.$content.stop().animate({
            scrollTop: 0
        });
    });
    Mousetrap.bind(['shift+down', 'shift+f'], function() {
        $scope.$content.stop().animate({
            scrollTop: $scope.$content[0].scrollHeight
        });
    });

    Mousetrap.bind('ctrl+s', function(e) {
        e.preventDefault() ? e.preventDefault() : e.returnValue = false;
        if($scope.editMode)
        {
            $('#write_btn').trigger('click');
        }
    });

    Mousetrap.bind('ctrl+1', function(e) {
        e.preventDefault() ? e.preventDefault() : e.returnValue = false;
        $location.path('/blog');
        if (!$rootScope.$$phase) $rootScope.$apply();
    });
    Mousetrap.bind('ctrl+2', function(e) {
        e.preventDefault() ? e.preventDefault() : e.returnValue = false;
        $location.path('/about');
        if (!$rootScope.$$phase) $rootScope.$apply();
    });
    Mousetrap.bind('ctrl+3', function(e) {
        e.preventDefault() ? e.preventDefault() : e.returnValue = false;
        $location.path('/news');
        if (!$rootScope.$$phase) $rootScope.$apply();
    });
    Mousetrap.bind('ctrl+4', function(e) {
        e.preventDefault() ? e.preventDefault() : e.returnValue = false;
        $location.path('/tips');
        if (!$rootScope.$$phase) $rootScope.$apply();
    });
    Mousetrap.bind('ctrl+5', function(e) {
        e.preventDefault() ? e.preventDefault() : e.returnValue = false;
        if($scope.editMode) { return; }

        if( $scope.isLogin )
        {
            $location.path('/write');
            if (!$rootScope.$$phase) $rootScope.$apply();
        }
    });
    Mousetrap.bind('f3', function(e) {
        e.preventDefault() ? r.preventDefault() : e.returnValue = false;
        if($scope.editMode) { return; }

        if( $scope.isLogin && $scope.docStat.fileName) {
            $location.path('/edit/' + $scope.docStat.dirName + '/' + $scope.docStat.subName + '/' + $scope.docStat.fileName);
            if (!$rootScope.$$phase) $rootScope.$apply();
        } else if($scope.blogStat.postid) {
            $location.path('/blog/edit/' + $scope.blogStat.postid);
            if (!$rootScope.$$phase) $rootScope.$apply();
        }
    });
    Mousetrap.bind('f2', function(e) {
        e.preventDefault() ? r.preventDefault() : e.returnValue = false;
        if($scope.editMode) { return; }

        if( $scope.isLogin && $scope.docStat.dirName ) {
            $location.path(makeWritePage($scope.docStat.dirName, $scope.docStat.subName, false));
            if (!$rootScope.$$phase) $rootScope.$apply();
        } else if( $scope.blogStat.dirCategory ) {
            $location.path(makeWritePage($scope.blogStat.dirCategory, $scope.blogStat.subCategory, true));
            if (!$rootScope.$$phase) $rootScope.$apply();
        }
    });
    Mousetrap.bind('alt+left', function(e) {
        e.preventDefault() ? r.preventDefault() : e.returnValue = false;
        $scope.historyBack();

    });
    Mousetrap.bind('alt+right', function(e) {
        e.preventDefault() ? r.preventDefault() : e.returnValue = false;
        $scope.historyForward();

    });


    function makeWritePage(dirName, subName, isBlog) {
        var str = isBlog ? '/blog/write' : '/write';

        if(dirName) {
            str += '/' + dirName;
        }
        if(subName) {
            str += '/' + subName;
        }

        return str;
    }

    $(window).on('beforeunload', function(e) {
        if(($location.path().indexOf('write') > -1 || $location.path().indexOf('edit') > - 1))
        {

            $scope.$emit('beforeunload');
            return '변경사항이 저장되지 않을 수 있습니다.';
        }
    });

    $rootScope.$on('$locationChangeStart', function (event, next, current) {
        if($('#write_btn').length != 0 && !$scope.$parent.save)
        {
            if(!confirm('변경사항이 저장되지 않을 수 있습니다. \n나가시겠습니까?')) {
                event.preventDefault();
            } else {
                $scope.$emit('beforeunload');
            }
        }
        $scope.$parent.save = false;
    });
}]);