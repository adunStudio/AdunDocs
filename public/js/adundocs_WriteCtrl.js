var converter = converter || new showdown.Converter();

AdunDocs.controller('writeCtrl', ['$scope', '$http', '$routeParams', function writeCtrl($scope, $http, $routeParams) {
    var editor = editormd("contents", {
        path : "/editor.md/lib/",
        flowChart: true,
        width: '100%',
        height: 520,
        tex: true,
        sequenceDiagram: true,
        theme: $scope.theme == '/css/style_white.css' ? 'default' : 'dark',
        editorTheme : $scope.theme == '/css/style_white.css' ? 'default' : 'base16-dark',
        previewTheme : $scope.theme == '/css/style_white.css' ? 'default' : 'dark',

        imageUpload    : true,
        imageFormats   : ["jpg", "jpeg", "gif", "png", "bmp", "PNG"],
        imageUploadURL : "/article/image",
    });

    $scope.$watch('theme', function() {
        editor.setTheme($scope.theme == '/css/style_white.css' ? 'default' : 'dark');
        editor.setEditorTheme($scope.theme == '/css/style_white.css' ? 'default' : 'base16-dark');
        editor.setPreviewTheme($scope.theme == '/css/style_white.css' ? 'default' : 'dark');
    });


}]);