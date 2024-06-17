const express = require('express');
const bodyParser = require('body-parser');
const authController = require('./controllers/authController'); 
const userController = require('./controllers/userController'); 
const basicAuthMiddleware = require('./middlewares/basicAuthMiddleware'); 

const app = express();

app.use(bodyParser.json());

// Middleware para logar os headers e body das requisições
app.use((req, res, next) => {
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Endpoint para registrar usuários
app.post('/register', authController.registerUser);
app.post('/login', authController.loginUser);

// Endpoints - protegido com Basic Auth
app.post('/criaruser', basicAuthMiddleware, userController.createUser);
app.put('/alterarcargo', basicAuthMiddleware, userController.updateUserCargo);
app.get('/listUsers',basicAuthMiddleware, userController.listUsers);
app.get('/listGroups', basicAuthMiddleware, userController.listGroups);  
app.post('/addUserToGroup', basicAuthMiddleware, userController.addUserToGroup);  


// Middleware para tratamento de erros de JSON inválido
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Bad JSON:', err.message);
    return res.status(400).send({ error: 'Invalid JSON' });
  }
  next();
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Servidor rodando na porta ${port}...`));





