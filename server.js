const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Violet@',
  database: 'calendario'
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL Connected');
});

const secretKey = 'your-secret-key';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;
  const hashedPassword = await bcrypt.hash(senha, 10);

  const sql = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
  db.query(sql, [nome, email, hashedPassword], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        res.status(400).json({ success: false, message: 'Email já registrado.' });
      } else {
        throw err;
      }
    } else {
      res.json({ success: true });
    }
  });
});

app.post('/login', (req, res) => {
  const { email, senha } = req.body;
  const sql = 'SELECT * FROM usuarios WHERE email = ?';

  db.query(sql, [email], async (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      return res.status(400).json({ success: false, message: 'Email ou senha incorretos.' });
    }

    const user = results[0];
    const validPassword = await bcrypt.compare(senha, user.senha);

    if (!validPassword) {
      return res.status(400).json({ success: false, message: 'Email ou senha incorretos.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });
    res.json({ success: true, token });
  });
});

app.post('/eventos', authenticateToken, (req, res) => {
  const { titulo, data, hora_inicio, hora_fim, status } = req.body;
  const sql = 'INSERT INTO eventos (usuario_id, titulo, data, hora_inicio, hora_fim, status) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [req.user.id, titulo, data, hora_inicio, hora_fim, status], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.get('/eventos', authenticateToken, (req, res) => {
  const sql = 'SELECT * FROM eventos WHERE usuario_id = ?';
  db.query(sql, [req.user.id], (err, results) => {
    if (err) throw err;
    res.send(results);
  });
});

app.put('/eventos/:id', authenticateToken, (req, res) => {
  const { titulo, data, hora_inicio, hora_fim, status } = req.body;
  const sql = 'UPDATE eventos SET titulo = ?, data = ?, hora_inicio = ?, hora_fim = ?, status = ? WHERE id = ? AND usuario_id = ?';
  db.query(sql, [titulo, data, hora_inicio, hora_fim, status, req.params.id, req.user.id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.delete('/eventos/:id', authenticateToken, (req, res) => {
  const sql = 'DELETE FROM eventos WHERE id = ? AND usuario_id = ?';
  db.query(sql, [req.params.id, req.user.id], (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

app.get('/eventos/concluidos', authenticateToken, (req, res) => {
  const sql = 'SELECT COUNT(*) AS count FROM eventos WHERE usuario_id = ? AND status = 1';
  db.query(sql, [req.user.id], (err, result) => {
    if (err) throw err;
    res.send(result[0]);
  });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'main_page', 'index.html'));
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
