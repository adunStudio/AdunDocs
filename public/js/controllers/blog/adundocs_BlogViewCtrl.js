var converter = converter || new showdown.Converter();

AdunDocs.controller('BlogViewCtrl', ['$rootScope', '$scope', '$http', '$routeParams', '$timeout', '$location', function BlogViewCtrl($rootScope, $scope, $http, $routeParams, $timeout, $location) {
    if( !$scope.blogReady)
    {
        $location.url('/');
        return;
    }

    $scope.setDocStat();

    var check  =  $routeParams.check;
    var blogDirCategoryName  =  $routeParams.dirCategoryName;
    var blogSubCategoryName  =  $routeParams.subCategoryName;
    var blogTitle            =  $routeParams.title;

    var postid  = $scope.blogCategory[blogDirCategoryName][blogSubCategoryName][blogTitle]['postid'];

    $.ajax({
        method  : 'POST',
        url     : 'http://www.oppacoding.com/adundocs/index.php',
        dataType: 'json',
        data    : {
            postid: postid,
            name: $scope.tistoryNAME,
            addr: $scope.tistoryADDR,
            id  : $scope.tistoryID,
            key : $scope.tistoryKEY,
            method: 'metaWeblog.getPost'
        }
    }).done(function(response) {
        if( response.result && response.data )
        {
            var data = response.data;

            $('#main').html(data.description).find('pre code').each(function(i, block) {
                hljs.highlightBlock(block);
            });

            $scope.setBlogStat(data.dateCreated, data.mt_keywords, data.permaLink, blogDirCategoryName, blogSubCategoryName, data.title, postid);

            $('img').on('error', function() {
                $(this).attr('src', "/img/tistory_404.png");
            });

            if (!$rootScope.$$phase) $rootScope.$apply();
        }
    });

    var dirEl =  angular.element(document.getElementById('blog_' + blogDirCategoryName));
    var subEl =  angular.element(document.getElementById('blog_' + blogDirCategoryName + "_" + blogSubCategoryName));
    var fileEl = angular.element(document.getElementById('blog_' + blogDirCategoryName + "_" + blogSubCategoryName + "_" + blogTitle));


    if( $scope.isToggleCheck == false || check) {
        $scope.toggleCheck(dirEl, subEl, fileEl);
    }

}]);