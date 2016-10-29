
AdunDocs.controller('navigationCtrl', ['$scope', '$http', '$routeParams', '$location', function navigationCtrl($scope, $http, $routeParams, $location) {
    $scope.$changeNameModal = $('#changeNameModal');
    $scope.changeName = "";
    $scope.$watch('fileName', function() {
        $scope.changeName = $scope.fileName.substr(0, $scope.fileName.length - 3);
    });
    $scope.nameRegExp = /^[^\\/:^\*\?"<>\|]+$/;
    $scope.dirRegExp  = /^[^\\/:.^\*\?"<>\|]+$/;

    $.contextMenu({
        selector: '._-file-_',
        callback: function(key, options) {
            var nameArr = $(this).attr('id').split('_');

            switch(key) {
                case 'edit':
                    location.href = $(this).data('edit');
                    break;
                case 'trash':
                    alert(2);
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

    // MODAL
    /*$scope.$changeNameModal.on('show.bs.modal', function () {
        $scope.changeName = $scope.fileName.substr(0, $scope.fileName.length -3);

    });*/
    /*$('#dirModal,#subModal').on('hide.bs.modal', function () {
        $('._container').css('z-index', '1');
        $scope.makeDirName = null;
        $scope.makeSubName = null;
    });*/

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
            $('#changeNameModal').effect('shake');
        }
    };
}]);