const mongoose = require('mongoose');

const skillSchema = mongoose.Schema({
    skill_name: { type: String},
    sub_skills:{type: Array}
},
{collection: 'Skills'});

module.exports = mongoose.model('Skills', skillSchema);