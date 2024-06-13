// groupController.js

const fs = require('fs');
const csvParser = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const csvFilePath = './data/users.csv';

const addUserToGroup = (req, res) => {
    const groupId = req.params.groupId;
    const login = req.params.login;

    fs.readFile(csvFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to read data from CSV' });
        }

        let users = csvParser(data);
        const user = users.find(user => user.login === login);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Adicione a lógica para adicionar o usuário ao grupo

        res.status(200).json({ message: 'User added to group successfully' });
    });
};

const getAllGroups = (req, res) => {
    // Adicione a lógica para obter todos os grupos
};

module.exports = {
    addUserToGroup,
    getAllGroups,
};
