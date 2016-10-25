
AdunDocs.controller('ThemeCtrl', ['$scope', function ThemeCtrl($scope) {
    var WHITE = '/css/style_white.css';
    var BLACK = '/css/style_black.css';

    $scope.setTheme(WHITE);

    $scope.toggleTheme = function() {
        var current = $('#theme').attr('href');
        var theme = (current == WHITE) ? BLACK : WHITE;

        $scope.setTheme(theme);

        $('#theme').attr('href', $scope.theme);
    };

    $scope.toggleWidth = function() {
        $('#app').toggleClass('_max-width');
    };

}]);