const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Pool de MySQL
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'padel',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ------------------ Crear Admin Automáticamente ------------------
(async () => {
  try {
    const conn = await pool.getConnection();

    const usuarioAdmin = 'admin';
    const correoAdmin = 'admin@padel.com';
    const passwordAdmin = '123';
    const rolAdmin = 'admin';

    // Revisar si ya existe
    const [existingAdmin] = await conn.execute(
      'SELECT * FROM usuarios WHERE usuario = ? OR correo = ?',
      [usuarioAdmin, correoAdmin]
    );

    if (existingAdmin.length === 0) {
      const hashedPassword = await bcrypt.hash(passwordAdmin, 10);
      await conn.execute(
        'INSERT INTO usuarios (usuario, correo, password, metodo_registro, rol) VALUES (?, ?, ?, ?, ?)',
        [usuarioAdmin, correoAdmin, hashedPassword, 'manual', rolAdmin]
      );
      console.log('Administrador creado automáticamente: usuario=admin, password=123');
    } else {
      console.log('Administrador ya existe.');
    }

    conn.release();
  } catch (error) {
    console.error('Error al crear el admin automáticamente:', error);
  }
})();

// ------------------ Registro Club/Usuario ------------------
app.post('/usuarios/registro-club', async (req, res) => {
  const {
    nombreClub, nombreTitular, nroTitular, edad,
    nroClub, localidad, direccion, correo, usuario, password, canchas
  } = req.body;

  if (!nombreClub || !nombreTitular || !nroTitular || !edad || !nroClub || !localidad || !direccion || !correo || !usuario || !password || !canchas) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  try {
    const conn = await pool.getConnection();

    // Verificar si usuario o correo existe
    const [existingUser] = await conn.execute(
      'SELECT * FROM usuarios WHERE correo = ? OR usuario = ?',
      [correo, usuario]
    );
    if (existingUser.length > 0) {
      conn.release();
      return res.status(400).json({ message: 'Correo o usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Registrar usuario
    const [userResult] = await conn.execute(
      'INSERT INTO usuarios (usuario, correo, password, metodo_registro, rol) VALUES (?, ?, ?, ?, ?)',
      [usuario, correo, hashedPassword, 'manual', 'club']
    );

    // Registrar club
    const [clubResult] = await conn.execute(
      `INSERT INTO club 
        (nombreClub, nombreTitular, nroTitular, edad, nroClub, localidad, direccion, correo, usuario, password, canchas)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombreClub, nombreTitular, nroTitular, edad, nroClub, localidad, direccion, correo, usuario, hashedPassword, canchas]
    );

    const idClub = clubResult.insertId;

    // Crear canchas automáticamente
    for (let i = 1; i <= parseInt(canchas); i++) {
      await conn.execute(
        'INSERT INTO canchas (nombre, ubicacion, estado, id_club) VALUES (?, ?, ?, ?)',
        [`Cancha ${i}`, direccion, 'disponible', idClub]
      );
    }

    conn.release();
    res.status(201).json({ message: 'Club registrado correctamente' });
  } catch (error) {
    console.error('Error en /usuarios/registro-club:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// ------------------ Login ------------------
app.post('/login', async (req, res) => {
  const { usuario, password } = req.body;
  if (!usuario || !password) return res.status(400).json({ message: 'Usuario y contraseña obligatorios' });

  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.execute(
      'SELECT * FROM usuarios WHERE usuario = ? OR correo = ?',
      [usuario, usuario]
    );
    conn.release();

    if (rows.length === 0) return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });

    const isPasswordValid = await bcrypt.compare(password, rows[0].password);
    if (!isPasswordValid) return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });

    const token = jwt.sign(
      { id: rows[0].id_usuario, usuario: rows[0].usuario, rol: rows[0].rol },
      'tu_secreto_jwt',
      { expiresIn: '2h' }
    );
    res.json({ token, usuario: rows[0].usuario, rol: rows[0].rol });
  } catch (error) {
    console.error('Error en /login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});
// ------------------ Login con Google ------------------
// ------------------ Login con Google ------------------
const { OAuth2Client } = require('google-auth-library');
const GOOGLE_CLIENT_ID = "852264110344-fgjqpscj6v4s4eg6tvchaii2ctiapoh0.apps.googleusercontent.com"; // mismo que frontend
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

app.post('/usuarios/login-google', async (req, res) => {
  const { credential } = req.body;
  if (!credential) return res.status(400).json({ message: 'Falta el token de Google' });

  try {
    // Verificar token de Google
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: GOOGLE_CLIENT_ID, // debe coincidir con el frontend
    });

    const payload = ticket.getPayload();
    console.log("Payload Google:", payload); // Para depurar email, nombre y aud
    const correo = payload.email;
    const usuario = payload.name;

    const conn = await pool.getConnection();

    // Buscar usuario en la BD
    const [rows] = await conn.execute(
      'SELECT * FROM usuarios WHERE correo = ?',
      [correo]
    );

    let rol = 'cliente';
    if (rows.length === 0) {
      // Si no existe, lo registramos como cliente
      await conn.execute(
        'INSERT INTO usuarios (usuario, correo, password, metodo_registro, rol) VALUES (?, ?, ?, ?, ?)',
        [usuario, correo, '', 'google', 'cliente']
      );
    } else {
      rol = rows[0].rol;
    }

    conn.release();

    // Crear token JWT
    const token = jwt.sign(
      { correo, usuario, rol },
      'tu_secreto_jwt',
      { expiresIn: '2h' }
    );

    res.json({ token, usuario, rol });

  } catch (error) {
    console.error('Error en /usuarios/login-google:', error);
    res.status(401).json({ message: 'Token de Google inválido' });
  }
});

// ------------------ Obtener todos los Clubes ------------------
app.get('/clubes', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.execute('SELECT * FROM club');
    conn.release();
    res.json(rows);
  } catch (error) {
    console.error('Error en /clubes:', error);
    res.status(500).json({ message: 'Error al obtener clubes' });
  }
});


app.listen(port, () => console.log(`Servidor corriendo en http://localhost:${port}`));
