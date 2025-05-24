import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import userRepository from '../repository/user-repository.js';

dotenv.config();

export const ensureAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'Token faltando ou mal formado' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const {data:user} = await userRepository.get(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Token inválido ou expirado' });
    }

    req.user = { id: decoded.id, email: decoded.email, role: decoded.role, language: user.language };
    
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
};
