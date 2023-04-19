var express = require('express');
var router = express.Router();

const User = require('../models/user');
const Task = require('../models/task');

/* POST home page. */
router.post('/', function(req, res, next) {

  // Find User by id
  User.findById(req.body.currentUserId)
  .populate('tasks')

  // Successfully found User
  .then(currentUser => {
    return res.status(200).json({success: true, currentUser: currentUser})
  })

  // Unsuccessfully found User
  .catch(err => {
    return res.status(500).json({err: err, success: false})
  })

});

router.post('/login', (req, res) => {

  // Check if user exists
  User.findOne({
    first_name: req.body.lowerCaseName
  })

  // User exists
  .then(foundUser => {
    if(foundUser) {
      return res.status(200).json({success: true, foundUser: foundUser})
    }
  })

  // User does NOT exist
  .catch(err => {
    return res.status(500).json({err: err, success: false})
  })

})

// POST request to create a new user
router.post('/users', (req, res) => {

  // Create new user with form information
  const newUser = new User({
    first_name: req.body.lowerCaseName,
    tasks: []
  })
  newUser.save()

  // Successfully saved new user
  .then(new_user => {
    return res.status(200).json({success: true, new_user: new_user})
  })
  // Unsuccessfully saved new user
  .catch(err => {
    return res.status(500).json({err: err, success: false})
  })
})

// POST create a new task for a user.
router.post('/tasks', function(req, res, next) {
  // Find user by id
  User.findById(req.body.currentUserId)
    .then(currentUser => {
      // Create new task for user
      const newTask = new Task({
        title: req.body.title,
        description: req.body.description,
        status: req.body.status,
        due_date: req.body.due_date,
        user: currentUser._id
      });
      // Save task to database
      newTask.save()
        .then(savedTask => {
          // Add task to user's tasks array
          currentUser.tasks.push(savedTask._id);
          currentUser.save()
            .then(() => {
              return res.status(200).json({success: true, message: "Task created successfully."});
            })
            .catch(err => {
              return res.status(500).json({err: err, success: false});
            });
        })
        .catch(err => {
          return res.status(500).json({err: err, success: false});
        });
    })
    .catch(err => {
      return res.status(500).json({err: err, success: false});
    });
});

// GET all tasks for a user.
router.get('/tasks', function(req, res, next) {
  // Find user by id and populate their tasks
  User.findById(req.query.currentUserId)
    .populate('tasks')
    .exec(function (err, user) {
      if (err) {
        return res.status(500).json({err: err, success: false});
      }
      return res.status(200).json({success: true, tasks: user.tasks});
    });
});

module.exports = router;
