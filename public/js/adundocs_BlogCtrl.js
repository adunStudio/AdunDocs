
AdunDocs.controller('blogCtrl', ['$scope', '$cookies', '$http', '$location', function blogCtrl($scope, $cookies, $http, $location) {


    $scope.tistoryNAME ="adunstudio@daum.net";
    $scope.tistoryADDR ="http://adunstudio.tistory.com/api";
    $scope.tistoryID   ="2441858";
    $scope.tistoryKEY  ="U2FV5P2Q";
    $scope.addrPattern = /^http:/;

    $scope.tistoryLogin = function() {
        if( $scope.tistoryForm.$valid ) {

            $http({
                method  : 'POST',
                url     : 'http://175.193.42.59:7711/tistory/login',
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
            alert('꽉꽉채우자.');
        }
    };

}]);