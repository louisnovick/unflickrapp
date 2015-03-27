var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var path = require('path'); //?? necessary??

//creating the fields we'll want to store in our database
var CommentSchema = new Schema({
    imageID: { type: String },
    name: { type: String },
    email: { type: String },
    comment: {type: String },
    timestamp: { type: Date, 'default': Date.now }
});

module.exports = mongoose.model('Comment', CommentSchema);