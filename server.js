// SERVER-SIDE JAVASCRIPT

// require express and other modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    _ = require("underscore");

// configure bodyParser (for handling data)
app.use(bodyParser.urlencoded({extended: true}));


// serve js and css files from public folder
app.use(express.static(__dirname + '/public'));

// include mongoose
var mongoose = require('mongoose');

// include our module from the other file
var db = require("./models/models");

// connect to db
mongoose.connect('mongodb://localhost/posts');


var User = require('./models/user');

//cookie and session stuff
var session = require('express-session');


app.use(session({
  saveUninitialized: true,
  resave: true,
  secret: 'OurSuperSecretCookieSecret',
  cookie: { maxAge: 60000 }
}));

app.get('/login', function (req, res) {
  var html = '<form action="/api/sessions" method="post">' +
               'Your email: <input type="text" name="email"><br>' +
               'Your password: <input type="text" name="password"><br>' +
               '<button type="submit">Submit</button>' +
               '</form>';
  if (req.session.user) {
    html += '<br>Your email from your session is: ' + req.session.user.email;
  }
  console.log(req.session);
  console.log(req.session.user);
  res.send(html);
})

app.post('/api/sessions', function (req, res) {

  User.authenticate(req.body.email, req.body.password, function(error, user) {
    console.log(user);
    req.session.user = user;
    res.redirect('/login');
  });
});


// STATIC ROUTES
// root (serves index.html)
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/views/index.html');
});

//DATA ROUTES

  //API ROUTES
  //MONGO DB ROUTES


// API ROUTES

// // posts index
// app.get('/api/posts', function (req, res) {
//   // send all posts as JSON response
//   res.json(posts);
// });

//get posts data from mongodb
//{} in find argument is where we can narrow down what types of posts to include
app.get('/api/posts', function (req, res) {
  db.Post.find({}, function (err, posts) {
    if (err) {
      res.status(500).send(err)
    } else {
    res.json(posts); 
  }
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
  // create new author with form data (`req.body`)
  var newAuthor = new db.Author({
    name: req.body.author
  });
  newAuthor.save();

  // create a new post
  var newPost = new db.Post({
    author: newAuthor._id,
    text: req.body.text
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
app.put('/api/posts/:id', function(req, res) {

  // take the value of the id from the url parameter
  var targetId = req.params.id;

  // find item in `posts` array matching the id
  db.Post.findOne({_id: targetId}, function(err, foundPost){
    console.log(foundPost); 

    if(err){
      res.status(500).send(err);

    } else {
      // update the post's author
      foundPost.author = req.body.author;

      // update the post's text
      foundPost.text = req.body.text;

      // save the changes
      foundPost.save(function(err, savedPost){
        if (err){
          res.status(500).send(err);
        } else {
          // send back edited object
          res.json(savedPost);
        }
      });
    }

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
  db.Post.findOneAndRemove({_id: targetId}, function (err, deletedPost) {
    res.json(deletedPost);
  });
});

////Comments////

// get all comments for one post
app.get('/api/posts/:postid/comments', function(req, res){
  // query the database to find the post indicated by the id
  db.Post.findOne({_id: req.params.postid}, function(err, post){
    // send the post's comments as the JSON response
    res.json(post.comments);
  });
});

// add a new comment to a post
app.post('/api/posts/:postid/comments', function(req, res){

  // query the database to find the post indicated by the id
  db.Post.findOne({_id: req.params.postid}, function(err, post){
    // create a new comment record
    var newComment = new db.Comment({text: req.body.text});

    // add the new comment to the post's list of embedded comments
    post.comments.push(newComment);

    // send the new comment as the JSON response
    res.json(newComment);
  });
});

// get all authors
app.get('/api/authors', function(req, res){
  // query the database to find all authors
  db.Author.find({}, function(err, authors){
    // send the authors as the JSON response
    res.json(authors);
  });
}); 

// create a new author
app.post('/api/authors', function(req, res){
  // make a new author, using the name from the request body
  var newAuthor = new db.Author({name: req.body.name});

  // save the new author
  newAuthor.save(function(err, author){
    // send the new author as the JSON response
    res.json(author);
  });
});


// assign a specific author to a specific post

app.put('/api/posts/:postid/authors/:authorid', function(req, res){
  // query the database to find the author 
  // (to make sure the id actually matches an author)
  db.Author.find({_id: req.params.authorid}, function(err, author){
    if (err){
      console.log("error: ", err);
      res.status(500).send("no author with id "+req.params.authorid);
    } else {
      // query the database to find the post
      db.Post.find({_id: req.params.postid}, function(err, post){

        if (err){  
          res.status(500).send("no post with id"+req.params.postid);
        } else {  // we found a post!
          // update the post to reference the author
          post.author = author._id;

          // save the updated post
          post.save(function(err, savedPost){
            // send the updated post as the JSON response
            res.json(savedPost);
          });
        }
      });
    }
  });
});


// set server to localhost:3000
app.listen(3000, function () {
  console.log('server started on localhost:3000');
});