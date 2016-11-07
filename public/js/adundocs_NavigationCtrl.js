
AdunDocs.controller('navigationCtrl', ['$scope', '$http', '$routeParams', '$location', '$cookies', function navigationCtrl($scope, $http, $routeParams, $location, $cookies) {

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
        }
    });

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
        $scope.onKey = ($location.path().indexOf('write') > -1 || $location.path().indexOf('edit') > - 1) ? false : true;
        // dirEq =  $scope.$parent.focus.length != 0 ? $('.isdir').index($scope.$parent.focus) : -1;
    });

    var dirEq = -1;

    Mousetrap.bind('up', function(e) {
        if(!$scope.onKey) { return; }
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

    Mousetrap.bind('down', function(e) {
        if(!$scope.onKey) { return; }
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

    Mousetrap.bind('left', function() {
        if(!$scope.onKey) { return; }

        if( $scope.$parent.focus.hasClass('open') )
        {
            $scope.$parent.focus.removeClass('open');
            $scope.$parent.focus.removeClass('open-title');
            $scope.$parent.focus.next().slideUp();
            $scope.$parent.focus.next().find('a').each(function(idx, el){ $(el).removeClass('open');  $(el).removeClass('isdir'); });
            $scope.$parent.focus.next().find('._list-sub').each(function(idx, el){ $(el).slideUp(); });
        }
    });

    Mousetrap.bind('right', function() {
        if(!$scope.onKey) { return; }

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
    Mousetrap.bind('ctrl+up', function() {
        if(!$scope.onKey) { return; }
        $scope.$content.stop().animate({
            scrollTop: $scope.$content.scrollTop() - 130
        }, 'fast');
    });
    Mousetrap.bind('ctrl+down', function() {
        if(!$scope.onKey) { return; }
        $scope.$content.stop().animate({
            scrollTop: $scope.$content.scrollTop() + 130
        }, 'fast');
    });

    Mousetrap.bind('enter', function(e) {
        if(!$scope.onKey) { return; }
        e.preventDefault() ? r.preventDefault() : e.returnValue = false;
        $scope.focus.trigger('click');
    });
    Mousetrap.bind('esc', function(e) {
        if(!$scope.onKey) { return; }

        $scope.initialize();
    });
    Mousetrap.bind('shift+enter', function(e) {
        if(!$scope.onKey) { return; }

        var url = $scope.$parent.focus.attr('href');
        window.open(url,'_blank');
    });
    Mousetrap.bind('shift+left', function(e) {
        if(!$scope.onKey) { return; }

        $scope.historyBack();
    });
    Mousetrap.bind('shift+right', function(e) {
        if(!$scope.onKey) { return; }

        $scope.historyForward();
    });

    Mousetrap.bind('shift+up', function() {
        if(!$scope.onKey) { return; }
        $scope.$content.stop().animate({
            scrollTop: 0
        });
    });
    Mousetrap.bind('shift+down', function() {
        if(!$scope.onKey) { return; }
        $scope.$content.stop().animate({
            scrollTop: $scope.$content[0].scrollHeight
        });
    });

    Mousetrap.bind('ctrl+s', function(e) {
        e.preventDefault() ? r.preventDefault() : e.returnValue = false;
        $('#write_btn').trigger('click');
    });

    Mousetrap.bind('ctrl+e', function(e) {
        e.preventDefault() ? r.preventDefault() : e.returnValue = false;
        if(!$scope.onKey) { return; }

        if($scope.docStat.fileName) {
            // 포스트 수정 이동
        } else if($scope.blogStat.postid) {
            // 블로그 수정 이동
        }

    });

    $('body').on('keydown', 'input, select', 'ctrl+s', function(e) {
        e.preventDefault ? e.preventDefault() : e.returnValue = false;
        $('#write_btn').trigger('click');
    });
}]);