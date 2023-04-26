const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roadmapSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        required: true,
        enum: [
            "beginner",
            "intermediate",
            "advanced"
        ]
    },
    courses:
    {
        type: [Schema.Types.ObjectID],
        ref: 'Course'
    }
});

const Roadmap = mongoose.model('Roadmap', roadmapSchema);
module.exports = Roadmap;
