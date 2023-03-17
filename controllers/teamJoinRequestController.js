const TeamJoinRequest = require("../models/teamJoinRequestModel")

exports.requestToJoin = async (req, res) => {
    try {
        const userId = req.body.userId;
        const teamId = req.params.teamId;

        // Check if the user is already a member of the team
        const existingMember = await Team.findOne({ teamMembers: userId, team: teamId });

        if (existingMember) {
            return res.status(400).json(
                {
                    message: 'User is already a member of the team'
                });
        }

        // Check if the team is already at maximum capacity
        const team = await Team.findById(teamId);

        if (team.members.length >= 3) {
            return res.status(400).json(
                {
                    message: 'Team is already at maximum capacity'
                });
        }

        // Add the user to the list of pending requests to join the team
        const joinRequest = await TeamJoinRequest.create({ user: userId, team: teamId });

        res.status(201).json({ message: "User has requested to join the team." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error." });
    }
}

exports.approveRequestToJoin = async (req, res) => {
    try {
        const requestId = req.params.requestId;

        // Update the status of the team join request to "accepted"
        const joinRequest = await TeamJoinRequest.findByIdAndUpdate(
            { _id: requestId },
            { status: "accepted" },
            { new: true }
        );

        // Add the user to the team's list of members
        await Team.findByIdAndUpdate(joinRequest.team, {
            $push: { members: joinRequest.user },
        });

        res.status(200).json(
            {
                message: 'Team join request has been approved'
            });
    } catch (err) {
        console.error(err);
        res.status(500).json(
            {
                message: 'Internal server error'
            });
    }
}

exports.rejectRequestToJoin = async (req, res) => {
    try {
        const requestId = req.params.requestId;

        // Update the status of the team join request to "rejected"
        await TeamJoinRequest.findByIdAndUpdate(
            { _id: requestId },
            { status: 'rejected' });

        res.status(200).json(
            {
                message: 'Team join request has been rejected'
            });
    } catch (err) {
        console.error(err);
        res.status(500).json(
            {
                message: 'Internal server error'
            });
    }
}