const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const User = require('../models/user');

// POST create a new task for a user.
router.post('/', function(req, res, next) {

  // Create the new task
  const newTask = new Task({
    title: req.body.newTaskRequest.title,
    description: req.body.newTaskRequest.description,
    status: req.body.newTaskRequest.status,
    due_date: req.body.newTaskRequest.dueDate,
  });
  newTask.save()

  // Successfully created the new task
  .then(() => {

    // Update user's tasks array
    const updatedTasksArray = req.body.newTaskRequest.currentUser.tasks;
    updatedTasksArray.unshift(newTask);
    
    User.findByIdAndUpdate(req.body.newTaskRequest.currentUser._id,
      {
        tasks: updatedTasksArray
      },
      {new: true}
    )
    .populate('tasks')

    // Successfully updated the user
    .then(updatedUser => {
      return res.status(200).json({updatedUser: updatedUser, success: true});
    })
    // Unsuccessfully updated the user
    .catch(err => {
      return res.status(500).json({err: err, success: false});
    })

  })
  // Unuccessfully created the new task
  .catch(err => {
    return res.status(500).json({err: err, success: false});
  })

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

