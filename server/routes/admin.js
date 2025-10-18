const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

console.log('admin routes loaded'); // debug

// simple ping to verify route mounting
router.get('/ping', (req, res) => res.status(200).send('admin routes OK'));

router.get('/users', adminController.getUsers);





module.exports = router;