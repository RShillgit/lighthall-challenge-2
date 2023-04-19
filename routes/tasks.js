const express = require('express');
const router = express.Router();
const Task = require('../models/task');

// POST create a new task for a user.
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

// GET all tasks for a user.
router.get('/', function(req, res, next) {
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

