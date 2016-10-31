var converter = converter || new showdown.Converter();

AdunDocs.controller('blogViewCtrl', ['$scope', '$http', '$routeParams', '$timeout', function blogViewCtrl($scope, $http, $routeParams, $timeout) {
    var postid  = $routeParams.postid;

    $scope.setName(null, null, null);
    $scope.initStat(null, null, null);

    $http.post('/tistory/post/' + postid).then(function (response) {

        var result = response.data;

        if( result.result )
        {
            var data = result.data;
            $('#main').html(data.description);

            if( data.categories[0].indexOf('/') > 0 )
            {
                var splitCategory = data.categories[0].split('/');
                $scope.setBlogStat(data.dateCreated, data.mt_keywords, data.permaLink, splitCategory[0], splitCategory[1], data.title, postid);
            }
        }
    });

}]);