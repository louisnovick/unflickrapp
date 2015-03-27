// helpers/popular.js

var Models = require('../models');


module.exports = function(viewModel, callback) {

        // do a mongo query w/ .sort -1 for descending popularity

    Models.Image.find().sort({ likes: -1 }).limit(5).exec(function(err, result){

            // error catcher

        if (err) {

            throw err

        };

            // debug line

        // console.log(result+" !!! "+result.length+".");  // check out the return object

            // give the results to extend the viewModel

        viewModel.sidebar.popular = result;

            // return our modified viewModel!

        callback(viewModel)

    });

        // callback(viewModel);
};