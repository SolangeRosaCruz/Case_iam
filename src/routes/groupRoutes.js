const express = require('express');
const router = express.Router();

const GroupController = require('../controllers/groupController');

// Rotas para manipulação de grupos
router.get('/', GroupController.getAllGroups);
router.post('/:groupId/users/:login', GroupController.addUserToGroup);

module.exports = router;
