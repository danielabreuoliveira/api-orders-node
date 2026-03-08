const jwt = require('jsonwebtoken');

// 1. VOCÊ PRECISA DEFINIR A CHAVE AQUI TAMBÉM:
const SECRET_KEY = process.env.JWT_SECRET || 'sua_chave_secreta_super_segura';

function verifyJWT(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(401).json({ auth: false, message: 'Nenhum token fornecido.' });
  }

  // O erro acontecia aqui, porque SECRET_KEY não existia neste arquivo
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(500).json({ auth: false, message: 'Falha ao autenticar o token.' });
    }

    req.userId = decoded.id;
    next();
  });
}

module.exports = { verifyJWT };