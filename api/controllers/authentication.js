var passport = require('passport');
var mongoose = require('mongoose');
var validator = require('validator');
var User = mongoose.model('User');

module.exports.register = function(req, res) {

  console.log("User registering");
  console.log("Name: " + req.body.name);
  console.log("Email: " + req.body.email);
  console.log("Password: " + req.body.password);

  /* If invalid data sent, send bad request status */
  if (!req.body.name || !req.body.email || !req.body.password) {
    res.status(400);
    res.json({
      "message": "All fields required"
    });
    return;
  }

  /* Check that a valid email exists */
  if (!validator.isEmail(req.body.email)) {
    res.status(200);
    res.json({
      "message": "Please use a valid email address"
    });
    return;
  }


  /* Check to see if an email address already exists */
  User.findOne({"email": req.body.email})
    .exec(function(err, user) {
      if (err === null) {
        if (user === null) {
          /* If no user found with email create new user */
          var user = new User();
          user.name = req.body.name;
          user.email = req.body.email;

          user.setPassword(req.body.password);

          user.save(function(err) {
            var token = user.generateJwt();
            res.status(200);
            res.json({
              "token": token
            });
          });

        } else {
          res.status(200);
          res.json({"message": "An account with that email already exists."});
        }
      } else {
        res.status(500);
        res.json({"message": "Error searching in database."});
      }
    });
};

module.exports.login = function(req, res) {

  passport.authenticate('local', function(err, user, info) {

    /* Handle if passport throws an error */
    if (err) {
      res.status(404).json(err);
      return;
    }

    if (user) {
      console.log("User " + user.name + " logged in");

      var token = user.generateJwt();
      res.status(200);
      res.json({
        "token": token
      });
    }
    else {
      res.status(401).json(info);
    }
  })(req, res);
};
