
AdunDocs.controller('LoginCtrl', ['$scope', '$timeout','$http', '$cookies',  function LoginCtrl($scope, $timeout, $http, $cookies) {



    $scope.setLogin($cookies.get('login') || false);

    var lock = new PatternLock(".login-lock", {
        margin: 15,
        allowRepeat : true,
        onDraw:function(pattern){

            $http({
                method  : 'POST',
                url     : '/article/login',
                data    : { pattern: pattern },
                headers : {'Content-Type': 'application/json'}
            }).then(function(response) {
                var result = response.data.result;

                if(result) {
                    $scope.setLogin(true);
                    $cookies.put('login', true);
                    lock.reset();
                    lock.enable();
                    $scope.$login.fadeOut();
                }

                else {
                    lock.error();
                    lock.disable();
                    $scope.$login.effect('shake');

                    $timeout(function() {
                        lock.reset();
                        lock.enable();
                    }, 700);
                }
            });
        }
    });

    var t = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var e = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    function dating() {
        var now = new Date();
        $scope.year = now.getFullYear();
        $scope.month = e[now.getMonth()];
        $scope.date = now.getDate();
        $scope.day = t[now.getDay()];
        $scope.h = now.getHours();
        $scope.m = now.getMinutes();
        $scope.s = now.getSeconds();

        $timeout(function() {
            dating();
        }, 1000* 60);
    }

    dating();
}]);