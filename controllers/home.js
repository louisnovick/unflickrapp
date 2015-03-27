//takes the browser's request and lets us send back a page or other information
var imageModel = require('../models').Image;
var stats = require('../helpers/stats');
var popular = require('../helpers/popular');    // working on


module.exports = {
	index: function(req, res) {
		// var viewModel = imageModel.find(function(err, images) {
  //           res.render('index',{"images":images});
  //       });

        var viewModel = {
            images: {},
            sidebar: {},     // add `sidebar` 2nd data point.
            userName: req.user ? req.user.username : ""
        };
        
        imageModel.find(function(err, images) {

            console.log("Use on him is: ",req.user);  // debug

            viewModel.images = images;

                stats(viewModel, function(viewModel) {  // calling stats function, module.export.

                    popular(viewModel, function(viewModel) {

                            // console.log(viewModel.sidebar.popular , "!!!!!");


                            res.render('index', viewModel);     // renders main page, index, w/ viewModel array item.

                            // res.json(viewModel);

                    });


                });

        });
        	//	res.render('index',viewModel);
	}
};