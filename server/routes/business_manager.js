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

router.get('/subscriptionPlans', managerController.getSubscriptionPlans);
router.post('/subscriptionPlans', managerController.createSubscriptionPlan);
router.put('/subscriptionPlans/:id', managerController.updateSubscriptionPlan);
router.patch('/subscriptionPlans/:id/toggle', managerController.toggleSubscriptionPlanStatus);
router.get('/subscriptionPlans/:id/companies', managerController.getSubscribedCompanies);

// Registration Requests
router.get('/registrationRequests', managerController.getRegistrationRequests);
router.post('/registrationRequests/accept/:id', managerController.acceptRegistrationRequest);
router.post('/registrationRequests/decline/:id', managerController.declineRegistrationRequest);



module.exports = router;