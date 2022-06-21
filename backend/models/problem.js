const mongoose = require('mongoose');

const problemSchema = mongoose.Schema({
    source: String,
    title: { type: String, required: true},
    link: String,
    reasons: String,
    solved: String,
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});

module.exports = mongoose.model('Problem', problemSchema);
