var fs = require('fs');
var path = require('path');
var Models = require('../models');			// grabs comment.js already it seems, 
											// like image.js in `models` directory.s
var stats = require('../helpers/stats');	// grab out helper function `stats`.
var popular = require('../helpers/popular');	// grab out helper function `stats`.


module.exports = {
	index: function(req, res) {

		var viewModel = {
			image: {},		//,
			comments: {},	// -> package to comments in the viewModel.
			sidebar: {},		// -> sidebar array for stats.
			userName: req.user ? req.user.username : ""
		};

			// find a single image , sidebar + comments

		Models.Image.findOne({ filename: { $regex: req.params.image_id } },

			function (err, image) {

				if (err) { throw err; }

				if (image) {

					image.views++;

					viewModel.image = image;

					image.save(function(err) {
						if (err) {throw err};
					});

					Models.Comment.find({ imageID: {$regex: req.params.image_id } }, function(err, comments) {

						if (err) {throw err;};	// debugger

						viewModel.comments = comments;	// add to the viewModel

						// res.render('image', viewModel);	// res.render

						stats(viewModel, function(viewModel) {
							popular(viewModel, function(viewModel){
			                    res.render('image', viewModel);
							});
		                });
					});

				} else {

					res.redirect('/');
				}
			});
		},
	create: function(req, res) {

		// 
		// create image name and save locally
		// 


		var saveImage = function() {

			var possible = 'abcdefghijklmnopqrstuvwxyz0123456789',
                imgUrl = '';
			
			//generates the id
            for(var i=0; i < 6; i+=1) {

                imgUrl += possible.charAt(Math.floor(Math.random() * possible.length));

            }
			//checks to see if there's an image with this filename
			//
			Models.Image.find({ filename: imgUrl }, function(err, images) {

				if (images.length > 0) {

					//if there's a match, make a different name
					//
					saveImage();

				} else {

					//creates the path for storing the image

					var tempPath = req.files.file.path,
					
						ext = path.extname(req.files.file.name).toLowerCase(),
						targetPath = path.resolve('./public/upload/' + imgUrl + ext);
					//checks to make sure we're getting an image, then stores it if valid
					if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
						fs.rename(tempPath, targetPath, function(err) { 
							if (err) { 
								throw err; 
							}
							//creates the image model with details from the request (req)
							var newImg = new Models.Image({
								title: req.body.title,
								filename: imgUrl + ext,
								description: req.body.description
							});
							//saves the image
							newImg.save(function(err, image) {
								console.log('Successfully inserted image: ' + image.filename);
								res.redirect('/images/' + imgUrl);
							});
					});
					} else {
						fs.unlink(tempPath, function () {
							if (err) {
								throw err;
							}

							res.json(500, {error: 'Only image files are allowed.'});
						});
					}
				}
			});
		};	
		saveImage();
	},
	like: function(req, res) {
			// res.send('The image:like POST controller');

			// checks to find `One` image w/ given filename/image_id
			Models.Image.findOne({ filename: { $regex: req.params.image_id } }, function(err, image ) {	// using `image` bc were are return one images not a collection of `images`.

				image.likes++;		// increment `likes` for images.

				image.views--;		// decreament `view` property of Image
				console.log("this image has " + image.likes + " many likes!");
				image.save(function(err, image){	// throw error
					if (err) {
						throw err;
					};
					console.log('updated the images like: ' + image.filename + '.');	// debugger.
				});	// save incremented back to image db.
				// res.render('image', {'image': image});	// render, skip.
				res.redirect('/images/' + req.params.image_id);	// redirect back to page.

				// grab code that grabs entire viewModel
			})	// end of callback function for image find.
	},
	comment: function(req, res) {

		var newComment = new Models.Comment({	// using our Comment Model to
												// make a new comment.
			// name: req.body.name,
			name: req.user.username,	// looks if user is singed in or not.
			// email: req.body.email,
			email: req.user.email,
			comment: req.body.comment,
			// imageID: req.param('image_id')	// works but outdated
			imageID: req.params.image_id	// ???, checks out!
			// imageID: req.body.imageID
		});
		newComment.save(function(err, comment) {
			if (err) { throw err; console.log(err);};
			console.log("we added a comment! " + comment.name);
			// res.json(comment);
			// res.redirect('/images/' + req.param('image_id'));	// outdated express.
			res.redirect('/images/' + req.params.image_id);
		});
	}
};