
AdunDocs.controller('AboutCtrl', ['$scope', function AboutCtrl($scope) {
    $scope.initStat();
    $scope.setName();

    $('._toc-list li a').bind('click', function(event) {
        event.preventDefault ? event.preventDefault() : event.returnValue = false;
        var $anchor = $(this);
        var link = '#' + $anchor.attr('href').split('#')[2];
        $('._content').stop().animate({
            scrollTop: ($(link).offset().top - 100)
        }, 1250, 'easeInOutExpo');
    });
}]);
