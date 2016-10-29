
AdunDocs.controller('navigationCtrl', ['$scope', '$http', '$routeParams', '$location', function navigationCtrl($scope, $http, $routeParams, $location) {
    $scope.$changeNameModal = $('#changeNameModal');
    $scope.$trashModal      = $('#trashModal');

    $scope.nameRegExp = /^[^\\/:^\*\?"<>\|]+$/;
    $scope.dirRegExp  = /^[^\\/:.^\*\?"<>\|]+$/;

    $scope.trashName   = "";
    $scope.trashRegExp = "";
    $scope.changeName  = "";
    $scope.$watch('fileName', function() {
        $scope.changeName = $scope.fileName.substr(0, $scope.fileName.length - 3);
    });

    $.contextMenu({
        selector: '._-file-_',
        callback: function(key, options) {
            var nameArr = $(this).attr('id').split('_');

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
            "name": {name: 'Name', icon: "fa-pencil"},
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
                    $http.get('/article/renew').then(function(response)
                    {
                        var dirName    = $scope.dirName;
                        var subName    = $scope.subName;
                        var changeName = $scope.changeName;

                        $scope.$changeNameModal.modal('hide');
                        $scope.init(function() {
                            $location.url(dirName +'/' + subName + '/' + changeName + '.md?check=1');
                        });
                    });
                } else { alert(result.msg); }
            });

        } else {
            $scope.$changeNameModal.effect('shake');
        }
    };

    $scope.trash = function() {
        if( $scope.trashForm.$valid ) {
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
                    $http.get('/article/renew').then(function(response)
                    {
                        $scope.$trashModal.modal('hide');
                        $scope.trashName   = "";

                        $scope.init(function() {
                            $location.url('/#');
                        });
                    });
                } else { alert(result.msg); }
            });
        } else {
            $scope.$trashModal.effect('shake');
        }
    };

}]);