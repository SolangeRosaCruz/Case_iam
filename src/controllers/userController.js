const fs = require('fs');
const path = require('path');
const { createObjectCsvWriter } = require('csv-writer');
const csvParser = require('csv-parser');

const usersFilePath = path.join(__dirname, '..', 'data', 'users.csv');

// Configurar o escritor CSV
const csvWriter = createObjectCsvWriter({
  path: usersFilePath,
  header: [
    { id: 'login', title: 'login' },
    { id: 'email', title: 'email' },
    { id: 'cargo', title: 'cargo' },
    { id: 'grupos', title: 'grupos' }  
  ],
  append: true
});

// Função para verificar se o login já existe
const isLoginUnique = async (login) => {
  return new Promise((resolve, reject) => {
 //   console.log('Iniciando verificação de login único para:', login);
    const results = [];
    fs.createReadStream(usersFilePath)
      .pipe(csvParser())
      .on('data', (data) => {
   //     console.log('Lendo dados:', data);
        results.push(data);
      })
      .on('end', () => {
     //   console.log('Leitura concluída. Resultados:', results);
        const userExists = results.some(user => user.login === login);
     //   console.log('Verificando existência de usuário com login:', login, 'Resultado:', userExists);
        resolve(!userExists);
      })
      .on('error', reject);
  });
};

// Rota para adicionar um novo usuário
exports.createUser = async (req, res) => {
  const { login, email, cargo, grupos } = req.body;

  try {
    const isUnique = await isLoginUnique(login);

    if (!isUnique) {
      return res.status(400).send('Login já existe. Escolha outro login.');
    }

    // Adicionar novo usuário ao arquivo CSV
    const record = [{ login, email, cargo, grupos: "" }]; 
    await csvWriter.writeRecords(record);

    res.status(201).send('Usuário criado com sucesso.');
  } catch (error) {
   // console.error('Erro ao criar usuário:', error);
    res.status(500).send('Erro ao processar a requisição.');
  }
};

// Rota para alterar o cargo de um usuário existente
exports.updateUserCargo = async (req, res) => {
  const { login, cargo } = req.body;

  try {
    const results = [];

    // Ler os dados do arquivo CSV
    fs.createReadStream(usersFilePath)
      .pipe(csvParser())
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', async () => {
        let userFound = false;

        // Encontrar e atualizar o usuário específico
        for (let i = 0; i < results.length; i++) {
          if (results[i].login === login) {
            results[i].cargo = cargo;
            userFound = true;
            break;
          }
        }

        if (!userFound) {
          return res.status(404).send('Usuário não encontrado.');
        }

        // Reescrever todo o arquivo CSV com os dados atualizados
        const csvWriter = createObjectCsvWriter({
          path: usersFilePath,
          header: [
            { id: 'login', title: 'login' },
            { id: 'email', title: 'email' },
            { id: 'cargo', title: 'cargo' },
            { id: 'grupos', title: 'grupos' }
          ],
          append: false 
        });

        await csvWriter.writeRecords(results);

        res.status(200).send('Cargo do usuário atualizado com sucesso.');
      })
      .on('error', (err) => {
        console.error('Erro ao ler arquivo CSV:', err);
        res.status(500).send('Erro ao processar a requisição.');
      });
  } catch (error) {
    console.error('Erro ao atualizar cargo do usuário:', error);
    res.status(500).send('Erro ao processar a requisição.');
  }
};

// Rota para listar todos os usuários do CSV
exports.listUsers = async (req, res) => {
  try {
    const results = [];
    fs.createReadStream(usersFilePath)
      .pipe(csvParser())
      .on('data', (data) => {
        results.push(data);
      })
      .on('end', () => {
        res.status(200).json(results);
      })
      .on('error', (err) => {
        console.error('Erro ao ler arquivo CSV:', err);
        res.status(500).send('Erro ao processar a requisição.');
      });
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).send('Erro ao processar a requisição.');
  }
};

// Rota para listar todos os grupos do CSV
exports.listGroups = async (req, res) => {
  try {
    const results = [];
    fs.createReadStream(usersFilePath)
      .pipe(csvParser())
      .on('data', (data) => {
      if (data && data.grupos) {
       results.push(...data.grupos.split(';'));
       }
     })
      .on('end', () => {
        const uniqueGroups = Array.from(new Set(results));
        res.status(200).json(uniqueGroups);
      })
      .on('error', (err) => {
        console.error('Erro ao ler arquivo CSV:', err);
        res.status(500).send('Erro ao processar a requisição.');
      });
  } catch (error) {
    console.error('Erro ao listar grupos:', error);
    res.status(500).send('Erro ao processar a requisição.');
  }
};

// Rota para adicionar um usuário a um grupo
exports.addUserToGroup = async (req, res) => {
  const { login, grupo } = req.body;
// console.error('login:', login , 'grupo:', grupo)
  try {
    const results = [];

    // Ler os dados do arquivo CSV
    fs.createReadStream(usersFilePath)
      .pipe(csvParser())
      .on('data', (data) => {
        results.push(data);
   //     console.error('registro:', data);
      })
      .on('end', async () => {
        let userFound = false;

        // Encontrar e atualizar o usuário específico
        for (let i = 0; i < results.length; i++) {
          if (results[i].login === login) {
            const grupos = results[i].grupos ? results[i].grupos.split(';') : []
     //         console.error('grupo encontrado:', results[i].grupos);
              if (!grupos.includes(grupos)) {
              grupos.push(grupo);
              results[i].grupos = grupos.join(';');
     //         console.error('grupo :', grupo);
     //       console.error('grupo incluido:', results[i].grupos);
            }
            userFound = true;
            break;
          }
        }

        if (!userFound) {
          return res.status(404).send('Usuário não encontrado.');
        }

        // Reescrever todo o arquivo CSV com os dados atualizados
        const csvWriter = createObjectCsvWriter({
          path: usersFilePath,
          header: [
            { id: 'login', title: 'login' },
            { id: 'email', title: 'email' },
            { id: 'cargo', title: 'cargo' },
            { id: 'grupos', title: 'grupos' }
          ],
          append: false  
        });

        await csvWriter.writeRecords(results);

        res.status(200).send('Usuário adicionado ao grupo com sucesso.');
      })
      .on('error', (err) => {
        console.error('Erro ao ler arquivo CSV:', err);
        res.status(500).send('Erro ao processar a requisição.');
      });
  } catch (error) {
    console.error('Erro ao adicionar usuário ao grupo:', error);
    res.status(500).send('Erro ao processar a requisição.');
  }
};
