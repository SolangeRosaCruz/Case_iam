const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Definir a rota para criar um novo usuário
router.post('/users', userController.createUser);

// Definir a rota para atualizar o cargo de um usuário
router.put('/users', userController.updateUserCargo);

// Definir a rota para listar todos os usuários
router.get('/users', userController.listUsers);

module.exports = router;
