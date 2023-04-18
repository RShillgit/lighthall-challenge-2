const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: {type: String, required: true},
    tasks: [{type: Schema.Types.ObjectId, ref: "Task" }]
})

module.exports = mongoose.model("User", UserSchema);