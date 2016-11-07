function key() {
    var dirEq = -1;


    $(window).on('keydown', function(e) {

        if ($(e.target).is('input, textarea')) {
            return;
        }

        if( $scope.focus.length != 0 )
        {
            dirEq = $('.isdir').index($scope.focus);
        }

        var keyCode = e.which;

        switch(keyCode) {
            case 37: // ก็
                if( $scope.focus.hasClass('open') )
                {
                    $scope.focus.removeClass('open');
                    $scope.focus.removeClass('open-title');
                    $scope.focus.next().slideUp();
                    $scope.focus.next().find('a').each(function(idx, el){ $(el).removeClass('open'); $(el).removeClass('active'); $(el).removeClass('isdir'); });
                    $scope.focus.next().find('._list-sub').each(function(idx, el){ $(el).slideUp(); });
                }
                break;
            case 38: // ก่
                dirEq--;
                if($('.isdir').length == -1) {
                    dirEq = $('.isdir').length;
                }
                $scope.focus.removeClass('focus');
                $scope.focus = $('.isdir').eq(dirEq);
                $scope.focus.addClass('focus');
                break;
            case 39: // กๆ
                if( !$scope.focus.hasClass('open') )
                {
                    $scope.focus.addClass('open');
                    $scope.focus.addClass('open-title');
                    $scope.focus.next().slideDown();
                    $scope.focus.next().find('.issub').each(function(idx, el){ $(el).addClass('isdir') });
                    if( $scope.focus.hasClass('issub') )
                    {
                        $scope.focus.next().find('.isfile').each(function(idx, el){ $(el).addClass('isdir') });
                    }
                }
                break;
            case 40: // ก้
                dirEq++;
                if($('.isdir').length == dirEq) {
                    dirEq = 0;
                }
                $scope.focus.removeClass('focus');
                $scope.focus = $('.isdir').eq(dirEq);
                $scope.focus.addClass('focus');
                break;

            case 13:
                if( $scope.focus.length != 0 )
                {
                    e.preventDefault ? e.preventDefault() : e.returnValue = false;
                    $($scope.focus).trigger('click');
                }
                else {
                    alert(1);
                }
                break;
        }
    })

}
key();