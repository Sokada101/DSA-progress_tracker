const mongoose = require('mongoose');

const problemSchema = mongoose.Schema({
    title: { type: String, required: true},
    reasons: String,
    solved: String,
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model('Problem', problemSchema);
