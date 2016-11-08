
AdunDocs.controller('blogCtrl', ['$scope', '$cookies', '$http', '$location', function blogCtrl($scope, $cookies, $http, $location) {
    $scope.setDocStat();

    $scope.tistoryNAME ="";
    $scope.tistoryADDR ="";
    $scope.tistoryID   ="";
    $scope.tistoryKEY  ="";
    $scope.addrPattern = /^http:/;

    $scope.tistoryLogin = function() {
        if( $scope.tistoryForm.$valid ) {
            $http({
                method  : 'POST',
                url     : '/tistory/login',
                data    : {
                    tistoryNAME: $scope.tistoryNAME,
                    tistoryADDR: $scope.tistoryADDR,
                    tistoryID  : $scope.tistoryID,
                    tistoryKEY : $scope.tistoryKEY
                },
                headers : {'Content-Type': 'application/json'}
            }).then(function(response) {
                var result = response.data;
                if( result.result )
                {
                    var data = result.data;
                    $cookies.put('blogName', data.blogName);
                    $scope.setBlogName(data.blogName);
                    $scope.setBlog();


                }
                else {
                    alert('로그인 실패');
                }
            });
        } else {
            $scope.$body.effect('shake');
        }
    };

    $scope.tistoryLogout = function() {
        $cookies.remove("blogName");
        $scope.setBlogName('Blog');
        $scope.$parent.blogCategory = null;

        $http({
            method  : 'GET',
            url     : '/tistory/logout',
            headers : {'Content-Type': 'application/json'}
        });
    };

}]);