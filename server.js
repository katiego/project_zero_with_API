// SERVER-SIDE JAVASCRIPT

// require express and other modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    _ = require('underscore');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/posts');

// serve js and css files from public folder
app.use(express.static(__dirname + '/public'));

// configure bodyParser (for handling data)
app.use(bodyParser.urlencoded({extended: true}));

var Post = require('./models/post');

// pre-seeded post data
// var posts = [
//   {id: 1, text: 'post 1 testing!'},
//   {id: 2, text: 'post 2 testing!'}, 
//   {id: 3, text: 'post 3 testing!'}, 
//   {id: 4, text: 'post 4 testing!'}, 
//   {id: 5, text: 'post 5 testing!'} 
// ];



// STATIC ROUTES

// root (serves index.html)
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/views/index.html');
});

// API ROUTES

// // posts index
// app.get('/api/posts', function (req, res) {
//   // send all posts as JSON response
//   res.json(posts);
// });


//get posts data from mongodb
app.get('/api/posts', function (req, res) {
  Post.find(function (err, posts) {
    res.json(posts); 
  }); 
});


// create new post
// app.post('/api/posts', function (req, res) {
//   // grab params (word and definition) from form data
//   var newPost = req.body;
  
//   // set sequential id (last id in `posts` array + 1)
//   if (posts.length > 0) {
//     newPost.id = posts[posts.length - 1].id +  1;
//   } else {
//     newPost.id = 0;
//   }

//   // add newPost to `posts` array
//   posts.push(newPost);
  
//   // send newPost as JSON response
//   res.json(newPost);
// });


// create new post to save in MongoDB
app.post('/api/posts', function (req, res) {
  // create new phrase with form data (`req.body`)
  var newPost = new Post({
    text: req.body.text
  });

  // save new phrase in db
  newPost.save(function (err, savedPost) {
    res.json(savedPost);
  });
});


// // update post
// app.put('/api/posts/:id', function (req, res) {

//   // set the value of the id
//   var targetId = parseInt(req.params.id);

//   // find item in `post` array matching the id
//   var foundPost = _.findWhere(posts, {id: targetId});

//   // update the post's word
//   foundPost.text = req.body.text;

//   // update the post's definition
//   foundPost.definition = req.body.definition;

//   // send back edited object
//   res.json(foundPost);
// });



// update post in MongoDB
app.put('/api/posts/:id', function (req, res) {
  // set the value of the id
  var targetId = req.params.id;
  console.log('server side target id: ' + targetId)
  // find post in db by id
  Post.findOne({_id: targetId}, function (err, foundPost) {
    // update the post's tetx
    foundPost.text = req.body.text;

    // save updated phrase in db
    foundPost.save(function (err, savedPost) {
      res.json(savedPost);
    });
  });
});



// // delete post
// app.delete('/api/posts/:id', function (req, res) {
  
//   // set the value of the id
//   var targetId = parseInt(req.params.id);

//   // find item in `posts` array matching the id
//   var foundPost = _.findWhere(posts, {id: targetId});

//   // get the index of the found item
//   var index = posts.indexOf(foundPost);
  
//   // remove the item at that index, only remove 1 item
//   posts.splice(index, 1);
  
//   // send back deleted object
//   res.json(foundPost);
// });


// delete post in MongoDB
app.delete('/api/posts/:id', function (req, res) {
  // set the value of the id
  var targetId = req.params.id;

  // find post in db by id and remove
  Post.findOneAndRemove({_id: targetId}, function (err, deletedPost) {
    res.json(deletedPost);
  });
});

// set server to localhost:3000
app.listen(3000, function () {
  console.log('server started on localhost:3000');
});