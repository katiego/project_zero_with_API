var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//what the data should look like in mongoDB
var PostSchema = new Schema({
  text: String, 
  comments: [CommentSchema],
  author: {AuthorSchema}
});



var CommentSchema = new Schema({
  commentText: String
});



var AuthorSchema = new Schema({
  name: {
    type: String,
    default: ""
  }

});


// create models
var Post = mongoose.model('Post', PostSchema);
var Comment = mongoose.model('Comment', CommentSchema);
var Author = mongoose.model('Author', AuthorSchema)


// Export all our models

module.exports.Post = Post;
module.exports.Comment = Comment;
module.exports.Author = Author;





