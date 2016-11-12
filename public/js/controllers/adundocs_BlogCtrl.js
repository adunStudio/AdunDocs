
AdunDocs.controller('blogCtrl', ['$scope', '$cookies', '$http', '$location', function blogCtrl($scope, $cookies, $http, $location) {
    $scope.setDocStat();



    $scope.tistoryLogin = function() {
        if( $scope.tistoryForm.$valid ) {
            $.ajax({
                method  : 'POST',
                url     : 'http://www.oppacoding.com/adundocs',
                dataType: 'json',
                data    : {
                    name: $scope.tistoryNAME,
                    addr: $scope.tistoryADDR,
                    id  : $scope.tistoryID,
                    key : $scope.tistoryKEY,
                    method: 'blogger.getUsersBlogs'
                },
            }).done(function(response) {
                if( response.result && response.data )
                {
                    var data = response.data[0];
                    $cookies.put('blogName', data.blogName);
                    $cookies.put('blog_addr', $scope.tistoryADDR);
                    $cookies.put('blog_id',   $scope.tistoryID);
                    $cookies.put('blog_name', $scope.tistoryNAME);
                    $cookies.put('blog_key',  $scope.tistoryKEY);
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