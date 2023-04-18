const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TasksSchema = new Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    status: {type: String, required: true},
    due_date: {type: Date, required: true}
})

module.exports = mongoose.model("Task", TasksSchema);