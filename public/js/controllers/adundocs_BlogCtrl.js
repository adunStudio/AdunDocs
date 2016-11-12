
AdunDocs.controller('blogCtrl', ['$scope', '$cookies', '$http', '$location', function blogCtrl($scope, $cookies, $http, $location) {
    $scope.setDocStat();



    $scope.tistoryLogin = function() {
        if( $scope.tistoryForm.$valid ) {
            var name = $scope.tistoryNAME;
            var addr = $scope.tistoryADDR;
            var id = $scope.tistoryID;
            var key = $scope.tistoryKEY;
            $.ajax({
                method  : 'POST',
                url     : 'http://www.oppacoding.com/adundocs',
                dataType: 'json',
                data    : {
                    name: name,
                    addr: addr,
                    id  : id,
                    key : key,
                    method: 'blogger.getUsersBlogs'
                },
            }).done(function(response) {
                if( response.result && response.data )
                {
                    var data = response.data[0];
                    $cookies.put('blogName', data.blogName);
                    $cookies.put('blog_addr', addr);
                    $cookies.put('blog_id',   id);
                    $cookies.put('blog_name', name);
                    $cookies.put('blog_key',  key);
                    $scope.setBlogName(data.blogName);
                    $scope.setBlogInfo(addr, id, name, key);
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
        $scope.$parent.tistoryKEY = null;
        $cookies.remove('blog_key');
    };

}]);