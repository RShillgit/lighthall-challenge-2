const express = require('express');
const router = express.Router();
const Task = require('../models/task');

// Route to get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({});
    res.status(200).json(tasks);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching tasks", error: error });
  }
});

module.exports = router;

