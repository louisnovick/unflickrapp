// helpers/stats.js


//
//  call in required data
// 

var Models = require('../models'),

    async = require('async');


//
//  exporting function
//  

module.exports = function(viewModel, callback) {

        // async will provide the `structure`
        // modifies our viewModel and has a callback.

    async.parallel([


            // first two functions do d.b. wide queries,
            // Note we use mongoosejs docs for ref
            // on how to get this data.

        function(next) {

            //image count happens here

            Models.Image.count({}, next);

        },
        function(next) {

           //comment count happens here

           Models.Comment.count({}, next);

        },
        function(next) {

            //views count happens here

            Models.Image.aggregate({ $group : { // pass object

                _id : '1',

                viewsTotal : { $sum : '$views' }

            }}, function(err, result) {     // results checker function

                var viewsTotal = 0;

                if (result.length > 0) {

                    viewsTotal += result[0].viewsTotal;

                }

                next(null, viewsTotal);

            });

        },
        function(next) {    // total # of `likes`

           //likes count happens here
           Models.Image.aggregate({ $group : {

                _id : '1',

                likesTotal : { $sum : '$likes' }

            }}, function (err, result) {

                var likesTotal = 0;

                if (result.length > 0) {

                    likesTotal += result[0].likesTotal;
                }
                next(null, likesTotal);

            });

        }   // callback here, 2nd argument.
        ], 
        function(err, results){  // our second argument for parallel, a `callback` to catch errors?
                                // `results` returns the query.

            viewModel.sidebar.stats = {

            images: results[0],

            comments: results[1],

            views: results[2],

            likes: results[3]

        };

        callback(viewModel);            // ??? wtf.

    });

};