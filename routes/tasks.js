const express = require('express');
const router = express.Router();
const Task = require('../models/task');

// Route to get all tasks
router.post('/', (req, res) => {
    Task.find({}).then(tasks=>{res.status(200).json(tasks)}).catch(error=>{res.status(500).json(Error)});
    
});

module.exports = router;

