// CLIENT-SIDE JAVASCRIPT

$(function() {

  // `postsController` holds all our post funtionality
  var postsController = {
    
    // compile phrase template
  template: _.template($('#post-template').html()),

    // pass each post object through template and append to view
    render: function(postObj) {
      var $postHtml = $(postsController.template(postObj));
      $('#post-list').append($postHtml);
    },

    all: function() {
      // send GET request to server to get all phrases
      $.get('/api/posts', function(data) {
        var allPosts = data;
        
        // iterate through each phrase
        _.each(allPosts, function(post) {
          postsController.render(post);
        });
        
        // add event-handers for updating/deleting
        postsController.addEventHandlers();
      });
    },

    create: function(newText) {
      var postData = {text: newText};
      
      // send POST request to server to create new phrase
      $.post('/api/posts', postData, function(data) {
        var newPost = data;
        postsController.render(newPost);
      });
    },

    update: function(postId, updatedText) {
      // send PUT request to server to update phrase
      $.ajax({
        type: 'PUT',
        url: '/api/posts/' + postId,
        data: {
          text: updatedText
        },
        success: function(data) {
          var updatedPost = data;

          // replace existing phrase in view with updated phrase
          var $postHtml = $(postsController.template(updatedPost));
          $('#post-' + postId).replaceWith($postHtml);
        }
      });
    },
    
    delete: function(postId) {
      // send DELETE request to server to delete phrase
      $.ajax({
        type: 'DELETE',
        url: '/api/posts/' + postId,
        success: function(data) {
          
          // remove deleted phrase from view
          $('#post-' + postId).remove();
        }
      });
    },

    // add event-handlers to phrases for updating/deleting
    addEventHandlers: function() {
      $('#post-list')

        // for update: submit event on `.update-phrase` form
        .on('submit', '.update-post', function(event) {
          event.preventDefault();
          
          // find the phrase's id (stored in HTML as `data-id`)
          var postId = $(this).closest('.post').attr('data-id');
          
          // udpate the phrase with form data
          var updatedText = $(this).find('.updated-text').val();
          postsController.update(postId, updatedText);
        })
        
        // for delete: click event on `.delete-phrase` button
        .on('click', '.delete-post', function(event) {
          event.preventDefault();

          // find the phrase's id
          var postId = $(this).closest('.post').attr('data-id');
          
          // delete the phrase
          postsController.delete(postId);
        });
    },

    setupView: function() {
      // append existing phrases to view
      postsController.all();
      
      // add event-handler to new-phrase form
      $('#new-post').on('submit', function(event) {
        event.preventDefault();
        
        // create new phrase with form data
        var newText = $('#new-text').val();
        postsController.create(newText);
        
        // reset the form
        $(this)[0].reset();
        $('#new-text').focus();
      });
    }
  };

  postsController.setupView();

});