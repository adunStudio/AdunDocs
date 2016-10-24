

AdunDocs.controller('SearchCtrl', function($scope) {
    $scope.searchDoc = function() {
        var text = $scope.search;
        if( !text ) { return; }

        var result = [];

        angular.forEach($scope.docs, function(dir, dirName) {
            angular.forEach(dir, function(sub, subName) {
                angular.forEach(sub, function(file, fileName) {
                    if(fileName.toLowerCase().indexOf(text.toLowerCase()) >= 0) {
                        result.push({
                            dirName: dirName,
                            subName: subName,
                            name: fileName,
                            file: file,
                        });
                    }
                })
            })
        });

        $scope.$parent.searchResult = result;
    };
})