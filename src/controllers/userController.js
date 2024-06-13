// userController.js
const fs = require('fs');
const path = require('path');
const csvWriter = require('csv-writer').createObjectCsvWriter;
const csvParser = require('csv-parser');

const usersFilePath = path.join(__dirname, '..', 'data', 'users.csv');

// Cria um novo usuário e o salva no arquivo CSV
exports.createUser = (req, res) => {
    const { login, email, cargo } = req.body;

    const writer = csvWriter({
        path: usersFilePath,
        header: [
            { id: 'login', title: 'Login' },
            { id: 'email', title: 'Email' },
            { id: 'cargo', title: 'Cargo' }
        ],
        append: true
    });

    writer.writeRecords([{ login, email, cargo }])
        .then(() => res.status(201).send('Usuário criado com sucesso'))
        .catch(err => res.status(500).send(err.message));
};

// Altera o cargo de um usuário existente no arquivo CSV
exports.updateUserCargo = (req, res) => {
    const { login, cargo } = req.body;

    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send(err.message);
        }

        const users = [];
        fs.createReadStream(usersFilePath)
            .pipe(csvParser())
            .on('data', (row) => {
                users.push(row);
            })
            .on('end', () => {
                const userIndex = users.findIndex(user => user.login === login);
                if (userIndex === -1) {
                    return res.status(404).send('Usuário não encontrado');
                }

                users[userIndex].cargo = cargo;

                const writer = csvWriter({
                    path: usersFilePath,
                    header: [
                        { id: 'login', title: 'Login' },
                        { id: 'email', title: 'Email' },
                        { id: 'cargo', title: 'Cargo' }
                    ]
                });

                writer.writeRecords(users)
                    .then(() => res.status(200).send('Cargo atualizado com sucesso'))
                    .catch(err => res.status(500).send(err.message));
            });
    });
};

// Lista todos os usuários do arquivo CSV
exports.listUsers = (req, res) => {
    const users = [];
    fs.createReadStream(usersFilePath)
        .pipe(csvParser())
        .on('data', (row) => {
            users.push(row);
        })
        .on('end', () => {
            res.status(200).json(users);
        })
        .on('error', (err) => {
            res.status(500).send(err.message);
        });
};
