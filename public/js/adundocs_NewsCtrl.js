
AdunDocs.controller('newsCtrl', ['$scope', function newsCtrl($scope) {

    function date_sort(a, b) {
        return new Date(b.stat.birthtime).getTime() - new Date(a.stat.birthtime).getTime();
    }

    if( !$scope.fileArray ) {
        var fileArray = [];

        angular.forEach($scope.docs, function(dir, dirName) {
            angular.forEach(dir, function(sub, subName) {
                angular.forEach(sub, function(file, fileName) {
                    file.dirName = dirName;
                    file.subName = subName;
                    file.name = fileName;

                    fileArray.push(file);
                });
            });
        });

        fileArray.sort(date_sort);

        $scope.setFileArray(fileArray)
    }
}]);
