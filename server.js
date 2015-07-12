// SERVER-SIDE JAVASCRIPT

// require express and other modules
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    _ = require('underscore');

// serve js and css files from public folder
app.use(express.static(__dirname + '/public'));

// configure bodyParser (for handling data)
app.use(bodyParser.urlencoded({extended: true}));

// pre-seeded phrase data
var posts = [
  {id: 1, text: 'post 1 testing!'},
  {id: 2, text: 'post 2 testing!'}, 
  {id: 3, text: 'post 3 testing!'}, 
  {id: 4, text: 'post 4 testing!'}, 
  {id: 5, text: 'post 5 testing!'} 
];

// STATIC ROUTES

// root (serves index.html)
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/views/index.html');
});

// API ROUTES

// phrases index
app.get('/api/posts', function (req, res) {
  // send all phrases as JSON response
  res.json(posts);
});

// create new phrase
app.post('/api/posts', function (req, res) {
  // grab params (word and definition) from form data
  var newPost = req.body;
  
  // set sequential id (last id in `phrases` array + 1)
  if (posts.length > 0) {
    newPost.id = posts[posts.length - 1].id +  1;
  } else {
    newPost.id = 0;
  }

  // add newPhrase to `phrases` array
  posts.push(newPost);
  
  // send newPhrase as JSON response
  res.json(newPost);
});

// update phrase
app.put('/api/posts/:id', function (req, res) {

  // set the value of the id
  var targetId = parseInt(req.params.id);

  // find item in `phrases` array matching the id
  var foundPost = _.findWhere(posts, {id: targetId});

  // update the phrase's word
  foundPost.text = req.body.text;

  // update the phrase's definition
  foundPost.definition = req.body.definition;

  // send back edited object
  res.json(foundPost);
});

// delete phrase
app.delete('/api/posts/:id', function (req, res) {
  
  // set the value of the id
  var targetId = parseInt(req.params.id);

  // find item in `phrases` array matching the id
  var foundPost = _.findWhere(posts, {id: targetId});

  // get the index of the found item
  var index = posts.indexOf(foundPost);
  
  // remove the item at that index, only remove 1 item
  posts.splice(index, 1);
  
  // send back deleted object
  res.json(foundPost);
});

// set server to localhost:3000
app.listen(3000, function () {
  console.log('server started on localhost:3000');
});