var converter = converter || new showdown.Converter();

AdunDocs.controller('blogViewCtrl', ['$scope', '$http', '$routeParams', '$timeout', function blogViewCtrl($scope, $http, $routeParams, $timeout) {
    var postid  = $routeParams.postid;

    $http.get('/tistory/post/' + postid).then(function (response) {

        var result = response.data;

        if( result.result )
        {
            var data = result.data;
            console.log(data);
            console.log(data.description);
            $('#main').html(data.description);
        }
    });

}]);