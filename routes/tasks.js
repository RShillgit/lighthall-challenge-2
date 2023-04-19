var express = require('express');
var router = express.Router();
const Task = require('../models/task');
const User = require('../models/user');

/* POST create a new task for a user. */
router.post('/', function(req, res, next) {
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

module.exports = router;
