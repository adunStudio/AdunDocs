
AdunDocs.controller('ThemeCtrl', ['$scope', '$cookies', '$interval', function ThemeCtrl($scope, $cookies, $interval) {
    var WHITE = '/css/style_white.css';
    var BLACK = '/css/style_black.css';

    $scope.theme = $('#theme').attr('href');

    $scope.toggleTheme = function() {
        var expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 3);

        $scope.theme  = ($scope.theme == WHITE) ? BLACK : WHITE;
        $cookies.put('theme', $scope.theme, {'expires': expireDate});
        $('#theme').attr('href', $scope.theme);
    };

    $scope.toggleWidth = function() {
        $scope.$app.toggleClass('_max-width');
    };

    $scope.$body.removeClass('_booting _loading');

}]);