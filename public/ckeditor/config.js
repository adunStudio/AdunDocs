/**
 * @license Copyright (c) 2003-2016, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'kr';
	// config.uiColor = '#AADC6E';
    config.filebrowserUploadUrl = '/upload/uploadck.php';
    //config.extraPlugins = 'widget';
    config.extraPlugins = 'codesnippet';
    //config.extraPlugins = 'markdown';
   // config.format_tags = 'p;h1;h2;h3;pre';

    //config.extraPlugins = 'lineutils';
    config.codeSnippet_theme = 'github';
    config.tabSpaces = 4;
        config.allowedContent = true;
        config.font_names = 맑은 고딕; 돋움; 바탕; 돋음; 궁서; Nanum Gothic Coding; Quattrocento Sans;' + CKEDITOR.config.font_names;

};

