
AdunDocs.controller('ThemeCtrl', ['$scope', '$cookies', '$interval', function ThemeCtrl($scope, $cookies, $interval) {
    var WHITE = '/css/style_white.css';
    var BLACK = '/css/style_black.css';

    var expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 3);

    $scope.initTheme = function() {
        var theme = $cookies.get('theme') || BLACK;
        $scope.setTheme(theme);

        $('#theme').attr('href', $scope.theme);
    };


    $scope.initTheme();


    $scope.toggleTheme = function() {
        var current = $('#theme').attr('href');
        var theme = (current == WHITE) ? BLACK : WHITE;

        $cookies.put('theme', theme, {'expires': expireDate});
        $scope.setTheme(theme);

        $('#theme').attr('href', $scope.theme);
    };

    $scope.toggleWidth = function() {
        $('#app').toggleClass('_max-width');
    };

}]);