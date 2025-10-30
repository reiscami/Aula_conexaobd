const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
const PORT = 3000;


const dbConfig = {
  host: '127.0.0.1',
  user: 'root',
  password: 'password',  
  database: 'filmes_series'
};


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/api/filmes', async (req, res) => {
  try {
    const conexao = await mysql.createConnection(dbConfig);
    const [rows] = await conexao.execute('SELECT * FROM catalogo');
    await conexao.end();
    res.json(rows);
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});


app.post('/api/filmes', async (req, res) => {
  const { titulo, genero, ano } = req.body;
  try {
    const conexao = await mysql.createConnection(dbConfig);
    await conexao.execute('INSERT INTO catalogo (titulo, genero, ano) VALUES (?, ?, ?)', [titulo, genero, ano]);
    await conexao.end();
    res.json({ mensagem: 'Filme adicionado com sucesso!' });
  } catch (erro) {
    res.status(500).json({ erro: erro.message });
  }
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
