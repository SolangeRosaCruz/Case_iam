const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/criaruser', userController.createUser);
router.put('/alterarcargo', userController.updateUserCargo);
router.get('/listUsers', userController.listUsers);
router.get('/listGroups', userController.listGroups);  
router.post('/addUserToGroup', userController.addUserToGroup);  

module.exports = router;

