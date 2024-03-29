var mongoose = require('mongoose');

var Comment = mongoose.model('Comment');
var Activity = mongoose.model('Activity');

module.exports.addComment = function(req, res) {

  /* Check to make sure authorized */
  if (req.auth._id) {
    console.log("Adding comment");
    console.log("UserID: " + req.auth._id);
    console.log("ActID: " + req.body.actID);
    console.log("comment: " + req.body.comment);
    console.log("url: " + req.body.url);

    /* Check to make sure all data filled in */
    if (!req.body.actID || !req.body.comment) {
      res.status(400);
      res.json({"message": "All fields required."});
      return;
    }

    /* Find activity comment relates to */
    Activity.findById(req.body.actID).exec(function(err, activity) {
      if ((activity != null) && (err === null)) {

        /* Create our new comment object */
        var comment = new Comment();
        comment.comment = req.body.comment;
        comment.time = new Date();
        comment.url = req.body.url;
        comment.postedBy = req.auth._id;
        comment.activityID = req.body.actID;
        comment.save();

        res.status(200);
        res.json({"message": "Comment added."});
      } else {
        res.status(400);
        res.json({"message": "Invalid activity ID."});
      }
    });
  }
};

/* Update an existing comment */
module.exports.updateComment = function(req, res) {

  /* Check to make sure authorized */
  if (req.auth._id) {
    console.log("Updating comment");
    console.log("UserID: " + req.auth._id);
    console.log("CommentID: " + req.body.id);
    console.log("Comment: " + req.body.comment);
    console.log("URL: " + req.body.url);

    if (!req.body.id || !req.body.comment) {
      res.status(400);
      res.json({"message": "All fields required."});
      return;
    }

    /* Update comment in database */
    Comment.findById(req.body.id).exec(function(err, comment) {
      if (comment != null)
      {
        if (comment.postedBy == req.auth._id)
        {
          if ((err === null)) {
            /* Update comment if found */
            comment.comment = req.body.comment;
            comment.url = req.body.url;
            comment.save();
            res.status(200);
            res.json({"message": "Comment updated."});
          } else {
            /* Indicate error updating comment */
            res.status(400);
            res.json({"message": "Error updating comment."});
          }
        } else {
          res.status(400);
          res.json({"message": "Cannot update other users comment."});
        }
      } else {
        res.status(400);
        res.json({"message": "Invalid comment ID."});
      }
    });
  }
};

/* Funcion for removing a comment */
module.exports.removeComment = function(req, res) {

  /* Check to make sure authorized */
  if (req.auth._id) {
    console.log("Deleting comment");
    console.log("UserID: " + req.auth._id);
    console.log("CommentID:" + req.body.id);
  }

  /* Check to make sure all data filled in */
  if (!req.body.id) {
    res.status(400);
    res.json({"message": "All fields required."});
    return;
  }

  /* Delete comment from database */
  Comment.findById(req.body.id).exec(function(err, comment) {
    if ((comment != null) && (err === null)) {
      if (comment.postedBy == req.auth._id) {
        comment.remove();
        res.status(200);
        res.json({"message": "Comment deleted."});
      } else {
        res.status(400);
        res.json({"message": "Cannot delete other users comment."});
      }
    } else {
      res.status(400);
      res.json({"message": "Invalid comment ID."});
    }
  });
};

/* Lists all comments for activity */
module.exports.view = function(req, res) {

  /* Check to make sure only authed users can view comments */
  if (req.auth._id) {

    /* Check to make sure request has activity ID field */
    if (req.query.actID) {

      var searchQuery = {};
      searchQuery.activityID = req.query.actID;

      Comment.find(searchQuery)
        .exec(function(err, comments) {

          var result = [];

          if (comments != null) {
            /* Loop through and only send needed data */
            for (comment of comments) {
              var comData = {
                "_id": comment._id,
                "postedBy": comment.postedBy,
                "time": comment.time,
                "comment": comment.comment,
                "url": comment.url
              };

              result.push(comData);
            }
          }

          res.status(200);
          res.json(result);
        });
    } else {
      res.status(400);
      res.json({"message": "No activity ID supplied."});
    }
  }
};
