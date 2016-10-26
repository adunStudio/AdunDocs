
AdunDocs.controller('loginCtrl', ['$scope', function loginCtrl($scope) {

    mhnUI = {
        pattern: "",
        setup: function() {
                this.lock(),
                this.filter(),
                this.colors(),
                this.links.setup(),
                this.dialog.setup(),
                setInterval("mhnUI.datetime()", 1e3)
        },
        lock: function() {
            mhnUI.page.hide(), pattern = new PatternLock(".mhn-lock", {
                margin: 15
            }), $(".mhn-lock-title").html($(".mhn-lock-title").data("title")), pattern.checkForPattern("7415369", function() {
                alert(1);
            }, function() {
                alert(2);

            })
        },
        message: function() {
            $(".mhn-lock-title span").fadeOut(), setTimeout(function() {
                $(".mhn-lock-title").html($(".mhn-lock-title").data("title")), $(".mhn-lock-title span").fadeIn()
            }, 500)
        },
        datetime: function() {
            var t = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"),
                e = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"),
                n = new Date,
                i = n.getYear();
            1e3 > i && (i += 1900);
            var a = n.getDay(),
                o = n.getMonth(),
                s = n.getDate();
            10 > s && (s = "0" + s);
            var h = n.getHours(),
                c = n.getMinutes(),
                u = n.getSeconds(),
                l = "AM";
            h >= 12 && (l = "PM"), h > 12 && (h -= 12), 0 == h && (h = 12), 9 >= c && (c = "0" + c), 9 >= u && (u = "0" + u), $(".mhn-ui-date-time .mhn-ui-day").text(t[a]), $(".mhn-ui-date-time .mhn-ui-date").text(e[o] + " " + s + ", " + i), $(".mhn-ui-date-time .mhn-ui-time").text(h + ":" + c + " " + l), $(".mhn-ui-app-time").text(h + ":" + c + ":" + u + " " + l)
        },
        page: {
            show: function(t) {
                t = t ? t : "page-home", $(".mhn-ui-page").hide(), $(".mhn-ui-page." + t).show()
            },
            hide: function(t) {
                t = t ? t : "page-lock", $(".mhn-ui-page").hide(), $(".mhn-ui-page." + t).show()
            }
        },
        filter: function() {
            $(".mhn-ui-filter .mhn-ui-btn").click(function() {
                $(this).toggleClass("active"), $(".mhn-ui-filter-list").toggle(100)
            }), $(".mhn-ui-filter-list>div").click(function() {
                var t = $(this).data("filter");
                $(this).siblings().removeAttr("class"), $(this).addClass("active");
                var e = function(t) {
                    $(".mhn-ui-apps .mhn-ui-col").fadeOut(400), $('.mhn-ui-apps .mhn-ui-col[data-filter="' + t + '"]').fadeIn(400)
                };
                switch (t) {
                    case "all":
                        $(".mhn-ui-apps .mhn-ui-col").fadeIn(400);
                        break;
                    case "general":
                        e(t);
                        break;
                    case "social":
                        e(t);
                        break;
                    case "credits":
                        e(t)
                }
                $(".mhn-ui-filter-list").toggle(100), $(".mhn-ui-filter .mhn-ui-btn").removeClass("active"), $(".mhn-ui-page-title").text($(this).text())
            })
        },
        colors: function() {
            $(".mhn-ui-icon span").on("mouseover", function() {
                $(this).css("background", $(this).data("color"))
            }).on("mouseout", function() {
                $(this).removeAttr("style")
            })
        },
        links: {
            setup: function() {
                $(".mhn-ui-apps .mhn-ui-icon").click(function() {
                    var t = $(this).data("href"),
                        e = $(this).data("open");
                    t && mhnUI.links.href(t), e && mhnUI.page.show(e)
                })
            },
            href: function(t) {
                mhnUI.dialog.show(t)
            }
        },
        dialog: {
            setup: function() {
                $('.mhn-ui-dialog-wrap,.mhn-ui-dialog-wrap a[data-action="cancel"]').click(function() {
                    mhnUI.dialog.hide()
                }), $(".mhn-ui-dialog").click(function(t) {
                    t.stopPropagation()
                }), $('.mhn-ui-dialog a[data-action="confirm"]').click(function() {
                    setTimeout(function() {
                        mhnUI.dialog.hide()
                    }, 400)
                })
            },
            show: function(t) {
                $('.mhn-ui-dialog-wrap a[data-action="confirm"]').attr("href", t), $(".mhn-ui-dialog-wrap").show()
            },
            hide: function() {
                $('.mhn-ui-dialog-wrap a[data-action="confirm"]').removeAttr("href"), $(".mhn-ui-dialog-wrap").fadeOut(400)
            }
        }
    };

    //mhnUI.setup();
    $(".mhn-ui-page").hide(),
        $(".mhn-ui-page." + "page-lock").show()

    var lock = new PatternLock(".mhn-lock", {
        margin: 15,
        allowRepeat : true,
        onDraw:function(pattern){
            lock.error();
            //lock.reset();
            lock.disable();
        }
    });

}]);
