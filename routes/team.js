const express = require('express');

const router = express.Router();

const teamController = require('../controllers/team');

router.get('/',teamController.getTeams);

router.post('/add-team',teamController.postTeam);

router.delete('/delete-team',teamController.DeleteTeam);


module.exports = router;