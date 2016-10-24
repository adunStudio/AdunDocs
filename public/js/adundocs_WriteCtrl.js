var converter = converter || new showdown.Converter();

AdunDocs.controller('writeCtrl', ['$scope', '$http', '$routeParams', '$timeout', function writeCtrl($scope, $http, $routeParams, $timeout) {
    $scope.simplemde = new SimpleMDE({
        element: $("#write_area")[0],
        spellChecker: false,
        tabSize: 4,
        styleSelectedText: false,
        renderingConfig: {
            singleLineBreaks: false,
            codeSyntaxHighlighting: true
        }
    });
}]);