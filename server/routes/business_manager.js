const express = require('express');
const router = express.Router();
const managerController = require('../controllers/managerController');

console.log('business_manager routes loaded'); // debug

// simple ping to verify route mounting
router.get('/ping', (req, res) => res.status(200).send('manager routes OK'));

router.get('/jobPosts', managerController.getJobPosts);

router.get('/companies', managerController.getCompanies);
router.get('/users', managerController.getUsers);

// Mentor verification routes
router.get('/mentors/pending', managerController.getPendingMentors);
router.post('/mentors/accept/:id', managerController.acceptMentor);
router.post('/mentors/decline/:id', managerController.declineMentor);




module.exports = router;