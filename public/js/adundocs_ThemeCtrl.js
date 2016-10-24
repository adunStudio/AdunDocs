
AdunDocs.controller('ThemeCtrl', ['$scope', function ThemeCtrl($scope) {
    var WHITE = '/css/style_white.css';
    var BLACK = '/css/style_black.css';

    $scope.theme = WHITE;

    $scope.toggleTheme = function() {
        var current = $('#theme').attr('href');
        $scope.theme = current == WHITE ? BLACK : WHITE;
        $('#theme').attr('href', $scope.theme);
    };

    $scope.toggleWidth = function() {
        $('#app').toggleClass('_max-width');
    };

}]);