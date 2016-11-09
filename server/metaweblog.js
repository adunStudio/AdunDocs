
'use strict';

const xmlrpc = require('xmlrpc');

function MetaWeblog(options) {
    var client = xmlrpc.createClient(options);

    function methodCall(methodName, params, resolve, reject) {
        client.methodCall(methodName, params, function (error, data) {
            if (!error) {
                resolve(data);
            } else {
                reject(error);
            }
        });
    }

    this.getUsersBlogs = function (appKey, username, password, resolve, reject) {
        return methodCall('blogger.getUsersBlogs', [appKey, username, password], resolve, reject);
    };


    this.getRecentPosts = function (blogid, username, password, numberOfPosts, resolve, reject) {
        return methodCall('metaWeblog.getRecentPosts', [blogid, username, password, numberOfPosts], resolve, reject);
    };


    this.getCategories = function (blogid, username, password, resolve, reject) {
        return methodCall('metaWeblog.getCategories', [blogid, username, password], resolve, reject);
    };

    this.getPost = function (postid, username, password, resolve, reject) {
        return methodCall('metaWeblog.getPost', [postid, username, password], resolve, reject);
    };

    this.editPost = function (postid, username, password, post, publish, resolve, reject) {
        return methodCall('metaWeblog.editPost', [postid, username, password, post, publish], resolve, reject);
    };


    this.newPost = function (blogid, username, password, post, publish, resolve, reject) {
        return methodCall('metaWeblog.newPost', [blogid, username, password, post, publish], resolve, reject);
    };

    this.deletePost = function (appKey, postid, username, password, publish, resolve, reject) {
        return methodCall('blogger.deletePost', [appKey, postid, username, password, publish], resolve, reject);
    };


    this.newMediaObject = function (blogid, username, password, mediaObject, resolve, reject) {
        return methodCall('metaWeblog.newMediaObject', [blogid, username, password, mediaObject], resolve, reject);
    };
}

module.exports = MetaWeblog;
