// helpers/comments.js

var Models = require("../Models");

var async = require('async');


module.export = function(viewModel, callback){
    /*
        Do find the images and comments in viewModel
        Not e that comment may be comments in viewModel
        Hate to have to use 2 queries and get them working together.
    */

    var viewModel.sidebar.comments {
        image: {},
        comment: {},
    };


    async.parallel([
        function(next){

            Models.Comment.find().sort({ timestamp: -1}).limit(10).exec(function(err, result){

                console.log("comments timestamp: "+result+".");

            });

        },
        function(next){

        }
    ], function(err, results){
        viewModel.sidebar.comments = {

        }
    })

     callback(viewModel);
};