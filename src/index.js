const express = require('express');
const csvParser = require('csv-parser');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Middleware para carregar os dados do CSV
app.use((req, res, next) => {
    fs.createReadStream('./data/users.csv')
        .pipe(csvParser())
        .on('data', (row) => {
            // Processar os dados do CSV
        })
        .on('end', () => {
            next();
        });
});

// Importar as rotas de usuário
const userRoutes = require('./routes/userRoutes');

// Usar as rotas de usuário
app.use(userRoutes);

// Importar as rotas de grupos
const groupRoutes = require('./routes/groupRoutes');

// Usar as rotas de grupos

app.use(groupRoutes);

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor está rodando na porta ${PORT}`);
});
