
AdunDocs.controller('tistoryCtrl', ['$scope', '$cookies', '$http', '$location', function tistoryCtrl($scope, $cookies, $http, $location) {

    $scope.tistoryNAME ="adunstudio@daum.net";
    $scope.tistoryADDR ="http://boycoding.tistory.com/api";
    $scope.tistoryID   ="2351996";
    $scope.tistoryKEY  ="";
    $scope.addrPattern = /^http:/;

    $scope.tistoryLogin = function() {
        if( $scope.tistoryForm.$valid ) {

            $http({
                method  : 'POST',
                url     : 'http://222.109.241.40:3311/tistory/login',
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
                    $scope.setBlogName(data.blogName);
                    $location.url('blog');
                }
                else {
                    alert('로그인 실패');
                }
            });
        } else {
            alert('꽉꽉채우자.');
        }
    }



}]);