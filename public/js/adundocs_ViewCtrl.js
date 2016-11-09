var converter = converter || new showdown.Converter();

AdunDocs.controller('viewCtrl', ['$scope', '$http', '$routeParams', '$timeout', function viewCtrl($scope, $http, $routeParams, $timeout) {
    var dirName  = $routeParams.dirName;
    var subName  = $routeParams.subName;
    var fileName = $routeParams.fileName;
    var check  =  $routeParams.check;

    var url = $scope.toURL('/' + dirName + '/' + subName + '/' + fileName);

    $http.get('/article' + url).then(function (response) {
        var html = markdown = converter.makeHtml(response.data);
/*
        var testEditormdView = editormd.markdownToHTML("main", {
            markdown        : markdown ,//+ "\r\n" + $("#append-test").text(),
            //htmlDecode      : true,       // 开启 HTML 标签解析，为了安全性，默认不开启
            htmlDecode      : "style,script,iframe",  // you can filter tags decode
            //toc             : false,
            tocm            : false,    // Using [TOCM]
            //tocContainer    : "#custom-toc-container", // 自定义 ToC 容器层
            //gfm             : false,
            //tocDropdown     : true,
            // markdownSourceCode : true, // 是否保留 Markdown 源码，即是否删除保存源码的 Textarea 标签
            emoji           : false,
            taskList        : true,
            tex             : true,  // 默认不解析
            flowChart       : true,  // 默认不解析
            sequenceDiagram : true,  // 默认不解析
        });*/


       $('#main').html(html);
    });

    $scope.setDocStat(dirName, subName, fileName, $scope.docs[dirName][subName][fileName].stat.birthtime, $scope.docs[dirName][subName][fileName].stat.mtime);


    var dirEl =  angular.element(document.getElementById('_' + dirName));
    var subEl =  angular.element(document.getElementById('_' + dirName + "_" + subName));
    var fileEl = angular.element(document.getElementById('_' + dirName + "_" + subName + "_" + fileName));

    if( $scope.isToggleCheck == false || check) {
        $scope.toggleCheck(dirEl, subEl, fileEl);
    }


/*
    $(function() {
        var testEditormdView, testEditormdView2;

        $.get("test.md", function(markdown) {



            //console.log("返回一个 jQuery 实例 =>", testEditormdView);

            // 获取Markdown源码
            //console.log(testEditormdView.getMarkdown());

            //alert(testEditormdView.getMarkdown());
        });

        testEditormdView2 = editormd.markdownToHTML("test-editormd-view2", {
            htmlDecode      : "style,script,iframe",  // you can filter tags decode
            emoji           : true,
            taskList        : true,
            tex             : true,  // 默认不解析
            flowChart       : true,  // 默认不解析
            sequenceDiagram : true,  // 默认不解析
        });
    });*/

}]);