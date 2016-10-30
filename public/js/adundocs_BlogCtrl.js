
AdunDocs.controller('blogCtrl', ['$scope', '$cookies', '$http', '$location', function blogCtrl($scope, $cookies, $http, $location) {

    var blogCategory = $scope.blogCategory;
    if($scope.blogName) {
        // 카테고리
        $http({
            method  : 'GET',
            url     : 'http://222.109.241.40:3311/tistory/category',
            headers : {'Content-Type': 'application/json'}
        }).then(function(response) {
            var result = response.data;
            if( result.result )
            {
                var data = result.data;
                var categorys = {};
                var name = '';
                angular.forEach(data, function(category) {
                    name = category.categoryName;
                    if( name.indexOf('/') > 0 )
                    {
                        var splitArr = name.split('/');
                        if( !categorys[splitArr[0]] ) {
                            categorys[splitArr[0]] = {};
                        }
                        categorys[splitArr[0]][splitArr[1]] = {};
                    } else
                    {
                        if( !categorys[name] ) {
                            categorys[name] = {};
                        }
                    }
                });

                $scope.setBlogCategory(categorys);
                $scope.getPosts();
            }
        });

    } else {
        alert('티스토리 로그인을 해주세요.!');
    }



    // 최신글
    $scope.getPosts = function() {
        $http({
            method  : 'GET',
            url     : 'http://222.109.241.40:3311/tistory/recentposts',
            headers : {'Content-Type': 'application/json'}
        }).then(function(response) {
            var result = response.data;
            if( result.result )
            {
                var data = result.data;
                var categoryName = '';
                angular.forEach(data, function(post) {
                    categoryName = post.categories[0];
                    if( categoryName.indexOf('/') > 0 )
                    {
                        var splitArr = categoryName.split('/');
                        $scope.setPost(splitArr[0], splitArr[1], post.title, post);
                    }
                });
            }
        });
    };

}]);