
AdunDocs.controller('navigationCtrl', ['$scope', '$http', '$routeParams', '$location', '$cookies', function navigationCtrl($scope, $http, $routeParams, $location, $cookies) {

    $scope.$changeNameModal = $('#changeNameModal');
    $scope.$trashModal      = $('#trashModal');
    $scope.$changePostNameModal = $('#changePostNameModal');
    $scope.$trashPostModal      = $('#trashPostModal');

    $scope.nameRegExp = /^[^\\/:^\*\?"<>\|]+$/;
    $scope.dirRegExp  = /^[^\\/:.^\*\?"<>\|]+$/;

    $scope.trashName   = "";
    $scope.changeName  = "";
    $scope.tranhPostName ="";
    $scope.changePostName ="";

    $scope.$watch('fileName', function() {
        $scope.changeName = $scope.fileName.substr(0, $scope.fileName.length - 3);
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
        $scope.changeName = $scope.fileName.substr(0, $scope.fileName.length - 3);
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
                    dirName : $scope.dirName,
                    subName : $scope.subName,
                    fileName: $scope.fileName,
                    newName : $scope.changeName
                },
                headers : {'Content-Type': 'application/json'}
            }).then(function(response) {
                var result = response.data;
                if( result.result )
                {
                    var dirName    = $scope.dirName;
                    var subName    = $scope.subName;
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
                    dirName   : $scope.dirName,
                    subName   : $scope.subName,
                    fileName  : $scope.fileName,
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
                        $scope.initStat();
                        $scope.setName();
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


    $(window).on('keydown', function(e) {
        
        if ($(e.target).is('input, textarea')) {
            return;
        }
        var keyCode = e.which;

        switch(keyCode) {
            case 37: // ←

                break;
            case 38: // ↑

                break;
            case 39: // →

                break;
            case 40: // ↓
                $('._list-item ').eq(1).addClass('focus')//[0].addClass('active');
                break;
        }
    })


}]);