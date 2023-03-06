const Team = require('../models/teams');

exports.postTeam = async (req, res) => {
    const teamName=req.body.teamName;
    const rank = req.body.rank;
    const streak = req.body.streak;
    const teamLeader = req.body.teamLeader; 
    const teamMembers = req.body.teamMembers;
    const newTeam = await Team.create({
        teamName:teamName,
        rank:rank,
        streak:streak,
        teamLeader:teamLeader,
        teamMembers:teamMembers
    });
    res.status(201).json({
        status: 'success',
        data: newTeam,    
      });
}

exports.getTeams = async (req,res) => {
    try {
        const teams = await Team.find();
        res.status(201).json({
        status: 'success',
        data: teams,
      });
    }
    catch(err){
        res.status(404).json({
            status:'fail',
            message:err
    })
}
}

exports.DeleteTeam = async (req, res) => {
    try {
        await Problem.findByIdAndDelete(id);
            res.status(204).json({
                status: 'success',  
                data : null
              });
        }
        catch (err){
            res.status(404).json({
                status:'fail',
                message:err
            });
        }

    /* const team = await Team.findById({ _id: req.params.id});
    if (team) {
      const deletedUser = await Team.findByIdAndDelete({
        _id: req.params.id,
      });
      res.json({ message: "Done", deletedUser });
    } else {
      res.json({ message: "Failed" });
    } */
  };

/* 
  const problemId = req.body.problemId;
  problemModel.deleteById(problemId)
  .then(()=>{
      res.redirect('/editcontent');
  })
  .catch(err=>{
      console.log(err);
  }); */



