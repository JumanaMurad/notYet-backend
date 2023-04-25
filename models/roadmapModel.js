const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');

const roadmapSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        required: true,
        enum: [
            begginner,
            intermediate,
            advanced
        ]
    },
    courses:
    {
        type: [Schema.type.ObjectID],
        ref: 'Course'
    }
});

const Roadmap = mongoose.Model('Roadmap', roadmapSchema);
module.exports = Roadmap;
