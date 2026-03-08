const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'sua_chave_secreta_super_segura';

async function login(req, res) {
  const { email, password } = req.body;

  if (email === "admin@email.com" && password === "123456") {
    const userId = 1; 

    const token = jwt.sign({ id: userId }, SECRET_KEY, { expiresIn: '1h' });

    return res.json({ auth: true, token: token });
  }

  res.status(401).json({ message: 'Login inválido!' });
}

module.exports = {
  login
};